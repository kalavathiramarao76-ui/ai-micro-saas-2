"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ToolIcon from "@/components/ToolIcon";
import SearchBar from "@/components/SearchBar";
import { tools } from "@/lib/tools";
import { getSavedGenerations, SavedGeneration } from "@/lib/storage";
import { getRecentlyUsedTools } from "@/lib/favorites";

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
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome + Search */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
            <p className="mt-1 text-zinc-500">
              Choose a tool to get started with AI-powered content generation.
            </p>
          </div>
          {totalGenerations > 0 && (
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20">
                <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-bold text-zinc-100">
                  <AnimatedCounter target={totalGenerations} />
                </p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">Generations</p>
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
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Recently Used
            </h2>
            <div className="flex flex-wrap gap-3">
              {recentlyUsedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-3 transition hover:border-indigo-500/30 hover:bg-zinc-900"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                    <ToolIcon path={tool.icon} className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{tool.name}</p>
                    <p className="text-xs text-zinc-500">Open tool</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tool Grid with gradient borders */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card-gradient group relative rounded-xl p-[1px]"
            >
              <div className="flex h-full items-start gap-4 rounded-xl bg-zinc-900 p-5 transition group-hover:bg-zinc-900/80">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient}`}
                >
                  <ToolIcon path={tool.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-zinc-100 transition group-hover:text-indigo-400">
                    {tool.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-zinc-500">
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
            <h2 className="mb-4 text-lg font-semibold text-zinc-200">
              Recent Generations
            </h2>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50">
              {recentGenerations.map((gen, i) => (
                <div
                  key={gen.id}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i !== recentGenerations.length - 1 ? "border-b border-zinc-800/50" : ""
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-xs font-medium text-zinc-400">
                        {gen.toolName}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {new Date(gen.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-400">
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
        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
            Tips
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
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
      </div>
    </div>
  );
}
