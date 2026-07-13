import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const aiSuggestionListVariants = cva("flex min-w-0", {
  variants: {
    layout: {
      /** Wrapping row — right for prompt chips. */
      row: "flex-wrap gap-2",
      /** Scrolling single line — keeps a composer from being pushed off screen. */
      scroll:
        "gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1",
      /** One per line, or two up on wide containers — right for suggestion cards. */
      grid: "flex-col gap-2 @md:grid @md:grid-cols-2",
    },
  },
  defaultVariants: {
    layout: "row",
  },
})

export interface AiSuggestionListProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof aiSuggestionListVariants> {
  /** Group label. Announced to assistive tech; render visibly with `showLabel`. */
  label?: string
  showLabel?: boolean
  /** Rendered instead of the list when there is nothing to suggest. */
  empty?: React.ReactNode
}

/**
 * Responsive container for next-prompt suggestions. It lays out what it is
 * given and emits nothing of its own — the suggestions come from the caller,
 * so this component never infers a recommendation.
 */
function AiSuggestionList({
  className,
  layout,
  label = "Suggested next steps",
  showLabel = false,
  empty,
  children,
  ...props
}: AiSuggestionListProps) {
  const isEmpty = React.Children.count(children) === 0

  if (isEmpty && !empty) return null

  return (
    <div
      data-slot="ai-suggestion-list"
      className={cn("@container flex flex-col gap-1.5", className)}
      {...props}
    >
      {showLabel && (
        <span className="text-muted-foreground px-0.5 text-[10px] font-bold tracking-wide uppercase">
          {label}
        </span>
      )}

      {isEmpty ? (
        <p className="text-muted-foreground/70 px-0.5 text-xs italic">{empty}</p>
      ) : (
        <div
          role="group"
          aria-label={label}
          className={cn(aiSuggestionListVariants({ layout }))}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { AiSuggestionList, aiSuggestionListVariants }
