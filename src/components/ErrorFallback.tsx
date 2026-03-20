"use client";

import { useState, useEffect, useCallback } from "react";

interface ErrorFallbackProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorFallback({ error, onRetry }: ErrorFallbackProps) {
  const [countdown, setCountdown] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  const startCountdown = useCallback(() => {
    setCountdown(10);
    setIsRetrying(true);
  }, []);

  useEffect(() => {
    if (countdown <= 0 && isRetrying) {
      setIsRetrying(false);
      onRetry();
      return;
    }
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isRetrying, onRetry]);

  const handleRetryNow = () => {
    setCountdown(0);
    setIsRetrying(false);
    onRetry();
  };

  return (
    <div
      className="rounded-xl border p-6 text-center"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderColor: "rgba(239, 68, 68, 0.15)",
        boxShadow: "0 0 20px rgba(239, 68, 68, 0.05)",
      }}
    >
      {/* Icon */}
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
        <svg
          className="h-6 w-6 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
          />
        </svg>
      </div>

      <h3
        className="mb-1 text-base font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        AI service unavailable
      </h3>
      <p className="mb-5 text-sm" style={{ color: "var(--text-tertiary)" }}>
        {error || "We couldn't connect to the AI service. Please try again."}
      </p>

      {/* Retry */}
      <div className="mb-5">
        {isRetrying ? (
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-10 w-10">
              <svg className="h-10 w-10 -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="var(--border-primary)"
                  strokeWidth="2"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#6366f1"
                  strokeWidth="2"
                  strokeDasharray={`${((10 - countdown) / 10) * 94.25} 94.25`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <span
                className="absolute inset-0 flex items-center justify-center text-xs font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {countdown}
              </span>
            </div>
            <p
              className="text-xs"
              style={{ color: "var(--text-tertiary)" }}
            >
              Auto-retrying...
            </p>
            <button
              onClick={handleRetryNow}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
            >
              Retry now
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleRetryNow}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
            >
              Retry
            </button>
            <button
              onClick={startCountdown}
              className="rounded-lg px-4 py-2 text-sm font-medium transition"
              style={{
                border: "1px solid var(--border-secondary)",
                color: "var(--text-secondary)",
              }}
            >
              Auto-retry (10s)
            </button>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div
        className="rounded-lg p-3 text-left"
        style={{ backgroundColor: "var(--bg-secondary)" }}
      >
        <p
          className="mb-2 text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--text-tertiary)" }}
        >
          Suggestions
        </p>
        <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-secondary)" }}>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-indigo-400">&#8226;</span>
            Check your internet connection
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-indigo-400">&#8226;</span>
            Try a simpler or shorter prompt
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-indigo-400">&#8226;</span>
            Wait a moment and try again
          </li>
        </ul>
      </div>
    </div>
  );
}
