"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getToolStats, getTotalStats, getLast7DaysActivity, getCurrentStreak, ToolUsageStat, DailyActivity } from "@/lib/analytics";
import { tools } from "@/lib/tools";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current || target === 0) {
      setCount(target);
      return;
    }
    hasAnimated.current = true;
    const duration = 1200;
    const steps = 40;
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

  return <>{count.toLocaleString()}{suffix}</>;
}

// Tool color mapping
const toolColors: Record<string, string> = {
  email: "#3b82f6",
  meetings: "#10b981",
  "code-review": "#f97316",
  blog: "#8b5cf6",
  product: "#ec4899",
  threads: "#06b6d4",
};

function DonutChart({ stats }: { stats: ToolUsageStat[] }) {
  const total = stats.reduce((sum, s) => sum + s.usageCount, 0);
  if (total === 0) return null;

  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {stats.map((stat) => {
            const pct = stat.usageCount / total;
            const dash = pct * circumference;
            const gap = circumference - dash;
            const currentOffset = offset;
            offset += dash;

            return (
              <circle
                key={stat.toolId}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={toolColors[stat.toolId] || "#6366f1"}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={-currentOffset}
                strokeLinecap="round"
                className="transition-all duration-1000"
                style={{ opacity: 0.9 }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            {total}
          </span>
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>Total</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {stats.map((stat) => {
          const pct = Math.round((stat.usageCount / total) * 100);
          return (
            <div key={stat.toolId} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: toolColors[stat.toolId] || "#6366f1" }}
              />
              <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                {stat.toolName} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BarChart({ data }: { data: DailyActivity[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-2" style={{ height: "140px" }}>
      {data.map((day) => {
        const height = Math.max((day.count / maxCount) * 120, 4);
        const dayLabel = new Date(day.date + "T12:00:00").toLocaleDateString("en", { weekday: "short" });
        return (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>
              {day.count > 0 ? day.count : ""}
            </span>
            <div
              className="w-full rounded-t-md transition-all duration-700"
              style={{
                height: `${height}px`,
                background: day.count > 0
                  ? "linear-gradient(to top, #6366f1, #8b5cf6)"
                  : "var(--bg-tertiary)",
                minHeight: "4px",
              }}
            />
            <span className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
              {dayLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function AnalyticsPage() {
  const [toolStats, setToolStats] = useState<ToolUsageStat[]>([]);
  const [totalStats, setTotalStats] = useState({ totalGenerations: 0, totalWords: 0, toolsUsed: 0 });
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setToolStats(getToolStats());
    setTotalStats(getTotalStats());
    setDailyActivity(getLast7DaysActivity());
    setStreak(getCurrentStreak());
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/app"
            className="mb-4 inline-flex items-center gap-1 text-sm transition"
            style={{ color: "var(--text-tertiary)" }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Usage Analytics
          </h1>
          <p className="mt-1" style={{ color: "var(--text-tertiary)" }}>
            Track your AI content generation activity
          </p>
        </div>

        {/* Stat Cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl glass-card p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/20">
              <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              <AnimatedNumber target={totalStats.totalGenerations} />
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Generations
            </p>
          </div>

          <div className="rounded-xl glass-card p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-600/20">
              <svg className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              <AnimatedNumber target={totalStats.totalWords} />
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Words Generated
            </p>
          </div>

          <div className="rounded-xl glass-card p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/20">
              <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.1-3.26a.75.75 0 010-1.28l5.1-3.26a.75.75 0 011.08.64v6.52a.75.75 0 01-1.08.64zM20.25 12a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              <AnimatedNumber target={totalStats.toolsUsed} />
              <span className="text-sm font-normal" style={{ color: "var(--text-tertiary)" }}>/6</span>
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Tools Used
            </p>
          </div>

          <div className="rounded-xl glass-card p-5">
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/20">
              <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
              </svg>
            </div>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                <AnimatedNumber target={streak} />
              </p>
              {streak > 0 && (
                <span className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  day{streak !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className="text-xs uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              {streak > 0 ? "Current Streak" : "No Streak"}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donut Chart - Tool Usage Breakdown */}
          <div className="rounded-xl glass-card p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              Tool Usage Breakdown
            </h2>
            {toolStats.length > 0 ? (
              <DonutChart stats={toolStats} />
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  No usage data yet. Start generating content!
                </p>
              </div>
            )}
          </div>

          {/* Bar Chart - 7 Day Activity */}
          <div className="rounded-xl glass-card p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
              7-Day Activity
            </h2>
            <BarChart data={dailyActivity} />
          </div>
        </div>

        {/* Per-Tool Stats Table */}
        {toolStats.length > 0 && (
          <div className="mt-6 rounded-xl glass-card overflow-hidden">
            <div className="border-b px-5 py-4" style={{ borderColor: "var(--border-primary)" }}>
              <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Per-Tool Details
              </h2>
            </div>
            {toolStats.map((stat, i) => {
              const tool = tools.find((t) => t.id === stat.toolId);
              return (
                <div
                  key={stat.toolId}
                  className={`flex items-center justify-between px-5 py-4 ${
                    i !== toolStats.length - 1 ? "border-b" : ""
                  }`}
                  style={{ borderColor: "var(--border-primary)" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: toolColors[stat.toolId] || "#6366f1" }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {stat.toolName}
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
                        Last used {new Date(stat.lastUsed).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {stat.usageCount}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                        Uses
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                        {stat.wordCount.toLocaleString()}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                        Words
                      </p>
                    </div>
                    {tool && (
                      <Link
                        href={tool.href}
                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        Open
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {toolStats.length === 0 && (
          <div className="mt-6 rounded-xl glass-card p-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "var(--bg-tertiary)" }}>
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
            </div>
            <h3 className="mb-2 text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
              No analytics yet
            </h3>
            <p className="mb-4 text-sm" style={{ color: "var(--text-tertiary)" }}>
              Start using the AI tools to see your usage analytics here.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              }}
            >
              Go to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
