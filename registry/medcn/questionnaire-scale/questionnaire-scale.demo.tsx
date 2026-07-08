"use client"

import * as React from "react"

import { QuestionnaireScale } from "@/registry/medcn/questionnaire-scale/questionnaire-scale"

const OPTIONS = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half", value: 2 },
  { label: "Nearly every day", value: 3 },
]

const ITEMS = [
  { id: "interest", text: "Little interest or pleasure in doing things" },
  { id: "down", text: "Feeling down, depressed, or hopeless" },
  { id: "sleep", text: "Trouble falling or staying asleep, or sleeping too much" },
  { id: "harm", text: "Thoughts that you would be better off dead", critical: true },
]

const BANDS = [
  { min: 0, max: 2, label: "Minimal", variant: "success" as const },
  { min: 3, max: 5, label: "Mild", variant: "default" as const },
  { min: 6, max: 8, label: "Moderate", variant: "warning" as const },
  { min: 9, max: 12, label: "Severe", variant: "destructive" as const },
]

export default function QuestionnaireScaleDemo() {
  const [answers, setAnswers] = React.useState<Record<string, number>>({
    interest: 2,
    down: 1,
  })

  return (
    <QuestionnaireScale
      items={ITEMS}
      options={OPTIONS}
      bands={BANDS}
      value={answers}
      onValueChange={setAnswers}
    />
  )
}
