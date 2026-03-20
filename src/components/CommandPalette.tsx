"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { tools } from "@/lib/tools";

interface Command {
  id: string;
  label: string;
  icon: string;
  href: string;
  category: "tool" | "nav";
}

const NAV_COMMANDS: Command[] = [
  {
    id: "favorites",
    label: "Favorites",
    icon: "M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z",
    href: "/app/favorites",
    category: "nav",
  },
  {
    id: "search",
    label: "Search",
    icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z",
    href: "/app",
    category: "nav",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
    href: "/app",
    category: "nav",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z",
    href: "/app",
    category: "nav",
  },
];

const RECENT_KEY = "cmd-palette-recent";

function getRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecent(id: string) {
  const recent = getRecent().filter((r) => r !== id);
  recent.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)));
}

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) qi++;
  }
  return qi === q.length;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const allCommands = useMemo<Command[]>(() => {
    const toolCmds: Command[] = tools.map((t) => ({
      id: t.id,
      label: t.name,
      icon: t.icon,
      href: t.href,
      category: "tool" as const,
    }));
    return [...toolCmds, ...NAV_COMMANDS];
  }, []);

  const recentIds = useMemo(() => (open ? getRecent() : []), [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) {
      // Show recent first, then all
      const recent = recentIds
        .map((id) => allCommands.find((c) => c.id === id))
        .filter(Boolean) as Command[];
      const rest = allCommands.filter((c) => !recentIds.includes(c.id));
      return [...recent, ...rest];
    }
    return allCommands.filter((c) => fuzzyMatch(query, c.label));
  }, [query, allCommands, recentIds]);

  const execute = useCallback(
    (cmd: Command) => {
      addRecent(cmd.id);
      setOpen(false);
      setQuery("");
      router.push(cmd.href);
    },
    [router]
  );

  // Global Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        setQuery("");
        setSelectedIndex(0);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Focus input when open
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset selection on filter change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard nav
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        execute(filtered[selectedIndex]);
      }
    },
    [filtered, selectedIndex, execute]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-cmd-item]");
    items[selectedIndex]?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
      onClick={() => {
        setOpen(false);
        setQuery("");
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm cmd-palette-backdrop" />

      {/* Palette */}
      <div
        className="cmd-palette-container relative w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div
          className="flex items-center gap-3 px-4 py-3.5"
          style={{ borderBottom: "1px solid var(--border-primary)" }}
        >
          <svg
            className="h-5 w-5 shrink-0"
            style={{ color: "var(--text-tertiary)" }}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
          />
          <kbd
            className="hidden sm:inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-medium"
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-tertiary)",
            }}
          >
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2 px-2">
          {filtered.length === 0 && (
            <p
              className="px-3 py-6 text-center text-sm"
              style={{ color: "var(--text-tertiary)" }}
            >
              No commands found
            </p>
          )}

          {/* Recent label */}
          {!query.trim() && recentIds.length > 0 && filtered.length > 0 && (
            <p
              className="px-3 pt-1 pb-1.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-tertiary)" }}
            >
              Recent
            </p>
          )}

          {filtered.map((cmd, i) => {
            const isRecent =
              !query.trim() && recentIds.includes(cmd.id);
            const showToolsLabel =
              !query.trim() &&
              recentIds.length > 0 &&
              i === recentIds.filter((id) => allCommands.find((c) => c.id === id)).length;

            return (
              <div key={cmd.id}>
                {showToolsLabel && (
                  <p
                    className="px-3 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    All Commands
                  </p>
                )}
                <button
                  data-cmd-item
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setSelectedIndex(i)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    i === selectedIndex
                      ? "bg-indigo-500/15 text-indigo-400"
                      : ""
                  }`}
                  style={
                    i !== selectedIndex
                      ? { color: "var(--text-secondary)" }
                      : undefined
                  }
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      i === selectedIndex
                        ? "bg-indigo-500/20"
                        : ""
                    }`}
                    style={
                      i !== selectedIndex
                        ? { background: "var(--bg-tertiary)" }
                        : undefined
                    }
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={cmd.icon}
                      />
                    </svg>
                  </div>
                  <span className="flex-1 font-medium">{cmd.label}</span>
                  {isRecent && (
                    <span
                      className="text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      Recent
                    </span>
                  )}
                  {cmd.category === "nav" && (
                    <span
                      className="rounded-md px-1.5 py-0.5 text-[10px] font-medium"
                      style={{
                        background: "var(--bg-tertiary)",
                        color: "var(--text-tertiary)",
                      }}
                    >
                      Nav
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-2.5 text-[10px]"
          style={{
            borderTop: "1px solid var(--border-primary)",
            color: "var(--text-tertiary)",
          }}
        >
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd
                className="rounded px-1 py-0.5 font-medium"
                style={{ background: "var(--bg-tertiary)" }}
              >
                ↑↓
              </kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd
                className="rounded px-1 py-0.5 font-medium"
                style={{ background: "var(--bg-tertiary)" }}
              >
                ↵
              </kbd>
              Open
            </span>
          </div>
          <span>{filtered.length} commands</span>
        </div>
      </div>
    </div>
  );
}
