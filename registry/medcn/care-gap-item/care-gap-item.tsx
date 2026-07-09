import * as React from "react"
import { CalendarClock } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type CareGapStatus = "overdue" | "due" | "scheduled" | "satisfied"

const statusConfig: Record<
  CareGapStatus,
  {
    label: string
    badge: React.ComponentProps<typeof Badge>["variant"]
    rail: string
    icon: string
  }
> = {
  overdue: {
    label: "Overdue",
    badge: "destructive",
    rail: "before:bg-destructive",
    icon: "text-destructive",
  },
  due: {
    label: "Due",
    badge: "warning",
    rail: "before:bg-warning",
    icon: "text-warning",
  },
  scheduled: {
    label: "Scheduled",
    badge: "info",
    rail: "before:bg-info",
    icon: "text-info",
  },
  satisfied: {
    label: "Up to date",
    badge: "success",
    rail: "before:bg-success",
    icon: "text-success",
  },
}

export interface CareGapItemProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The measure, e.g. "HbA1c test" or "Colorectal cancer screening". */
  name: React.ReactNode
  status?: CareGapStatus
  /** Due/last date line, e.g. "Due 30 Jun · 9 days overdue". */
  due?: React.ReactNode
  /** Measure program/code (e.g. HEDIS), disclosed in a Tooltip on the name. */
  measure?: React.ReactNode
  /** Right-aligned action (Order, Schedule, Dismiss). */
  action?: React.ReactNode
}

/**
 * One open care gap / health-maintenance item: a status-tinted rail, the
 * measure name, a due line, and a quick action. Overdue leads with the
 * destructive tone so it sorts and reads first.
 */
function CareGapItem({
  name,
  status = "due",
  due,
  measure,
  action,
  className,
  ...props
}: CareGapItemProps) {
  const cfg = statusConfig[status]

  return (
    <div
      data-slot="care-gap-item"
      data-status={status}
      className={cn(
        "group/gap relative flex items-center gap-3 overflow-hidden rounded-xl border border-border/60 bg-card py-2.5 pl-4 pr-3 shadow-soft transition-all duration-200 hover:border-border hover:shadow-lift",
        "before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-['']",
        cfg.rail,
        className
      )}
      {...props}
    >
      <CalendarClock
        aria-hidden
        className={cn(
          "size-5 shrink-0 transition-transform duration-200 group-hover/gap:scale-110",
          cfg.icon
        )}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          {measure ? (
            <Tooltip>
              <TooltipTrigger
                className="min-w-0 rounded text-left focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                aria-label={
                  typeof measure === "string" ? `Measure: ${measure}` : undefined
                }
              >
                <span className="truncate text-sm font-semibold underline-offset-2 decoration-dotted group-hover/gap:underline">
                  {name}
                </span>
              </TooltipTrigger>
              <TooltipContent>{measure}</TooltipContent>
            </Tooltip>
          ) : (
            <span className="truncate text-sm font-semibold">{name}</span>
          )}
        </div>
        {due && (
          <span className="truncate text-xs text-muted-foreground tabular-nums">
            {due}
          </span>
        )}
      </div>

      <Badge variant={cfg.badge} className="shrink-0">
        {cfg.label}
      </Badge>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export { CareGapItem }
