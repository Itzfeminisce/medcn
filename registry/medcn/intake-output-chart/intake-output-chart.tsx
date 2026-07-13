"use client"

import * as React from "react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { cn } from "@/registry/medcn/lib/utils"
import { Card } from "@/registry/medcn/card/card"
import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

export interface FluidPeriod {
  /** "08:00–12:00", "Day 2" — the period this row covers. */
  period: string
  /** Total in, for the period. */
  intake: number | null
  /** Total out, for the period. Positive numbers; the chart plots them downward. */
  output: number | null
  /**
   * True when output for this period was not fully charted. Unrecorded output is
   * not zero output, and the balance below is not trustworthy where this is set.
   */
  outputIncomplete?: boolean
}

export interface IntakeOutputChartProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  data: FluidPeriod[]
  unit?: string
  label?: string
  caption?: React.ReactNode
}

const config = {
  intake: { label: "Intake", unit: "mL", color: "var(--chart-1)" },
  outputPlotted: { label: "Output", unit: "mL", color: "var(--chart-4)" },
  balance: { label: "Running balance", unit: "mL", color: "var(--chart-3)" },
} satisfies ChartConfig

/**
 * Fluid balance across a shift or a day: intake up, output down, and the running
 * balance over the top.
 *
 * The balance is only as complete as the charting behind it. Where a period is
 * marked `outputIncomplete`, the component says so on the chart and in the
 * summary rather than quietly folding a gap in the record into a tidy positive
 * balance — unrecorded output is not zero output, and a patient who looks 2 L
 * positive because nobody emptied the catheter bag is a patient about to be
 * given a diuretic they do not need.
 */
function IntakeOutputChart({
  data,
  unit = "mL",
  label = "Fluid balance",
  caption,
  className,
  ...props
}: IntakeOutputChartProps) {
  const rows = React.useMemo(() => {
    let running = 0
    return data.map((period) => {
      const net = (period.intake ?? 0) - (period.output ?? 0)
      running += net
      return {
        ...period,
        // Output is plotted below the axis; the value itself stays positive.
        outputPlotted: period.output == null ? null : -period.output,
        balance: running,
      }
    })
  }, [data])

  const incomplete = data.some((period) => period.outputIncomplete)
  const net = rows.at(-1)?.balance ?? 0

  return (
    <Card
      data-slot="intake-output-chart"
      className={cn("w-full gap-2 px-5 py-4", className)}
      {...props}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-muted-foreground text-xs">
          Net{" "}
          <span className="text-foreground font-mono font-medium tabular-nums">
            {net > 0 ? "+" : ""}
            {net} {unit}
          </span>
          {incomplete && (
            <span className="text-warning-foreground bg-warning/20 ml-2 rounded px-1.5 py-0.5 text-[10px] font-semibold">
              Output incompletely charted — balance unreliable
            </span>
          )}
        </span>
      </div>

      <ChartContainer
        config={config}
        label={`${label}: intake and output by period, in ${unit}`}
        caption={
          caption ??
          (incomplete
            ? "Periods marked below have incomplete output charting. Unrecorded output is not zero output."
            : `Intake and output in ${unit}.`)
        }
        className="aspect-auto h-56"
        dataTable={
          <ChartDataTable
            caption={label}
            columns={[
              { key: "period", label: "Period" },
              { key: "intake", label: "Intake", unit },
              { key: "output", label: "Output", unit },
              { key: "balance", label: "Running balance", unit },
              { key: "charting", label: "Output charting" },
            ]}
            rows={rows.map((row) => ({
              period: row.period,
              intake: row.intake,
              output: row.output,
              balance: row.balance,
              charting: row.outputIncomplete ? "Incomplete" : "Complete",
            }))}
          />
        }
      >
        <ComposedChart data={rows} margin={{ left: 4, right: 12, top: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="period"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis
            width={48}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => `${Math.abs(value)}`}
            label={{
              value: unit,
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 10, fill: "var(--muted-foreground)" },
            }}
          />
          <ReferenceLine y={0} stroke="var(--chart-range-line)" />

          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />

          <Bar
            dataKey="intake"
            fill="var(--color-intake)"
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          />
          <Bar
            dataKey="outputPlotted"
            fill="var(--color-outputPlotted)"
            radius={[0, 0, 4, 4]}
            isAnimationActive={false}
            // Incomplete periods are drawn hollow: a short bar that means
            // "not charted" must not read as a short bar that means "little out".
            shape={(shapeProps) => {
              const { x, y, width, height, payload } =
                shapeProps as unknown as {
                  x: number
                  y: number
                  width: number
                  height: number
                  payload: FluidPeriod
                }
              const hollow = payload.outputIncomplete
              return (
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  rx={4}
                  fill={hollow ? "transparent" : "var(--color-outputPlotted)"}
                  stroke="var(--color-outputPlotted)"
                  strokeWidth={hollow ? 1.5 : 0}
                  strokeDasharray={hollow ? "4 3" : undefined}
                />
              )
            }}
          />
          <Line
            dataKey="balance"
            type="monotone"
            stroke="var(--color-balance)"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </ComposedChart>
      </ChartContainer>
    </Card>
  )
}

export { IntakeOutputChart }
