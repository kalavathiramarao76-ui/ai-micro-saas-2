"use client";

import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";
import { tools } from "@/lib/tools";

const tool = tools.find((t) => t.id === "meetings")!;

export default function MeetingsPage() {
  const [transcript, setTranscript] = useState("");
  const [meetingType, setMeetingType] = useState("General");

  const meetingTypes = [
    "General",
    "Sprint Planning",
    "Standup",
    "Retrospective",
    "Client Call",
    "Strategy Session",
    "1-on-1",
  ];

  return (
    <ToolLayout
      toolId={tool.id}
      toolName={tool.name}
      toolDescription={tool.description}
      toolIcon={tool.icon}
      toolColor={tool.color}
      gradient={tool.gradient}
    >
      {({ onGenerate, isLoading }) => (
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Meeting Type
            </label>
            <select
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            >
              {meetingTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-zinc-400">
              Meeting Transcript or Notes
            </label>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={10}
              placeholder="Paste your meeting transcript, notes, or any raw content from the meeting here. The more detail you provide, the better the summary..."
              className="w-full resize-none rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => {
              const input = `Meeting type: ${meetingType}\n\nTranscript/Notes:\n${transcript}`;
              onGenerate(input);
            }}
            disabled={isLoading || !transcript.trim()}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Summarizing...
              </span>
            ) : (
              "Summarize Meeting"
            )}
          </button>
        </div>
      )}
    </ToolLayout>
  );
}
