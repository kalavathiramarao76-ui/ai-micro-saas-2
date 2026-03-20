"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function SharedContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get("d");

  let toolName = "";
  let input = "";
  let content = "";
  let error = false;

  if (data) {
    try {
      const decoded = decodeURIComponent(escape(atob(data)));
      const parsed = JSON.parse(decoded);
      toolName = parsed.toolName || "AI ToolBox";
      input = parsed.input || "";
      content = parsed.content || "";
    } catch {
      error = true;
    }
  } else {
    error = true;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 mx-auto">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
            Invalid Share Link
          </h1>
          <p className="mb-6" style={{ color: "var(--text-tertiary)" }}>
            This link is expired, corrupted, or invalid.
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Open AI ToolBox
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Header */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--border-primary)",
          backgroundColor: "color-mix(in srgb, var(--bg-primary) 80%, transparent)",
        }}
      >
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                  />
                </svg>
              </div>
              <span className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                AI ToolBox
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <span
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{
                  backgroundColor: "var(--bg-tertiary)",
                  color: "var(--text-tertiary)",
                }}
              >
                Shared Content
              </span>
              <Link
                href="/app"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Open App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tool badge */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              {toolName}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
              Generated with AI ToolBox
            </p>
          </div>
        </div>

        {/* Input context */}
        {input && (
          <div
            className="mb-6 rounded-xl p-4"
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border-primary)",
            }}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Prompt
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {input.length > 500 ? input.slice(0, 500) + "..." : input}
            </p>
          </div>
        )}

        {/* Output */}
        <div
          className="rounded-xl glass-card p-1"
        >
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Output
            </h2>
            <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Read-only
            </span>
          </div>
          <div className="p-6">
            <div className="prose-output whitespace-pre-wrap">{content}</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 text-center">
          <p className="mb-3 text-sm" style={{ color: "var(--text-tertiary)" }}>
            Create your own AI-generated content for free
          </p>
          <Link
            href="/app"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-indigo-500 hover:to-purple-500"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            Try AI ToolBox
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SharedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--bg-primary)" }}>
          <div className="animate-pulse text-sm" style={{ color: "var(--text-tertiary)" }}>
            Loading shared content...
          </div>
        </div>
      }
    >
      <SharedContent />
    </Suspense>
  );
}
