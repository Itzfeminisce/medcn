import * as React from "react"
import { ChartSplineIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { EmptyState } from "@/registry/medcn/empty-state/empty-state"

export interface ChartInsufficientDataProps
  extends Omit<React.ComponentProps<typeof EmptyState>, "title"> {
  /** Readings actually available. */
  count: number
  /** Readings this chart needs before a trend means anything. */
  minimum: number
  /** The window the count covers — "30 days", "this admission". */
  period?: React.ReactNode
  title?: React.ReactNode
  /** The readings themselves, listed rather than plotted. */
  children?: React.ReactNode
}

/**
 * What a chart renders instead of a trend it cannot honestly draw.
 *
 * A confident line through two points is a claim the reader has no way to check,
 * and it is indistinguishable from a line through two hundred. This states the
 * count, the threshold, and the period, and still shows the readings — they are
 * data, they are just not a trend.
 */
function ChartInsufficientData({
  count,
  minimum,
  period,
  title,
  description,
  icon,
  className,
  children,
  ...props
}: ChartInsufficientDataProps) {
  const readings = `${count} ${count === 1 ? "reading" : "readings"}`

  return (
    <div
      data-slot="chart-insufficient-data"
      className={cn("flex flex-col items-center gap-3", className)}
    >
      <EmptyState
        icon={icon ?? <ChartSplineIcon />}
        title={
          title ?? (
            <>
              {readings}
              {period ? <> in {period}</> : null} — not enough to show a trend
            </>
          )
        }
        description={
          description ??
          `A trend needs at least ${minimum}. The readings below are shown as recorded.`
        }
        size="sm"
        {...props}
      />

      {children && (
        <div
          data-slot="chart-insufficient-data-readings"
          className="w-full text-sm"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { ChartInsufficientData }
