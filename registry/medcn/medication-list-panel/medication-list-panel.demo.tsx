"use client"

import { Button } from "@/registry/medcn/button/button"
import { MedicationListPanel } from "@/registry/medcn/medication-list-panel/medication-list-panel"

const week = [2, 1, 2, 2, 2, 1, 2].map((taken, i) => ({
  date: `2026-07-0${i + 1}`,
  taken,
  scheduled: 2,
}))

export default function MedicationListPanelDemo() {
  return (
    <MedicationListPanel
      className="w-full max-w-lg"
      adherence={{ data: week, windowLabel: "7 days" }}
      interactions={[
        {
          severity: "moderate",
          drugs: ["Lisinopril", "Ibuprofen"],
          description:
            "NSAIDs can blunt the antihypertensive effect and worsen renal function.",
          onDismiss: () => {},
        },
      ]}
      medications={[
        {
          drugName: "Lisinopril",
          strength: "10 mg tablet",
          sig: "Take 1 tablet once daily in the morning.",
          quantity: "28 tablets",
          refillsRemaining: 3,
          prescriber: "Dr. A. Okafor",
          issuedDate: "2026-05-02",
          status: "active",
          actions: (
            <Button size="sm" variant="outline">
              Request refill
            </Button>
          ),
        },
        {
          drugName: "Metformin",
          strength: "500 mg tablet",
          sig: "Take 1 tablet twice daily with meals.",
          quantity: "56 tablets",
          refillsRemaining: 1,
          prescriber: "Dr. A. Okafor",
          issuedDate: "2026-06-01",
          status: "active",
        },
      ]}
    />
  )
}
