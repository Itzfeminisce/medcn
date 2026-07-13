"use client"

import * as React from "react"
import { PaperclipIcon, ShieldAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"

/** A caller-defined kind of attachment. The component knows nothing about it. */
export interface AiAttachmentType {
  /** Passed back on select so the caller can route the files. */
  id: string
  label: React.ReactNode
  /** What this is for, and what it must not be used for. */
  description?: React.ReactNode
  icon?: React.ReactNode
  /** `accept` for the file input, e.g. "image/*,application/pdf". */
  accept?: string
  multiple?: boolean
  /** Offer the device camera / scanner instead of the file browser. */
  capture?: boolean
  disabled?: boolean
}

export interface AiAttachmentPickerProps
  extends Omit<React.ComponentProps<typeof Button>, "onSelect" | "type"> {
  /** The attachment types this product allows. Rendered as the menu. */
  types: AiAttachmentType[]
  /**
   * Required. Allowed formats, PHI handling, and external-sharing limits, in
   * the caller's words — shown in the popover, not behind a terms link.
   */
  restrictions: React.ReactNode
  /** Fires with the chosen files and the id of the type they came from. */
  onSelect?: (files: File[], typeId: string) => void
  /** Size limit copy, e.g. "Up to 20 MB per file". */
  limitLabel?: React.ReactNode
  label?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  align?: React.ComponentProps<typeof PopoverContent>["align"]
}

/**
 * Attachment entry control. It opens the platform file picker (or the capture
 * affordance) for a caller-defined type and hands the resulting `File[]` back —
 * it uploads nothing, stores nothing, and assumes nothing about where the bytes
 * go next. The restrictions the caller writes are part of the control, not
 * small print somewhere else.
 */
function AiAttachmentPicker({
  className,
  types,
  restrictions,
  onSelect,
  limitLabel,
  label = "Attach",
  open,
  onOpenChange,
  align = "start",
  disabled = false,
  variant = "ghost",
  size = "sm",
  ...props
}: AiAttachmentPickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const pendingType = React.useRef<string | null>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

  const isOpen = open ?? uncontrolledOpen
  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  // The input is configured imperatively so one hidden input can serve every
  // type: a state update would not have landed before the click() call.
  const openPicker = (type: AiAttachmentType) => {
    const input = inputRef.current
    if (!input) return

    input.value = ""
    input.accept = type.accept ?? ""
    input.multiple = type.multiple ?? false
    if (type.capture) input.setAttribute("capture", "environment")
    else input.removeAttribute("capture")

    pendingType.current = type.id
    input.click()
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = Array.from(event.target.files ?? [])
    const typeId = pendingType.current
    pendingType.current = null
    setOpen(false)
    if (files.length > 0 && typeId) onSelect?.(files, typeId)
  }

  return (
    <Popover open={isOpen} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          data-slot="ai-attachment-picker-trigger"
          variant={variant}
          size={size}
          disabled={disabled}
          className={cn("text-muted-foreground", className)}
          {...props}
        >
          <PaperclipIcon />
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        data-slot="ai-attachment-picker"
        align={align}
        className="w-80 p-0"
      >
        <div className="flex flex-col p-1.5">
          {types.map((type) => (
            <button
              key={type.id}
              type="button"
              disabled={type.disabled}
              onClick={() => openPicker(type)}
              className={cn(
                "hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/40 flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none transition-colors focus-visible:ring-[3px]",
                "disabled:pointer-events-none disabled:opacity-50"
              )}
            >
              {type.icon && (
                <span
                  aria-hidden
                  className="text-muted-foreground mt-0.5 shrink-0 [&_svg]:size-4"
                >
                  {type.icon}
                </span>
              )}
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="text-sm font-semibold">{type.label}</span>
                {type.description && (
                  <span className="text-muted-foreground text-xs leading-snug">
                    {type.description}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div
          data-slot="ai-attachment-picker-restrictions"
          className="bg-muted/40 flex flex-col gap-1.5 rounded-b-xl border-t px-3 py-2.5"
        >
          <p className="text-muted-foreground flex items-start gap-1.5 text-xs leading-snug">
            <ShieldAlertIcon
              aria-hidden
              className="text-warning-foreground dark:text-warning mt-px size-3.5 shrink-0"
            />
            <span>{restrictions}</span>
          </p>
          {limitLabel && (
            <p className="text-muted-foreground pl-5 text-[11px]">
              {limitLabel}
            </p>
          )}
        </div>
      </PopoverContent>

      <input
        ref={inputRef}
        type="file"
        tabIndex={-1}
        aria-hidden
        className="hidden"
        onChange={handleChange}
      />
    </Popover>
  )
}

export { AiAttachmentPicker }
