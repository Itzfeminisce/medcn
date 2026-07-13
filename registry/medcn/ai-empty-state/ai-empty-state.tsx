import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { EmptyState } from "@/registry/medcn/empty-state/empty-state"

export interface AiEmptyStateProps
  extends Omit<React.ComponentProps<typeof EmptyState>, "title" | "icon"> {
  title?: React.ReactNode
  icon?: React.ReactNode
  /** Prompt chips or suggestion cards — what this assistant can actually do here. */
  suggestions?: React.ReactNode
}

/**
 * Opening state of a conversation. It introduces the tasks the assistant can do
 * and keeps the context check part of starting one, rather than greeting the
 * clinician with an empty box.
 */
function AiEmptyState({
  className,
  title = "Ask about the active encounter",
  description = "Check the context above before sending anything that identifies a patient.",
  icon,
  suggestions,
  children,
  ...props
}: AiEmptyStateProps) {
  return (
    <div
      data-slot="ai-empty-state"
      className={cn("flex flex-col items-center gap-3 p-4", className)}
    >
      <EmptyState
        icon={icon ?? <SparklesIcon />}
        title={title}
        description={description}
        {...props}
      />

      {suggestions && (
        <div
          data-slot="ai-empty-state-suggestions"
          className="flex flex-wrap justify-center gap-2"
        >
          {suggestions}
        </div>
      )}

      {children}
    </div>
  )
}

export { AiEmptyState }
