"use client"

import { IntakeOutputChart } from "@/registry/medcn/intake-output-chart/intake-output-chart"

/**
 * The 12:00–16:00 output was not fully charted. The bar is hollow and the net
 * balance is marked unreliable — otherwise this patient reads as 1.4 L positive
 * and gets a diuretic they may not need.
 */
const PERIODS = [
  { period: "00:00–04:00", intake: 250, output: 320 },
  { period: "04:00–08:00", intake: 400, output: 280 },
  { period: "08:00–12:00", intake: 620, output: 350 },
  { period: "12:00–16:00", intake: 580, output: 90, outputIncomplete: true },
  { period: "16:00–20:00", intake: 300, output: 260 },
]

export default function IntakeOutputChartDemo() {
  return (
    <IntakeOutputChart
      className="max-w-2xl"
      data={PERIODS}
      unit="mL"
      label="Fluid balance · 12 Mar"
    />
  )
}
