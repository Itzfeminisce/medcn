"use client"

import { GlucoseLogInput } from "@/registry/medcn/glucose-log-input/glucose-log-input"

export default function GlucoseLogInputDemo() {
  return (
    <GlucoseLogInput
      defaultValue={{ value: 8.9, unit: "mmol/L", context: "post-meal" }}
      onValueChange={(v) => console.log(v)}
    />
  )
}
