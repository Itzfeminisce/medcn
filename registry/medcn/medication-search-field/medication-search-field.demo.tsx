"use client"

import * as React from "react"

import {
  MedicationSearchField,
  type MedicationOption,
} from "@/registry/medcn/medication-search-field/medication-search-field"

const CATALOG: MedicationOption[] = [
  { id: "1", name: "Amoxicillin", strength: "500 mg", form: "capsule" },
  { id: "2", name: "Amoxicillin", strength: "250 mg/5 mL", form: "oral suspension" },
  { id: "3", name: "Amlodipine", strength: "5 mg", form: "tablet" },
  { id: "4", name: "Atorvastatin", strength: "20 mg", form: "tablet", brand: "Lipitor" },
  { id: "5", name: "Paracetamol", strength: "500 mg", form: "tablet", brand: "Panadol" },
  { id: "6", name: "Ibuprofen", strength: "400 mg", form: "tablet" },
]

export default function MedicationSearchFieldDemo() {
  const [selected, setSelected] = React.useState<MedicationOption | null>(null)

  async function search(q: string): Promise<MedicationOption[]> {
    // Simulate an async /drug-catalog lookup.
    await new Promise((r) => setTimeout(r, 200))
    return CATALOG.filter((m) =>
      m.name.toLowerCase().includes(q.toLowerCase())
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <MedicationSearchField onSearch={search} onSelect={setSelected} />
      {selected && (
        <p className="text-muted-foreground text-xs">
          Selected: <span className="text-foreground font-medium">{selected.name} {selected.strength}</span>
        </p>
      )}
    </div>
  )
}
