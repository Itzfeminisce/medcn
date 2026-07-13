"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { cn } from "@/registry/medcn/lib/utils"
import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"
import { ReferenceRangeBand } from "@/registry/medcn/reference-range-band/reference-range-band"

export interface VitalsSeries {
  /** Key into each row of `data`. */
  key: string
  label: string
  unit: string
  color?: string
  /** Normal range for this vital, from the caller. */
  range?: {
    low?: number
    high?: number
    criticalBelow?: number
    criticalAbove?: number
    /** Who the range applies to — "Adult, seated". */
    label?: string
  }
  domain?: [number, number]
}

export interface VitalsEvent {
  /** The x value the event sits at — must match a row's x. */
  x: string | number
  label: string
}

export interface VitalsTrendChartProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  data: Record<string, string | number | null>[]
  series: VitalsSeries[]
  /** Key holding the timestamp/label in each row. */
  xKey?: string
  /** Names the whole figure for assistive tech. */
  label: string
  caption?: React.ReactNode
  /** Clinical events aligned to the x axis — a dose, a position change, an intervention. */
  events?: VitalsEvent[]
  showTable?: boolean
}

/**
 * Vitals over time.
 *
 * Series that do not share a unit are drawn as **separate stacked panels over a
 * common x axis**, never as two y-scales on one plot. A second axis silently
 * rescales one series against another, which is how a respiratory rate of 20 gets
 * read against a heart rate of 20 — the panels keep every value on the only
 * scale it means anything in.
 *
 * Gaps stay gaps: a missing observation is not bridged, because a line drawn
 * across it is a measurement nobody took.
 */
function VitalsTrendChart({
  data,
  series,
  xKey = "time",
  label,
  caption,
  events,
  showTable,
  className,
  ...props
}: VitalsTrendChartProps) {
  // One panel per unit — the alternative is a dual axis, which this component refuses.
  const panels = React.useMemo(() => {
    const groups = new Map<string, VitalsSeries[]>()
    for (const item of series) {
      const list = groups.get(item.unit) ?? []
      list.push(item)
      groups.set(item.unit, list)
    }
    return [...groups.entries()]
  }, [series])

  const config = React.useMemo(
    () =>
      Object.fromEntries(
        series.map((item, index) => [
          item.key,
          {
            label: item.label,
            unit: item.unit,
            color: item.color ?? `var(--chart-${(index % 5) + 1})`,
          },
        ])
      ) satisfies ChartConfig,
    [series]
  )

  const dataTable = (
    <ChartDataTable
      caption={label}
      columns={[
        { key: xKey, label: "Time" },
        ...series.map((item) => ({
          key: item.key,
          label: item.label,
          unit: item.unit,
        })),
      ]}
      rows={data}
    />
  )

  return (
    <div
      data-slot="vitals-trend-chart"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      {panels.map(([unit, group], panelIndex) => (
        <ChartContainer
          key={unit}
          config={config}
          label={`${label} — ${group.map((s) => s.label).join(", ")} (${unit})`}
          caption={panelIndex === panels.length - 1 ? caption : undefined}
          // The table belongs to the figure, not to each panel; attach it once.
          dataTable={panelIndex === panels.length - 1 ? dataTable : undefined}
          showTable={showTable}
          className="aspect-auto h-48"
        >
          <LineChart data={data} margin={{ left: 4, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={40}
              tickLine={false}
              axisLine={false}
              domain={group[0]?.domain ?? ["auto", "auto"]}
              label={{
                value: unit,
                angle: -90,
                position: "insideLeft",
                style: { fontSize: 10, fill: "var(--muted-foreground)" },
              }}
            />

            {group.map((item) =>
              item.range ? (
                <ReferenceRangeBand
                  key={`range-${item.key}`}
                  low={item.range.low}
                  high={item.range.high}
                  criticalBelow={item.range.criticalBelow}
                  criticalAbove={item.range.criticalAbove}
                  label={item.range.label}
                  showBounds={false}
                />
              ) : null
            )}

            {events?.map((event) => (
              <ReferenceLine
                key={`${event.x}-${event.label}`}
                x={event.x}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{
                  value: event.label,
                  position: "top",
                  fontSize: 10,
                  fill: "var(--muted-foreground)",
                }}
              />
            ))}

            <ChartTooltip content={<ChartTooltipContent />} />
            {group.length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}

            {group.map((item) => (
              <Line
                key={item.key}
                dataKey={item.key}
                type="monotone"
                stroke={`var(--color-${item.key})`}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ChartContainer>
      ))}
    </div>
  )
}

export { VitalsTrendChart }
