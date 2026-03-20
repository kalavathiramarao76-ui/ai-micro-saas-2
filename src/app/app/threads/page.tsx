"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { tools } from "@/lib/tools";

const tool = tools.find((t) => t.id === "threads")!;

const threadStyles = [
  "Educational",
  "Storytelling",
  "Tips & Tricks",
  "Hot Take / Opinion",
  "Step-by-Step Guide",
  "Myth Busting",
];

export default function ThreadsPage() {
  const [topic, setTopic] = useState("");
  const [style, setStyle] = useState(threadStyles[0]);
  const [tweetCount, setTweetCount] = useState("7");
  const [additionalContext, setAdditionalContext] = useState("");

  return (
    <ToolLayout
      toolId={tool.id}
      toolName={tool.name}
      toolDescription={tool.description}
      toolIcon={tool.icon}
      toolColor={tool.color}
      gradient={tool.gradient}
    >
      {({ onGenerate, isLoading }) => (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Thread Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Why most startups fail in their first year"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Thread Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {threadStyles.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-400">
                Number of Tweets
              </label>
              <select
                value={tweetCount}
                onChange={(e) => setTweetCount(e.target.value)}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              >
                {["5", "6", "7", "8", "9", "10"].map((n) => (
                  <option key={n} value={n}>
                    {n} tweets
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Additional Context (optional)
            </label>
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              rows={4}
              placeholder="Any specific points, data, examples, or angles you want included in the thread..."
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              const input = `Topic: ${topic}\nStyle: ${style}\nNumber of tweets: ${tweetCount}${
                additionalContext
                  ? `\n\nAdditional context:\n${additionalContext}`
                  : ""
              }`;
              onGenerate(input);
            }}
            disabled={isLoading || !topic.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating Thread...
              </span>
            ) : (
              "Generate Tweet Thread"
            )}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
