"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  ChartContainer,
  ChartDataTable,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/registry/medcn/chart/chart"

/** Heart rate is missing at 12:00 — the gap is drawn as a gap, not bridged. */
const READINGS = [
  { time: "08:00", heartRate: 78, respiratoryRate: 16 },
  { time: "10:00", heartRate: 84, respiratoryRate: 18 },
  { time: "12:00", heartRate: null, respiratoryRate: 18 },
  { time: "14:00", heartRate: 96, respiratoryRate: 20 },
  { time: "16:00", heartRate: 92, respiratoryRate: 19 },
  { time: "18:00", heartRate: 88, respiratoryRate: 17 },
]

const config = {
  heartRate: { label: "Heart rate", unit: "bpm", color: "var(--chart-1)" },
  respiratoryRate: {
    label: "Respiratory rate",
    unit: "breaths/min",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export default function ChartDemo() {
  return (
    <ChartContainer
      config={config}
      label="Heart rate and respiratory rate, 08:00 to 18:00"
      caption="Observations 12 Mar · heart rate not measured at 12:00"
      className="max-w-2xl"
      dataTable={
        <ChartDataTable
          caption="Heart rate and respiratory rate, 08:00 to 18:00"
          columns={[
            { key: "time", label: "Time" },
            { key: "heartRate", label: "Heart rate", unit: "bpm" },
            {
              key: "respiratoryRate",
              label: "Respiratory rate",
              unit: "breaths/min",
            },
          ]}
          rows={READINGS.map((reading) => ({
            time: reading.time,
            heartRate: reading.heartRate,
            respiratoryRate: reading.respiratoryRate,
          }))}
        />
      }
    >
      <LineChart data={READINGS} margin={{ left: 4, right: 12, top: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          width={32}
          tickLine={false}
          axisLine={false}
          domain={[10, 110]}
          tickMargin={4}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="heartRate"
          type="monotone"
          stroke="var(--color-heartRate)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls={false}
        />
        <Line
          dataKey="respiratoryRate"
          type="monotone"
          stroke="var(--color-respiratoryRate)"
          strokeWidth={2}
          dot={{ r: 3 }}
          connectNulls={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
