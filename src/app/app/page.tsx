"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ToolIcon from "@/components/ToolIcon";
import { tools } from "@/lib/tools";
import { getSavedGenerations, SavedGeneration } from "@/lib/storage";

export default function DashboardPage() {
  const [recentGenerations, setRecentGenerations] = useState<SavedGeneration[]>([]);

  useEffect(() => {
    setRecentGenerations(getSavedGenerations().slice(0, 5));
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-zinc-100">Dashboard</h1>
          <p className="mt-1 text-zinc-500">
            Choose a tool to get started with AI-powered content generation.
          </p>
        </div>

        {/* Tool Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
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
              Be specific in your inputs for better AI-generated results.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 text-indigo-400">&#8226;</span>
              Click the copy button to quickly grab any generated content.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
