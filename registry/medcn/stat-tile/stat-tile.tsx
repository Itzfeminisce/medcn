import * as React from "react"
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  InfoIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Card } from "@/registry/medcn/card/card"
import {
  TrendSparkline,
  type TrendPoint,
} from "@/registry/medcn/trend-sparkline/trend-sparkline"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

const intentText = {
  good: "text-success",
  bad: "text-destructive",
  neutral: "text-muted-foreground",
} as const

const intentChip = {
  good: "bg-success/10 text-success",
  bad: "bg-destructive/10 text-destructive",
  neutral: "bg-muted text-muted-foreground",
} as const

const sparkColor = {
  good: "success",
  bad: "destructive",
  neutral: "default",
} as const

export interface StatTileDelta {
  value: React.ReactNode
  /** Arrow direction — this is data (which way the number moved). */
  direction?: "up" | "down" | "flat"
  /** Whether that movement is clinically/operationally good or bad. */
  intent?: "good" | "bad" | "neutral"
  /** Optional Tooltip explaining the comparison (e.g. "vs. same day last week"). */
  tooltip?: React.ReactNode
}

export interface StatTileProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  label: React.ReactNode
  value: React.ReactNode
  unit?: React.ReactNode
  icon?: React.ReactNode
  /** Change vs. a prior period. */
  delta?: StatTileDelta
  /** Optional inline sparkline series. */
  trend?: TrendPoint[]
  /** Small supporting caption under the value. */
  caption?: React.ReactNode
  /** Info affordance beside the label — an icon button with a Tooltip. */
  info?: React.ReactNode
  /** Adds hover-lift, press, focus-ring, and pointer affordances for drill-down. */
  interactive?: boolean
}

const arrow = {
  up: ArrowUpRight,
  down: ArrowDownRight,
  flat: ArrowRight,
} as const

/**
 * Big-number KPI tile for a dashboard header strip: a tinted-icon label,
 * value + unit, an optional intent-colored delta (with its own Tooltip), and an
 * optional sparkline. `direction` (which way the number moved) and `intent`
 * (whether that's good) are separate on purpose — a falling readmission rate is
 * good, a falling census may not be. Set `interactive` for drill-down tiles.
 */
function StatTile({
  className,
  label,
  value,
  unit,
  icon,
  delta,
  trend,
  caption,
  info,
  interactive = false,
  ...props
}: StatTileProps) {
  const intent = delta?.intent ?? "neutral"
  const Arrow = delta ? arrow[delta.direction ?? "flat"] : null

  const deltaEl = delta && (
    <span
      data-slot="stat-tile-delta"
      className={cn(
        "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
        intentChip[intent]
      )}
    >
      {Arrow && <Arrow className="size-3.5" aria-hidden />}
      {delta.value}
    </span>
  )

  return (
    <Card
      data-slot="stat-tile"
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group/tile gap-3 p-5 transition-all duration-200 ease-out",
        interactive &&
          "cursor-pointer hover:-translate-y-px hover:border-ring/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:translate-y-0 active:scale-[0.99] active:duration-75",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-sm font-medium text-muted-foreground">
            {label}
          </span>
          {info && (
            <Tooltip>
              <TooltipTrigger
                className="shrink-0 rounded-full text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                aria-label="More information"
              >
                <InfoIcon className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>{info}</TooltipContent>
            </Tooltip>
          )}
        </div>
        {icon && (
          <span
            aria-hidden
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-transform duration-200 group-hover/tile:scale-105 [&_svg]:size-4"
            )}
          >
            {icon}
          </span>
        )}
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tracking-[-0.02em] tabular-nums text-foreground">
              {value}
            </span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
          {(delta || caption) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
              {delta &&
                (delta.tooltip ? (
                  <Tooltip>
                    <TooltipTrigger className="focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 rounded-md">
                      {deltaEl}
                    </TooltipTrigger>
                    <TooltipContent>{delta.tooltip}</TooltipContent>
                  </Tooltip>
                ) : (
                  deltaEl
                ))}
              {caption && (
                <span className={cn("text-muted-foreground", intentText.neutral)}>
                  {caption}
                </span>
              )}
            </div>
          )}
        </div>
        {trend && trend.length > 1 && (
          <TrendSparkline
            data={trend}
            color={sparkColor[intent]}
            className="mb-0.5 transition-transform duration-200 group-hover/tile:scale-[1.03]"
          />
        )}
      </div>
    </Card>
  )
}

export { StatTile }
