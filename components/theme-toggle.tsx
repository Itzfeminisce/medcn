"use client"

import * as React from "react"
import { MoonIcon, SunIcon } from "lucide-react"

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains("dark")
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={toggle}
      className="text-muted-foreground hover:text-foreground hover:bg-accent/60 inline-flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors"
    >
      {isDark === false ? (
        <MoonIcon className="size-4" />
      ) : (
        <SunIcon className="size-4" />
      )}
    </button>
  )
}
