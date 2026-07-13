"use client"

import * as React from "react"
import { FileTextIcon, ListChecksIcon, PillIcon } from "lucide-react"

import { AiSuggestionCard } from "@/registry/medcn/ai-suggestion-card/ai-suggestion-card"

export default function AiSuggestionCardDemo() {
  const [chosen, setChosen] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <AiSuggestionCard
        icon={<FileTextIcon />}
        title="Draft a visit summary"
        rationale="The encounter note is complete but no summary has been filed."
        sourceCount={2}
        onSelect={() => setChosen("Draft a visit summary")}
      />

      <AiSuggestionCard
        icon={<PillIcon />}
        title="List medication changes since January"
        rationale="Three prescriptions changed in the period you are viewing."
        badge="Reads meds"
        sourceCount={3}
        onSelect={() => setChosen("List medication changes since January")}
      />

      <AiSuggestionCard
        icon={<ListChecksIcon />}
        title="Compare today's vitals with the last visit"
        rationale="Outside pharmacy data is unavailable, so this covers in-org records only."
        disabled
      />

      <p className="text-muted-foreground px-1 text-xs" aria-live="polite">
        {chosen ? `Selected: ${chosen}` : "Suggestions are supplied by your product, not inferred here."}
      </p>
    </div>
  )
}
