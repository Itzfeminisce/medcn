"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type TaskPriority = "routine" | "urgent" | "stat"

const priorityConfig: Record<
  TaskPriority,
  { label: string; badge: React.ComponentProps<typeof Badge>["variant"] }
> = {
  routine: { label: "Routine", badge: "secondary" },
  urgent: { label: "Urgent", badge: "warning" },
  stat: { label: "STAT", badge: "destructive" },
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

export interface ClinicalTaskRowProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "title"> {
  title: React.ReactNode
  /** Secondary line — order detail, patient, location. */
  detail?: React.ReactNode
  priority?: TaskPriority
  /** Due line, e.g. "Due 14:30". */
  due?: React.ReactNode
  /** Flag the due line as overdue (destructive). */
  overdue?: boolean
  /** Assignee shown as an avatar with a name Tooltip. */
  assignee?: { name: string; avatarSrc?: string }
  completed?: boolean
  onCompletedChange?: (completed: boolean) => void
  /** Right-aligned action slot. */
  actions?: React.ReactNode
}

/**
 * One item on a task / order worklist: a completion checkbox, title + detail,
 * a priority badge, an overdue-aware due line, and an assignee avatar with a
 * Tooltip. Completing a task strikes and dims it in place.
 */
function ClinicalTaskRow({
  title,
  detail,
  priority = "routine",
  due,
  overdue = false,
  assignee,
  completed = false,
  onCompletedChange,
  actions,
  className,
  ...props
}: ClinicalTaskRowProps) {
  const cfg = priorityConfig[priority]

  return (
    <div
      data-slot="clinical-task-row"
      data-priority={priority}
      data-completed={completed || undefined}
      className={cn(
        "group/task flex items-center gap-3 rounded-xl border border-border/60 bg-card px-3 py-2.5 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        completed && "opacity-60",
        className
      )}
      {...props}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(v) => onCompletedChange?.(v === true)}
        aria-label={completed ? "Mark task incomplete" : "Mark task complete"}
        className="shrink-0"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "truncate text-sm font-medium",
              completed && "text-muted-foreground line-through decoration-1"
            )}
          >
            {title}
          </span>
          {priority !== "routine" && !completed && (
            <Badge
              variant={cfg.badge}
              className={cn(
                "shrink-0",
                priority === "stat" && "motion-safe:animate-pulse"
              )}
            >
              {cfg.label}
            </Badge>
          )}
        </div>
        {detail && (
          <span className="truncate text-xs text-muted-foreground">
            {detail}
          </span>
        )}
      </div>

      {due && (
        <span
          className={cn(
            "shrink-0 text-xs tabular-nums",
            overdue && !completed
              ? "font-semibold text-destructive"
              : "text-muted-foreground"
          )}
        >
          {due}
        </span>
      )}

      {assignee && (
        <Tooltip>
          <TooltipTrigger
            className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
            aria-label={`Assigned to ${assignee.name}`}
          >
            <Avatar className="size-7 ring-1 ring-border transition-transform duration-200 group-hover/task:scale-105">
              {assignee.avatarSrc && (
                <AvatarImage src={assignee.avatarSrc} alt="" />
              )}
              <AvatarFallback className="text-[10px] font-semibold">
                {initials(assignee.name)}
              </AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>Assigned to {assignee.name}</TooltipContent>
        </Tooltip>
      )}
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export { ClinicalTaskRow }
