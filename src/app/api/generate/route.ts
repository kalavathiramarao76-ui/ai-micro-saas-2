import { NextRequest } from "next/server";
import { getSystemPrompt } from "@/lib/prompts";
import { checkAndIncrementUsage, isAuthenticated } from "@/lib/rate-limit";

const API_URL = "https://sai.sharedllm.com/v1/chat/completions";
const MODEL = "gpt-oss:120b";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || req.headers.get("x-real-ip")
      || "unknown";

    const authed = await isAuthenticated(ip);

    if (!authed) {
      const { allowed, count } = await checkAndIncrementUsage(ip);
      if (!allowed) {
        return new Response(
          JSON.stringify({
            error: "FREE_LIMIT_REACHED",
            message: `Free trial complete. You've used ${count} of 3 free generations. Sign in with Google to continue.`,
            count,
            remaining: 0,
          }),
          { status: 429, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    const { toolType, input } = await req.json();

    if (!toolType || !input) {
      return new Response(
        JSON.stringify({ error: "Missing toolType or input" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(toolType);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: input },
        ],
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upstream API error:", response.status, errorText);
      const errorMessages: Record<number, string> = {
        429: "Too many requests. Please wait a moment and try again.",
        500: "The AI service is experiencing issues. Please try again shortly.",
        502: "The AI service is temporarily unavailable. Please try again in a few moments.",
        503: "The AI service is undergoing maintenance. Please try again later.",
      };
      const userMessage = errorMessages[response.status] || "AI service temporarily unavailable. Please try again.";
      return new Response(
        JSON.stringify({ error: userMessage }),
        { status: response.status >= 500 ? 502 : response.status, headers: { "Content-Type": "application/json" } }
      );
    }

    // Stream the response through
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }
            controller.enqueue(value);
          }
        } catch (error) {
          console.error("Stream error:", error);
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("API route error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
