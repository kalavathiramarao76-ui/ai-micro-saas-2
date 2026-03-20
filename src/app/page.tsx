import Link from "next/link";
import Navbar from "@/components/Navbar";
import { tools } from "@/lib/tools";
import ToolIcon from "@/components/ToolIcon";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-600/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300">
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              6 AI-powered tools in one platform
            </div>
            <h1 className="text-balance text-5xl font-bold tracking-tight text-zinc-100 sm:text-6xl lg:text-7xl">
              Your AI Productivity{" "}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Toolkit
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl">
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
                className="rounded-xl border border-zinc-700 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
              >
                See All Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-zinc-800/50 bg-zinc-900/30">
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
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-100 sm:text-4xl">
            Everything You Need, One Platform
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Six professional-grade AI tools designed for maximum productivity.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${tool.gradient} p-3`}>
                <ToolIcon path={tool.icon} className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-100 transition group-hover:text-indigo-400">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
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
      <section className="border-t border-zinc-800/50 bg-zinc-900/20">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-zinc-100">
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
                <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-500">{item.desc}</p>
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

      {/* Footer */}
      <footer className="border-t border-zinc-800/50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-zinc-600">
              AI Toolkit Pro — Built with Next.js, Tailwind CSS & AI
            </p>
            <p className="text-sm text-zinc-600">
              No API key required. Free to use.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
