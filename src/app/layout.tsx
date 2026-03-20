import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import InstallPrompt from "@/components/InstallPrompt";
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "AI ToolBox — 6 AI Tools in One Platform",
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
  manifest: "/manifest.json",
  openGraph: {
    title: "AI ToolBox — 6 AI Tools in One Platform",
    description:
      "Professional AI-powered productivity suite with 6 micro-tools.",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AI ToolBox",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(resolved);
                  root.setAttribute('data-theme', resolved);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}
      >
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}
