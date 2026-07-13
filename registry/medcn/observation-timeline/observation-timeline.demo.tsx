import { ObservationTimeline } from "@/registry/medcn/observation-timeline/observation-timeline"

/**
 * A device reading, a patient's own report, and a clinician's assessment sit in
 * one stream — each labelled, because they do not carry the same weight.
 */
const OBSERVATIONS = [
  {
    key: "obs-1",
    kind: "vital" as const,
    source: "device" as const,
    time: "12 Mar · 22:00",
    title: "Heart rate 124 bpm",
    description: "Bedside monitor, continuous.",
    flagged: true,
    trend: {
      value: 124,
      unit: "bpm",
      data: [78, 84, 92, 98, 108, 116, 124],
      thresholdMax: 100,
      color: "destructive" as const,
    },
  },
  {
    key: "obs-2",
    kind: "result" as const,
    source: "system" as const,
    time: "12 Mar · 21:40",
    title: "Potassium 6.8 mmol/L — critical",
    description: "Haemolysed sample; repeat requested.",
    flagged: true,
  },
  {
    key: "obs-3",
    kind: "note" as const,
    source: "clinician" as const,
    author: "Dr S. Chen",
    time: "12 Mar · 20:15",
    title: "Evening review",
    description:
      "Increasing oxygen requirement. For repeat gas and senior review if NEWS2 rises further.",
  },
  {
    key: "obs-4",
    kind: "vital" as const,
    source: "patient" as const,
    time: "12 Mar · 19:50",
    title: "Breathlessness reported as worse",
    description: "Patient-reported, not measured.",
  },
  {
    key: "obs-5",
    kind: "medication" as const,
    source: "clinician" as const,
    author: "Nurse A.M.",
    time: "12 Mar · 18:00",
    title: "Metoprolol 12.5 mg held",
    description: "Held for systolic 90 mmHg.",
  },
]

export default function ObservationTimelineDemo() {
  return (
    <div className="max-w-lg">
      <ObservationTimeline observations={OBSERVATIONS} />
    </div>
  )
}
