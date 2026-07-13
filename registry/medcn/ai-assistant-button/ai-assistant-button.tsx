"use client"

import * as React from "react"
import { SparklesIcon, XIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

const aiAssistantButtonVariants = cva("relative", {
  variants: {
    placement: {
      inline: "",
      "bottom-right": "fixed bottom-6 right-6 z-40 shadow-glow",
      "bottom-left": "fixed bottom-6 left-6 z-40 shadow-glow",
    },
  },
  defaultVariants: {
    placement: "inline",
  },
})

export interface AiAssistantButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "children">,
    VariantProps<typeof aiAssistantButtonVariants> {
  /** Visible label. Omit for an icon-only trigger. */
  children?: React.ReactNode
  /** New assistant output waiting: `true` renders a dot, a number renders a count. */
  unread?: boolean | number
  /** The assistant needs the user back (e.g. a queued draft finished). */
  attention?: boolean
  /** Whether the assistant surface is open — swaps the icon, sets aria-expanded. */
  open?: boolean
  /** Tooltip copy. Defaults to `label`. */
  tooltip?: React.ReactNode
  /** Accessible name for the icon-only form. */
  label?: string
}

/**
 * Entry point for the clinical assistant — inline in a toolbar, or floating via
 * `placement`. The badge reports new assistant output only; urgent clinical
 * conditions belong in an escalation surface, not on this button.
 */
function AiAssistantButton({
  className,
  placement,
  children,
  unread,
  attention,
  open,
  tooltip,
  label = "Clinical assistant",
  variant,
  size,
  ...props
}: AiAssistantButtonProps) {
  const count = typeof unread === "number" ? unread : 0
  const flagged = unread === true || count > 0 || attention === true
  const iconOnly = !children

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="ai-assistant-button"
          data-state={open ? "open" : "closed"}
          variant={variant}
          size={size ?? (iconOnly ? "icon" : "default")}
          aria-label={iconOnly ? label : undefined}
          aria-expanded={open}
          className={cn(
            aiAssistantButtonVariants({ placement }),
            "rounded-full",
            open && "ring-primary/40 ring-2",
            className
          )}
          {...props}
        >
          {open ? <XIcon aria-hidden /> : <SparklesIcon aria-hidden />}
          {children}

          {flagged && (
            <span
              aria-hidden
              className={cn(
                "ring-background absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full ring-2",
                count > 0 ? "min-w-4 px-1 text-[10px] font-bold" : "size-2.5",
                attention
                  ? "bg-warning text-warning-foreground motion-safe:animate-pulse"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {count > 0 ? (count > 9 ? "9+" : count) : null}
            </span>
          )}

          {/* Never colour-only: the same state reaches assistive tech as text. */}
          {flagged && (
            <span className="sr-only">
              {count > 0
                ? `${count} new assistant ${count === 1 ? "response" : "responses"}`
                : "New assistant output"}
            </span>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{tooltip ?? label}</TooltipContent>
    </Tooltip>
  )
}

export { AiAssistantButton, aiAssistantButtonVariants }
