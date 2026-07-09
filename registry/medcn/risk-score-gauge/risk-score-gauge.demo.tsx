import { RiskScoreGauge } from "@/registry/medcn/risk-score-gauge/risk-score-gauge"

export default function RiskScoreGaugeDemo() {
  return (
    <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
      <RiskScoreGauge
        interactive
        label="ASCVD 10-yr"
        value="6.2%"
        band="low"
        scale="Pooled Cohort Equations. Low <5%, borderline 5–7.5%, intermediate 7.5–20%, high ≥20%."
        caption="Updated 14 Jul"
      />
      <RiskScoreGauge
        interactive
        label="Readmission"
        value="18%"
        band="moderate"
        scale="LACE index 30-day readmission risk."
        caption="At discharge"
      />
      <RiskScoreGauge
        interactive
        label="Sepsis (qSOFA)"
        value="3"
        band="critical"
        percent={100}
        scale="qSOFA 0–3. Score ≥2 suggests high risk of poor outcome — escalate."
        caption="12:40"
      />
    </div>
  )
}
