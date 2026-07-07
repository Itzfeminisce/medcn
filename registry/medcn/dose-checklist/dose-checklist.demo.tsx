"use client"

import * as React from "react"

import {
  DoseChecklist,
  type DoseItem,
} from "@/registry/medcn/dose-checklist/dose-checklist"

const initialDoses: DoseItem[] = [
  { id: 1, name: "Metformin", dose: "500 mg", time: "8:00 AM", taken: true },
  { id: 2, name: "Lisinopril", dose: "10 mg", time: "8:00 AM", taken: true },
  { id: 3, name: "Atorvastatin", dose: "20 mg", time: "9:00 PM" },
  { id: 4, name: "Vitamin D", dose: "1000 IU", time: "9:00 PM" },
]

export default function DoseChecklistDemo() {
  const [doses, setDoses] = React.useState(initialDoses)

  return (
    <DoseChecklist
      doses={doses}
      onToggle={(dose, taken) =>
        setDoses((prev) =>
          prev.map((d) => (d.id === dose.id ? { ...d, taken } : d))
        )
      }
    />
  )
}
