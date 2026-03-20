export interface SavedGeneration {
  id: string;
  toolType: string;
  toolName: string;
  input: string;
  output: string;
  createdAt: string;
}

const STORAGE_KEY = "ai-toolkit-generations";

export function getSavedGenerations(): SavedGeneration[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGeneration(gen: Omit<SavedGeneration, "id" | "createdAt">): SavedGeneration {
  const generations = getSavedGenerations();
  const newGen: SavedGeneration = {
    ...gen,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  generations.unshift(newGen);
  // Keep last 50
  const trimmed = generations.slice(0, 50);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return newGen;
}

export function deleteGeneration(id: string): void {
  const generations = getSavedGenerations().filter((g) => g.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(generations));
}

export function getGenerationsByTool(toolType: string): SavedGeneration[] {
  return getSavedGenerations().filter((g) => g.toolType === toolType);
}
