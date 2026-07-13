import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

export interface AiTypingIndicatorProps extends React.ComponentProps<"div"> {
  /** Announced to assistive tech in place of the dots. */
  label?: string
}

/**
 * Transient "the assistant has started a turn but has no visible text yet"
 * indicator. Conversational turn state only — if you can name what the system is
 * doing, use `AiThinking` instead.
 */
function AiTypingIndicator({
  className,
  label = "Assistant is responding",
  ...props
}: AiTypingIndicatorProps) {
  return (
    <div
      data-slot="ai-typing-indicator"
      role="status"
      aria-label={label}
      className={cn(
        "bg-muted flex w-fit items-center gap-1 rounded-xl px-3 py-2.5",
        className
      )}
      {...props}
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          aria-hidden
          style={{ animationDelay: `${index * 150}ms` }}
          className={cn(
            "bg-muted-foreground/70 size-1.5 rounded-full",
            // Reduced motion keeps the dots, drops the bounce.
            "motion-safe:animate-bounce motion-reduce:opacity-60"
          )}
        />
      ))}
    </div>
  )
}

export { AiTypingIndicator }
