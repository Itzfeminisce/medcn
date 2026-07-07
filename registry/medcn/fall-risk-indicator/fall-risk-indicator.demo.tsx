import { FallRiskIndicator } from "@/registry/medcn/fall-risk-indicator/fall-risk-indicator"

export default function FallRiskIndicatorDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <FallRiskIndicator
        band="low"
        scale="Morse"
        score={20}
        maxScore={125}
        assessedAt="2026-07-07"
      />
      <FallRiskIndicator
        band="moderate"
        scale="Morse"
        score={45}
        maxScore={125}
        assessedAt="2026-07-06"
      />
      <FallRiskIndicator
        band="high"
        scale="Hendrich II"
        score={7}
        maxScore={16}
        assessedAt="2026-07-07"
      />
      <FallRiskIndicator band="moderate" scale="Morse" score={40} size="sm" />
    </div>
  )
}
