"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import { getFavorites, removeFavorite, FavoriteItem } from "@/lib/favorites";
import { tools } from "@/lib/tools";

function getToolInfo(toolType: string) {
  return tools.find((t) => t.id === toolType);
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toolTypes = useMemo(() => {
    const types = new Set(favorites.map((f) => f.toolType));
    return Array.from(types);
  }, [favorites]);

  const filtered = useMemo(() => {
    let items = favorites;
    if (filterType !== "all") {
      items = items.filter((f) => f.toolType === filterType);
    }
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase();
      items = items.filter(
        (f) =>
          f.contentPreview.toLowerCase().includes(lower) ||
          f.fullContent.toLowerCase().includes(lower) ||
          f.toolName.toLowerCase().includes(lower) ||
          f.input.toLowerCase().includes(lower)
      );
    }
    return items;
  }, [favorites, filterType, searchQuery]);

  const handleRemove = (generationId: string) => {
    removeFavorite(generationId);
    setFavorites((prev) => prev.filter((f) => f.generationId !== generationId));
    window.dispatchEvent(new Event("favorites-changed"));
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Group by tool type
  const grouped = useMemo(() => {
    const groups: Record<string, FavoriteItem[]> = {};
    for (const fav of filtered) {
      if (!groups[fav.toolType]) groups[fav.toolType] = [];
      groups[fav.toolType].push(fav);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              <span className="mr-2">Favorites</span>
              <span className="text-lg font-normal" style={{ color: 'var(--text-tertiary)' }}>({favorites.length})</span>
            </h1>
            <p className="mt-1" style={{ color: 'var(--text-tertiary)' }}>Your bookmarked generations, organized by tool.</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
              style={{ color: 'var(--text-tertiary)' }}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search favorites..."
              className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
              style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        {toolTypes.length > 1 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                filterType === "all"
                  ? "bg-indigo-600 text-white"
                  : ""
              }`}
              style={filterType !== "all" ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
            >
              All ({favorites.length})
            </button>
            {toolTypes.map((type) => {
              const tool = getToolInfo(type);
              const count = favorites.filter((f) => f.toolType === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    filterType === type
                      ? "bg-indigo-600 text-white"
                      : ""
                  }`}
                  style={filterType !== type ? { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' } : {}}
                >
                  {tool?.name || type} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl glass-card py-20 text-center">
            <svg className="mb-4 h-16 w-16" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-secondary)' }}>No favorites yet</h3>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Star any generation to save it here for quick access.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl glass-card py-20 text-center">
            <svg className="mb-4 h-12 w-12" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No favorites match your search.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([toolType, items]) => {
              const tool = getToolInfo(toolType);
              return (
                <div key={toolType}>
                  <div className="mb-3 flex items-center gap-2">
                    {tool && (
                      <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${tool.gradient}`}>
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={tool.icon} />
                        </svg>
                      </div>
                    )}
                    <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>{tool?.name || toolType}</h2>
                    <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((fav) => (
                      <div
                        key={fav.id}
                        className="group relative rounded-xl glass-card p-4 transition hover:shadow-lg hover:shadow-indigo-500/5"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(fav.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleCopy(fav.fullContent, fav.id)}
                              className="rounded p-1 transition hover:bg-[var(--surface-hover)]"
                              style={{ color: 'var(--text-tertiary)' }}
                              title="Copy content"
                            >
                              {copiedId === fav.id ? (
                                <svg className="h-3.5 w-3.5 text-green-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              ) : (
                                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => handleRemove(fav.generationId)}
                              className="rounded p-1 text-amber-400 transition hover:bg-[var(--surface-hover)] hover:text-amber-300"
                              title="Remove from favorites"
                            >
                              <svg className="h-3.5 w-3.5 fill-amber-400" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedId(expandedId === fav.id ? null : fav.id)}
                          className="w-full text-left"
                        >
                          <p className={`text-sm ${expandedId === fav.id ? "" : "line-clamp-4"}`} style={{ color: 'var(--text-secondary)' }}>
                            {fav.fullContent}
                          </p>
                          {fav.fullContent.length > 200 && (
                            <span className="mt-1 inline-block text-xs font-medium text-indigo-400">
                              {expandedId === fav.id ? "Show less" : "Show more"}
                            </span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
