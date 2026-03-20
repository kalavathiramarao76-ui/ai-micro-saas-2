"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "tip" | "update";
  read: boolean;
  createdAt: string;
}

const STORAGE_KEY = "ai-toolbox-notifications";
const MAX_NOTIFICATIONS = 20;

const SEED_NOTIFICATIONS: Omit<Notification, "id" | "read" | "createdAt">[] = [
  {
    title: "Welcome to AI ToolBox!",
    message: "Explore 6 AI-powered tools to supercharge your productivity.",
    type: "success",
  },
  {
    title: "New: Share via Link",
    message: "You can now share generated content with anyone via a shareable link.",
    type: "update",
  },
  {
    title: "Tip: Use Cmd+K",
    message: "Press Cmd+K (or Ctrl+K) to quickly search and navigate between tools.",
    type: "tip",
  },
  {
    title: "Export Options Available",
    message: "Export your generated content as PDF, Markdown, or plain text.",
    type: "info",
  },
  {
    title: "Dark & Light Themes",
    message: "Toggle between dark, light, and system themes from the navbar.",
    type: "tip",
  },
  {
    title: "Favorites Feature",
    message: "Star your best generations to find them quickly in the Favorites tab.",
    type: "info",
  },
  {
    title: "Analytics Dashboard",
    message: "Track your tool usage and generation stats in the Analytics page.",
    type: "update",
  },
  {
    title: "PWA Support",
    message: "Install AI ToolBox as an app on your device for offline access.",
    type: "success",
  },
];

function getNotifications(): Notification[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
    // Seed initial notifications
    const seeded: Notification[] = SEED_NOTIFICATIONS.map((n, i) => ({
      ...n,
      id: `seed-${i}`,
      read: false,
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
    return seeded;
  } catch {
    return [];
  }
}

function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)));
}

const typeIcons: Record<Notification["type"], { color: string; bg: string }> = {
  info: { color: "text-blue-400", bg: "bg-blue-500/15" },
  success: { color: "text-green-400", bg: "bg-green-500/15" },
  tip: { color: "text-amber-400", bg: "bg-amber-500/15" },
  update: { color: "text-purple-400", bg: "bg-purple-500/15" },
};

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [shake, setShake] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNotifications(getNotifications());
  }, []);

  // Shake bell when there are unread notifications on mount
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    if (unread > 0 && !open) {
      const timer = setTimeout(() => setShake(true), 1000);
      const reset = setTimeout(() => setShake(false), 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(reset);
      };
    }
  }, [notifications.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-[var(--surface-hover)] ${shake ? "bell-shake" : ""}`}
        style={{ color: "var(--text-secondary)" }}
        title="Notifications"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide panel */}
      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl notification-panel-enter"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-4 py-3"
            style={{ borderColor: "var(--border-primary)" }}
          >
            <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-400">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium transition hover:opacity-80"
                style={{ color: "var(--accent-primary)" }}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg
                  className="mb-3 h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  style={{ color: "var(--text-tertiary)" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  No notifications
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group flex gap-3 px-4 py-3 transition cursor-pointer hover:bg-[var(--surface-hover)] ${
                    !n.read ? "" : "opacity-60"
                  }`}
                  onClick={() => markRead(n.id)}
                  style={{
                    borderBottom: "1px solid var(--border-primary)",
                  }}
                >
                  <div className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${typeIcons[n.type].bg}`}>
                    {n.type === "info" && (
                      <svg className={`h-4 w-4 ${typeIcons[n.type].color}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                    )}
                    {n.type === "success" && (
                      <svg className={`h-4 w-4 ${typeIcons[n.type].color}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {n.type === "tip" && (
                      <svg className={`h-4 w-4 ${typeIcons[n.type].color}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                      </svg>
                    )}
                    {n.type === "update" && (
                      <svg className={`h-4 w-4 ${typeIcons[n.type].color}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${!n.read ? "font-semibold" : "font-medium"}`}
                        style={{ color: "var(--text-primary)" }}
                      >
                        {n.title}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(n.id);
                        }}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition"
                        style={{ color: "var(--text-tertiary)" }}
                        title="Dismiss"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                      {n.message}
                    </p>
                    <p className="mt-1 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                      {formatTime(n.createdAt)}
                    </p>
                  </div>
                  {!n.read && (
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-indigo-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
