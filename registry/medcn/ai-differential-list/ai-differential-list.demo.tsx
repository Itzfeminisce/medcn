import {
  AiDifferentialList,
  type AiDifferentialConsideration,
} from "@/registry/medcn/ai-differential-list/ai-differential-list"
import { AiEscalationAlert } from "@/registry/medcn/ai-escalation-alert/ai-escalation-alert"
import { Button } from "@/registry/medcn/button/button"

const considerations: AiDifferentialConsideration[] = [
  {
    id: "cap",
    label: "Community-acquired pneumonia",
    likelihood: 62,
    supporting: [
      "Productive cough for 4 days, fever 38.4 °C recorded at triage",
      "Focal crackles documented at the right base",
    ],
    contradicting: ["No pleuritic pain reported", "SpO₂ 96% on air"],
    gather: ["Chest radiograph", "CRP and white cell count"],
  },
  {
    id: "pe",
    label: "Pulmonary embolism",
    likelihood: 14,
    supporting: [
      "Pleuritic-sounding chest discomfort noted in the free text",
      "Long-haul flight 6 days ago",
    ],
    contradicting: ["No unilateral leg swelling documented", "HR 88, regular"],
    gather: ["Wells score", "D-dimer if the score permits"],
    note: "Low model-reported likelihood does not lower the consequence of missing this. Score it explicitly rather than relying on the position of this row.",
  },
  {
    id: "copd",
    label: "COPD exacerbation",
    likelihood: 11,
    supporting: ["Smoking history of 30 pack-years in the record"],
    contradicting: ["No prior obstructive spirometry on file"],
    gather: ["Previous spirometry", "Baseline exercise tolerance"],
  },
]

export default function AiDifferentialListDemo() {
  return (
    <AiDifferentialList
      className="w-full max-w-lg"
      title="Considerations — cough and fever, 4 days"
      metadata="Drafted 10:12 · from triage note and vitals, 12 Mar"
      confidence="0.61"
      considerations={considerations}
      defaultExpanded={["cap"]}
      uncertainty="Generated from the triage note and the 12 Mar vitals only. No examination findings, imaging, or bloods were available; travel and drug history were read from free text and have not been confirmed."
      redFlags={
        <AiEscalationAlert severity="priority" title="Red flag in the record">
          Respiratory rate 24 and a documented long-haul flight within 7 days.
          These are surfaced separately, not ranked among the considerations.
          Apply your local PE and sepsis pathways.
        </AiEscalationAlert>
      }
      informationToGather={[
        "Formal respiratory examination and repeat observations",
        "Chest radiograph",
        "Wells score, then D-dimer if indicated",
      ]}
      actions={
        <>
          <Button size="sm">Review with the patient</Button>
          <Button size="sm" variant="outline">
            Add to working list
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Dismiss
          </Button>
        </>
      }
    />
  )
}
