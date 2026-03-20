"use client";

import { useState, useRef, useEffect } from "react";

interface ExportMenuProps {
  content: string;
  toolName: string;
}

export default function ExportMenu({ content, toolName }: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const showCopied = (type: string) => {
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyText = () => {
    // Strip markdown formatting for plain text
    const plainText = content
      .replace(/#{1,6}\s/g, "")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`{1,3}[^`]*`{1,3}/g, (match) => match.replace(/`/g, ""))
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    navigator.clipboard.writeText(plainText);
    showCopied("text");
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(content);
    showCopied("markdown");
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCopied("download");
  };

  const handlePrint = () => {
    // Set data attribute for print styles to know the tool name
    document.documentElement.setAttribute("data-print-tool", toolName);
    document.documentElement.setAttribute(
      "data-print-date",
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
    setOpen(false);
    window.print();
  };

  const actions = [
    {
      id: "text",
      label: "Copy as Text",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      ),
      onClick: handleCopyText,
    },
    {
      id: "markdown",
      label: "Copy as Markdown",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
        />
      ),
      onClick: handleCopyMarkdown,
    },
    {
      id: "download",
      label: "Download as .txt",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      ),
      onClick: handleDownloadTxt,
    },
    {
      id: "print",
      label: "Print / Save as PDF",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18.75 12h.008v.008h-.008V12zm-8.25 0h.008v.008H10.5V12z"
        />
      ),
      onClick: handlePrint,
    },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
        style={{
          backgroundColor: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
        }}
        title="Export options"
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
        Export
      </button>

      {open && (
        <div
          className="export-menu-dropdown absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border p-1"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: "var(--glass-border)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.3), 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.backgroundColor =
                  "var(--surface-hover)";
                (e.target as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.backgroundColor = "transparent";
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              <svg
                className="h-4 w-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                {action.icon}
              </svg>
              <span className="flex-1">{action.label}</span>
              {copiedType === action.id && (
                <span className="text-[10px] font-semibold text-green-400">
                  {action.id === "download" ? "Saved!" : action.id === "print" ? "" : "Copied!"}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
