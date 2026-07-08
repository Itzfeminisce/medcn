"use client"

import { TemperatureField } from "@/registry/medcn/temperature-field/temperature-field"

export default function TemperatureFieldDemo() {
  return (
    <TemperatureField
      defaultValue={38.2}
      site="Axillary"
      onValueChange={(c) => console.log(c)}
    />
  )
}
