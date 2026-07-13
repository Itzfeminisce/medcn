import * as React from "react"
import { PlusIcon, SparklesIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

export type AiAssistantStatus =
  | "available"
  | "working"
  | "offline"
  | "unavailable"

const STATUS_CONFIG: Record<
  AiAssistantStatus,
  { label: string; dot: string; variant: "soft" | "secondary" | "warning" }
> = {
  available: { label: "Available", dot: "bg-success", variant: "soft" },
  working: {
    label: "Preparing response",
    dot: "bg-primary motion-safe:animate-pulse",
    variant: "soft",
  },
  offline: {
    label: "Offline",
    dot: "bg-muted-foreground/50",
    variant: "secondary",
  },
  unavailable: {
    label: "Unavailable here",
    dot: "bg-warning",
    variant: "warning",
  },
}

export interface AiChatHeaderProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  /** Conversation title or scope line under the assistant name. */
  subtitle?: React.ReactNode
  /** System state. Never clinical confidence. */
  status?: AiAssistantStatus
  /** Overrides the status label text. */
  statusLabel?: React.ReactNode
  onNewChat?: () => void
  onClose?: () => void
  /** Extra controls, rendered before new-chat/close. */
  actions?: React.ReactNode
}

/**
 * Assistant identity, system status, and conversation controls. The status
 * describes what the product is doing — it says nothing about how correct any
 * answer is.
 */
function AiChatHeader({
  className,
  title = "Clinical assistant",
  subtitle,
  status = "available",
  statusLabel,
  onNewChat,
  onClose,
  actions,
  ...props
}: AiChatHeaderProps) {
  const config = STATUS_CONFIG[status]

  return (
    <div
      data-slot="ai-chat-header"
      data-status={status}
      className={cn("flex items-center gap-3 border-b px-4 py-3", className)}
      {...props}
    >
      <Avatar size="sm" className="shrink-0">
        <AvatarFallback className="bg-primary/12 text-primary">
          <SparklesIcon className="size-3.5" aria-hidden />
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-semibold">{title}</span>
          <Badge
            variant={config.variant}
            className="h-4 shrink-0 gap-1 px-1.5 py-0 text-[10px] font-semibold"
          >
            <span
              aria-hidden
              className={cn("size-1.5 rounded-full", config.dot)}
            />
            {statusLabel ?? config.label}
          </Badge>
        </div>
        {subtitle && (
          <span className="text-muted-foreground truncate text-xs">
            {subtitle}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        {actions}

        {onNewChat && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Start a new conversation"
            onClick={onNewChat}
            className="text-muted-foreground hover:text-foreground"
          >
            <PlusIcon />
          </Button>
        )}

        {onClose && (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Close assistant"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <XIcon />
          </Button>
        )}
      </div>
    </div>
  )
}

export { AiChatHeader, STATUS_CONFIG as aiChatHeaderStatuses }
