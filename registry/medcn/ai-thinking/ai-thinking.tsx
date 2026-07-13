import * as React from "react"
import { LoaderCircleIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const aiThinkingVariants = cva(
  "text-muted-foreground flex items-center gap-2 text-sm",
  {
    variants: {
      variant: {
        inline: "",
        bubble: "bg-muted w-fit rounded-xl px-3 py-2",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
)

export interface AiThinkingProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof aiThinkingVariants> {
  /** Plain-language product phase, e.g. "Retrieving encounter notes". */
  phase?: React.ReactNode
  /** Trailing slot for a caller-owned stop/cancel control. */
  action?: React.ReactNode
}

/**
 * Non-blocking "working" status for an assistant turn. Describes what the
 * product is doing, never what a model "thinks" — the spinner is decorative and
 * the phase is announced politely, so it never steals focus from the chart.
 */
function AiThinking({
  className,
  variant,
  phase = "Preparing response",
  action,
  ...props
}: AiThinkingProps) {
  return (
    <div
      data-slot="ai-thinking"
      role="status"
      aria-live="polite"
      className={cn(aiThinkingVariants({ variant }), className)}
      {...props}
    >
      <LoaderCircleIcon
        aria-hidden
        className="size-4 shrink-0 motion-safe:animate-spin"
      />
      <span className="min-w-0 truncate">{phase}</span>
      {action && <span className="ml-1 shrink-0">{action}</span>}
    </div>
  )
}

export { AiThinking, aiThinkingVariants }
