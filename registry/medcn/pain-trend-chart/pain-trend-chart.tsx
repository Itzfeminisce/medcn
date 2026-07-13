"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

export interface PainReading {
  time: string
  score: number | null
  /**
   * The instrument the score came from — "NRS 0–10", "FLACC", "Wong-Baker".
   * Scores from different scales are not one series.
   */
  scale: string
}

export interface AnalgesiaMarker {
  time: string
  /** "Morphine 5 mg IV" — the caller's words. */
  label: string
}

export interface PainTrendChartProps
  extends Omit<
    React.ComponentProps<typeof ChartContainer>,
    "config" | "children" | "label"
  > {
  data: PainReading[]
  analgesia?: AnalgesiaMarker[]
  /** Score at or above which the caller's protocol expects a review. */
  reviewThreshold?: number
  /** Highest score the scales run to. */
  max?: number
  label?: string
}

/**
 * Reported pain over time, with analgesia marked.
 *
 * The scale is part of the data, so each instrument is its own series: a 6 on
 * the numeric rating scale and a 6 on FLACC are not the same observation, and
 * joining them draws a trend that nobody reported. Where a patient's assessment
 * changes instrument — a child who becomes able to self-report, say — the chart
 * shows two series rather than one continuous line.
 *
 * Pain is what the patient says it is. The chart does not smooth it toward what
 * the analgesia would predict, and a score that stays high after a dose is data,
 * not noise.
 */
function PainTrendChart({
  data,
  analgesia,
  reviewThreshold,
  max = 10,
  label = "Reported pain over time",
  caption,
  ...props
}: PainTrendChartProps) {
  const scales = React.useMemo(
    () => [...new Set(data.map((reading) => reading.scale))],
    [data]
  )

  // Scale names are free text ("NRS 0–10") and become both data keys and CSS
  // custom properties, so they are slugged before either use.
  const seriesKey = React.useCallback(
    (scale: string) => `s${scales.indexOf(scale)}`,
    [scales]
  )

  const rows = React.useMemo(
    () =>
      data.map((reading) => ({
        time: reading.time,
        ...Object.fromEntries(
          scales.map((scale) => [
            seriesKey(scale),
            reading.scale === scale ? reading.score : null,
          ])
        ),
      })),
    [data, scales, seriesKey]
  )

  const config = Object.fromEntries(
    scales.map((scale, index) => [
      seriesKey(scale),
      { label: scale, color: `var(--chart-${(index % 5) + 1})` },
    ])
  ) satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      label={`${label}, scored on ${scales.join(" and ")}`}
      caption={
        caption ??
        (scales.length > 1
          ? `Scored on ${scales.join(" and ")} — plotted separately, because scores from different scales are not comparable.`
          : `Scored on ${scales[0]}. Self-reported.`)
      }
      dataTable={
        <ChartDataTable
          caption={label}
          columns={[
            { key: "time", label: "Time" },
            { key: "score", label: "Score" },
            { key: "scale", label: "Scale" },
          ]}
          rows={data as unknown as Record<string, React.ReactNode>[]}
        />
      }
      {...props}
    >
      <LineChart data={rows} margin={{ left: 4, right: 16, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          width={28}
          tickLine={false}
          axisLine={false}
          domain={[0, max]}
          ticks={[0, max / 2, max]}
        />

        {reviewThreshold !== undefined && (
          <ReferenceLine
            y={reviewThreshold}
            stroke="var(--chart-abnormal)"
            strokeDasharray="5 3"
            label={{
              value: `Review ≥ ${reviewThreshold}`,
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--chart-abnormal)",
            }}
          />
        )}

        {analgesia?.map((dose) => (
          <ReferenceLine
            key={`${dose.time}-${dose.label}`}
            x={dose.time}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{
              value: dose.label,
              position: "top",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        ))}

        <ChartTooltip content={<ChartTooltipContent />} />
        {scales.length > 1 && <ChartLegend content={<ChartLegendContent />} />}

        {scales.map((scale) => (
          <Line
            key={scale}
            dataKey={seriesKey(scale)}
            type="linear"
            stroke={`var(--color-${seriesKey(scale)})`}
            strokeWidth={2}
            dot={{ r: 3.5 }}
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

export { PainTrendChart }
