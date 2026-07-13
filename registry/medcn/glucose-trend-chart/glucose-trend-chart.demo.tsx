"use client"

import { GlucoseTrendChart } from "@/registry/medcn/glucose-trend-chart/glucose-trend-chart"

const READINGS = [
  { time: "06:00", glucose: 5.4, context: "Fasting" },
  { time: "09:00", glucose: 9.1, context: "Post-breakfast" },
  { time: "12:00", glucose: 7.2 },
  { time: "15:00", glucose: 3.4, context: "Pre-meal" },
  { time: "18:00", glucose: 6.8, context: "Post-treatment" },
  { time: "21:00", glucose: 8.4, context: "Post-dinner" },
]

export default function GlucoseTrendChartDemo() {
  return (
    <GlucoseTrendChart
      className="max-w-2xl"
      data={READINGS}
      unit="mmol/L"
      target={{ low: 3.9, high: 10 }}
      hypo={3.9}
      hyper={13.9}
      markers={[
        { time: "09:00", label: "Breakfast" },
        { time: "15:00", label: "Hypo treated" },
      ]}
    />
  )
}
