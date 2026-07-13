"use client"

import { VitalsTrendChart } from "@/registry/medcn/vitals-trend-chart/vitals-trend-chart"

/** No reading at 12:00 — the ward round ran late. The gap is drawn as a gap. */
const OBSERVATIONS = [
  { time: "06:00", heartRate: 76, respiratoryRate: 15, spo2: 97 },
  { time: "08:00", heartRate: 82, respiratoryRate: 16, spo2: 96 },
  { time: "10:00", heartRate: 94, respiratoryRate: 20, spo2: 94 },
  { time: "12:00", heartRate: null, respiratoryRate: null, spo2: null },
  { time: "14:00", heartRate: 108, respiratoryRate: 24, spo2: 91 },
  { time: "16:00", heartRate: 101, respiratoryRate: 22, spo2: 93 },
]

export default function VitalsTrendChartDemo() {
  return (
    <VitalsTrendChart
      label="Heart rate, respiratory rate and oxygen saturation, 06:00 to 16:00"
      caption="Ward round 12:00 missed — no observations recorded. Panels share one time axis; each keeps its own scale."
      data={OBSERVATIONS}
      events={[{ x: "14:00", label: "Escalated" }]}
      series={[
        {
          key: "heartRate",
          label: "Heart rate",
          unit: "bpm",
          domain: [50, 130],
          range: { low: 60, high: 100, label: "Adult, at rest" },
        },
        {
          key: "respiratoryRate",
          label: "Respiratory rate",
          unit: "breaths/min",
          domain: [8, 30],
          range: { low: 12, high: 20, label: "Adult, at rest" },
        },
        {
          key: "spo2",
          label: "Oxygen saturation",
          unit: "%",
          domain: [85, 100],
          range: { low: 94, criticalBelow: 90, label: "On room air" },
        },
      ]}
    />
  )
}
