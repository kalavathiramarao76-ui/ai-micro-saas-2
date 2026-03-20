import Link from "next/link";
import Navbar from "@/components/Navbar";
import { tools } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />

      {/* Hero with animated gradient mesh */}
      <section className="relative overflow-hidden">
        <div className="gradient-mesh" />
        <div className="gradient-mesh-extra" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
                6 AI-powered tools in one platform
              </div>
              <div className="enterprise-badge inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold">
                <svg className="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Enterprise-Grade Resilience
              </div>
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl" style={{ color: 'var(--text-primary)' }}>
              Your AI Productivity{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Toolkit
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 sm:text-xl" style={{ color: 'var(--text-secondary)' }}>
              Write emails, summarize meetings, review code, generate blog posts,
              craft product copy, and create tweet threads — all powered by AI.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/app"
                className="rounded-xl bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 hover:shadow-indigo-500/30"
              >
                Get Started Free
              </Link>
              <a
                href="#tools"
                className="rounded-xl px-8 py-3.5 text-sm font-semibold transition"
                style={{ border: '1px solid var(--border-secondary)', color: 'var(--text-secondary)' }}
              >
                See All Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 30%, transparent)' }}>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "6", label: "AI Tools" },
              { value: "Free", label: "No API Key Needed" },
              { value: "Real-time", label: "Streaming Output" },
              { value: "Instant", label: "Generation Speed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-indigo-400">{stat.value}</p>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Everything You Need, One Platform
          </h2>
          <p className="mt-4 text-lg" style={{ color: 'var(--text-secondary)' }}>
            Six professional-grade AI tools designed for maximum productivity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl p-6 transition glass-card hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3`}>
                <ToolIcon path={tool.icon} className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold transition group-hover:text-indigo-400" style={{ color: 'var(--text-primary)' }}>
                {tool.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                {tool.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-400 opacity-0 transition group-hover:opacity-100">
                Try it now
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ borderTop: '1px solid var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-secondary) 20%, transparent)' }}>
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            How It Works
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Choose Your Tool",
                desc: "Pick from 6 specialized AI tools — each optimized for a specific task.",
              },
              {
                step: "02",
                title: "Provide Your Input",
                desc: "Enter your context, paste your content, or describe what you need.",
              },
              {
                step: "03",
                title: "Get AI Results",
                desc: "Watch as AI generates polished, professional content in real-time.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/10 text-xl font-bold text-indigo-400">
                  {item.step}
                </div>
                <h3 className="mt-4 text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-center shadow-2xl">
          <div className="relative">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              Ready to supercharge your productivity?
            </h2>
            <p className="mt-4 text-lg text-indigo-100">
              Start using all 6 AI tools right now. No signup required.
            </p>
            <Link
              href="/app"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50"
            >
              Launch Dashboard
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer with Powered by AI badge */}
      <footer style={{ borderTop: '1px solid var(--border-primary)' }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              AI ToolBox — Built with Next.js, Tailwind CSS & AI
            </p>
            <div className="flex items-center gap-4">
              <span className="powered-badge text-sm font-semibold">
                Powered by AI
              </span>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                No API key required. Free to use.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
