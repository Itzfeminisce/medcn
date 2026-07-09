import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

const markerColor = {
  default: "border-border bg-background text-muted-foreground",
  primary: "border-primary/30 bg-primary/10 text-primary",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
} as const

function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("flex flex-col", className)}
      {...props}
    />
  )
}

export interface TimelineItemProps
  extends Omit<React.ComponentProps<"li">, "title"> {
  /** Node/icon rendered inside the marker. Falls back to a dot. */
  marker?: React.ReactNode
  color?: keyof typeof markerColor
  title?: React.ReactNode
  /** Right-aligned timestamp, e.g. "14 Jul · 10:30". */
  time?: React.ReactNode
  /** Tooltip shown on the marker — e.g. the event type/category. */
  markerTooltip?: React.ReactNode
  /** Hover-highlight + pointer affordance for a clickable event. */
  interactive?: boolean
  /** Hide the connecting line below (set on the last item). */
  last?: boolean
}

/**
 * One event on a vertical timeline rail. Compose inside `Timeline` for
 * encounter history, activity feeds, and care-plan steps. Markers can carry a
 * Tooltip; set `interactive` for clickable events.
 */
function TimelineItem({
  className,
  marker,
  color = "default",
  title,
  time,
  markerTooltip,
  interactive = false,
  last = false,
  children,
  ...props
}: TimelineItemProps) {
  const markerEl = (
    <span
      data-slot="timeline-marker"
      aria-hidden={markerTooltip ? undefined : true}
      className={cn(
        "z-10 flex size-6 shrink-0 items-center justify-center rounded-full border transition-transform duration-200 [&_svg]:size-3.5",
        markerColor[color],
        interactive && "group-hover/tl:scale-110"
      )}
    >
      {marker ?? <span className="size-1.5 rounded-full bg-current" />}
    </span>
  )

  return (
    <li
      data-slot="timeline-item"
      data-interactive={interactive || undefined}
      className={cn(
        "group/tl relative flex gap-3 pb-5 last:pb-0",
        interactive &&
          "cursor-pointer rounded-lg transition-colors -mx-2 px-2 hover:bg-muted/50",
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center">
        {markerTooltip ? (
          <Tooltip>
            <TooltipTrigger
              className="rounded-full focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              aria-label={
                typeof markerTooltip === "string" ? markerTooltip : undefined
              }
            >
              {markerEl}
            </TooltipTrigger>
            <TooltipContent>{markerTooltip}</TooltipContent>
          </Tooltip>
        ) : (
          markerEl
        )}
        {!last && (
          <span
            data-slot="timeline-connector"
            aria-hidden
            className="w-px flex-1 bg-border"
          />
        )}
      </div>
      <div className="-mt-0.5 min-w-0 flex-1 pb-1">
        {(title || time) && (
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
            {title && (
              <p
                data-slot="timeline-title"
                className={cn(
                  "text-sm font-medium text-foreground",
                  interactive && "transition-colors group-hover/tl:text-primary"
                )}
              >
                {title}
              </p>
            )}
            {time && (
              <span
                data-slot="timeline-time"
                className="text-xs text-muted-foreground tabular-nums"
              >
                {time}
              </span>
            )}
          </div>
        )}
        {children && (
          <div
            data-slot="timeline-content"
            className="mt-1 text-sm text-muted-foreground"
          >
            {children}
          </div>
        )}
      </div>
    </li>
  )
}

export { Timeline, TimelineItem }
