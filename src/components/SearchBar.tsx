"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getSavedGenerations, SavedGeneration } from "@/lib/storage";
import { tools } from "@/lib/tools";

interface SearchBarProps {
  onResultClick?: (gen: SavedGeneration) => void;
}

function highlightText(text: string, query: string): React.ReactNode {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="rounded bg-amber-500/30 px-0.5 text-amber-200">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getToolIcon(toolType: string) {
  const tool = tools.find((t) => t.id === toolType);
  return tool ? { icon: tool.icon, gradient: tool.gradient, name: tool.name } : null;
}

export default function SearchBar({ onResultClick }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SavedGeneration[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [allGenerations, setAllGenerations] = useState<SavedGeneration[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setAllGenerations(getSavedGenerations());
  }, []);

  // Keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Click outside to close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = useCallback(
    (q: string) => {
      if (!q.trim()) {
        setResults([]);
        return;
      }
      const lower = q.toLowerCase();
      const filtered = allGenerations.filter(
        (gen) =>
          gen.input.toLowerCase().includes(lower) ||
          gen.output.toLowerCase().includes(lower) ||
          gen.toolName.toLowerCase().includes(lower)
      );
      setResults(filtered.slice(0, 10));
    },
    [allGenerations]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setIsOpen(true);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => search(val), 150);
    },
    [search]
  );

  const handleResultClick = useCallback(
    (gen: SavedGeneration) => {
      setIsOpen(false);
      setQuery("");
      onResultClick?.(gen);
    },
    [onResultClick]
  );

  const showDropdown = isOpen && query.trim().length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
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
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search all generations... (/ or Ctrl+F)"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 py-2.5 pl-10 pr-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-500 hover:text-zinc-300"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[400px] overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/50">
          {results.length === 0 ? (
            <div className="flex flex-col items-center gap-3 p-8 text-center">
              <svg className="h-12 w-12 text-zinc-700" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <p className="text-sm text-zinc-500">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="text-xs text-zinc-600">Try a different search term</p>
            </div>
          ) : (
            <div>
              <div className="border-b border-zinc-800 px-4 py-2">
                <span className="text-xs text-zinc-500">{results.length} result{results.length !== 1 ? "s" : ""}</span>
              </div>
              {results.map((gen) => {
                const toolInfo = getToolIcon(gen.toolType);
                return (
                  <button
                    key={gen.id}
                    onClick={() => handleResultClick(gen)}
                    className="flex w-full items-start gap-3 border-b border-zinc-800/50 px-4 py-3 text-left transition last:border-0 hover:bg-zinc-800/50"
                  >
                    {toolInfo && (
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${toolInfo.gradient}`}>
                        <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={toolInfo.icon} />
                        </svg>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-zinc-400">{gen.toolName}</span>
                        <span className="text-xs text-zinc-600">
                          {new Date(gen.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-0.5 line-clamp-2 text-sm text-zinc-300">
                        {highlightText(gen.output.slice(0, 150), query)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
