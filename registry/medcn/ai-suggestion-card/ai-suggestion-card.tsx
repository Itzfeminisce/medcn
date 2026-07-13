import * as React from "react"
import { ArrowRightIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { cardVariants } from "@/registry/medcn/card/card"

export interface AiSuggestionCardProps
  extends Omit<React.ComponentProps<"button">, "title" | "onSelect"> {
  /** What the suggestion will do. */
  title: React.ReactNode
  /** Why it is being suggested — one line, caller-authored. */
  rationale?: React.ReactNode
  icon?: React.ReactNode
  /** Small qualifier, e.g. "Uses 3 notes". Never label a generation "recommended care". */
  badge?: React.ReactNode
  /** How many context items the suggestion would read. */
  sourceCount?: number
  onSelect?: () => void
}

/**
 * One suggested next action, with a visible rationale and a single activation
 * target. It presents what the caller supplied — it infers nothing, and it is
 * not clinical decision support.
 */
function AiSuggestionCard({
  className,
  title,
  rationale,
  icon,
  badge,
  sourceCount,
  onSelect,
  disabled,
  ...props
}: AiSuggestionCardProps) {
  return (
    <button
      data-slot="ai-suggestion-card"
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        cardVariants({ variant: "interactive" }),
        "focus-visible:ring-ring/40 group gap-2 px-4 py-3 text-left outline-none focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-2.5">
        {icon && (
          <span
            aria-hidden
            className="text-primary bg-primary/10 mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg [&_svg]:size-3.5"
          >
            {icon}
          </span>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-2">
            <span className="min-w-0 text-sm font-semibold">{title}</span>
            {badge && (
              <Badge
                variant="outline"
                className="h-4 shrink-0 px-1.5 py-0 text-[10px] font-medium"
              >
                {badge}
              </Badge>
            )}
          </span>

          {rationale && (
            <span className="text-muted-foreground text-xs leading-relaxed">
              {rationale}
            </span>
          )}

          {sourceCount !== undefined && (
            <span className="text-muted-foreground/80 text-[11px]">
              Reads {sourceCount} context{" "}
              {sourceCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        <ArrowRightIcon
          aria-hidden
          className="text-muted-foreground mt-1 size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </button>
  )
}

export { AiSuggestionCard }
