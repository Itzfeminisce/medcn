"use client"

import { AiCitation } from "@/registry/medcn/ai-citation/ai-citation"
import { AiEvidencePanel } from "@/registry/medcn/ai-evidence-panel/ai-evidence-panel"

export default function AiEvidencePanelDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <p className="text-sm leading-relaxed">
        Blood pressure fell from 148/92 to 128/78 after the 4 Feb dose change.
        Weight and eGFR are unchanged.
      </p>

      <AiEvidencePanel
        retrievedAt="14:02, 12 Mar"
        limitations="Drawn from the encounter note and the vitals flowsheet only. The outside pharmacy record could not be read, so medication changes made elsewhere are not reflected."
        defaultOpen
      >
        <AiCitation
          index={1}
          title="Encounter note · 12 Mar"
          publisher="Cardiology clinic"
          date="12 Mar 2026"
          locator="Assessment, paragraph 2"
          excerpt="BP today 128/78, improved since the dose increase on 4 Feb."
        />
        <AiCitation
          index={2}
          title="Vitals flowsheet"
          publisher="Nursing observations"
          date="4 Feb 2026"
          locator="Row: BP (sitting)"
        />
        <AiCitation
          index={3}
          title="Outside pharmacy record"
          publisher="Not accessible from this org"
          state="unavailable"
        />
      </AiEvidencePanel>
    </div>
  )
}
