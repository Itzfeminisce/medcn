"use client"

import * as React from "react"

import {
  SymptomMultiSelect,
  type SelectedSymptom,
} from "@/registry/medcn/symptom-multi-select/symptom-multi-select"

const OPTIONS = [
  { id: "headache", label: "Headache" },
  { id: "nausea", label: "Nausea" },
  { id: "cough", label: "Cough" },
  { id: "fever", label: "Fever" },
  { id: "fatigue", label: "Fatigue" },
  { id: "dizziness", label: "Dizziness" },
  { id: "chest-pain", label: "Chest pain" },
  { id: "abdominal-pain", label: "Abdominal pain" },
]

export default function SymptomMultiSelectDemo() {
  const [value, setValue] = React.useState<SelectedSymptom[]>([
    { id: "headache", label: "Headache", severity: "moderate", duration: "2 days" },
    { id: "nausea", label: "Nausea" },
  ])

  return (
    <SymptomMultiSelect options={OPTIONS} value={value} onValueChange={setValue} />
  )
}
