"use client"

import { LabResultChart } from "@/registry/medcn/lab-result-chart/lab-result-chart"

/**
 * The laboratory changed platform in March. The apparent step up is the assay,
 * not the patient — so the line breaks there and no delta is offered across it.
 */
const RESULTS = [
  { date: "05 Jan", value: 82, assay: "Jaffe", flag: "normal" as const },
  { date: "02 Feb", value: 88, assay: "Jaffe", flag: "normal" as const },
  { date: "01 Mar", value: 94, assay: "Jaffe", flag: "high" as const },
  { date: "29 Mar", value: 138, assay: "Enzymatic", flag: "high" as const },
  { date: "26 Apr", value: 152, assay: "Enzymatic", flag: "high" as const },
  { date: "24 May", value: 218, assay: "Enzymatic", flag: "critical" as const },
]

export default function LabResultChartDemo() {
  return (
    <LabResultChart
      className="max-w-2xl"
      analyte="Creatinine"
      data={RESULTS}
      unit="µmol/L"
      significantChange={20}
      range={{
        low: 60,
        high: 110,
        criticalAbove: 200,
        label: "Adult female, serum",
      }}
    />
  )
}
