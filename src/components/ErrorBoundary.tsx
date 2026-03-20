"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showDetails: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, showDetails: false };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, showDetails: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-[400px] items-center justify-center p-6">
          <div
            className="mx-auto w-full max-w-md rounded-2xl border p-8 text-center"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "var(--glass-border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            {/* Error icon */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
              <svg
                className="h-8 w-8 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h3
              className="mb-2 text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Something went wrong
            </h3>
            <p
              className="mb-6 text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              An unexpected error occurred. Please try again.
            </p>

            {/* Collapsible error details */}
            {this.state.error && (
              <div className="mb-6">
                <button
                  onClick={() =>
                    this.setState((prev) => ({
                      showDetails: !prev.showDetails,
                    }))
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium transition"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <svg
                    className={`h-3 w-3 transition-transform ${
                      this.state.showDetails ? "rotate-90" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                  {this.state.showDetails ? "Hide details" : "Show details"}
                </button>
                {this.state.showDetails && (
                  <div
                    className="mt-2 rounded-lg p-3 text-left text-xs font-mono overflow-auto max-h-32"
                    style={{
                      backgroundColor: "var(--bg-secondary)",
                      color: "var(--text-tertiary)",
                      border: "1px solid var(--border-primary)",
                    }}
                  >
                    {this.state.error.message}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Try Again
              </button>
              <a
                href="https://github.com/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-4 py-2.5 text-sm font-medium transition"
                style={{
                  border: "1px solid var(--border-secondary)",
                  color: "var(--text-secondary)",
                }}
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
