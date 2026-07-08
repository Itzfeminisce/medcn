"use client"

import * as React from "react"

import {
  DosageBuilder,
  type DosageSig,
} from "@/registry/medcn/dosage-builder/dosage-builder"

export default function DosageBuilderDemo() {
  const [sig, setSig] = React.useState<DosageSig>({
    amount: 1,
    unit: "tab",
    route: "PO",
    frequency: "TDS",
    prn: true,
    indication: "pain",
  })

  return <DosageBuilder value={sig} onValueChange={setSig} />
}
