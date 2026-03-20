export interface FavoriteItem {
  id: string;
  generationId: string;
  toolType: string;
  toolName: string;
  contentPreview: string;
  fullContent: string;
  input: string;
  createdAt: string;
  favoritedAt: string;
}

const FAVORITES_KEY = "ai-toolkit-favorites";
const RECENTLY_USED_KEY = "ai-toolkit-recently-used";

export function getFavorites(): FavoriteItem[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(item: Omit<FavoriteItem, "id" | "favoritedAt">): FavoriteItem {
  const favorites = getFavorites();
  const newFav: FavoriteItem = {
    ...item,
    id: crypto.randomUUID(),
    favoritedAt: new Date().toISOString(),
  };
  favorites.unshift(newFav);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  return newFav;
}

export function removeFavorite(generationId: string): void {
  const favorites = getFavorites().filter((f) => f.generationId !== generationId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorited(generationId: string): boolean {
  return getFavorites().some((f) => f.generationId === generationId);
}

export function getFavoritesCount(): number {
  return getFavorites().length;
}

// Recently used tools tracking
export interface RecentlyUsedTool {
  toolId: string;
  usedAt: string;
}

export function getRecentlyUsedTools(): RecentlyUsedTool[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(RECENTLY_USED_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function trackToolUsage(toolId: string): void {
  if (typeof window === "undefined") return;
  const recent = getRecentlyUsedTools().filter((r) => r.toolId !== toolId);
  recent.unshift({ toolId, usedAt: new Date().toISOString() });
  const trimmed = recent.slice(0, 10);
  localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(trimmed));
}
