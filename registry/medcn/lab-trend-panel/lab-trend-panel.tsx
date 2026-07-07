import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { LabPanel, LabResultRow } from "@/registry/medcn/lab-result/lab-result"
import type { LabResultRowProps } from "@/registry/medcn/lab-result/lab-result"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"
import { TrendSparkline } from "@/registry/medcn/trend-sparkline/trend-sparkline"

export interface LabHistoryPoint {
  value: number
  date?: string
}

export interface LabTrendRowProps extends LabResultRowProps {
  /** Historical series for this analyte, oldest → newest. */
  history: LabHistoryPoint[]
  /** Most recent N points to list in the popover. Default 6. */
  historyLimit?: number
}

function formatDate(d: string): string {
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return d
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/**
 * A LabResultRow with a leading trend column: a sparkline shaded against the
 * reference range, opening a popover of the last N dated values. Composes
 * lab-result + trend-sparkline — trend direction matters more than a single
 * flag for slow-moving analytes (eGFR, HbA1c).
 */
function LabTrendRow({
  history,
  historyLimit = 6,
  className,
  referenceMin,
  referenceMax,
  label,
  unit,
  ...rowProps
}: LabTrendRowProps) {
  const recent = [...history].reverse().slice(0, historyLimit)
  const analyteName = typeof label === "string" ? label : "analyte"

  return (
    <div className={cn("flex items-center gap-3 py-1", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <button
            data-slot="lab-trend-row-trend"
            aria-label={`Show recent ${analyteName} values`}
            className="focus-visible:ring-ring shrink-0 rounded-md p-1 transition-shadow hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2"
          >
            <TrendSparkline
              data={history}
              thresholdMin={referenceMin}
              thresholdMax={referenceMax}
              width={64}
              height={24}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-52">
          <p className="text-muted-foreground mb-2 text-[10px] font-semibold uppercase tracking-wide">
            {analyteName} · recent values
          </p>
          <ul className="flex flex-col gap-1">
            {recent.map((p, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-3 text-xs"
              >
                <span className="text-muted-foreground tabular-nums">
                  {p.date ? formatDate(p.date) : `#${recent.length - i}`}
                </span>
                <span className="font-semibold tabular-nums">
                  {p.value}
                  {unit && (
                    <span className="text-muted-foreground ml-0.5 font-normal">
                      {unit}
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <LabResultRow
        className="flex-1 py-0"
        label={label}
        unit={unit}
        referenceMin={referenceMin}
        referenceMax={referenceMax}
        {...rowProps}
      />
    </div>
  )
}

export interface LabTrendPanelProps
  extends React.ComponentProps<typeof LabPanel> {}

/** LabPanel that hosts LabTrendRow children — a trend column per analyte. */
function LabTrendPanel({ children, ...props }: LabTrendPanelProps) {
  return (
    <LabPanel data-slot="lab-trend-panel" {...props}>
      {children}
    </LabPanel>
  )
}

export { LabTrendPanel, LabTrendRow }
