"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

export type FlowsheetFlag = "normal" | "low" | "high" | "critical"

export interface FlowsheetCell {
  value: number | string
  flag?: FlowsheetFlag
  /**
   * Charted after the fact. The value still sits at the time it was TAKEN —
   * this only marks that the record was written later.
   */
  chartedLate?: boolean
  note?: string
}

export interface FlowsheetParameter {
  key: string
  label: string
  unit?: string
  /** Values by column key. A column with no entry was not measured. */
  values: Record<string, FlowsheetCell | undefined>
}

export interface FlowsheetColumn {
  key: string
  /** The time the observations were TAKEN. */
  label: string
  /** A second line — "Nurse J.O.", "Post-op day 1". */
  sublabel?: string
}

export interface VitalsFlowsheetProps extends React.ComponentProps<"div"> {
  columns: FlowsheetColumn[]
  parameters: FlowsheetParameter[]
  caption: string
  /** Rendered in a cell with no measurement. Never blank, never zero. */
  missingLabel?: string
}

const FLAG_STYLE: Record<FlowsheetFlag, string> = {
  normal: "",
  low: "text-warning-foreground bg-warning/15 font-semibold",
  high: "text-warning-foreground bg-warning/15 font-semibold",
  critical:
    "text-destructive bg-destructive/10 font-bold ring-1 ring-destructive/40 ring-inset",
}

/** The marker is what survives greyscale and colour-blindness; the fill is a hint. */
const FLAG_MARK: Record<FlowsheetFlag, string> = {
  normal: "",
  low: "↓",
  high: "↑",
  critical: "!",
}

const FLAG_TEXT: Record<FlowsheetFlag, string> = {
  normal: "",
  low: "low",
  high: "high",
  critical: "critical",
}

/**
 * The time × parameter grid: parameters down, observation times across.
 *
 * Three things it will not do. It will not render a missing observation as
 * blank — an empty cell means "not measured" and says so, because a gap that
 * looks like a normal value is how a deteriorating patient goes unnoticed. It
 * will not move a late-charted value to the time it was charted: a value sits at
 * the time it was TAKEN, with the late entry marked, since the alternative
 * rewrites the clinical timeline. And it will not signal abnormality by colour
 * alone — every flagged cell carries a marker and a screen-reader label.
 *
 * Row and column headers stick, so a value is never orphaned from its parameter
 * or its time when the grid is scrolled.
 */
function VitalsFlowsheet({
  columns,
  parameters,
  caption,
  missingLabel = "Not measured",
  className,
  ...props
}: VitalsFlowsheetProps) {
  return (
    <div
      data-slot="vitals-flowsheet"
      className={cn(
        "relative w-full overflow-auto rounded-xl border",
        "[scrollbar-width:thin]",
        className
      )}
      {...props}
    >
      <table className="w-full border-separate border-spacing-0 text-sm">
        <caption className="text-muted-foreground bg-background sticky left-0 px-3 py-2 text-left text-xs">
          {caption}
        </caption>

        <thead>
          <tr>
            <th
              scope="col"
              className="bg-background sticky left-0 top-0 z-20 border-b border-r px-3 py-2 text-left text-xs font-medium"
            >
              Parameter
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="bg-background sticky top-0 z-10 min-w-24 border-b px-3 py-2 text-left text-xs font-medium whitespace-nowrap"
              >
                {column.label}
                {column.sublabel && (
                  <span className="text-muted-foreground block text-[10px] font-normal">
                    {column.sublabel}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {parameters.map((parameter) => (
            <tr key={parameter.key} className="group/row">
              <th
                scope="row"
                className="bg-background group-hover/row:bg-muted/50 sticky left-0 z-10 border-b border-r px-3 py-1.5 text-left font-medium whitespace-nowrap"
              >
                {parameter.label}
                {parameter.unit && (
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    {parameter.unit}
                  </span>
                )}
              </th>

              {columns.map((column) => {
                const cell = parameter.values[column.key]
                const flag = cell?.flag ?? "normal"

                if (!cell) {
                  return (
                    <td
                      key={column.key}
                      className="text-muted-foreground/60 group-hover/row:bg-muted/50 border-b px-3 py-1.5 text-xs italic"
                    >
                      {missingLabel}
                    </td>
                  )
                }

                return (
                  <td
                    key={column.key}
                    data-flag={cell.flag}
                    className={cn(
                      "group-hover/row:bg-muted/50 border-b px-3 py-1.5 font-mono tabular-nums",
                      FLAG_STYLE[flag]
                    )}
                  >
                    <span className="flex items-center gap-1">
                      {cell.value}
                      {FLAG_MARK[flag] && (
                        <span aria-hidden className="text-xs">
                          {FLAG_MARK[flag]}
                        </span>
                      )}
                      {FLAG_TEXT[flag] && (
                        <span className="sr-only">{FLAG_TEXT[flag]}</span>
                      )}
                      {cell.chartedLate && (
                        <span
                          title="Charted late — shown at the time the observation was taken"
                          className="text-muted-foreground text-[10px] font-sans"
                        >
                          late
                        </span>
                      )}
                    </span>
                    {cell.note && (
                      <span className="text-muted-foreground block font-sans text-[10px]">
                        {cell.note}
                      </span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export { VitalsFlowsheet }
