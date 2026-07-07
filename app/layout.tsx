import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Link from "next/link"

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-dvh font-sans`}
      >
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <header className="border-border/60 bg-background/75 sticky top-0 z-40 border-b backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-6xl items-center gap-7 px-6">
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
            <ThemeToggle />
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
        <footer className="border-border/60 mt-16 border-t">
          <div className="text-muted-foreground mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs">
            <span className="font-mono">medcn</span>
            <span>MIT</span>
          </div>
        </footer>
      </body>
    </html>
  )
}
