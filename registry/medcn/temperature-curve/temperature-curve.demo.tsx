"use client"

import { TemperatureCurve } from "@/registry/medcn/temperature-curve/temperature-curve"

/**
 * The axillary readings sit below the tympanic ones. Plotted as one line, the
 * 14:00 switch of route would read as a defervescence that never happened.
 */
const READINGS = [
  { time: "06:00", temperature: 38.4, route: "tympanic" as const },
  { time: "10:00", temperature: 39.1, route: "tympanic" as const },
  { time: "14:00", temperature: 38.2, route: "axillary" as const },
  { time: "18:00", temperature: 37.9, route: "axillary" as const },
  { time: "22:00", temperature: 38.6, route: "tympanic" as const },
]

export default function TemperatureCurveDemo() {
  return (
    <TemperatureCurve
      className="max-w-2xl"
      data={READINGS}
      unit="°C"
      feverThreshold={38}
      range={{ low: 36.1, high: 37.5, label: "Normal (adult)" }}
      antipyretics={[{ time: "10:00", label: "Paracetamol 1 g" }]}
    />
  )
}
