"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { tools } from "@/lib/tools";
import { getSavedGenerations, SavedGeneration } from "@/lib/storage";
import { getRecentlyUsedTools } from "@/lib/favorites";
import OnboardingTour from "@/components/OnboardingTour";

const toolMeta = [
  { accent: "compose()", desc: "Professional emails in seconds. Replies, outreach, follow-ups." },
  { accent: "summarize()", desc: "Action items, decisions, and key takeaways from any transcript." },
  { accent: "review()", desc: "Catches bugs, security issues, and anti-patterns in your code." },
  { accent: "generate()", desc: "SEO-optimized long-form content with structured headings." },
  { accent: "write()", desc: "Compelling product descriptions that convert on any platform." },
  { accent: "thread()", desc: "Viral-ready threads with hooks, insights, and calls to action." },
];

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0);
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

  return <span>{count}</span>;
}

export default function DashboardPage() {
  const [recentGenerations, setRecentGenerations] = useState<SavedGeneration[]>([]);
  const [totalGenerations, setTotalGenerations] = useState(0);
  const [recentlyUsedTools, setRecentlyUsedTools] = useState<typeof tools>([]);

  useEffect(() => {
    const all = getSavedGenerations();
    setRecentGenerations(all.slice(0, 5));
    setTotalGenerations(all.length);

    const recentIds = getRecentlyUsedTools().slice(0, 6);
    const recentTools = recentIds
      .map((r) => tools.find((t) => t.id === r.toolId))
      .filter(Boolean) as typeof tools;
    setRecentlyUsedTools(recentTools);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <OnboardingTour />
      <Navbar />

      {/* Noise texture overlay — matches landing */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      {/* Subtle gradient wash */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--accent-primary)' }}>
            Tools
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: 'var(--text-primary)' }}>
            Your Workspace
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
            Six AI tools. One interface. Pick a tool and start creating.
          </p>
        </div>

        {/* Stats — massive monospace numbers */}
        {totalGenerations > 0 && (
          <div className="mb-16 flex items-baseline gap-16 border-y py-10" style={{ borderColor: 'var(--border-primary)' }}>
            <div>
              <p className="font-mono text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                <AnimatedCounter target={totalGenerations} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: 'var(--text-tertiary)' }}>
                Generations
              </p>
            </div>
            <div>
              <p className="font-mono text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {tools.length}
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: 'var(--text-tertiary)' }}>
                Tools
              </p>
            </div>
            <div>
              <p className="font-mono text-5xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                <AnimatedCounter target={recentlyUsedTools.length} />
              </p>
              <p className="mt-2 text-xs font-medium uppercase tracking-[0.15em]" style={{ color: 'var(--text-tertiary)' }}>
                Recently Used
              </p>
            </div>
          </div>
        )}

        {/* Recently Used — clean horizontal scroll */}
        {recentlyUsedTools.length > 0 && (
          <div className="mb-16">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
              Recently used
            </p>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide">
              {recentlyUsedTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="flex-shrink-0 flex items-center gap-3 rounded-lg px-5 py-3 transition hover:opacity-80"
                  style={{
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {tool.name}
                  </span>
                  <svg className="h-3.5 w-3.5" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tool Cards — large editorial layout */}
        <div className="space-y-0">
          {tools.map((tool, i) => {
            const number = String(i + 1).padStart(2, "0");
            const meta = toolMeta[i];

            return (
              <Link
                key={tool.id}
                href={tool.href}
                className="group block border-t transition"
                style={{ borderColor: 'var(--border-primary)' }}
              >
                <div className="flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:gap-12 sm:py-12">
                  {/* Number */}
                  <span className="font-mono text-xs shrink-0 w-8" style={{ color: 'var(--text-tertiary)' }}>
                    {number}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className="text-2xl font-bold tracking-tight transition sm:text-3xl group-hover:text-indigo-400"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {tool.name}
                    </h3>
                    <p className="mt-2 max-w-lg text-base leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                      {meta.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-4 shrink-0">
                    <code className="hidden sm:block font-mono text-sm transition group-hover:text-indigo-400" style={{ color: 'var(--text-tertiary)' }}>
                      {meta.accent}
                    </code>
                    <svg
                      className="h-5 w-5 transition group-hover:translate-x-1"
                      style={{ color: 'var(--text-tertiary)' }}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
          {/* Bottom border for last item */}
          <div className="border-t" style={{ borderColor: 'var(--border-primary)' }} />
        </div>

        {/* Recent Activity — clean list */}
        {recentGenerations.length > 0 && (
          <div className="mt-24">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'var(--text-tertiary)' }}>
              Recent generations
            </p>
            <div className="space-y-0">
              {recentGenerations.map((gen) => (
                <div
                  key={gen.id}
                  className="flex items-center justify-between border-t py-5"
                  style={{ borderColor: 'var(--border-primary)' }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs" style={{ color: 'var(--text-tertiary)' }}>
                        {new Date(gen.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>
                        {gen.toolName}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {gen.input.slice(0, 100)}
                    </p>
                  </div>
                  <Link
                    href={`/app/${gen.toolType === "code-review" ? "code-review" : gen.toolType}`}
                    className="ml-6 shrink-0 text-xs font-medium transition hover:text-indigo-300"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    Open
                  </Link>
                </div>
              ))}
              <div className="border-t" style={{ borderColor: 'var(--border-primary)' }} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-24 text-center">
          <span className="powered-badge text-sm font-semibold">
            Powered by AI
          </span>
        </div>
      </div>
    </div>
  );
}
