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
  title: "ToolSpark AI — 6 AI-Powered Productivity Tools in One Platform",
  description:
    "Professional AI-powered productivity suite. Write emails, summarize meetings, review code, generate SEO blogs, craft product descriptions, and create viral tweet threads — all from one workspace.",
  keywords: [
    "AI tools",
    "email writer",
    "meeting summarizer",
    "code reviewer",
    "blog generator",
    "product copywriter",
    "tweet generator",
    "AI productivity",
    "content generation",
  ],
  manifest: "/manifest.json",
  metadataBase: new URL("https://toolspark.vercel.app"),
  openGraph: {
    title: "ToolSpark AI — 6 AI Tools in One Platform",
    description:
      "Write emails, summarize meetings, review code, generate blogs, craft product copy, and create tweet threads — all powered by AI in one workspace.",
    type: "website",
    url: "https://toolspark.vercel.app",
    siteName: "ToolSpark AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ToolSpark AI — 6 AI-Powered Productivity Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolSpark AI — 6 AI Tools, One Workspace",
    description:
      "Email writer, meeting summarizer, code reviewer, blog generator, product copywriter, and tweet thread creator — all AI-powered.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ToolSpark AI",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "ToolSpark AI",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              description:
                "AI-powered productivity suite with 6 tools: email writer, meeting summarizer, code reviewer, blog generator, product copywriter, and tweet thread creator.",
              url: "https://toolspark.vercel.app",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              featureList: [
                "Email Writer",
                "Meeting Summarizer",
                "Code Reviewer",
                "Blog Post Generator",
                "Product Copywriter",
                "Tweet Thread Creator",
              ],
            }),
          }}
        />
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
