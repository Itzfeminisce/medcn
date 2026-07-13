"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"
import { ReferenceRangeBand } from "@/registry/medcn/reference-range-band/reference-range-band"

/** Serum potassium. The 06 Mar draw is critical — flagged by shape, not colour alone. */
const RESULTS = [
  { date: "12 Feb", potassium: 4.1 },
  { date: "19 Feb", potassium: 3.8 },
  { date: "26 Feb", potassium: 3.4 },
  { date: "06 Mar", potassium: 2.4 },
  { date: "13 Mar", potassium: 3.6 },
]

const config = {
  potassium: { label: "Potassium", unit: "mmol/L", color: "var(--chart-1)" },
} satisfies ChartConfig

export default function ReferenceRangeBandDemo() {
  return (
    <ChartContainer
      config={config}
      label="Serum potassium, 12 February to 13 March"
      caption="Reference range 3.5–5.0 mmol/L (adult, serum) · Springfield General laboratory"
      className="max-w-2xl"
      dataTable={
        <ChartDataTable
          caption="Serum potassium, 12 February to 13 March"
          columns={[
            { key: "date", label: "Date" },
            { key: "potassium", label: "Potassium", unit: "mmol/L" },
            { key: "flag", label: "Flag" },
          ]}
          rows={RESULTS.map((result) => ({
            date: result.date,
            potassium: result.potassium,
            flag:
              result.potassium < 2.5
                ? "Critical low"
                : result.potassium < 3.5
                  ? "Low"
                  : "Within range",
          }))}
        />
      }
    >
      <LineChart data={RESULTS} margin={{ left: 4, right: 72, top: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis width={36} tickLine={false} axisLine={false} domain={[2, 6]} />

        <ReferenceRangeBand
          low={3.5}
          high={5}
          criticalBelow={2.5}
          criticalAbove={6.5}
          label="Normal (adult, serum)"
        />

        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="potassium"
          type="monotone"
          stroke="var(--color-potassium)"
          strokeWidth={2}
          dot={(props) => {
            const { cx, cy, key, payload } = props
            const critical = payload.potassium < 2.5
            // Critical points are a different shape, not just a different colour.
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
                r={3.5}
                fill="var(--color-potassium)"
              />
            )
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}
