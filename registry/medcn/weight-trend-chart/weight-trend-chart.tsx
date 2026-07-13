"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

export interface WeightReading {
  date: string
  weight: number | null
}

export interface WeightTrendChartProps
  extends Omit<
    React.ComponentProps<typeof ChartContainer>,
    "config" | "children" | "label"
  > {
  data: WeightReading[]
  unit: "kg" | "lb"
  /**
   * Change over this many readings, annotated beneath the chart. The component
   * reports the magnitude; what it *means* is the caller's to say.
   */
  deltaWindow?: number
  /** The caller's interpretation of the change, if they have one. */
  deltaNote?: React.ReactNode
  label?: string
}

/**
 * Weight over time, with the change across a window stated in plain numbers.
 *
 * The component annotates magnitude and refuses to interpret it. Fluid overload
 * in heart failure, growth in an infant, and cachexia in advanced disease all
 * draw the same arrow, and the arrow does not know which one it is — `deltaNote`
 * is where the caller, who has the context, says.
 */
function WeightTrendChart({
  data,
  unit,
  deltaWindow,
  deltaNote,
  label = "Weight over time",
  caption,
  className,
  ...props
}: WeightTrendChartProps) {
  const config = {
    weight: { label: "Weight", unit, color: "var(--chart-1)" },
  } satisfies ChartConfig

  const delta = React.useMemo(() => {
    const measured = data.filter(
      (reading): reading is { date: string; weight: number } =>
        reading.weight != null
    )
    if (measured.length < 2) return null

    const window = deltaWindow ?? measured.length
    const from = measured[Math.max(0, measured.length - window)]
    const to = measured[measured.length - 1]
    const change = to.weight - from.weight

    return {
      change,
      percent: (change / from.weight) * 100,
      from,
      to,
    }
  }, [data, deltaWindow])

  return (
    <div className="flex w-full flex-col gap-2">
      <ChartContainer
        config={config}
        label={label}
        caption={caption ?? `Weights in ${unit}, as recorded.`}
        className={className}
        dataTable={
          <ChartDataTable
            caption={label}
            columns={[
              { key: "date", label: "Date" },
              { key: "weight", label: "Weight", unit },
            ]}
            rows={data}
          />
        }
        {...props}
      >
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            width={40}
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
          <ChartTooltip content={<ChartTooltipContent />} />
          <Area
            dataKey="weight"
            type="monotone"
            stroke="var(--color-weight)"
            strokeWidth={2}
            fill="var(--color-weight)"
            fillOpacity={0.1}
            dot={{ r: 3 }}
            connectNulls={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>

      {delta && (
        <p
          data-slot="weight-trend-chart-delta"
          className="text-muted-foreground text-xs"
        >
          <span className="text-foreground font-medium tabular-nums">
            {delta.change > 0 ? "+" : ""}
            {delta.change.toFixed(1)} {unit} ({delta.percent > 0 ? "+" : ""}
            {delta.percent.toFixed(1)}%)
          </span>{" "}
          from {delta.from.date} to {delta.to.date}
          {deltaNote ? <> · {deltaNote}</> : null}
        </p>
      )}
    </div>
  )
}

export { WeightTrendChart }
