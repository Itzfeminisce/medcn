"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { cn } from "@/registry/medcn/lib/utils"
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"
import { LabDeltaIndicator } from "@/registry/medcn/lab-delta-indicator/lab-delta-indicator"
import { ReferenceRangeBand } from "@/registry/medcn/reference-range-band/reference-range-band"

export interface LabResultPoint {
  date: string
  value: number | null
  /**
   * The assay that produced this result. Results from different assays are not
   * one continuous series — a change here breaks the line.
   */
  assay?: string
  flag?: "normal" | "low" | "high" | "critical"
}

export interface LabResultChartProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  analyte: string
  data: LabResultPoint[]
  unit: string
  /** Reference range from the laboratory, with the population it applies to. */
  range?: {
    low?: number
    high?: number
    criticalBelow?: number
    criticalAbove?: number
    label?: string
  }
  /** Show the change between the last two results. */
  showDelta?: boolean
  significantChange?: number
  label?: string
}

/**
 * One analyte over time, against its reference range.
 *
 * An assay change is a break in the series, drawn as one. Results produced by
 * different methods are not comparable as a continuous line — a "rise" across a
 * platform migration is an artefact of the laboratory, not of the patient — so
 * each assay is its own segment and the changeover is marked on the axis.
 *
 * Critical results are flagged by shape and label as well as colour, because a
 * printed chart and a colour-blind reader must carry the same warning.
 */
function LabResultChart({
  analyte,
  data,
  unit,
  range,
  showDelta = true,
  significantChange,
  label,
  className,
  ...props
}: LabResultChartProps) {
  const title = label ?? `${analyte} over time`

  // One dataKey per assay: recharts draws each as its own line, so the series
  // visibly breaks where the method changed instead of implying continuity.
  const assays = React.useMemo(() => {
    const present = data.map((point) => point.assay ?? "default")
    return [...new Set(present)]
  }, [data])

  // Assay names are free text, and a data key here also becomes a CSS custom
  // property — slug them rather than emitting `--color-Roche Cobas c702`.
  const seriesKey = React.useCallback(
    (assay: string) => `a${assays.indexOf(assay)}`,
    [assays]
  )

  const rows = React.useMemo(
    () =>
      data.map((point) => ({
        date: point.date,
        ...Object.fromEntries(
          assays.map((assay) => [
            seriesKey(assay),
            (point.assay ?? "default") === assay ? point.value : null,
          ])
        ),
      })),
    [data, assays, seriesKey]
  )

  // Where the assay changed — the x value of the first result on each new assay.
  const changeovers = React.useMemo(
    () =>
      data
        .filter(
          (point, index) =>
            index > 0 &&
            (point.assay ?? "default") !== (data[index - 1]?.assay ?? "default")
        )
        .map((point) => ({ date: point.date, assay: point.assay })),
    [data]
  )

  const config = Object.fromEntries(
    assays.map((assay) => [
      seriesKey(assay),
      {
        label: assay === "default" ? analyte : `${analyte} (${assay})`,
        unit,
        color: "var(--chart-1)",
      },
    ])
  ) satisfies ChartConfig

  const measured = data.filter(
    (point): point is LabResultPoint & { value: number } => point.value != null
  )
  const latest = measured.at(-1)
  const prior = measured.at(-2)
  // A delta across an assay change compares two different measurements.
  const sameAssay =
    latest && prior && (latest.assay ?? "default") === (prior.assay ?? "default")

  return (
    <div
      data-slot="lab-result-chart"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-sm font-semibold">{analyte}</span>
        {latest && (
          <span className="font-mono text-sm tabular-nums">
            {latest.value}
            <span className="text-muted-foreground ml-0.5 text-xs">{unit}</span>
          </span>
        )}
        {showDelta && latest && prior && sameAssay && (
          <LabDeltaIndicator
            current={latest.value}
            prior={prior.value}
            unit={unit}
            interval={`prior ${prior.date}`}
            significantChange={significantChange}
          />
        )}
        {showDelta && latest && prior && !sameAssay && (
          <span className="text-muted-foreground text-xs">
            No delta across an assay change
          </span>
        )}
      </div>

      <ChartContainer
        config={config}
        label={title}
        caption={
          range?.label
            ? `Reference range ${range.low ?? "—"}–${range.high ?? "—"} ${unit} · ${range.label}`
            : `Values in ${unit}`
        }
        dataTable={
          <ChartDataTable
            caption={title}
            columns={[
              { key: "date", label: "Date" },
              { key: "value", label: analyte, unit },
              { key: "flag", label: "Flag" },
              { key: "assay", label: "Assay" },
            ]}
            rows={data as unknown as Record<string, React.ReactNode>[]}
          />
        }
      >
        <LineChart data={rows} margin={{ left: 4, right: 76, top: 16 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            width={44}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
            label={{
              value: unit,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 10, fill: "var(--muted-foreground)" },
            }}
          />

          {range && (
            <ReferenceRangeBand
              low={range.low}
              high={range.high}
              criticalBelow={range.criticalBelow}
              criticalAbove={range.criticalAbove}
              label={range.label}
              showBounds={false}
            />
          )}

          {changeovers.map((changeover) => (
            <ReferenceLine
              key={changeover.date}
              x={changeover.date}
              stroke="var(--muted-foreground)"
              strokeDasharray="2 2"
              label={{
                value: `Assay → ${changeover.assay}`,
                position: "top",
                fontSize: 9,
                fill: "var(--muted-foreground)",
              }}
            />
          ))}

          <ChartTooltip content={<ChartTooltipContent />} />

          {assays.map((assay) => (
            <Line
              key={assay}
              dataKey={seriesKey(assay)}
              type="monotone"
              stroke="var(--chart-1)"
              strokeWidth={2}
              connectNulls={false}
              isAnimationActive={false}
              dot={(dotProps) => {
                const { cx, cy, key, index } = dotProps
                // No coordinates means Recharts placed no point here — a gap in
                // the series, or a result belonging to a different assay.
                if (cx == null || cy == null) return <g key={key} />

                const point = data[index]
                const critical = point?.flag === "critical"

                return critical ? (
                  <path
                    key={key}
                    d={`M ${cx} ${cy - 5} L ${cx + 5} ${cy + 4} L ${cx - 5} ${cy + 4} Z`}
                    fill="var(--chart-critical)"
                    stroke="var(--background)"
                    strokeWidth={1.5}
                  />
                ) : (
                  <circle
                    key={key}
                    cx={cx}
                    cy={cy}
                    r={3}
                    fill="var(--chart-1)"
                  />
                )
              }}
            />
          ))}
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export { LabResultChart }
