"use client"

import * as React from "react"
import { ReferenceArea, ReferenceLine } from "recharts"

export interface ReferenceRangeBandProps {
  /** Which axis the bounds are read against. */
  axis?: "y" | "x"
  /** Lower bound of the normal range. Omit for a one-sided range. */
  low?: number
  /** Upper bound of the normal range. Omit for a one-sided range. */
  high?: number
  /** Thresholds beyond which a value is critical. Drawn as labelled lines, never as fill alone. */
  criticalBelow?: number
  criticalAbove?: number
  /** Names the band — "Normal (adult, seated)". Say who the range applies to. */
  label?: string
  /** Draws the bound values on the band edges. */
  showBounds?: boolean
  /** Fill for the normal band. Defaults to the low-chroma --chart-range token. */
  fill?: string
}

/**
 * The normal range behind a series, plus any critical thresholds.
 *
 * A reference range is a property of the assay, the patient's age, and often
 * their sex — never a constant. Every bound is supplied by the caller, and
 * `label` exists so the chart can say which population the band describes;
 * an unattributed band is an assertion the reader cannot check.
 *
 * Critical thresholds are drawn as labelled, dashed lines rather than as a red
 * wash, because colour alone is not a warning — a colour-blind reader and a
 * printed chart must carry the same information. The lines extend the axis
 * domain so a threshold never falls silently outside the visible range.
 */
function ReferenceRangeBand({
  axis = "y",
  low,
  high,
  criticalBelow,
  criticalAbove,
  label,
  showBounds = true,
  fill = "var(--chart-range)",
}: ReferenceRangeBandProps) {
  const bounds = axis === "y" ? { y1: low, y2: high } : { x1: low, x2: high }
  const hasBand = low !== undefined || high !== undefined

  return (
    <>
      {hasBand && (
        <ReferenceArea
          {...bounds}
          ifOverflow="extendDomain"
          fill={fill}
          fillOpacity={1}
          stroke="var(--chart-range-line)"
          strokeDasharray="2 4"
          label={
            label
              ? {
                  value: label,
                  position: "insideTopLeft",
                  fill: "var(--muted-foreground)",
                  fontSize: 10,
                }
              : undefined
          }
        />
      )}

      {showBounds &&
        [low, high]
          .filter((bound): bound is number => bound !== undefined)
          .map((bound) => (
            <ReferenceLine
              key={`bound-${bound}`}
              {...(axis === "y" ? { y: bound } : { x: bound })}
              ifOverflow="extendDomain"
              stroke="var(--chart-range-line)"
              strokeWidth={1}
            />
          ))}

      {[
        { value: criticalBelow, text: `Critical below ${criticalBelow}` },
        { value: criticalAbove, text: `Critical above ${criticalAbove}` },
      ]
        .filter((threshold) => threshold.value !== undefined)
        .map((threshold) => (
          <ReferenceLine
            key={`critical-${threshold.value}`}
            {...(axis === "y"
              ? { y: threshold.value }
              : { x: threshold.value })}
            ifOverflow="extendDomain"
            stroke="var(--chart-critical)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            label={{
              value: threshold.text,
              position: axis === "y" ? "right" : "top",
              fill: "var(--chart-critical)",
              fontSize: 10,
            }}
          />
        ))}
    </>
  )
}

export { ReferenceRangeBand }
