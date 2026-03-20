import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Toolkit Pro — 6 AI Tools in One Platform",
  description:
    "Professional AI-powered productivity suite. Write emails, summarize meetings, review code, generate blogs, craft product descriptions, and create tweet threads.",
  keywords: [
    "AI tools",
    "email writer",
    "meeting summarizer",
    "code reviewer",
    "blog generator",
    "product copywriter",
    "tweet generator",
  ],
  openGraph: {
    title: "AI Toolkit Pro — 6 AI Tools in One Platform",
    description:
      "Professional AI-powered productivity suite with 6 micro-tools.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-zinc-950`}
      >
        {children}
      </body>
    </html>
  );
}
