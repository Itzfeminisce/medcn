import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

import { SITE_NAME, SITE_URL } from "@/lib/env"
import { getNavGroups } from "@/lib/registry"
import { CommandMenu } from "@/components/command-menu"
import { ThemeToggle } from "@/components/theme-toggle"

import "./globals.css"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — shadcn for health & medical UI`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Copy-paste, accessible React components for health products — vitals, medication, scheduling, triage. Install with the shadcn CLI. You own the code.",
  keywords: [
    "shadcn",
    "health UI",
    "medical UI components",
    "React components",
    "Tailwind CSS",
    "Radix UI",
    "vitals",
    "EHR components",
    "clinical UI",
    "healthcare design system",
    "shadcn registry",
  ],
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  applicationName: SITE_NAME,
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — shadcn for health & medical UI`,
    description:
      "Copy-paste, accessible React components for health products — vitals, medication, scheduling, triage. Install with the shadcn CLI.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — shadcn for health & medical UI`,
    description:
      "Copy-paste, accessible React components for health & medical products. Install with the shadcn CLI.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

/** Dark by default; respect a stored "light" preference. Runs before paint. */
const themeScript = `(function(){try{var t=localStorage.getItem("theme");document.documentElement.classList.toggle("dark",t!=="light")}catch(e){document.documentElement.classList.add("dark")}})()`

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const navGroups = await getNavGroups()

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col overflow-x-clip font-sans`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <header className="border-border/60 bg-background/75 sticky top-0 z-40 border-b backdrop-blur-md">
          <div className="flex h-14 items-center gap-5 px-4 sm:gap-7 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="bg-primary/70 absolute inline-flex h-full w-full animate-ping rounded-full" />
                <span className="bg-primary relative inline-flex size-2 rounded-full" />
              </span>
              <span className="text-[17px] font-bold tracking-tight">
                med<span className="text-primary">cn</span>
              </span>
            </Link>
            <nav className="flex flex-1 items-center gap-5 text-sm font-medium">
              <Link
                href="/components"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Components
              </Link>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Docs
              </Link>
            </nav>
            <CommandMenu groups={navGroups} />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-border/60 border-t">
          <div className="text-muted-foreground flex items-center justify-between px-4 py-6 text-xs sm:px-6">
            <span className="font-mono">{SITE_NAME}</span>
            <span>MIT</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
