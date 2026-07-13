"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, ReferenceLine, XAxis, YAxis } from "recharts"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"
import {
  RiskScoreGauge,
  type RiskBand,
} from "@/registry/medcn/risk-score-gauge/risk-score-gauge"

export interface EwsParameter {
  label: string
  /** The measured value — "108 bpm", "92%". */
  value: React.ReactNode
  /** Points this parameter contributed, as scored by the consumer's logic. */
  points: number
}

export interface EwsPoint {
  time: string
  score: number | null
}

export interface EarlyWarningScoreProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** "NEWS2", "MEWS", "PEWS" — named, because the scores are not interchangeable. */
  system: string
  /** The current aggregate score. Computed by the caller's validated logic. */
  score: number
  band: RiskBand
  /** The caller's escalation guidance for this score. */
  guidance?: React.ReactNode
  /** Per-parameter contributions, so a score can be checked rather than trusted. */
  parameters?: EwsParameter[]
  /** The score over time. The trajectory is the reading. */
  history?: EwsPoint[]
  /** Score at or above which the caller's protocol escalates. */
  escalationThreshold?: number
  max?: number
}

/**
 * An aggregate deterioration score, its parameters, and its trajectory.
 *
 * The component **displays** a score; it does not compute one. NEWS2, MEWS, and
 * PEWS are validated instruments with defined scoring tables, and a UI library
 * that reimplemented one would be shipping an unvalidated clinical calculator
 * with no way for a consumer to know it had drifted. The parameter breakdown is
 * shown so a clinician can check the arithmetic against the chart.
 *
 * The trajectory is given as much room as the number, because a score of 4 that
 * was 1 four hours ago is a different patient from a score of 4 that has been 4
 * all day — and a rising score still inside the "low" band is exactly the signal
 * an aggregate number tends to flatten.
 */
function EarlyWarningScore({
  system,
  score,
  band,
  guidance,
  parameters,
  history,
  escalationThreshold,
  max = 20,
  className,
  ...props
}: EarlyWarningScoreProps) {
  const config = {
    score: { label: `${system} score`, color: "var(--chart-3)" },
  } satisfies ChartConfig

  const measured = history?.filter(
    (point): point is { time: string; score: number } => point.score != null
  )
  const previous = measured?.at(-2)?.score
  const trend =
    previous === undefined
      ? null
      : score > previous
        ? "rising"
        : score < previous
          ? "falling"
          : "unchanged"

  return (
    <div
      data-slot="early-warning-score"
      className={cn("flex w-full flex-col gap-4", className)}
      {...props}
    >
      <div className="flex flex-wrap items-start gap-4">
        <RiskScoreGauge
          label={`${system} score`}
          value={score}
          band={band}
          percent={(score / max) * 100}
          scale={`0–${max}`}
          caption={guidance}
        />

        <div className="flex min-w-48 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {system}
            </Badge>
            {trend && (
              // The direction is stated in words: the number alone hides it.
              <Badge
                variant={trend === "rising" ? "warning" : "soft"}
                className="font-normal"
              >
                {trend === "rising"
                  ? `Rising — was ${previous}`
                  : trend === "falling"
                    ? `Falling — was ${previous}`
                    : `Unchanged at ${previous}`}
              </Badge>
            )}
          </div>

          {parameters && (
            <table className="w-full text-xs">
              <caption className="sr-only">
                {system} parameter contributions
              </caption>
              <thead className="text-muted-foreground">
                <tr>
                  <th scope="col" className="py-1 text-left font-medium">
                    Parameter
                  </th>
                  <th scope="col" className="py-1 text-right font-medium">
                    Value
                  </th>
                  <th scope="col" className="py-1 text-right font-medium">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((parameter) => (
                  <tr key={parameter.label} className="border-border/50 border-t">
                    <td className="py-1">{parameter.label}</td>
                    <td className="py-1 text-right font-mono tabular-nums">
                      {parameter.value}
                    </td>
                    <td
                      className={cn(
                        "py-1 text-right font-mono font-medium tabular-nums",
                        parameter.points > 0 && "text-warning-foreground"
                      )}
                    >
                      {parameter.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {history && history.length > 1 && (
        <ChartContainer
          config={config}
          label={`${system} score over time`}
          caption={`Scored by the care team's ${system} implementation — this chart displays it and does not compute it.`}
          className="aspect-auto h-40"
          dataTable={
            <ChartDataTable
              caption={`${system} score over time`}
              columns={[
                { key: "time", label: "Time" },
                { key: "score", label: `${system} score` },
              ]}
              rows={history}
            />
          }
        >
          <LineChart data={history} margin={{ left: 4, right: 12, top: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              width={28}
              tickLine={false}
              axisLine={false}
              domain={[0, max]}
              allowDecimals={false}
            />

            {escalationThreshold !== undefined && (
              <ReferenceLine
                y={escalationThreshold}
                stroke="var(--chart-critical)"
                strokeDasharray="5 3"
                label={{
                  value: `Escalate ≥ ${escalationThreshold}`,
                  position: "insideTopRight",
                  fontSize: 10,
                  fill: "var(--chart-critical)",
                }}
              />
            )}

            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="score"
              type="stepAfter"
              stroke="var(--color-score)"
              strokeWidth={2}
              dot={{ r: 3 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  )
}

export { EarlyWarningScore }
