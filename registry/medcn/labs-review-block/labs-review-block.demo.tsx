"use client"

import { LabsReviewBlock } from "@/registry/medcn/labs-review-block/labs-review-block"

/** Potassium has two results — it is listed, not trended. Creatinine has six. */
export default function LabsReviewBlockDemo() {
  return (
    <div className="w-full overflow-hidden rounded-xl border">
      <LabsReviewBlock
        className="min-h-[620px]"
        title="Laboratory review · A. Okonkwo"
        panels={{
          collectedAt: "13 Mar 2026, 07:20 · Springfield General",
          groups: [
            {
              key: "renal",
              label: "Renal profile",
              analytes: [
                {
                  key: "creat",
                  label: "Creatinine",
                  value: 218,
                  unit: "µmol/L",
                  flag: "critical",
                  referenceLow: 60,
                  referenceHigh: 110,
                  prior: { value: 152, date: "26 Apr" },
                  significantChange: 20,
                  concerningDirection: "up",
                },
                {
                  key: "k",
                  label: "Potassium",
                  value: 6.8,
                  unit: "mmol/L",
                  flag: "high",
                  referenceLow: 3.5,
                  referenceHigh: 5,
                  prior: { value: 5.1, date: "06 Mar" },
                  significantChange: 0.5,
                  concerningDirection: "up",
                },
              ],
            },
          ],
        }}
        histories={[
          {
            key: "creat",
            analyte: "Creatinine",
            unit: "µmol/L",
            significantChange: 20,
            range: {
              low: 60,
              high: 110,
              criticalAbove: 200,
              label: "Adult female, serum",
            },
            data: [
              { date: "05 Jan", value: 82, assay: "Jaffe", flag: "normal" },
              { date: "02 Feb", value: 88, assay: "Jaffe", flag: "normal" },
              { date: "01 Mar", value: 94, assay: "Jaffe", flag: "high" },
              { date: "29 Mar", value: 138, assay: "Enzymatic", flag: "high" },
              { date: "26 Apr", value: 152, assay: "Enzymatic", flag: "high" },
              { date: "24 May", value: 218, assay: "Enzymatic", flag: "critical" },
            ],
          },
          {
            key: "k",
            analyte: "Potassium",
            unit: "mmol/L",
            data: [
              { date: "06 Mar", value: 5.1, flag: "high" },
              { date: "13 Mar", value: 6.8, flag: "critical" },
            ],
          },
        ]}
      />
    </div>
  )
}
