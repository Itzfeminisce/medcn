"use client"

import { WeightTrendChart } from "@/registry/medcn/weight-trend-chart/weight-trend-chart"

const WEIGHTS = [
  { date: "01 Feb", weight: 78.2 },
  { date: "08 Feb", weight: 79.6 },
  { date: "15 Feb", weight: 81.1 },
  { date: "22 Feb", weight: 82.4 },
  { date: "01 Mar", weight: 83.9 },
]

export default function WeightTrendChartDemo() {
  return (
    <WeightTrendChart
      className="max-w-2xl"
      data={WEIGHTS}
      unit="kg"
      deltaNote="Daily weights, heart failure clinic — the caller supplies this reading of the change, not the chart."
    />
  )
}
