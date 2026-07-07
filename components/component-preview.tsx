"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

/**
 * Preview/Code tabs for a component demo. The demo element is rendered
 * live; `code` is its source (read server-side from the registry folder).
 */
export function ComponentPreview({
  children,
  code,
  className,
}: {
  children: React.ReactNode
  code: string
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
      {tab === "preview" ? (
        <div className="border-border/60 bg-grid flex min-h-72 items-center justify-center rounded-xl border p-10">
          {children}
        </div>
      ) : (
        <div className="relative">
          <CopyButton
            value={code}
            className="bg-code/80 text-code-foreground/60 hover:text-code-foreground absolute top-3 right-3"
          />
          <pre className="bg-code text-code-foreground max-h-125 overflow-auto rounded-xl p-5 font-mono text-[13px] leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  )
}
