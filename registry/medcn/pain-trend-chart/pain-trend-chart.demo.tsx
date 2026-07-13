"use client"

import { PainTrendChart } from "@/registry/medcn/pain-trend-chart/pain-trend-chart"

/**
 * The child moves from FLACC (observed) to self-reported NRS on day 2. Two
 * series, because a 6 on one is not a 6 on the other.
 */
const SCORES = [
  { time: "D1 08:00", score: 8, scale: "FLACC" },
  { time: "D1 12:00", score: 6, scale: "FLACC" },
  { time: "D1 20:00", score: 5, scale: "FLACC" },
  { time: "D2 08:00", score: 7, scale: "NRS 0–10" },
  { time: "D2 12:00", score: 4, scale: "NRS 0–10" },
  { time: "D2 20:00", score: 3, scale: "NRS 0–10" },
]

export default function PainTrendChartDemo() {
  return (
    <PainTrendChart
      className="max-w-2xl"
      data={SCORES}
      reviewThreshold={7}
      analgesia={[
        { time: "D1 08:00", label: "Morphine 2 mg" },
        { time: "D2 08:00", label: "Morphine 2 mg" },
      ]}
    />
  )
}
