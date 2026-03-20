"use client";

import { useState, useEffect, useCallback } from "react";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  color: string;
  activity: string;
  online: boolean;
}

const MOCK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "SC",
    color: "from-violet-500 to-purple-500",
    activity: "Using Email Writer",
    online: true,
  },
  {
    id: "2",
    name: "Alex Rivera",
    avatar: "AR",
    color: "from-blue-500 to-cyan-500",
    activity: "Using Code Reviewer",
    online: true,
  },
  {
    id: "3",
    name: "Jordan Lee",
    avatar: "JL",
    color: "from-emerald-500 to-green-500",
    activity: "Using Blog Generator",
    online: true,
  },
  {
    id: "4",
    name: "Maya Patel",
    avatar: "MP",
    color: "from-orange-500 to-amber-500",
    activity: "Using Meeting Summarizer",
    online: false,
  },
];

const ACTIVITIES = [
  "Using Email Writer",
  "Using Code Reviewer",
  "Using Blog Generator",
  "Using Meeting Summarizer",
  "Using Product Copywriter",
  "Using Thread Creator",
  "Viewing Dashboard",
  "Browsing Favorites",
];

export default function CollabPresence() {
  const [members, setMembers] = useState<TeamMember[]>(MOCK_TEAM);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setMembers((prev) =>
      prev.map((m) => ({
        ...m,
        online: m.id === "4" ? Math.random() > 0.5 : true,
        activity: ACTIVITIES[Math.floor(Math.random() * ACTIVITIES.length)],
      }))
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const onlineMembers = members.filter((m) => m.online);

  return (
    <div className="relative flex items-center">
      {/* Avatar stack */}
      <div className="flex -space-x-2">
        {onlineMembers.slice(0, 4).map((member, i) => (
          <div
            key={member.id}
            className="relative"
            style={{ zIndex: 10 - i }}
            onMouseEnter={() => setHoveredId(member.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${member.color} text-[10px] font-bold text-white cursor-default`}
              style={{ boxShadow: "0 0 0 2px var(--bg-primary)" }}
            >
              {member.avatar}
            </div>
            {/* Pulsing green dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" style={{ boxShadow: "0 0 0 1px var(--bg-primary)" }} />
            </span>

            {/* Hover tooltip */}
            {hoveredId === member.id && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-lg px-3 py-2 text-xs shadow-xl collab-tooltip"
                style={{
                  background: "var(--surface-primary)",
                  border: "1px solid var(--border-secondary)",
                  zIndex: 50,
                }}
              >
                <p className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {member.name}
                </p>
                <p className="mt-0.5 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  {member.activity}
                </p>
                {/* Tooltip arrow */}
                <div
                  className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45"
                  style={{
                    background: "var(--surface-primary)",
                    borderLeft: "1px solid var(--border-secondary)",
                    borderTop: "1px solid var(--border-secondary)",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Online count */}
      <span
        className="ml-2 text-[11px] font-medium hidden sm:inline"
        style={{ color: "var(--text-tertiary)" }}
      >
        {onlineMembers.length} online
      </span>
    </div>
  );
}
