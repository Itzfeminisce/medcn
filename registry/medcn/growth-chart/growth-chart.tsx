"use client"

import * as React from "react"
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

export type GrowthMeasure =
  | "weight"
  | "length"
  | "height"
  | "headCircumference"
  | "bmi"

export interface PercentileCurve {
  /** "P3", "P50", "P97" — as named by the reference. */
  label: string
  /** One point per x value on the reference's own grid. */
  data: { x: number; y: number }[]
  /** Emphasise the median, or a clinically watched percentile. */
  emphasis?: boolean
}

export interface GrowthPoint {
  /** Age in the unit named by `xUnit` — corrected, if `correctedAge` is set. */
  x: number
  y: number
  /** Percentile the caller placed this measurement at, if they computed one. */
  percentile?: number
  date?: string
}

export interface GrowthChartProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  measure: GrowthMeasure
  /** The child's plotted measurements. */
  data: GrowthPoint[]
  /** The reference's percentile curves. Supplied — never bundled with the component. */
  percentiles: PercentileCurve[]
  /**
   * Which growth reference these curves come from, and for whom:
   * "WHO 0–2 years, girls". Required — the same measurement lands on a
   * different percentile against a different reference.
   */
  reference: string
  unit: string
  xUnit?: string
  /**
   * True when `x` is corrected for prematurity. It changes the whole reading, so
   * it is stated on the chart rather than assumed either way.
   */
  correctedAge?: boolean
  /** Gestation at birth — shown alongside a corrected age. */
  gestationAtBirth?: string
  label?: string
}

const MEASURE_LABEL: Record<GrowthMeasure, string> = {
  weight: "Weight",
  length: "Length",
  height: "Height",
  headCircumference: "Head circumference",
  bmi: "BMI",
}

/**
 * A child's growth against a named percentile reference.
 *
 * `reference` and `percentiles` are both required and neither is bundled: the
 * same weight lands on a different percentile against WHO, CDC, or a local
 * standard, so a growth chart that quietly chose one for the caller would be
 * putting a clinical claim in their mouth. The reference is named on the chart
 * itself for the same reason.
 *
 * `correctedAge` is stated, never inferred. Plotting a preterm infant at
 * chronological age drags them down the centiles and invents a growth problem
 * that does not exist.
 *
 * A single point on a growth chart says very little; the shape of the line is
 * the reading. The component plots what it is given and computes no percentile.
 */
function GrowthChart({
  measure,
  data,
  percentiles,
  reference,
  unit,
  xUnit = "months",
  correctedAge = false,
  gestationAtBirth,
  label,
  className,
  ...props
}: GrowthChartProps) {
  const measureLabel = MEASURE_LABEL[measure]
  const title = label ?? `${measureLabel} for age — ${reference}`

  // Percentile curves and the child's points live on one x grid.
  const rows = React.useMemo(() => {
    const xs = new Set<number>()
    for (const curve of percentiles) for (const point of curve.data) xs.add(point.x)
    for (const point of data) xs.add(point.x)

    return [...xs]
      .sort((a, b) => a - b)
      .map((x) => {
        const row: Record<string, number | null> = { x }
        for (const curve of percentiles) {
          row[curve.label] =
            curve.data.find((point) => point.x === x)?.y ?? null
        }
        row.child = data.find((point) => point.x === x)?.y ?? null
        return row
      })
  }, [percentiles, data])

  const config = {
    child: { label: measureLabel, unit, color: "var(--chart-1)" },
    ...Object.fromEntries(
      percentiles.map((curve) => [
        curve.label,
        { label: curve.label, unit, color: "var(--chart-range-line)" },
      ])
    ),
  } satisfies ChartConfig

  const latest = data.at(-1)

  return (
    <div
      data-slot="growth-chart"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-semibold">{measureLabel} for age</span>
        <Badge variant="outline" className="font-normal">
          {reference}
        </Badge>
        {correctedAge && (
          <Badge variant="warning" className="font-normal">
            Corrected age
            {gestationAtBirth ? ` · born ${gestationAtBirth}` : ""}
          </Badge>
        )}
        {latest?.percentile !== undefined && (
          <Badge variant="soft" className="ml-auto font-normal">
            Latest: {latest.percentile}th percentile
          </Badge>
        )}
      </div>

      <ChartContainer
        config={config}
        label={`${title}${correctedAge ? ", plotted at corrected age" : ""}`}
        caption={
          <>
            Percentile curves from {reference}. Age in {xUnit}
            {correctedAge ? ", corrected for prematurity" : ""}. A single point is
            not a growth assessment — the shape of the line is.
          </>
        }
        className="aspect-auto h-72"
        dataTable={
          <ChartDataTable
            caption={title}
            columns={[
              { key: "date", label: "Date" },
              { key: "x", label: `Age (${xUnit})` },
              { key: "y", label: measureLabel, unit },
              { key: "percentile", label: "Percentile" },
            ]}
            rows={data as unknown as Record<string, React.ReactNode>[]}
          />
        }
      >
        <LineChart data={rows} margin={{ left: 4, right: 28, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="x"
            type="number"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          >
            <Label
              value={`Age (${xUnit})`}
              position="insideBottom"
              offset={-4}
              style={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            />
          </XAxis>
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

          {/* Reference curves are recessive: they are the backdrop, not the reading. */}
          {percentiles.map((curve) => (
            <Line
              key={curve.label}
              dataKey={curve.label}
              type="monotone"
              stroke="var(--chart-range-line)"
              strokeWidth={curve.emphasis ? 1.5 : 1}
              strokeDasharray={curve.emphasis ? undefined : "4 4"}
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={false}
              label={{
                value: curve.label,
                position: "right",
                fontSize: 9,
                fill: "var(--muted-foreground)",
              }}
            />
          ))}

          <ChartTooltip content={<ChartTooltipContent />} />

          <Line
            dataKey="child"
            type="monotone"
            stroke="var(--color-child)"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            connectNulls
            isAnimationActive={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

export { GrowthChart, MEASURE_LABEL as growthMeasures }
