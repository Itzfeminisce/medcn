"use client"

import { ActivityIcon, HeartPulseIcon, ThermometerIcon } from "lucide-react"

import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { PatientChartBlock } from "@/registry/medcn/patient-chart-block/patient-chart-block"

const patient = {
  name: "Adaeze Nwosu",
  dob: "1992-03-12",
  sex: "female" as const,
  mrn: "PT-048291",
  allergies: [
    { label: "Penicillin", severity: "severe" as const, reaction: "Anaphylaxis" },
    { label: "Latex", severity: "moderate" as const },
  ],
  tags: <Badge variant="soft">28 weeks pregnant</Badge>,
}

const vitals = [
  { label: "Heart rate", icon: <HeartPulseIcon />, value: "72", unit: "bpm", status: "normal" as const, time: "08:04" },
  { label: "Blood pressure", icon: <ActivityIcon />, value: "138/89", unit: "mmHg", status: "elevated" as const, time: "08:06" },
  { label: "Temperature", icon: <ThermometerIcon />, value: "36.8", unit: "°C", status: "normal" as const, time: "08:04" },
]

const problems = [
  { name: "Type 2 diabetes mellitus", code: "E11.9", status: "active" as const, severity: "moderate" as const, onset: "Since 2019" },
  { name: "Essential hypertension", code: "I10", status: "active" as const, severity: "mild" as const },
  { name: "Community-acquired pneumonia", code: "J18.9", status: "resolved" as const, onset: "Mar 2024" },
]

const medications = [
  {
    drugName: "Lisinopril",
    strength: "10 mg tablet",
    sig: "Take 1 tablet once daily in the morning.",
    quantity: "28 tablets",
    refillsRemaining: 3,
    prescriber: "Dr. A. Okafor",
    issuedDate: "2026-05-02",
    status: "active" as const,
  },
  {
    drugName: "Metformin",
    strength: "500 mg tablet",
    sig: "Take 1 tablet twice daily with meals.",
    quantity: "56 tablets",
    refillsRemaining: 1,
    prescriber: "Dr. A. Okafor",
    issuedDate: "2026-06-01",
    status: "active" as const,
  },
]

const labs = [
  {
    label: "HbA1c",
    value: 7.1,
    unit: "%",
    referenceMin: 4,
    referenceMax: 5.6,
    showRangeBar: true,
    history: [
      { value: 8.4, date: "2026-01-10" },
      { value: 7.9, date: "2026-03-12" },
      { value: 7.1, date: "2026-07-05" },
    ],
  },
  {
    label: "eGFR",
    value: 58,
    unit: "mL/min",
    referenceMin: 60,
    referenceMax: 120,
    history: [
      { value: 72, date: "2026-01-10" },
      { value: 58, date: "2026-07-05" },
    ],
  },
]

const encounters = [
  { type: "office" as const, title: "Hypertension follow-up — Dr. Adeyemi", meta: "Outpatient · Rm 4", date: "14 Jul", summary: "BP 128/82. Continue lisinopril." },
  { type: "lab" as const, title: "Metabolic panel resulted", date: "9 Jul", summary: "HbA1c 6.1% · Lipid panel in range." },
  { type: "ed" as const, title: "Chest pain", meta: "Emergency · Dr. Okoro", date: "2 Jun", summary: "ACS ruled out." },
]

export default function PatientChartBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-border">
      <PatientChartBlock
        className="min-h-[640px]"
        summary={{
          patient: {
            ...patient,
            actions: (
              <Button size="sm" variant="outline">
                Open chart
              </Button>
            ),
          },
          vitals,
          problems,
          medications,
        }}
        vitals={{ vitals, info: "Latest bedside readings." }}
        medications={{
          medications,
          adherence: {
            data: [2, 1, 2, 2, 2, 1, 2].map((taken, i) => ({
              date: `2026-07-0${i + 1}`,
              taken,
              scheduled: 2,
            })),
            windowLabel: "7 days",
          },
        }}
        problems={{ items: problems }}
        allergies={{ allergies: patient.allergies }}
        labs={{ results: labs }}
        encounters={{ items: encounters }}
      />
    </div>
  )
}
