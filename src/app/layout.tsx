import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { RootProvider } from "fumadocs-ui/provider/next";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const DESCRIPTION =
  "Baton coordinates multiple AI coding agents — Claude Code, Cursor, Codex, Gemini — on one repo. Isolated git worktrees, a live dashboard, shared memory, and one-file session handoff. No server lock-in. Open source.";

export const metadata: Metadata = {
  metadataBase: new URL("https://baton.dev"),
  title: "Baton — coordinate AI coding agents on one repo",
  description: DESCRIPTION,
  applicationName: "Baton",
  keywords: [
    "AI coding agents",
    "Claude Code",
    "Cursor",
    "multi-agent",
    "git worktrees",
    "session handoff",
    "open source",
  ],
  openGraph: {
    type: "website",
    title: "Baton — coordinate AI coding agents on one repo",
    description: DESCRIPTION,
    siteName: "Baton",
    url: "https://baton.dev",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baton — coordinate AI coding agents on one repo",
    description: DESCRIPTION,
  },
  alternates: { canonical: "/" },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Baton",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "macOS, Linux, Windows",
  description: DESCRIPTION,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  license: "https://opensource.org/licenses/MIT",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {/* Docs stay on-brand dark; the theme toggle is disabled. Lenis + grain
            live in the (marketing) layout, not here. */}
        <RootProvider
          theme={{ enabled: false, defaultTheme: "dark", forcedTheme: "dark" }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
