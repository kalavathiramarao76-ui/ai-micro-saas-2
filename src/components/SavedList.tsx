"use client";

import { SavedGeneration } from "@/lib/storage";

interface SavedListProps {
  items: SavedGeneration[];
  onLoad: (gen: SavedGeneration) => void;
  onDelete: (id: string) => void;
}

export default function SavedList({ items, onLoad, onDelete }: SavedListProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl glass-card p-6 text-center">
        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No saved generations yet</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl glass-card p-1">
      <div className="border-b px-4 py-3" style={{ borderColor: 'var(--border-primary)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Saved Generations</h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between border-b px-4 py-3 last:border-0"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <button
              onClick={() => onLoad(item)}
              className="flex-1 text-left"
            >
              <p className="line-clamp-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.input.slice(0, 80)}
                {item.input.length > 80 ? "..." : ""}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {new Date(item.createdAt).toLocaleDateString()} at{" "}
                {new Date(item.createdAt).toLocaleTimeString()}
              </p>
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="ml-2 rounded p-1 text-zinc-600 transition hover:bg-zinc-800 hover:text-red-400"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
