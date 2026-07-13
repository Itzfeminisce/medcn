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
import { ReferenceRangeBand } from "@/registry/medcn/reference-range-band/reference-range-band"

export type TemperatureRoute =
  | "oral"
  | "tympanic"
  | "axillary"
  | "rectal"
  | "core"

const ROUTE_LABEL: Record<TemperatureRoute, string> = {
  oral: "Oral",
  tympanic: "Tympanic",
  axillary: "Axillary",
  rectal: "Rectal",
  core: "Core",
}

export interface TemperatureReading {
  time: string
  temperature: number | null
  route: TemperatureRoute
}

export interface AntipyreticMarker {
  time: string
  /** "Paracetamol 1 g" — the caller's words. */
  label: string
}

export interface TemperatureCurveProps
  extends Omit<
    React.ComponentProps<typeof ChartContainer>,
    "config" | "children" | "label"
  > {
  data: TemperatureReading[]
  unit?: "°C" | "°F"
  /** Antipyretic administrations, aligned to the x axis. */
  antipyretics?: AntipyreticMarker[]
  /** Normal range for the route in use. Caller-supplied. */
  range?: { low: number; high: number; label?: string }
  /** Threshold above which the caller considers the temperature febrile. */
  feverThreshold?: number
  label?: string
}

/**
 * The fever curve.
 *
 * Each route is its own series. Oral, tympanic, axillary, rectal, and core
 * readings are not interchangeable — an axillary reading runs roughly half a
 * degree below a core one — so a single line through mixed routes manufactures a
 * trend out of a change in measurement method. Plotting them separately means a
 * defervescence is a real defervescence, not a switch from rectal to axillary.
 *
 * Antipyretic doses are markers. A fall after one is not proof the drug caused it.
 */
function TemperatureCurve({
  data,
  unit = "°C",
  antipyretics,
  range,
  feverThreshold,
  label = "Temperature over time",
  caption,
  ...props
}: TemperatureCurveProps) {
  // One series per route present — never one line across mixed methods.
  const routes = React.useMemo(() => {
    const present = new Set(data.map((reading) => reading.route))
    return [...present]
  }, [data])

  const rows = React.useMemo(
    () =>
      data.map((reading) => ({
        time: reading.time,
        route: ROUTE_LABEL[reading.route],
        ...Object.fromEntries(
          routes.map((route) => [
            route,
            reading.route === route ? reading.temperature : null,
          ])
        ),
      })),
    [data, routes]
  )

  const config = Object.fromEntries(
    routes.map((route, index) => [
      route,
      {
        label: ROUTE_LABEL[route],
        unit,
        color: `var(--chart-${(index % 5) + 1})`,
      },
    ])
  ) satisfies ChartConfig

  return (
    <ChartContainer
      config={config}
      label={`${label} by route, in ${unit}`}
      caption={
        caption ??
        `Routes are plotted separately — readings taken by different routes are not comparable.`
      }
      dataTable={
        <ChartDataTable
          caption={label}
          columns={[
            { key: "time", label: "Time" },
            { key: "temperature", label: "Temperature", unit },
            { key: "route", label: "Route" },
          ]}
          rows={data.map((reading) => ({
            time: reading.time,
            temperature: reading.temperature,
            route: ROUTE_LABEL[reading.route],
          }))}
        />
      }
      {...props}
    >
      <LineChart data={rows} margin={{ left: 4, right: 12, top: 16 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
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
            label={range.label}
            showBounds={false}
          />
        )}

        {feverThreshold !== undefined && (
          <ReferenceLine
            y={feverThreshold}
            stroke="var(--chart-abnormal)"
            strokeDasharray="5 3"
            label={{
              value: `Febrile ≥ ${feverThreshold}${unit}`,
              position: "insideTopRight",
              fontSize: 10,
              fill: "var(--chart-abnormal)",
            }}
          />
        )}

        {antipyretics?.map((dose) => (
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
        {routes.length > 1 && <ChartLegend content={<ChartLegendContent />} />}

        {routes.map((route) => (
          <Line
            key={route}
            dataKey={route}
            type="monotone"
            stroke={`var(--color-${route})`}
            strokeWidth={2}
            dot={{ r: 3 }}
            // Unlike every other chart in this round, nulls ARE connected here:
            // a null in a route's series means that row was measured by a
            // different route, not that nothing was measured. Breaking the line
            // there would shatter each route into isolated dots and hide the
            // very trend the curve exists to show.
            connectNulls
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

export { TemperatureCurve, ROUTE_LABEL as temperatureRoutes }
