"use client"

import * as React from "react"
import { SendIcon, ShieldAlertIcon, SquareIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Textarea } from "@/registry/medcn/textarea/textarea"

export interface AiPromptInputProps
  extends Omit<
    React.ComponentProps<"form">,
    "onSubmit" | "onChange" | "value" | "defaultValue"
  > {
  /** Controlled draft. Leave undefined to let the composer own it. */
  value?: string
  /** Initial draft for the uncontrolled form. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Fires on Enter or the send button. The draft is trimmed before it is passed. */
  onSubmit?: (value: string) => void
  /** Fires from the stop button while `streaming`. */
  onStop?: () => void
  /** A response is in flight: send is swapped for stop. */
  streaming?: boolean
  disabled?: boolean
  placeholder?: string
  maxLength?: number
  /**
   * Caller-authored limits on what may be typed here, shown above the field —
   * not buried behind a terms link.
   */
  restrictions?: React.ReactNode
  /** Leading slot for attachment, voice, or context controls. */
  tools?: React.ReactNode
  submitLabel?: string
}

/**
 * Prompt composer. Enter sends, Shift+Enter adds a line, and the field grows
 * with the draft. Works controlled or uncontrolled; an empty or whitespace-only
 * draft can never be sent.
 */
function AiPromptInput({
  className,
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  onStop,
  streaming = false,
  disabled = false,
  placeholder = "Ask about the active encounter...",
  maxLength,
  restrictions,
  tools,
  submitLabel = "Send prompt",
  ...props
}: AiPromptInputProps) {
  const isControlled = value !== undefined
  const [internalDraft, setInternalDraft] = React.useState(defaultValue)
  const draft = isControlled ? value : internalDraft

  const canSend = draft.trim().length > 0 && !disabled && !streaming

  const setDraft = (next: string) => {
    if (!isControlled) setInternalDraft(next)
    onValueChange?.(next)
  }

  const submit = () => {
    if (!canSend) return
    onSubmit?.(draft.trim())
    if (!isControlled) setInternalDraft("")
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (event.key !== "Enter" || event.shiftKey) return
    event.preventDefault()
    submit()
  }

  return (
    <form
      data-slot="ai-prompt-input"
      data-streaming={streaming ? "" : undefined}
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
      className={cn(
        "bg-card focus-within:border-ring focus-within:ring-ring/30 rounded-xl border p-2 shadow-xs transition-[box-shadow,border-color] focus-within:ring-[3px]",
        disabled && "opacity-60",
        className
      )}
      {...props}
    >
      {restrictions && (
        <p
          data-slot="ai-prompt-input-restrictions"
          className="text-muted-foreground mb-1.5 flex items-start gap-1.5 px-1.5 pt-1 text-xs"
        >
          <ShieldAlertIcon
            aria-hidden
            className="text-warning-foreground dark:text-warning mt-px size-3.5 shrink-0"
          />
          <span>{restrictions}</span>
        </p>
      )}

      <Textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        rows={2}
        className="max-h-40 min-h-16 resize-none border-0 bg-transparent px-1.5 py-1 shadow-none focus-visible:border-0 focus-visible:ring-0"
      />

      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex min-w-0 items-center gap-1">{tools}</div>

        <div className="flex shrink-0 items-center gap-2">
          {maxLength && (
            <span
              className={cn(
                "text-muted-foreground text-[11px] tabular-nums",
                draft.length >= maxLength && "text-destructive font-semibold"
              )}
            >
              {draft.length}/{maxLength}
            </span>
          )}

          {streaming ? (
            <Button
              type="button"
              size="icon-sm"
              variant="outline"
              aria-label="Stop response"
              onClick={onStop}
            >
              <SquareIcon className="size-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon-sm"
              aria-label={submitLabel}
              disabled={!canSend}
            >
              <SendIcon />
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}

export { AiPromptInput }
