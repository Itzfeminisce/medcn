"use client"

import * as React from "react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export default function ToggleGroupDemo() {
  const [unit, setUnit] = React.useState("metric")

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={unit}
      onValueChange={(v) => v && setUnit(v)}
      className="w-56"
    >
      <ToggleGroupItem value="metric">Metric (kg/cm)</ToggleGroupItem>
      <ToggleGroupItem value="imperial">Imperial (lb/in)</ToggleGroupItem>
    </ToggleGroup>
  )
}
