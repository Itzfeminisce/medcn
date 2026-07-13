"use client"

import { FileTextIcon, PillIcon } from "lucide-react"

import { AiPromptChip } from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip"
import { AiSuggestionCard } from "@/registry/medcn/ai-suggestion-card/ai-suggestion-card"
import { AiSuggestionList } from "@/registry/medcn/ai-suggestion-list/ai-suggestion-list"

export default function AiSuggestionListDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      {/* Same container, chips: a wrapping row above a composer. */}
      <AiSuggestionList showLabel>
        <AiPromptChip mode="insert" prompt="Summarise this encounter" onSelect={() => {}} />
        <AiPromptChip mode="insert" prompt="What changed since the last visit?" onSelect={() => {}} />
        <AiPromptChip mode="insert" prompt="Draft a follow-up plan" onSelect={() => {}} />
      </AiSuggestionList>

      {/* Same container, cards: one per line, two up when the container is wide. */}
      <AiSuggestionList layout="grid" label="Suggested tasks" showLabel>
        <AiSuggestionCard
          icon={<FileTextIcon />}
          title="Draft a visit summary"
          rationale="No summary has been filed for this encounter."
          onSelect={() => {}}
        />
        <AiSuggestionCard
          icon={<PillIcon />}
          title="List medication changes"
          rationale="Three prescriptions changed in this period."
          onSelect={() => {}}
        />
      </AiSuggestionList>
    </div>
  )
}
