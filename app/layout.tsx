import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

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
  title: {
    default: "medcn — health & medical UI components",
    template: "%s · medcn",
  },
  description:
    "Beautiful, accessible UI components for health & medical products. Install with the shadcn CLI. You own the code.",
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
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-dvh flex-col font-sans`}
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
            <span className="font-mono">medcn</span>
            <span>MIT</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
