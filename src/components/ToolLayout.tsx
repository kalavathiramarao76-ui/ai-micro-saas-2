"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import ToolIcon from "./ToolIcon";
import SavedList from "./SavedList";
import FavoriteButton from "./FavoriteButton";
import ExportMenu from "./ExportMenu";
import ErrorBoundary from "./ErrorBoundary";
import ErrorFallback from "./ErrorFallback";
import { saveGeneration, getGenerationsByTool, deleteGeneration, SavedGeneration } from "@/lib/storage";
import { trackToolUsage } from "@/lib/favorites";
import { trackGeneration } from "@/lib/analytics";

interface ToolLayoutProps {
  toolId: string;
  toolName: string;
  toolDescription: string;
  toolIcon: string;
  toolColor: string;
  gradient: string;
  children: (props: {
    onGenerate: (input: string) => void;
    isLoading: boolean;
  }) => React.ReactNode;
}

export default function ToolLayout({
  toolId,
  toolName,
  toolDescription,
  toolIcon,
  toolColor,
  gradient,
  children,
}: ToolLayoutProps) {
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [, setCurrentInput] = useState("");
  const [saved, setSaved] = useState<SavedGeneration[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [lastGeneration, setLastGeneration] = useState<SavedGeneration | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSaved(getGenerationsByTool(toolId));
  }, [toolId]);

  const handleGenerate = useCallback(
    async (input: string) => {
      if (!input.trim() || isLoading) return;

      setCurrentInput(input);
      setLastInput(input);
      setOutput("");
      setIsLoading(true);
      setIsStreaming(true);
      setLastGeneration(null);
      setApiError(null);

      // Track tool usage
      trackToolUsage(toolId);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolType: toolId, input }),
        });

        if (!response.ok) {
          let errorMsg = "Failed to generate content";
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch {
            // couldn't parse error response
          }
          throw new Error(errorMsg);
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No reader");

        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content || "";
                if (content) {
                  fullText += content;
                  setOutput(fullText);
                  if (outputRef.current) {
                    outputRef.current.scrollTop = outputRef.current.scrollHeight;
                  }
                }
              } catch {
                // skip unparseable
              }
            }
          }
        }

        if (fullText) {
          const gen = saveGeneration({
            toolType: toolId,
            toolName,
            input,
            output: fullText,
          });
          setSaved((prev) => [gen, ...prev]);
          setLastGeneration(gen);
          trackGeneration(toolId, toolName, fullText);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred";
        setApiError(message);
        setOutput("");
        console.error(err);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [toolId, toolName, isLoading]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDelete = useCallback((id: string) => {
    deleteGeneration(id);
    setSaved((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleLoadSaved = useCallback((gen: SavedGeneration) => {
    setOutput(gen.output);
    setLastGeneration(gen);
    setCurrentInput(gen.input);
    setShowSaved(false);
  }, []);

  return (
    <ErrorBoundary>
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/app"
            className="mb-4 inline-flex items-center gap-1 text-sm transition"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient}`}>
              <ToolIcon path={toolIcon} className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{toolName}</h1>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{toolDescription}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <div className="space-y-4">
            <div className="rounded-xl glass-card p-1">
              <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border-primary)' }}>
                <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Input</h2>
                <button
                  onClick={() => setShowSaved(!showSaved)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                  History ({saved.length})
                </button>
              </div>
              <div className="p-4">
                {children({ onGenerate: handleGenerate, isLoading })}
              </div>
            </div>

            {showSaved && (
              <SavedList
                items={saved}
                onLoad={handleLoadSaved}
                onDelete={handleDelete}
              />
            )}
          </div>

          {/* Output Panel */}
          <div className="rounded-xl glass-card p-1">
            <div className="flex items-center justify-between border-b px-4 py-3" style={{ borderColor: 'var(--border-primary)' }}>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Output</h2>
              {output && !isStreaming && (
                <div className="flex items-center gap-1">
                  {lastGeneration && (
                    <FavoriteButton
                      generationId={lastGeneration.id}
                      toolType={lastGeneration.toolType}
                      toolName={lastGeneration.toolName}
                      content={lastGeneration.output}
                      input={lastGeneration.input}
                      createdAt={lastGeneration.createdAt}
                      size="sm"
                    />
                  )}
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                  >
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Copied
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                  <ExportMenu content={output} toolName={toolName} />
                </div>
              )}
            </div>
            <div
              ref={outputRef}
              className="max-h-[600px] min-h-[400px] overflow-y-auto p-6"
            >
              {apiError ? (
                <div className="flex min-h-[350px] items-center justify-center">
                  <ErrorFallback
                    error={apiError}
                    onRetry={() => {
                      if (lastInput) {
                        handleGenerate(lastInput);
                      }
                    }}
                  />
                </div>
              ) : output ? (
                <div className={`prose-output whitespace-pre-wrap print-content ${isStreaming ? "streaming-cursor" : ""}`}>
                  {output}
                </div>
              ) : (
                <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
                  <div className={`mb-4 rounded-full p-4 ${toolColor}`} style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                    <ToolIcon path={toolIcon} className="h-8 w-8" />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    Your AI-generated content will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
