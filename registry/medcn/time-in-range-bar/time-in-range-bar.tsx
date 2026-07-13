import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export interface TimeInRangeSegment {
  key: "veryLow" | "low" | "inRange" | "high" | "veryHigh"
  label: string
  /** Share of the period, 0–100. */
  percent: number
  color: string
}

export interface TimeInRangeBarProps extends React.ComponentProps<"div"> {
  /** Share of the period below the target range. */
  below: number
  inRange: number
  above: number
  /** Urgent bands, if the caller distinguishes them. Subtracted from below/above. */
  veryBelow?: number
  veryAbove?: number
  /** The period the percentages describe — "14 days", "this shift". Required. */
  period: React.ReactNode
  /**
   * How much of the period actually has data — "92% sensor wear". Without it,
   * a percentage has no denominator and cannot be read.
   */
  coverage?: React.ReactNode
  /** The target band these shares are measured against — "3.9–10.0 mmol/L". */
  targetLabel?: React.ReactNode
}

/**
 * Share of a period spent below, in, and above the target range.
 *
 * The numbers are stated in text beside the bar, not encoded in colour alone,
 * and the period and its coverage are part of the component rather than a
 * caption someone might drop: 90% in range over four hours of sensor wear is a
 * different clinical fact from 90% over a fortnight, and the two look identical
 * without a denominator.
 *
 * The component renders the shares it is given. It does not compute them from
 * readings, so the consumer's definition of "in range" — and how it treats gaps
 * in the data — stays where it can be validated.
 */
function TimeInRangeBar({
  below,
  inRange,
  above,
  veryBelow = 0,
  veryAbove = 0,
  period,
  coverage,
  targetLabel,
  className,
  ...props
}: TimeInRangeBarProps) {
  const segments: TimeInRangeSegment[] = [
    {
      key: "veryLow",
      label: "Very low",
      percent: veryBelow,
      color: "var(--chart-critical)",
    },
    { key: "low", label: "Below target", percent: below, color: "var(--chart-4)" },
    {
      key: "inRange",
      label: "In target",
      percent: inRange,
      color: "var(--chart-2)",
    },
    { key: "high", label: "Above target", percent: above, color: "var(--chart-3)" },
    {
      key: "veryHigh",
      label: "Very high",
      percent: veryAbove,
      color: "var(--chart-critical)",
    },
  ].filter((segment) => segment.percent > 0)

  const total = segments.reduce((sum, segment) => sum + segment.percent, 0)

  return (
    <div
      data-slot="time-in-range-bar"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">
          Time in range · {period}
          {coverage ? <> · {coverage}</> : null}
        </span>
        {targetLabel && (
          <span className="text-muted-foreground font-mono">{targetLabel}</span>
        )}
      </div>

      <div
        role="img"
        aria-label={segments
          .map((segment) => `${segment.label} ${segment.percent}%`)
          .join(", ")}
        // 2px surface gaps between segments so adjacent bands stay countable.
        className="flex h-3 w-full gap-0.5 overflow-hidden rounded-full"
      >
        {segments.map((segment) => (
          <Tooltip key={segment.key}>
            <TooltipTrigger asChild>
              <span
                data-segment={segment.key}
                style={{
                  width: `${(segment.percent / (total || 100)) * 100}%`,
                  background: segment.color,
                }}
                className="h-full first:rounded-l-full last:rounded-r-full"
              />
            </TooltipTrigger>
            <TooltipContent>
              {segment.label}: {segment.percent}% of {period}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>

      {/* The values in text — the bar is a second encoding of these, not the only one. */}
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: segment.color }}
            />
            <span className="text-muted-foreground">{segment.label}</span>
            <span className="font-mono font-medium tabular-nums">
              {segment.percent}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export { TimeInRangeBar }
