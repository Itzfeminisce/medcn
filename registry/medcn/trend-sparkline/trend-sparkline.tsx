import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

export type TrendPoint = number | { value: number; date?: string }

const colorClass = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const

export interface TrendSparklineProps
  extends Omit<React.ComponentProps<"svg">, "color" | "width" | "height"> {
  data: TrendPoint[]
  width?: number
  height?: number
  /** Shade the regions outside [thresholdMin, thresholdMax]. */
  thresholdMin?: number
  thresholdMax?: number
  /** Highlight the most recent point with a dot. */
  showLastPoint?: boolean
  color?: keyof typeof colorClass
  /** Overrides the auto-generated trend summary. */
  ariaLabel?: string
}

function toValue(p: TrendPoint): number {
  return typeof p === "number" ? p : p.value
}

/** Direction of a series judged by its first and last values (±2% tolerance). */
function trendDirection(values: number[]): "up" | "down" | "stable" {
  if (values.length < 2) return "stable"
  const first = values[0]!
  const last = values[values.length - 1]!
  const tolerance = Math.abs(first) * 0.02
  if (last > first + tolerance) return "up"
  if (last < first - tolerance) return "down"
  return "stable"
}

/** Tiny inline SVG trend line for vitals/tracking series, with optional threshold shading. */
function TrendSparkline({
  data,
  width = 96,
  height = 28,
  thresholdMin,
  thresholdMax,
  showLastPoint = true,
  color = "default",
  ariaLabel,
  className,
  ...props
}: TrendSparklineProps) {
  const values = data.map(toValue)
  const pad = 3 // room for stroke + last-point dot at the edges

  // Include thresholds in the domain so shaded bands stay in view.
  const domainValues = [
    ...values,
    ...(thresholdMin !== undefined ? [thresholdMin] : []),
    ...(thresholdMax !== undefined ? [thresholdMax] : []),
  ]
  const min = Math.min(...domainValues)
  const max = Math.max(...domainValues)
  const span = max - min

  const x = (i: number) =>
    values.length === 1
      ? width / 2
      : pad + (i / (values.length - 1)) * (width - pad * 2)
  const y = (v: number) =>
    span === 0
      ? height / 2
      : height - pad - ((v - min) / span) * (height - pad * 2)

  const points = values.map((v, i) => `${x(i)},${y(v)}`).join(" ")
  const direction = trendDirection(values)
  const lastValue = values[values.length - 1]
  const label =
    ariaLabel ??
    (values.length === 0
      ? "trend, no data"
      : `trend ${direction}, last value ${lastValue}, over ${values.length} ${values.length === 1 ? "reading" : "readings"}`)

  return (
    <svg
      data-slot="trend-sparkline"
      data-trend={direction}
      role="img"
      aria-label={label}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("shrink-0 overflow-visible", colorClass[color], className)}
      {...props}
    >
      {thresholdMax !== undefined && y(thresholdMax) > 0 && (
        <rect
          data-slot="trend-sparkline-band-above"
          aria-hidden
          x={0}
          y={0}
          width={width}
          height={Math.max(0, y(thresholdMax))}
          className="fill-destructive/10"
        />
      )}
      {thresholdMin !== undefined && y(thresholdMin) < height && (
        <rect
          data-slot="trend-sparkline-band-below"
          aria-hidden
          x={0}
          y={Math.min(height, y(thresholdMin))}
          width={width}
          height={Math.max(0, height - y(thresholdMin))}
          className="fill-destructive/10"
        />
      )}
      {values.length > 1 && (
        <polyline
          data-slot="trend-sparkline-line"
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {showLastPoint && lastValue !== undefined && (
        <circle
          data-slot="trend-sparkline-last-point"
          cx={x(values.length - 1)}
          cy={y(lastValue)}
          r={2}
          fill="currentColor"
        />
      )}
    </svg>
  )
}

export { TrendSparkline }
