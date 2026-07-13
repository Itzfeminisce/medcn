"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"
import { ReferenceRangeBand } from "@/registry/medcn/reference-range-band/reference-range-band"

export interface GlucoseReading {
  time: string
  glucose: number | null
  /** "Fasting", "Post-meal" — context the number cannot carry alone. */
  context?: string
}

export interface GlucoseMarker {
  time: string
  /** "Breakfast", "Insulin 6u" — meals and doses, supplied by the caller. */
  label: string
}

export interface GlucoseTrendChartProps
  extends Omit<
    React.ComponentProps<typeof ChartContainer>,
    "config" | "children" | "label"
  > {
  data: GlucoseReading[]
  /** Required: the unit is never assumed. mmol/L and mg/dL differ by ~18×. */
  unit: "mmol/L" | "mg/dL"
  /** Individualised target band. Required — there is no population default. */
  target: { low: number; high: number }
  /** Thresholds for clinically urgent lows and highs, from the care plan. */
  hypo?: number
  hyper?: number
  markers?: GlucoseMarker[]
  label?: string
}

/**
 * Glucose over time against an individualised target band.
 *
 * The unit and the target are both required props, and neither has a default.
 * A value that is a hypo for one patient is a target for another, and a reading
 * of 7 is unremarkable in mmol/L and profoundly hypoglycaemic in mg/dL — a
 * component that guessed either would be guessing about harm.
 *
 * Meals and doses are markers the caller supplies. Their alignment with a rise
 * or fall is not a causal claim.
 */
function GlucoseTrendChart({
  data,
  unit,
  target,
  hypo,
  hyper,
  markers,
  label = "Glucose over time",
  caption,
  ...props
}: GlucoseTrendChartProps) {
  const config = {
    glucose: { label: "Glucose", unit, color: "var(--chart-2)" },
  } satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      label={`${label}, target ${target.low}–${target.high} ${unit}`}
      caption={
        caption ?? `Target ${target.low}–${target.high} ${unit} · individualised`
      }
      dataTable={
        <ChartDataTable
          caption={label}
          columns={[
            { key: "time", label: "Time" },
            { key: "glucose", label: "Glucose", unit },
            { key: "context", label: "Context" },
            { key: "flag", label: "Flag" },
          ]}
          rows={data.map((reading) => ({
            time: reading.time,
            glucose: reading.glucose,
            context: reading.context,
            flag:
              reading.glucose == null
                ? undefined
                : hypo !== undefined && reading.glucose <= hypo
                  ? "Hypoglycaemic"
                  : hyper !== undefined && reading.glucose >= hyper
                    ? "Hyperglycaemic"
                    : reading.glucose < target.low
                      ? "Below target"
                      : reading.glucose > target.high
                        ? "Above target"
                        : "In target",
          }))}
        />
      }
      {...props}
    >
      <LineChart data={data} margin={{ left: 4, right: 76, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          width={40}
          tickLine={false}
          axisLine={false}
          label={{
            value: unit,
            angle: -90,
            position: "insideLeft",
            style: { fontSize: 10, fill: "var(--muted-foreground)" },
          }}
        />

        <ReferenceRangeBand
          low={target.low}
          high={target.high}
          criticalBelow={hypo}
          criticalAbove={hyper}
          label="Target range"
          showBounds={false}
        />

        {markers?.map((marker) => (
          <ReferenceLine
            key={`${marker.time}-${marker.label}`}
            x={marker.time}
            stroke="var(--muted-foreground)"
            strokeDasharray="3 3"
            label={{
              value: marker.label,
              position: "top",
              fontSize: 10,
              fill: "var(--muted-foreground)",
            }}
          />
        ))}

        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value, payload) => {
                const context = payload?.[0]?.payload?.context
                return context ? `${value} · ${context}` : String(value)
              }}
            />
          }
        />

        <Line
          dataKey="glucose"
          type="monotone"
          stroke="var(--color-glucose)"
          strokeWidth={2}
          connectNulls={false}
          isAnimationActive={false}
          dot={(dotProps) => {
            const { cx, cy, key, payload } = dotProps
            const value = payload.glucose as number | null
            const urgent =
              value != null &&
              ((hypo !== undefined && value <= hypo) ||
                (hyper !== undefined && value >= hyper))

            // Urgent readings differ in shape, not only in colour.
            return urgent ? (
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
                fill="var(--color-glucose)"
              />
            )
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

export { GlucoseTrendChart }
