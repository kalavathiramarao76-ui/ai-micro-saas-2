export interface Tool {
  id: string;
  name: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  gradient: string;
}

export const tools: Tool[] = [
  {
    id: "email",
    name: "Email Writer",
    description:
      "Generate professional emails — replies, cold outreach, follow-ups, and apologies with the perfect tone.",
    href: "/app/email",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
    color: "text-blue-400",
    gradient: "from-blue-600 to-blue-400",
  },
  {
    id: "meetings",
    name: "Meeting Summarizer",
    description:
      "Paste any meeting transcript and extract action items, decisions, key points, and follow-ups instantly.",
    href: "/app/meetings",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "text-emerald-400",
    gradient: "from-emerald-600 to-emerald-400",
  },
  {
    id: "code-review",
    name: "Code Reviewer",
    description:
      "Get AI-powered code reviews covering bugs, security vulnerabilities, performance issues, and best practices.",
    href: "/app/code-review",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    color: "text-orange-400",
    gradient: "from-orange-600 to-orange-400",
  },
  {
    id: "blog",
    name: "Blog Post Generator",
    description:
      "Create SEO-optimized blog posts with structured headings, keywords, and engaging content for any topic.",
    href: "/app/blog",
    icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6V7.5z",
    color: "text-purple-400",
    gradient: "from-purple-600 to-purple-400",
  },
  {
    id: "product",
    name: "Product Copywriter",
    description:
      "Write compelling product descriptions optimized for Amazon, Shopify, and e-commerce platforms.",
    href: "/app/product",
    icon: "M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z",
    color: "text-pink-400",
    gradient: "from-pink-600 to-pink-400",
  },
  {
    id: "threads",
    name: "Tweet Thread Creator",
    description:
      "Generate viral Twitter/X threads with 5-10 tweets — hooks, insights, and calls to action included.",
    href: "/app/threads",
    icon: "M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z",
    color: "text-cyan-400",
    gradient: "from-cyan-600 to-cyan-400",
  },
];
