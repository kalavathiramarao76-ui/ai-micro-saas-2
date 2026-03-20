"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFavoritesCount } from "@/lib/favorites";
import ThemeToggle from "./ThemeToggle";
import CommandPalette from "./CommandPalette";
import CollabPresence from "./CollabPresence";
import NotificationCenter from "./NotificationCenter";

export default function Navbar() {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    setFavCount(getFavoritesCount());
    const handler = () => setFavCount(getFavoritesCount());
    window.addEventListener("favorites-changed", handler);
    return () => window.removeEventListener("favorites-changed", handler);
  }, []);

  return (
    <>
      <CommandPalette />
      <nav className="sticky top-0 z-50 border-b backdrop-blur-xl" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'color-mix(in srgb, var(--bg-primary) 80%, transparent)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  AI ToolBox
                </span>
              </Link>

              {/* Cmd+K hint */}
              {isApp && (
                <button
                  onClick={() => {
                    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
                  }}
                  className="hidden sm:flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs transition hover:bg-[var(--surface-hover)]"
                  style={{
                    border: '1px solid var(--border-primary)',
                    color: 'var(--text-tertiary)',
                  }}
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <span>Search...</span>
                  <kbd className="rounded px-1 py-0.5 text-[10px] font-medium" style={{ background: 'var(--bg-tertiary)' }}>
                    ⌘K
                  </kbd>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Collab Presence */}
              {isApp && <CollabPresence />}

              {isApp && <div className="mx-1 h-5 w-px" style={{ background: 'var(--border-primary)' }} />}

              {/* Notification Center */}
              {isApp && <NotificationCenter />}

              <ThemeToggle />
              {isApp ? (
                <>
                  <Link
                    href="/app"
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pathname === "/app"
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/app/analytics"
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pathname === "/app/analytics"
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                      />
                    </svg>
                    Analytics
                  </Link>
                  <Link
                    href="/app/favorites"
                    className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pathname === "/app/favorites"
                        ? "text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill={pathname === "/app/favorites" ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                      />
                    </svg>
                    Favorites
                    {favCount > 0 && (
                      <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-500/20 px-1.5 text-[10px] font-bold text-amber-400">
                        {favCount}
                      </span>
                    )}
                  </Link>
                </>
              ) : (
                <Link
                  href="/app"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Open App
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
