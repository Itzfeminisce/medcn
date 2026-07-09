import * as React from "react"
import { Paperclip } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type MessagePriority = "normal" | "high" | "urgent"

const priorityConfig: Record<
  MessagePriority,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] } | null
> = {
  normal: null,
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "destructive" },
}

function initials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface MessageInboxRowProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  sender: { name: string; avatarSrc?: string }
  subject: React.ReactNode
  /** One-line preview of the body. */
  preview?: React.ReactNode
  time?: React.ReactNode
  unread?: boolean
  priority?: MessagePriority
  /** Category chip, e.g. "Result", "Refill request". */
  category?: React.ReactNode
  hasAttachment?: boolean
  /** Interactive by default — an inbox row is a link. */
  interactive?: boolean
  actions?: React.ReactNode
}

/**
 * One row in a secure-message / results inbox: sender avatar, subject +
 * preview, an unread indicator, priority and category chips, an attachment
 * affordance, and a timestamp. Unread rows are weighted and marked with a dot.
 */
function MessageInboxRow({
  sender,
  subject,
  preview,
  time,
  unread = false,
  priority = "normal",
  category,
  hasAttachment = false,
  interactive = true,
  actions,
  className,
  ...props
}: MessageInboxRowProps) {
  const pri = priorityConfig[priority]

  return (
    <div
      data-slot="message-inbox-row"
      data-unread={unread || undefined}
      data-priority={priority}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group/msg flex items-center gap-3 rounded-xl border border-border/60 py-2.5 pl-3 pr-3 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        unread ? "bg-card" : "bg-card/60",
        interactive &&
          "cursor-pointer focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:scale-[0.995]",
        className
      )}
      {...props}
    >
      <span className="flex w-2 shrink-0 justify-center" aria-hidden>
        {unread && (
          <span className="size-2 rounded-full bg-primary transition-transform duration-200 group-hover/msg:scale-125" />
        )}
      </span>

      <Avatar className="size-9 shrink-0 ring-1 ring-border transition-transform duration-200 group-hover/msg:scale-105">
        {sender.avatarSrc && <AvatarImage src={sender.avatarSrc} alt="" />}
        <AvatarFallback className="text-xs font-semibold">
          {initials(sender.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "truncate text-sm",
              unread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
            )}
          >
            {sender.name}
          </span>
          {pri && (
            <Badge
              variant={pri.variant}
              className={cn(
                "shrink-0",
                priority === "urgent" && "motion-safe:animate-pulse"
              )}
            >
              {pri.label}
            </Badge>
          )}
          {category && (
            <span className="hidden shrink-0 rounded-full bg-foreground/5 px-2 py-0.5 text-[11px] font-medium text-muted-foreground sm:inline">
              {category}
            </span>
          )}
          {time && (
            <span className="ml-auto shrink-0 text-xs text-muted-foreground tabular-nums">
              {time}
            </span>
          )}
        </div>
        <div className="flex min-w-0 items-center gap-1.5">
          {hasAttachment && (
            <Tooltip>
              <TooltipTrigger
                aria-label="Has attachment"
                className="shrink-0 rounded text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                <Paperclip className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>Has attachment</TooltipContent>
            </Tooltip>
          )}
          <span
            className={cn(
              "truncate text-xs",
              unread ? "text-foreground/80" : "text-muted-foreground"
            )}
          >
            <span className={cn(unread && "font-medium")}>{subject}</span>
            {preview ? (
              <span className="text-muted-foreground"> — {preview}</span>
            ) : null}
          </span>
        </div>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { MessageInboxRow }
