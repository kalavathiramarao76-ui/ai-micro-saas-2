export interface ToolUsageStat {
  toolId: string;
  toolName: string;
  usageCount: number;
  wordCount: number;
  lastUsed: string;
}

export interface DailyActivity {
  date: string;
  count: number;
}

const ANALYTICS_KEY = "microsaas_analytics";
const STREAK_KEY = "microsaas_streak";

function getAnalyticsData(): Record<string, ToolUsageStat> {
  if (typeof window === "undefined") return {};
  try {
    const data = localStorage.getItem(ANALYTICS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveAnalyticsData(data: Record<string, ToolUsageStat>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
}

export function trackGeneration(toolId: string, toolName: string, output: string): void {
  if (typeof window === "undefined") return;
  const data = getAnalyticsData();
  const words = output.trim().split(/\s+/).filter(Boolean).length;

  if (data[toolId]) {
    data[toolId].usageCount += 1;
    data[toolId].wordCount += words;
    data[toolId].lastUsed = new Date().toISOString();
  } else {
    data[toolId] = {
      toolId,
      toolName,
      usageCount: 1,
      wordCount: words,
      lastUsed: new Date().toISOString(),
    };
  }

  saveAnalyticsData(data);

  // Track daily activity
  trackDailyActivity();

  // Update streak
  updateStreak();
}

export function getToolStats(): ToolUsageStat[] {
  const data = getAnalyticsData();
  return Object.values(data).sort((a, b) => b.usageCount - a.usageCount);
}

export function getTotalStats(): { totalGenerations: number; totalWords: number; toolsUsed: number } {
  const stats = getToolStats();
  return {
    totalGenerations: stats.reduce((sum, s) => sum + s.usageCount, 0),
    totalWords: stats.reduce((sum, s) => sum + s.wordCount, 0),
    toolsUsed: stats.length,
  };
}

// Daily activity tracking (last 7 days)
const DAILY_KEY = "microsaas_daily_activity";

function trackDailyActivity(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    const today = new Date().toISOString().split("T")[0];
    data[today] = (data[today] || 0) + 1;

    // Keep only last 30 days
    const keys = Object.keys(data).sort();
    if (keys.length > 30) {
      for (const key of keys.slice(0, keys.length - 30)) {
        delete data[key];
      }
    }

    localStorage.setItem(DAILY_KEY, JSON.stringify(data));
  } catch {
    // silently fail
  }
}

export function getLast7DaysActivity(): DailyActivity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    const data: Record<string, number> = raw ? JSON.parse(raw) : {};
    const days: DailyActivity[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push({
        date: key,
        count: data[key] || 0,
      });
    }

    return days;
  } catch {
    return [];
  }
}

// Streak tracking
function updateStreak(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    const streak = raw ? JSON.parse(raw) : { current: 0, lastDate: "" };
    const today = new Date().toISOString().split("T")[0];

    if (streak.lastDate === today) return; // Already counted today

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (streak.lastDate === yesterdayStr) {
      streak.current += 1;
    } else {
      streak.current = 1;
    }
    streak.lastDate = today;

    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch {
    // silently fail
  }
}

export function getCurrentStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (!raw) return 0;
    const streak = JSON.parse(raw);
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Streak is still active if last date is today or yesterday
    if (streak.lastDate === today || streak.lastDate === yesterdayStr) {
      return streak.current;
    }
    return 0;
  } catch {
    return 0;
  }
}
