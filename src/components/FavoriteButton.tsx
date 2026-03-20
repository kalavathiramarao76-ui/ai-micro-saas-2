"use client";

import { useState, useEffect, useCallback } from "react";
import { addFavorite, removeFavorite, isFavorited } from "@/lib/favorites";

interface FavoriteButtonProps {
  generationId: string;
  toolType: string;
  toolName: string;
  content: string;
  input: string;
  createdAt: string;
  size?: "sm" | "md";
}

export default function FavoriteButton({
  generationId,
  toolType,
  toolName,
  content,
  input,
  createdAt,
  size = "md",
}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited(generationId));
  }, [generationId]);

  const toggle = useCallback(() => {
    if (favorited) {
      removeFavorite(generationId);
      setFavorited(false);
    } else {
      addFavorite({
        generationId,
        toolType,
        toolName,
        contentPreview: content.slice(0, 200),
        fullContent: content,
        input,
        createdAt,
      });
      setFavorited(true);
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    }
    // Dispatch event so other components can react
    window.dispatchEvent(new Event("favorites-changed"));
  }, [favorited, generationId, toolType, toolName, content, input, createdAt]);

  const sizeClasses = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const btnClasses = size === "sm" ? "p-1" : "p-1.5";

  return (
    <button
      onClick={toggle}
      className={`${btnClasses} rounded-lg transition-all duration-200 hover:bg-zinc-800 ${
        animating ? "favorite-bounce" : ""
      }`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`${sizeClasses} transition-all duration-300 ${
          favorited
            ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]"
            : "fill-none text-zinc-500 hover:text-zinc-300"
        }`}
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
    </button>
  );
}
