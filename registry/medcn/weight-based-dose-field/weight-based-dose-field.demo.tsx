"use client"

import { WeightBasedDoseField } from "@/registry/medcn/weight-based-dose-field/weight-based-dose-field"

export default function WeightBasedDoseFieldDemo() {
  return (
    <WeightBasedDoseField
      defaultValue={{ mgPerKg: 15, weightKg: 18 }}
      maxDose={200}
      roundTo={25}
      unit="mg"
      onValueChange={(v) => console.log(v)}
    />
  )
}
