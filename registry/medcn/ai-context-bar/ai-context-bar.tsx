import * as React from "react"
import { SlidersHorizontalIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Separator } from "@/registry/medcn/separator/separator"

export interface AiContextBarProps extends React.ComponentProps<"div"> {
  /** Leading label for the region. */
  label?: React.ReactNode
  /** Opens the caller's context picker. Omit to render a read-only bar. */
  onManage?: () => void
  /** Accessible name for the manage control. */
  manageLabel?: string
  /** Shown when no context chips are supplied. */
  emptyMessage?: React.ReactNode
}

/**
 * Persistent summary of what will be sent with the next prompt. Sits above the
 * transcript or the composer so the scope of a request is visible before it
 * leaves the building — context is a visible surface here, never hidden state.
 */
function AiContextBar({
  className,
  label = "Context",
  onManage,
  manageLabel = "Manage assistant context",
  emptyMessage = "No context attached",
  children,
  ...props
}: AiContextBarProps) {
  const isEmpty = React.Children.count(children) === 0

  return (
    <div
      data-slot="ai-context-bar"
      role="group"
      aria-label="Context sent with your prompt"
      className={cn("flex items-center gap-2 px-1 py-1.5", className)}
      {...props}
    >
      <span className="text-muted-foreground shrink-0 text-[10px] font-bold tracking-wide uppercase">
        {label}
      </span>

      <Separator orientation="vertical" className="h-4 shrink-0" />

      <div
        data-slot="ai-context-bar-items"
        className={cn(
          "flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto",
          // No scrollbar: a long context list scrolls without adding chrome.
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        )}
      >
        {isEmpty ? (
          <span className="text-muted-foreground/70 truncate text-xs italic">
            {emptyMessage}
          </span>
        ) : (
          children
        )}
      </div>

      {onManage && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={manageLabel}
          onClick={onManage}
          className="text-muted-foreground hover:text-foreground shrink-0"
        >
          <SlidersHorizontalIcon />
        </Button>
      )}
    </div>
  )
}

export { AiContextBar }
