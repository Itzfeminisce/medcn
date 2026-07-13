"use client"

import { GrowthChart } from "@/registry/medcn/growth-chart/growth-chart"

/**
 * Illustrative curves only — a real product passes the reference's own published
 * values. They are never bundled with the component.
 */
const PERCENTILES = [
  {
    label: "P3",
    data: [
      { x: 0, y: 2.4 }, { x: 3, y: 4.6 }, { x: 6, y: 5.8 },
      { x: 9, y: 6.6 }, { x: 12, y: 7.1 }, { x: 18, y: 8.2 }, { x: 24, y: 9.0 },
    ],
  },
  {
    label: "P50",
    emphasis: true,
    data: [
      { x: 0, y: 3.2 }, { x: 3, y: 5.8 }, { x: 6, y: 7.3 },
      { x: 9, y: 8.2 }, { x: 12, y: 8.9 }, { x: 18, y: 10.2 }, { x: 24, y: 11.5 },
    ],
  },
  {
    label: "P97",
    data: [
      { x: 0, y: 4.2 }, { x: 3, y: 7.2 }, { x: 6, y: 9.0 },
      { x: 9, y: 10.1 }, { x: 12, y: 11.0 }, { x: 18, y: 12.6 }, { x: 24, y: 14.1 },
    ],
  },
]

/** Plotted at corrected age — born at 32 weeks. */
const CHILD = [
  { x: 0, y: 1.8, percentile: 3, date: "04 Jan 2025" },
  { x: 3, y: 4.4, percentile: 5, date: "06 Apr 2025" },
  { x: 6, y: 6.1, percentile: 15, date: "05 Jul 2025" },
  { x: 9, y: 7.4, percentile: 25, date: "04 Oct 2025" },
  { x: 12, y: 8.4, percentile: 33, date: "06 Jan 2026" },
]

export default function GrowthChartDemo() {
  return (
    <GrowthChart
      className="max-w-2xl"
      measure="weight"
      data={CHILD}
      percentiles={PERCENTILES}
      reference="WHO 0–2 years, girls"
      unit="kg"
      xUnit="months"
      correctedAge
      gestationAtBirth="32 weeks"
    />
  )
}
