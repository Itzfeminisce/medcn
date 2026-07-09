import * as React from "react"
import { InfoIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Card } from "@/registry/medcn/card/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type RiskBand = "low" | "moderate" | "high" | "critical"

const bandConfig: Record<
  RiskBand,
  { label: string; arc: string; text: string; chip: string }
> = {
  low: {
    label: "Low",
    arc: "text-success",
    text: "text-success",
    chip: "bg-success/10 text-success",
  },
  moderate: {
    label: "Moderate",
    arc: "text-warning",
    text: "text-warning",
    chip: "bg-warning/15 text-warning-foreground",
  },
  high: {
    label: "High",
    arc: "text-destructive",
    text: "text-destructive",
    chip: "bg-destructive/10 text-destructive",
  },
  critical: {
    label: "Critical",
    arc: "text-destructive",
    text: "text-destructive",
    chip: "bg-destructive text-destructive-foreground",
  },
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180
  return { x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }
}

/** Semicircle arc path from `start`° to `end`° (measured CCW from the +x axis). */
function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start)
  const e = polar(cx, cy, r, end)
  const largeArc = Math.abs(end - start) > 180 ? 1 : 0
  const sweep = end < start ? 1 : 0
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} ${sweep} ${e.x} ${e.y}`
}

export interface RiskScoreGaugeProps
  extends Omit<React.ComponentProps<typeof Card>, "children"> {
  /** Score name, e.g. "ASCVD 10-yr" or "Sepsis (qSOFA)". */
  label: React.ReactNode
  /** Displayed value, e.g. "12.4%" or "3". */
  value: React.ReactNode
  band: RiskBand
  /** Fill fraction of the arc, 0–100. Defaults from a numeric `value`, else 0. */
  percent?: number
  /** Scale explanation shown in a Tooltip on the label (e.g. the model + cutoffs). */
  scale?: React.ReactNode
  /** Small caption under the gauge, e.g. "Updated 14 Jul". */
  caption?: React.ReactNode
  interactive?: boolean
}

/**
 * A single risk score as a semicircular gauge: the arc fills and colors by
 * band (low → critical), with the value read large in the well. `percent`
 * (arc fill) and `band` (color/label) are separate so a raw score and its
 * clinical cut-point never have to agree numerically.
 */
function RiskScoreGauge({
  className,
  label,
  value,
  band,
  percent,
  scale,
  caption,
  interactive = false,
  ...props
}: RiskScoreGaugeProps) {
  const cfg = bandConfig[band]
  const numeric =
    percent ?? (typeof value === "number" ? value : Number.parseFloat(String(value)))
  const frac = Math.max(0, Math.min(100, Number.isFinite(numeric) ? numeric : 0)) / 100

  const cx = 60
  const cy = 54
  const r = 44
  const startAngle = 180
  const endAngle = 180 - 180 * frac

  return (
    <Card
      data-slot="risk-score-gauge"
      data-band={band}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        "group/risk items-center gap-2 p-5 transition-all duration-200 ease-out",
        interactive &&
          "cursor-pointer hover:-translate-y-px hover:border-ring/40 hover:shadow-lift focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:translate-y-0 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-center gap-1.5">
        <span className="truncate text-center text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {scale && (
          <Tooltip>
            <TooltipTrigger
              className="shrink-0 rounded-full text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              aria-label="Scale details"
            >
              <InfoIcon className="size-3.5" />
            </TooltipTrigger>
            <TooltipContent className="max-w-56">{scale}</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 120 64"
          className="w-36"
          role="img"
          aria-label={`${cfg.label} risk`}
        >
          <path
            d={arcPath(cx, cy, r, startAngle, 0)}
            fill="none"
            className="stroke-muted"
            strokeWidth={10}
            strokeLinecap="round"
          />
          {frac > 0 && (
            <path
              d={arcPath(cx, cy, r, startAngle, endAngle)}
              fill="none"
              stroke="currentColor"
              className={cn(
                cfg.arc,
                "transition-transform duration-200 group-hover/risk:opacity-90"
              )}
              strokeWidth={10}
              strokeLinecap="round"
            />
          )}
        </svg>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <span
            className={cn(
              "text-2xl font-semibold tracking-[-0.02em] tabular-nums",
              cfg.text
            )}
          >
            {value}
          </span>
        </div>
      </div>

      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-semibold",
          cfg.chip
        )}
      >
        {cfg.label}
      </span>
      {caption && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {caption}
        </span>
      )}
    </Card>
  )
}

export { RiskScoreGauge }
