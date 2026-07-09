import { FallRiskIndicator } from "@/registry/medcn/fall-risk-indicator/fall-risk-indicator"
import { RiskScoresPanel } from "@/registry/medcn/risk-scores-panel/risk-scores-panel"

export default function RiskScoresPanelDemo() {
  return (
    <RiskScoresPanel
      className="w-full max-w-lg"
      info="Scores recalculated at each encounter."
      scores={[
        {
          label: "ASCVD 10-yr",
          value: "6.2%",
          band: "low",
          scale: "Pooled Cohort Equations.",
          caption: "14 Jul",
        },
        {
          label: "Readmission",
          value: "18%",
          band: "moderate",
          scale: "LACE index, 30-day.",
          caption: "At discharge",
        },
        {
          label: "qSOFA",
          value: "3",
          band: "critical",
          percent: 100,
          scale: "qSOFA 0–3; ≥2 is high risk.",
          caption: "12:40",
        },
      ]}
      extras={
        <FallRiskIndicator
          band="moderate"
          scale="Morse"
          score={45}
          maxScore={125}
          assessedAt="2026-07-07"
        />
      }
    />
  )
}
