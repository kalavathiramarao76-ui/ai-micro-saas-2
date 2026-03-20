"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ToolIcon from "@/components/ToolIcon";
import SearchBar from "@/components/SearchBar";
import { tools } from "@/lib/tools";
import { getSavedGenerations, SavedGeneration } from "@/lib/storage";
import { getRecentlyUsedTools } from "@/lib/favorites";
import OnboardingTour from "@/components/OnboardingTour";

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target === 0) {
      setCount(target);
      return;
    }
    hasAnimated.current = true;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(interval);
  }, [target]);

  return <span ref={ref}>{count}</span>;
}

export default function DashboardPage() {
  const [recentGenerations, setRecentGenerations] = useState<SavedGeneration[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [recentlyUsedTools, setRecentlyUsedTools] = useState<typeof tools>([]);

  useEffect(() => {
    const all = getSavedGenerations();
    setRecentGenerations(all.slice(0, 5));
    setTotalGenerations(all.length);

    // Get recently used tools
    const recentIds = getRecentlyUsedTools().slice(0, 3);
    const recentTools = recentIds
      .map((r) => tools.find((t) => t.id === r.toolId))
      .filter(Boolean) as typeof tools;
    setRecentlyUsedTools(recentTools);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <OnboardingTour />
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
            <p className="mt-1" style={{ color: 'var(--text-tertiary)' }}>
              Choose a tool to get started with AI-powered content generation.
            </p>
          </div>
          {totalGenerations > 0 && (
            <div className="flex items-center gap-2 rounded-xl glass-card px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20">
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  <AnimatedCounter target={totalGenerations} />
                </p>
                <p className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Generations</p>
              </div>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar />
        </div>

        {/* Recently Used */}
        {recentlyUsedTools.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              Recently Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {recentlyUsedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="flex items-center gap-3 rounded-xl glass-card px-4 py-3 transition hover:shadow-lg hover:shadow-indigo-500/5"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                    <ToolIcon path={tool.icon} className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{tool.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Open tool</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tool Grid with glassmorphism */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card-gradient group relative rounded-xl p-[1px]"
            >
              <div className="flex h-full items-start gap-4 rounded-xl p-5 transition glass-card group-hover:shadow-lg group-hover:shadow-indigo-500/5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}
                >
                  <ToolIcon path={tool.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold transition group-hover:text-indigo-400" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        {recentGenerations.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Generations
            </h2>
            <div className="rounded-xl glass-card overflow-hidden">
              {recentGenerations.map((gen, i) => (
                <div
                  key={gen.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i !== recentGenerations.length - 1 ? "border-b" : ""
                  }`}
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md px-2 py-0.5 text-xs font-medium" style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        {gen.toolName}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {gen.input.slice(0, 100)}
                    </p>
                  </div>
                  <Link
                    href={`/app/${gen.toolType === "code-review" ? "code-review" : gen.toolType}`}
                    className="ml-4 shrink-0 text-xs font-medium text-indigo-400 hover:text-indigo-300"
                  >
                    Open Tool
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-12 rounded-xl glass-card p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            Tips
          </h2>
          <ul className="mt-3 space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-400">&#8226;</span>
              All generated content is automatically saved to your browser&apos;s local storage.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-400">&#8226;</span>
              Star any generation to add it to your favorites for quick access.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-400">&#8226;</span>
              Use Ctrl+F or / to quickly search across all your generations.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-400">&#8226;</span>
              Be specific in your inputs for better AI-generated results.
            </li>
          </ul>
        </div>

        {/* Powered by AI footer */}
        <div className="mt-8 text-center">
          <span className="powered-badge text-sm font-semibold">
            Powered by AI
          </span>
        </div>
      </div>
    </div>
  );
}
