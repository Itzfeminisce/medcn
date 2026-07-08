"use client"

import { HeightWeightField } from "@/registry/medcn/height-weight-field/height-weight-field"

export default function HeightWeightFieldDemo() {
  return (
    <HeightWeightField
      defaultValue={{ heightCm: 175, weightKg: 72 }}
      onValueChange={(v) => console.log(v)}
    />
  )
}
