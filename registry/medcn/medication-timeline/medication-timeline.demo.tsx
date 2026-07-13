"use client"

import { MedicationTimeline } from "@/registry/medcn/medication-timeline/medication-timeline"

/** The same time axis a vitals chart would use, so the two can be read together. */
const TIMES = ["06:00", "10:00", "14:00", "18:00", "22:00"]

/**
 * Three held metoprolol doses. A strip that showed only what was given would
 * answer "what did we administer?" and hide why the heart rate is climbing.
 */
const MEDICATIONS = [
  {
    key: "metoprolol",
    label: "Metoprolol 12.5 mg",
    doses: [
      { time: "06:00", state: "given" as const, detail: "12.5 mg PO" },
      { time: "10:00", state: "held" as const, detail: "Held — SBP 92" },
      { time: "14:00", state: "held" as const, detail: "Held — SBP 88" },
      { time: "18:00", state: "held" as const, detail: "Held — SBP 90" },
      { time: "22:00", state: "scheduled" as const, detail: "Due 22:00" },
    ],
  },
  {
    key: "furosemide",
    label: "Furosemide 40 mg",
    doses: [
      { time: "06:00", state: "given" as const, detail: "40 mg IV" },
      { time: "14:00", state: "given" as const, detail: "40 mg IV" },
    ],
  },
  {
    key: "paracetamol",
    label: "Paracetamol 1 g",
    doses: [
      { time: "06:00", state: "given" as const },
      { time: "10:00", state: "refused" as const, detail: "Patient declined" },
      { time: "14:00", state: "missed" as const, detail: "Not administered" },
      { time: "18:00", state: "given" as const },
    ],
  },
]

export default function MedicationTimelineDemo() {
  return (
    <MedicationTimeline
      caption="Doses · 12 Mar · aligns with the vitals time axis above it"
      times={TIMES}
      medications={MEDICATIONS}
    />
  )
}
