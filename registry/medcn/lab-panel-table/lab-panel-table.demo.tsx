"use client"

import { LabPanelTable } from "@/registry/medcn/lab-panel-table/lab-panel-table"

/**
 * The renal profile is marked `defaultCollapsed` — and stays open anyway,
 * because it holds a critical potassium.
 */
const GROUPS = [
  {
    key: "fbc",
    label: "Full blood count",
    defaultCollapsed: true,
    analytes: [
      {
        key: "hb",
        label: "Haemoglobin",
        value: 9.8,
        unit: "g/dL",
        flag: "low" as const,
        referenceLow: 12,
        referenceHigh: 15.5,
        prior: { value: 12.4, date: "06 Mar" },
        significantChange: 1,
        concerningDirection: "down" as const,
      },
      {
        key: "wcc",
        label: "White cell count",
        value: 11.2,
        unit: "×10⁹/L",
        flag: "high" as const,
        referenceLow: 4,
        referenceHigh: 11,
        prior: { value: 9.8, date: "06 Mar" },
      },
      {
        key: "plt",
        label: "Platelets",
        value: 264,
        unit: "×10⁹/L",
        referenceLow: 150,
        referenceHigh: 400,
        prior: { value: 258, date: "06 Mar" },
      },
    ],
  },
  {
    key: "renal",
    label: "Renal profile",
    defaultCollapsed: true,
    analytes: [
      {
        key: "k",
        label: "Potassium",
        value: 6.8,
        unit: "mmol/L",
        flag: "critical" as const,
        referenceLow: 3.5,
        referenceHigh: 5,
        prior: { value: 5.1, date: "06 Mar" },
        significantChange: 0.5,
        concerningDirection: "up" as const,
        detail: "Haemolysed sample — repeat requested",
      },
      {
        key: "creat",
        label: "Creatinine",
        value: 218,
        unit: "µmol/L",
        flag: "high" as const,
        referenceLow: 60,
        referenceHigh: 110,
        prior: { value: 152, date: "06 Mar" },
        significantChange: 20,
        concerningDirection: "up" as const,
      },
    ],
  },
]

export default function LabPanelTableDemo() {
  return (
    <LabPanelTable
      className="max-w-2xl"
      collectedAt="13 Mar 2026, 07:20 · Springfield General"
      groups={GROUPS}
    />
  )
}
