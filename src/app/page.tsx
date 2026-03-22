"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const toolShowcase = [
  {
    number: "01",
    name: "Email Writer",
    desc: "Professional emails in seconds. Replies, outreach, follow-ups — with the right tone, every time.",
    accent: "compose()",
    href: "/app/email",
  },
  {
    number: "02",
    name: "Meeting Summarizer",
    desc: "Paste a transcript. Get action items, decisions, and key takeaways — structured and instant.",
    accent: "summarize()",
    href: "/app/meetings",
  },
  {
    number: "03",
    name: "Code Reviewer",
    desc: "Catches bugs, security issues, and anti-patterns. Like a senior engineer on every pull request.",
    accent: "review()",
    href: "/app/code-review",
  },
  {
    number: "04",
    name: "Blog Post Generator",
    desc: "SEO-optimized long-form content with structured headings, keyword placement, and real depth.",
    accent: "generate()",
    href: "/app/blog",
  },
  {
    number: "05",
    name: "Product Copywriter",
    desc: "Compelling product descriptions for Amazon, Shopify, and any e-commerce platform that converts.",
    accent: "write()",
    href: "/app/product",
  },
  {
    number: "06",
    name: "Tweet Thread Creator",
    desc: "Viral-ready threads with hooks, insights, and calls to action. Five to ten tweets, ready to post.",
    accent: "thread()",
    href: "/app/threads",
  },
];

/* ─── Letter Reveal ─── */
function LetterReveal({ text, as: Tag = "span", className = "", delay = 0 }: {
  text: string; as?: React.ElementType; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setVisible(true); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref as React.RefObject<HTMLElement>} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(18px)",
            transitionDelay: visible ? `${delay + i * 32}ms` : "0ms",
          }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </Tag>
  );
}

/* ─── Scroll Counter ─── */
function ScrollCounter({ end, suffix = "", duration = 900 }: {
  end: number; suffix?: string; duration?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setValue(end); return; }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setValue(Math.round(eased * end));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const staggerRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("fade-up-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    fadeRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    /* Stagger observer for tool cards */
    if (!prefersReduced) {
      const staggerObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const idx = staggerRefs.current.indexOf(entry.target as HTMLElement);
              const el = entry.target as HTMLElement;
              el.style.transitionDelay = `${idx * 80}ms`;
              el.classList.add("stagger-visible");
              staggerObs.unobserve(el);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
      );

      staggerRefs.current.forEach((el) => {
        if (el) staggerObs.observe(el);
      });

      return () => { observer.disconnect(); staggerObs.disconnect(); };
    }

    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | null) => {
    if (el && !fadeRefs.current.includes(el)) {
      fadeRefs.current.push(el);
    }
  };

  const addStaggerRef = (el: HTMLElement | null) => {
    if (el && !staggerRefs.current.includes(el)) {
      staggerRefs.current.push(el);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white antialiased">
      {/* Noise texture overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }} />

      {/* Subtle gradient wash — one only */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
        <span className="text-sm font-medium tracking-tight text-gray-300">ToolSpark AI</span>
        <Link
          href="/app"
          className="text-xs uppercase tracking-widest text-gray-500 transition hover:text-gray-300"
        >
          Open App
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 mx-auto max-w-4xl px-6 pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div ref={addRef} className="fade-up">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            Productivity platform
          </p>
          <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-gray-100 sm:text-7xl">
            <LetterReveal text="Six AI tools." delay={0} />
            <br />
            <LetterReveal text="One workspace." delay={420} />
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-gray-400">
            Write emails, summarize meetings, review code, generate posts,
            craft product copy, and create threads — from a single interface.
          </p>
          <div className="mt-12 flex items-center gap-6">
            <Link
              href="/app"
              className="rounded-lg bg-gray-100 px-7 py-3 text-sm font-semibold text-gray-900 transition hover:bg-white"
            >
              Get Started
            </Link>
            <a
              href="#tools"
              className="text-sm font-medium text-gray-500 transition hover:text-gray-300"
            >
              See the tools
            </a>
          </div>
        </div>
      </section>

      {/* Stats ribbon */}
      <section ref={addRef} className="fade-up relative z-10 border-y border-white/5">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-6 py-10">
          <span className="font-mono text-xs tracking-wide text-gray-500">
            <ScrollCounter end={6} /> Tools
            <span className="ml-12 text-gray-700 hidden sm:inline">&bull;</span>
          </span>
          <span className="font-mono text-xs tracking-wide text-gray-500">
            <ScrollCounter end={50} suffix="K+" /> Words Generated
            <span className="ml-12 text-gray-700 hidden sm:inline">&bull;</span>
          </span>
          <span className="font-mono text-xs tracking-wide text-gray-500">
            Used by <ScrollCounter end={1200} /> Teams
          </span>
        </div>
      </section>

      {/* Tool Showcase — editorial full-width rows */}
      <section id="tools" className="relative z-10 py-32">
        <div className="mx-auto max-w-4xl px-6">
          <p ref={addRef} className="fade-up mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
            The toolkit
          </p>
          <h2 ref={addRef} className="fade-up text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
            Every tool earns its place.
          </h2>
        </div>

        <div className="mt-24 space-y-0">
          {toolShowcase.map((tool, i) => {
            const isEven = i % 2 === 0;
            return (
              <Link
                key={tool.number}
                href={tool.href}
                ref={addStaggerRef}
                className={`stagger-card group block border-t border-white/5 transition hover:bg-white/[0.02] ${
                  i === toolShowcase.length - 1 ? "border-b" : ""
                }`}
              >
                <div className={`mx-auto flex max-w-4xl flex-col gap-4 px-6 py-16 sm:flex-row sm:items-center sm:gap-12 ${
                  isEven ? "" : "sm:flex-row-reverse sm:text-right"
                }`}>
                  <div className="flex-1">
                    <span className="font-mono text-xs text-gray-600">{tool.number}</span>
                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-gray-200 sm:text-4xl transition group-hover:text-white">
                      {tool.name}
                    </h3>
                    <p className="mt-4 max-w-md text-base leading-relaxed text-gray-400">
                      {tool.desc}
                    </p>
                  </div>
                  <div className={`flex-shrink-0 ${isEven ? "" : "sm:text-left"}`}>
                    <code className="font-mono text-sm text-gray-600 transition group-hover:text-indigo-400">
                      {tool.accent}
                    </code>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section ref={addRef} className="fade-up relative z-10 mx-auto max-w-4xl px-6 py-32 sm:py-48 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-100 sm:text-6xl">
          <LetterReveal text="Start creating." />
        </h2>
        <p className="mt-6 text-base text-gray-500">
          No signup. No API keys. Just open and go.
        </p>
        <div className="mt-12">
          <Link
            href="/app"
            className="rounded-lg bg-gray-100 px-8 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-white"
          >
            Launch ToolSpark
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-8">
          <span className="text-xs text-gray-600">ToolSpark AI</span>
          <span className="text-xs text-gray-600">Built with Next.js</span>
        </div>
      </footer>
    </div>
  );
}
