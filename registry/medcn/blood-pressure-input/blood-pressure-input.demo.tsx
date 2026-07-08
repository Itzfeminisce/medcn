"use client"

import * as React from "react"

import {
  BloodPressureInput,
  type BloodPressureValue,
} from "@/registry/medcn/blood-pressure-input/blood-pressure-input"

export default function BloodPressureInputDemo() {
  const [bp, setBp] = React.useState<BloodPressureValue>({
    systolic: 134,
    diastolic: 86,
  })

  return <BloodPressureInput value={bp} onValueChange={setBp} />
}
