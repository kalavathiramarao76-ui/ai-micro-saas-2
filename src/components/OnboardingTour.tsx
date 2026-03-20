"use client";

import { useState, useEffect, useCallback } from "react";

const ONBOARDING_KEY = "microsaas_onboarding";

const steps = [
  {
    title: "Welcome to AI ToolBox",
    description:
      "Your all-in-one AI content toolkit with 6 powerful tools: Email Writer, Meeting Summarizer, Code Reviewer, Blog Post Generator, Product Copywriter, and Tweet Thread Creator.",
    icon: (
      <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
  },
  {
    title: "Pick a Tool",
    description:
      "Browse the tool grid below to find the right AI assistant. Each tool is purpose-built for a specific content type -- just click to start generating.",
    icon: (
      <svg className="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    title: "Save & Organize",
    description:
      "Star your best generations to save them as favorites. Use the search bar or press Cmd+K to quickly find any tool or past generation.",
    icon: (
      <svg className="h-8 w-8 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
  },
];

// Simple confetti effect
function createConfetti(container: HTMLElement) {
  const colors = ["#6366f1", "#8b5cf6", "#a78bfa", "#c084fc", "#f472b6", "#34d399", "#fbbf24"];
  const count = 60;

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    piece.style.cssText = `
      position: fixed;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: ${Math.random() > 0.5 ? "50%" : "2px"};
      pointer-events: none;
      z-index: 10000;
      opacity: 1;
    `;

    const rotation = Math.random() * 360;
    const duration = Math.random() * 2 + 1.5;
    const drift = (Math.random() - 0.5) * 200;

    piece.animate(
      [
        { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
        { transform: `translateY(100vh) translateX(${drift}px) rotate(${rotation}deg)`, opacity: 0 },
      ],
      {
        duration: duration * 1000,
        easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }
    );

    container.appendChild(piece);
    setTimeout(() => piece.remove(), duration * 1000);
  }
}

export default function OnboardingTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) {
      // Small delay so the page loads first
      const t = setTimeout(() => setShow(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  const finish = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    createConfetti(document.body);
    setShow(false);
  }, []);

  const skip = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setShow(false);
  }, []);

  const next = useCallback(() => {
    if (step < steps.length - 1) {
      setStep((s) => s + 1);
    } else {
      finish();
    }
  }, [step, finish]);

  if (!show) return null;

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 cmd-palette-backdrop"
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative w-full max-w-md cmd-palette-container"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
          borderRadius: "20px",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}
      >
        {/* Glow effect */}
        <div
          className="absolute -inset-px rounded-[20px] opacity-50"
          style={{
            background: "linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.1), rgba(168,85,247,0.3))",
            filter: "blur(1px)",
            zIndex: -1,
          }}
        />

        <div className="p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "var(--bg-tertiary)" }}
          >
            {current.icon}
          </div>

          {/* Step indicator */}
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-tertiary)" }}>
            Step {step + 1} of {steps.length}
          </p>

          {/* Title */}
          <h2 className="mb-3 text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            {current.title}
          </h2>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {current.description}
          </p>

          {/* Dots */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === step ? "24px" : "8px",
                  height: "8px",
                  background: i === step
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : i < step
                    ? "#6366f1"
                    : "var(--bg-tertiary)",
                }}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={skip}
              className="rounded-xl px-5 py-2.5 text-sm font-medium transition hover:opacity-80"
              style={{ color: "var(--text-tertiary)" }}
            >
              Skip
            </button>
            <button
              onClick={next}
              className="rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                boxShadow: "0 4px 15px rgba(99,102,241,0.4)",
              }}
            >
              {step === steps.length - 1 ? "Get Started" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
