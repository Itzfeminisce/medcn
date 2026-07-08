"use client"

import * as React from "react"

import {
  ReviewOfSystemsForm,
  type RosValue,
} from "@/registry/medcn/review-of-systems-form/review-of-systems-form"

const SYSTEMS = [
  {
    id: "constitutional",
    label: "Constitutional",
    symptoms: [
      { id: "fever", label: "Fever" },
      { id: "weight-loss", label: "Weight loss" },
      { id: "fatigue", label: "Fatigue" },
    ],
  },
  {
    id: "respiratory",
    label: "Respiratory",
    symptoms: [
      { id: "cough", label: "Cough" },
      { id: "dyspnea", label: "Shortness of breath" },
      { id: "wheeze", label: "Wheeze" },
    ],
  },
  {
    id: "cardiovascular",
    label: "Cardiovascular",
    symptoms: [
      { id: "chest-pain", label: "Chest pain" },
      { id: "palpitations", label: "Palpitations" },
      { id: "edema", label: "Ankle swelling" },
    ],
  },
]

export default function ReviewOfSystemsFormDemo() {
  const [value, setValue] = React.useState<RosValue>({
    cough: "yes",
    fever: "yes",
  })

  return (
    <ReviewOfSystemsForm systems={SYSTEMS} value={value} onValueChange={setValue} />
  )
}
