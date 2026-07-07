"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Preview/Code tabs for a component demo. The demo element renders live;
 * `codeView` is the shiki-highlighted demo source (a server-rendered
 * CodeBlock passed down as a node).
 */
export function ComponentPreview({
  children,
  codeView,
  className,
}: {
  children: React.ReactNode
  codeView: React.ReactNode
  className?: string
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="border-border/60 flex items-center gap-5 border-b">
        {(["preview", "code"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "-mb-px cursor-pointer border-b-2 pb-2.5 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent"
            )}
          >
            {t}
          </button>
        ))}
      </div>
      <div className={cn(tab !== "preview" && "hidden")}>
        <div className="border-border/60 bg-grid flex min-h-72 items-center justify-center rounded-xl border p-10">
          {children}
        </div>
      </div>
      <div className={cn(tab !== "code" && "hidden")}>{codeView}</div>
    </div>
  )
}
