import * as React from "react"
import { CornerDownLeftIcon, PlusIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"

export type AiPromptChipMode = "insert" | "submit"

export interface AiPromptChipProps
  extends Omit<React.ComponentProps<typeof Button>, "onClick" | "onSelect"> {
  /** The prompt text handed back to the caller. */
  prompt: string
  /**
   * `insert` puts the prompt in the composer for editing; `submit` sends it
   * immediately. Required — the user must never be surprised by a send.
   */
  mode: AiPromptChipMode
  onSelect: (prompt: string, mode: AiPromptChipMode) => void
  /** Override the trailing affordance icon. */
  icon?: React.ReactNode
}

/**
 * Single-line prompt starter. The `mode` is part of the contract and is visible
 * in the chip: an insert chip shows a plus, a submit chip shows a return arrow
 * and says so in its accessible name.
 */
function AiPromptChip({
  className,
  prompt,
  mode,
  onSelect,
  icon,
  children,
  ...props
}: AiPromptChipProps) {
  const submits = mode === "submit"

  return (
    <Button
      data-slot="ai-prompt-chip"
      data-mode={mode}
      type="button"
      size="sm"
      variant="outline"
      aria-label={`${submits ? "Send prompt" : "Insert prompt into composer"}: ${prompt}`}
      onClick={() => onSelect(prompt, mode)}
      className={cn(
        "text-muted-foreground hover:text-foreground h-auto rounded-full py-1.5 text-left font-medium whitespace-normal",
        className
      )}
      {...props}
    >
      {children ?? prompt}
      <span aria-hidden className="text-muted-foreground/70 shrink-0">
        {icon ?? (submits ? <CornerDownLeftIcon /> : <PlusIcon />)}
      </span>
    </Button>
  )
}

export { AiPromptChip }
