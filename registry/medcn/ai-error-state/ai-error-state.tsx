import * as React from "react"
import { PencilIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { EmptyState } from "@/registry/medcn/empty-state/empty-state"

export interface AiErrorStateProps
  extends Omit<
    React.ComponentProps<typeof EmptyState>,
    "title" | "icon" | "action"
  > {
  title?: React.ReactNode
  icon?: React.ReactNode
  /**
   * The prompt that failed. Shown back to the user so a long draft is visibly
   * preserved rather than silently dropped.
   */
  draft?: string
  onRetry?: () => void
  /** Puts the draft back in the composer for editing. */
  onEdit?: () => void
  /** Replaces the built-in retry/edit buttons. */
  action?: React.ReactNode
}

/**
 * Failed-turn state. The prompt survives the failure, the copy never claims the
 * request went through, and the user gets an explicit way back to their draft.
 */
function AiErrorState({
  className,
  title = "The response could not be completed",
  description = "Nothing was sent to the record. Your prompt was kept — retry or edit it.",
  icon,
  draft,
  onRetry,
  onEdit,
  action,
  ...props
}: AiErrorStateProps) {
  const fallbackActions = (onRetry || onEdit) && (
    <>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          <RotateCcwIcon />
          Retry
        </Button>
      )}
      {onEdit && (
        <Button size="sm" variant="outline" onClick={onEdit}>
          <PencilIcon />
          Edit prompt
        </Button>
      )}
    </>
  )

  return (
    <div
      data-slot="ai-error-state"
      className={cn("flex flex-col items-center gap-3 p-4", className)}
    >
      <EmptyState
        icon={
          icon ?? <TriangleAlertIcon className="text-destructive" aria-hidden />
        }
        title={title}
        description={description}
        action={action ?? fallbackActions}
        {...props}
      />

      {draft && (
        <figure
          data-slot="ai-error-state-draft"
          className="bg-muted/50 w-full max-w-sm rounded-lg border px-3 py-2"
        >
          <figcaption className="text-muted-foreground mb-1 text-[10px] font-bold tracking-wide uppercase">
            Your prompt
          </figcaption>
          <p className="text-foreground line-clamp-3 text-xs leading-relaxed">
            {draft}
          </p>
        </figure>
      )}
    </div>
  )
}

export { AiErrorState }
