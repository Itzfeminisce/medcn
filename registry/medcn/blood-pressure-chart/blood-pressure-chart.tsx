"use client"

import * as React from "react"
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

export interface BloodPressureReading {
  /** Timestamp or label for the x axis. */
  time: string
  systolic: number | null
  diastolic: number | null
  /** Mean arterial pressure, if the caller computed one. */
  map?: number | null
  /** "Seated", "Standing", "Left arm" — an annotation, never an assumption. */
  position?: string
}

export interface BloodPressureChartProps
  extends Omit<React.ComponentProps<typeof ChartContainer>, "config" | "children" | "label"> {
  data: BloodPressureReading[]
  label?: string
  /** Caller's target thresholds, drawn as labelled lines. */
  systolicTarget?: number
  diastolicTarget?: number
  showMap?: boolean
  unit?: string
}

const config = {
  pressure: { label: "Systolic — diastolic", unit: "mmHg", color: "var(--chart-1)" },
  systolic: { label: "Systolic", unit: "mmHg", color: "var(--chart-1)" },
  diastolic: { label: "Diastolic", unit: "mmHg", color: "var(--chart-3)" },
  map: { label: "MAP", unit: "mmHg", color: "var(--chart-2)" },
} satisfies ChartConfig

/**
 * Blood pressure over time, drawn as one observation rather than two.
 *
 * Systolic and diastolic are plotted as a filled range between the pair, with
 * each bound also drawn. Splitting them into two unrelated lines hides the thing
 * clinicians read a BP chart for — the pulse pressure narrowing or widening
 * between them.
 *
 * Position and cuff site are caller-supplied annotations shown in the tooltip: a
 * standing reading and a seated one are not interchangeable, and the component
 * will not pretend they are by silently plotting them on one line.
 */
function BloodPressureChart({
  data,
  label = "Blood pressure over time",
  systolicTarget,
  diastolicTarget,
  showMap = false,
  unit = "mmHg",
  caption,
  ...props
}: BloodPressureChartProps) {
  // Recharts draws a band from a [low, high] tuple.
  const rows = React.useMemo(
    () =>
      data.map((reading) => ({
        ...reading,
        pressure:
          reading.systolic != null && reading.diastolic != null
            ? [reading.diastolic, reading.systolic]
            : null,
      })),
    [data]
  )

  return (
    <ChartContainer
      config={config}
      label={label}
      caption={caption ?? `Pressures in ${unit}. Position is shown per reading.`}
      dataTable={
        <ChartDataTable
          caption={label}
          columns={[
            { key: "time", label: "Time" },
            { key: "systolic", label: "Systolic", unit },
            { key: "diastolic", label: "Diastolic", unit },
            ...(showMap ? [{ key: "map", label: "MAP", unit }] : []),
            { key: "position", label: "Position" },
          ]}
          rows={data as unknown as Record<string, React.ReactNode>[]}
        />
      }
      {...props}
    >
      <ComposedChart data={rows} margin={{ left: 4, right: 12, top: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          width={40}
          tickLine={false}
          axisLine={false}
          domain={[40, 200]}
          label={{
            value: unit,
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 10, fill: "var(--muted-foreground)" },
          }}
        />

        {systolicTarget !== undefined && (
          <ReferenceLine
            y={systolicTarget}
            stroke="var(--chart-range-line)"
            strokeDasharray="4 4"
            label={{
              value: `Systolic target ${systolicTarget}`,
              position: "right",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        )}
        {diastolicTarget !== undefined && (
          <ReferenceLine
            y={diastolicTarget}
            stroke="var(--chart-range-line)"
            strokeDasharray="4 4"
            label={{
              value: `Diastolic target ${diastolicTarget}`,
              position: "right",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        )}

        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value, payload) => {
                const position = payload?.[0]?.payload?.position
                return position ? `${value} · ${position}` : String(value)
              }}
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />

        {/* The pair, as one mark: the gap between the bounds is the reading. */}
        <Area
          dataKey="pressure"
          stroke="none"
          fill="var(--color-pressure)"
          fillOpacity={0.12}
          connectNulls={false}
          isAnimationActive={false}
          legendType="none"
          tooltipType="none"
        />
        <Line
          dataKey="systolic"
          type="monotone"
          stroke="var(--color-systolic)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls={false}
          isAnimationActive={false}
        />
        <Line
          dataKey="diastolic"
          type="monotone"
          stroke="var(--color-diastolic)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls={false}
          isAnimationActive={false}
        />
        {showMap && (
          <Line
            dataKey="map"
            type="monotone"
            stroke="var(--color-map)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            dot={false}
            connectNulls={false}
            isAnimationActive={false}
          />
        )}
      </ComposedChart>
    </ChartContainer>
  )
}

export { BloodPressureChart }
