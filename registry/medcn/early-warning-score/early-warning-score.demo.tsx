"use client"

import { EarlyWarningScore } from "@/registry/medcn/early-warning-score/early-warning-score"

/** Scored by the consumer's validated NEWS2 implementation — not by this component. */
const HISTORY = [
  { time: "06:00", score: 1 },
  { time: "10:00", score: 3 },
  { time: "14:00", score: 5 },
  { time: "18:00", score: null },
  { time: "22:00", score: 8 },
]

const PARAMETERS = [
  { label: "Respiratory rate", value: "28 breaths/min", points: 3 },
  { label: "SpO₂", value: "89%", points: 2 },
  { label: "Supplemental oxygen", value: "2 L nasal", points: 2 },
  { label: "Systolic BP", value: "92 mmHg", points: 1 },
  { label: "Heart rate", value: "124 bpm", points: 0 },
  { label: "Consciousness", value: "Alert", points: 0 },
  { label: "Temperature", value: "38.9 °C", points: 0 },
]

export default function EarlyWarningScoreDemo() {
  return (
    <EarlyWarningScore
      className="max-w-2xl"
      system="NEWS2"
      score={8}
      band="high"
      escalationThreshold={7}
      guidance="Urgent review by a clinician with critical-care competencies. Follow local protocol."
      parameters={PARAMETERS}
      history={HISTORY}
    />
  )
}
