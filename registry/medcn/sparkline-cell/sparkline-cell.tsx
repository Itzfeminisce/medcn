import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  TrendSparkline,
  type TrendPoint,
} from "@/registry/medcn/trend-sparkline/trend-sparkline"

export interface SparklineCellProps extends React.ComponentProps<"div"> {
  /** The current value, in text. Always rendered — the glyph is the second encoding. */
  value: React.ReactNode
  unit?: React.ReactNode
  data: TrendPoint[]
  thresholdMin?: number
  thresholdMax?: number
  color?: React.ComponentProps<typeof TrendSparkline>["color"]
  /** Right-aligns the value, for a numeric table column. */
  align?: "start" | "end"
}

/**
 * A trend glyph beside the value it summarises, sized for a table row.
 *
 * A sparkline has no axis, no scale, and no labels: it cannot be the only place
 * a trend is expressed. So the current value is always rendered in text, the
 * glyph is hidden from assistive tech, and the row stays readable when the
 * sparkline is not.
 */
function SparklineCell({
  value,
  unit,
  data,
  thresholdMin,
  thresholdMax,
  color,
  align = "start",
  className,
  ...props
}: SparklineCellProps) {
  return (
    <div
      data-slot="sparkline-cell"
      className={cn(
        "flex items-center gap-2",
        align === "end" && "justify-end",
        className
      )}
      {...props}
    >
      <span className="font-mono text-sm tabular-nums">
        {value}
        {unit && (
          <span className="text-muted-foreground ml-0.5 text-xs">{unit}</span>
        )}
      </span>

      {/* Decorative: the value above carries the meaning. */}
      <span aria-hidden className="shrink-0">
        <TrendSparkline
          data={data}
          width={56}
          height={16}
          thresholdMin={thresholdMin}
          thresholdMax={thresholdMax}
          color={color}
        />
      </span>
    </div>
  )
}

export { SparklineCell }
