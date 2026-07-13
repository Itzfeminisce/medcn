import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export interface AiMessageActionsProps extends React.ComponentProps<"div"> {
  /**
   * Keep the row hidden until the message is hovered or an action is focused.
   * Focus always reveals it, so keyboard users are never locked out.
   */
  revealOnHover?: boolean
}

/**
 * Row of caller-supplied controls under a message. It assumes no behaviour of
 * its own — only the operations a caller passes in can appear, so an unpermitted
 * action cannot leak into the UI.
 */
function AiMessageActions({
  className,
  revealOnHover,
  ...props
}: AiMessageActionsProps) {
  return (
    <div
      data-slot="ai-message-actions"
      className={cn(
        "flex items-center gap-0.5",
        revealOnHover &&
          "opacity-0 transition-opacity group-hover/message:opacity-100 focus-within:opacity-100",
        className
      )}
      {...props}
    />
  )
}

export interface AiMessageActionProps
  extends Omit<React.ComponentProps<typeof Button>, "aria-label"> {
  /** Accessible name and tooltip copy, e.g. "Copy visible text". */
  label: string
}

/** One icon action with a tooltip; the icon is passed as `children`. */
function AiMessageAction({
  className,
  label,
  variant = "ghost",
  size = "icon-sm",
  ...props
}: AiMessageActionProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          data-slot="ai-message-action"
          type="button"
          variant={variant}
          size={size}
          aria-label={label}
          className={cn(
            "text-muted-foreground hover:text-foreground size-7",
            className
          )}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export { AiMessageActions, AiMessageAction }
