"use client"

import * as React from "react"

import { UnitToggle } from "@/registry/medcn/unit-toggle/unit-toggle"

/** The caller owns the conversion — and its rounding. */
const GLUCOSE_MMOL = 7.8
const MMOL_TO_MGDL = 18.0182

export default function UnitToggleDemo() {
  const [unit, setUnit] = React.useState("mmol/L")

  const value =
    unit === "mmol/L"
      ? GLUCOSE_MMOL.toFixed(1)
      : Math.round(GLUCOSE_MMOL * MMOL_TO_MGDL).toString()

  return (
    <div className="flex flex-col items-start gap-3">
      <div className="flex items-baseline gap-1.5">
        <span className="font-mono text-3xl font-semibold tabular-nums">
          {value}
        </span>
        {/* The unit travels with the number, always. */}
        <span className="text-muted-foreground text-sm">{unit}</span>
      </div>

      <UnitToggle
        label="Glucose display unit"
        units={[
          { value: "mmol/L", description: "millimoles per litre" },
          { value: "mg/dL", description: "milligrams per decilitre" },
        ]}
        value={unit}
        onValueChange={setUnit}
      />

      <p className="text-muted-foreground max-w-xs text-xs">
        Fasting glucose, 12 Mar 08:05. The same reading, two units — 7.8 mmol/L
        and 141 mg/dL are one value, not two.
      </p>
    </div>
  )
}
