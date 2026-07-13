"use client"

import { AiSummary } from "@/registry/medcn/ai-summary/ai-summary"
import { AiCitation } from "@/registry/medcn/ai-citation/ai-citation"
import { Button } from "@/registry/medcn/button/button"

export default function AiSummaryDemo() {
  return (
    <AiSummary
      className="w-full max-w-xl"
      title="Pre-visit summary — R. Okafor, 64"
      metadata="Drafted 08:41 · from 3 encounter notes and the 4 Mar vitals"
      confidence="0.72"
      limitations="Built from encounter notes and vitals only. Medication list, allergies, imaging, and outside records were not read."
      sections={[
        {
          id: "history",
          heading: "Interval history",
          content:
            "Seen twice since the February review. Reports that exertional breathlessness has settled since the dose change on 4 Feb, and describes walking to the shops without stopping. No orthopnoea, no paroxysmal nocturnal dyspnoea, no ankle swelling documented at either visit.",
          provenance: (
            <div className="flex flex-wrap gap-1.5">
              <AiCitation
                index={1}
                title="Encounter note · 12 Mar"
                publisher="Cardiology clinic"
                date="12 Mar 2026"
                locator="History of presenting complaint"
                excerpt="Walks to the shops without stopping. Denies orthopnoea or ankle swelling."
              />
              <AiCitation
                index={2}
                title="Encounter note · 4 Feb"
                publisher="Cardiology clinic"
                date="4 Feb 2026"
                locator="Plan"
              />
            </div>
          ),
        },
        {
          id: "findings",
          heading: "Recorded findings",
          content:
            "BP 128/78 (12 Mar), down from 152/94 in February. HR 72 and regular. Weight steady at 81 kg across both visits. Chest documented as clear on auscultation.",
          uncertainty:
            "The February reading was taken at a home visit and the March reading in clinic; the two were not measured on the same device.",
          provenance: (
            <div className="flex flex-wrap gap-1.5">
              <AiCitation
                index={3}
                title="Vitals · 12 Mar"
                publisher="Clinic observations"
                date="12 Mar 2026"
                locator="BP 128/78, HR 72"
              />
              <AiCitation
                index={4}
                title="Vitals · 4 Feb"
                publisher="Home visit"
                date="4 Feb 2026"
                state="stale"
                locator="BP 152/94"
              />
            </div>
          ),
        },
        {
          id: "open-questions",
          heading: "Open questions for the clinician",
          content:
            "Neither note records whether the potassium check requested on 4 Feb was completed. The March note refers to “bloods chased” without a result.",
        },
        {
          id: "medications",
          heading: "Medications",
          status: "omitted",
          statusDetail:
            "The medication list was not read. This is a gap in the summary, not a statement that the patient takes nothing.",
        },
        {
          id: "safeguarding",
          heading: "Social and safeguarding concerns",
          status: "empty",
          statusDetail:
            "Both notes were read; neither records a social or safeguarding concern.",
          provenance: (
            <div className="flex flex-wrap gap-1.5">
              <AiCitation
                index={5}
                title="Encounter note · 12 Mar"
                publisher="Cardiology clinic"
                date="12 Mar 2026"
                locator="Social history — blank"
              />
            </div>
          ),
        },
        {
          id: "problem-list",
          heading: "Problem list",
          status: "verbatim",
          content:
            "Hypertension (2019). Type 2 diabetes (2021). Chronic kidney disease, stage 3a (2024).",
        },
      ]}
      onCopySection={(section) => console.log("copy", section.id)}
      onInsertSection={(section) => console.log("insert", section.id)}
      actions={
        <>
          <Button size="sm" variant="outline">
            Copy whole summary
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Discard
          </Button>
        </>
      }
    />
  )
}
