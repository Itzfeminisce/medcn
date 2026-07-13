"use client"

import { AiCitation } from "@/registry/medcn/ai-citation/ai-citation"

export default function AiCitationDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-sm leading-relaxed">
        Blood pressure fell from 148/92 to 128/78 after the 4 Feb dose change.
      </p>

      <div className="flex flex-wrap gap-2">
        <AiCitation
          index={1}
          title="Encounter note · 12 Mar"
          publisher="Cardiology clinic"
          date="12 Mar 2026"
          locator="Assessment, paragraph 2"
          excerpt="BP today 128/78, improved since the dose increase on 4 Feb."
          href="#"
        />
        <AiCitation
          index={2}
          title="Vitals flowsheet"
          publisher="Nursing observations"
          date="4 Feb 2026"
          state="stale"
          locator="Row: BP (sitting)"
        />
        <AiCitation
          index={3}
          title="Outside pharmacy record"
          publisher="Not accessible from this org"
          state="unavailable"
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Each marker names its source. Open one to see the publisher, date, and
        the passage the claim rests on.
      </p>
    </div>
  )
}
