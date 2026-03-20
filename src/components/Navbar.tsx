"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFavoritesCount } from "@/lib/favorites";

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
    <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
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
            <span className="text-lg font-bold text-zinc-100">
              AI Toolkit <span className="text-indigo-400">Pro</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {isApp ? (
              <>
                <Link
                  href="/app"
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition hover:text-zinc-100 ${
                    pathname === "/app" ? "text-zinc-100" : "text-zinc-400"
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/app/favorites"
                  className={`relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition hover:text-zinc-100 ${
                    pathname === "/app/favorites" ? "text-zinc-100" : "text-zinc-400"
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
  );
}
