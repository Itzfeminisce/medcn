"use client"

import * as React from "react"

import { Button } from "@/registry/medcn/button/button"
import { type DoseItem } from "@/registry/medcn/dose-checklist/dose-checklist"
import { MedicationManagementBlock } from "@/registry/medcn/medication-management-block/medication-management-block"

export default function MedicationManagementBlockDemo() {
  const [doses, setDoses] = React.useState<DoseItem[]>([
    { id: 1, name: "Metformin", dose: "500 mg", time: "8:00 AM", taken: true },
    { id: 2, name: "Lisinopril", dose: "10 mg", time: "8:00 AM", taken: true },
    { id: 3, name: "Atorvastatin", dose: "20 mg", time: "9:00 PM" },
  ])

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <MedicationManagementBlock
        className="min-h-[600px]"
        medications={{
          interactions: [
            { severity: "moderate", drugs: ["Lisinopril", "Ibuprofen"], description: "NSAIDs blunt the antihypertensive effect.", onDismiss: () => {} },
          ],
          medications: [
            { drugName: "Lisinopril", strength: "10 mg tablet", sig: "1 tablet each morning", quantity: "28 tablets", refillsRemaining: 3, prescriber: "Dr. Adeyemi", issuedDate: "2026-05-02", status: "active", actions: <Button size="sm" variant="outline">Refill</Button> },
            { drugName: "Metformin", strength: "500 mg tablet", sig: "1 tablet twice daily with meals", quantity: "56 tablets", refillsRemaining: 1, prescriber: "Dr. Adeyemi", issuedDate: "2026-06-01", status: "active" },
          ],
          adherence: {
            data: [2, 1, 2, 2, 2, 1, 2].map((taken, i) => ({ date: `2026-07-0${i + 1}`, taken, scheduled: 2 })),
            windowLabel: "7 days",
          },
        }}
        doses={{
          doses,
          onToggle: (dose, taken) =>
            setDoses((prev) => prev.map((d) => (d.id === dose.id ? { ...d, taken } : d))),
        }}
        schedule={[
          { medication: "Metformin 500 mg", doses: [ { time: "08:00", status: "taken", label: "With breakfast" }, { time: "13:00", status: "taken" }, { time: "18:00", status: "due" } ] },
          { medication: "Atorvastatin 20 mg", doses: [ { time: "21:00", status: "due" } ] },
        ]}
        appointments={{
          title: "Medication reviews",
          items: [
            { time: "24 Jul", duration: "09:00", patient: { name: "Dr. Adeyemi" }, type: "Medication review", location: "Rm 4", status: "scheduled", actions: <Button size="sm" variant="outline">Reschedule</Button> },
          ],
        }}
      />
    </div>
  )
}
