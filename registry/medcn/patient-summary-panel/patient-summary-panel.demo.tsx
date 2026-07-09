import { ActivityIcon, HeartPulseIcon } from "lucide-react"

import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { PatientSummaryPanel } from "@/registry/medcn/patient-summary-panel/patient-summary-panel"

export default function PatientSummaryPanelDemo() {
  return (
    <PatientSummaryPanel
      className="w-full max-w-2xl"
      patient={{
        name: "Adaeze Nwosu",
        dob: "1992-03-12",
        sex: "female",
        mrn: "PT-048291",
        allergies: [
          { label: "Penicillin", severity: "severe", reaction: "Anaphylaxis" },
          { label: "Latex", severity: "moderate" },
        ],
        tags: <Badge variant="soft">28 weeks pregnant</Badge>,
        actions: (
          <Button size="sm" variant="outline">
            Open chart
          </Button>
        ),
      }}
      vitals={[
        {
          label: "Heart rate",
          icon: <HeartPulseIcon />,
          value: "72",
          unit: "bpm",
          status: "normal",
          time: "08:04",
        },
        {
          label: "Blood pressure",
          icon: <ActivityIcon />,
          value: "138/89",
          unit: "mmHg",
          status: "elevated",
          time: "08:06",
        },
      ]}
      problems={[
        { name: "Type 2 diabetes mellitus", code: "E11.9", status: "active", severity: "moderate", onset: "Since 2019" },
        { name: "Essential hypertension", code: "I10", status: "active", severity: "mild" },
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
        },
      ]}
    />
  )
}
