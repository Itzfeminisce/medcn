"use client"

import * as React from "react"

import { AiContextPicker } from "@/registry/medcn/ai-context-picker/ai-context-picker"

export default function AiContextPickerDemo() {
  const [selected, setSelected] = React.useState<string[]>([
    "doc-discharge",
    "obs-bp",
  ])

  return (
    <div className="flex w-full max-w-md flex-col items-start gap-3">
      <AiContextPicker
        selected={selected}
        onSelectedChange={setSelected}
        heading="Attach context for Ada Nwosu"
        footnote="Only the items you attach are sent with your prompt. Attaching context is logged against your user ID."
        groups={[
          {
            id: "documents",
            label: "Documents",
            items: [
              {
                id: "doc-discharge",
                kind: "document",
                label: "Discharge summary — Cardiology",
                meta: "14 Mar 2026 · Dr A. Whitfield",
              },
              {
                id: "doc-clinic",
                kind: "document",
                label: "Clinic letter — Renal",
                meta: "2 Feb 2026 · Dr S. Iyer",
              },
              {
                id: "doc-mh",
                kind: "document",
                label: "Correspondence from a specialist service",
                restricted: true,
                restrictedReason:
                  "Restricted — your role does not include access to this service's records. Ask the responsible clinician if you need it.",
              },
              {
                id: "doc-imaging",
                kind: "document",
                label: "CT abdomen report",
                meta: "16 Mar 2026",
                unavailable: true,
                unavailableReason:
                  "The imaging system is not responding. Retry, or read the report in PACS.",
              },
            ],
          },
          {
            id: "observations",
            label: "Observations",
            items: [
              {
                id: "obs-bp",
                kind: "encounter",
                label: "Blood pressure trend",
                meta: "Last 6 readings · 128/78 on 14 Mar",
              },
              {
                id: "obs-egfr",
                kind: "encounter",
                label: "eGFR trend",
                meta: "Last 12 months · 48 on 10 Mar",
              },
            ],
          },
          {
            id: "medications",
            label: "Medications",
            items: [
              {
                id: "med-current",
                kind: "medication",
                label: "Current medications",
                meta: "7 active · reconciled 14 Mar",
              },
              {
                id: "med-allergies",
                kind: "medication",
                label: "Allergies and intolerances",
                meta: "Penicillin — rash",
              },
            ],
          },
        ]}
      />

      <p className="text-muted-foreground text-xs">
        {selected.length} item{selected.length === 1 ? "" : "s"} will be sent with
        the next prompt.
      </p>
    </div>
  )
}
