"use client"

import { AiEmptyState } from "@/registry/medcn/ai-empty-state/ai-empty-state"
import { AiPromptChip } from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip"

export default function AiEmptyStateDemo() {
  return (
    <div className="bg-card w-full max-w-md rounded-xl border">
      <AiEmptyState
        suggestions={
          <>
            <AiPromptChip
              mode="insert"
              prompt="Summarise this encounter"
              onSelect={() => {}}
            />
            <AiPromptChip
              mode="insert"
              prompt="What changed since the last visit?"
              onSelect={() => {}}
            />
            <AiPromptChip
              mode="insert"
              prompt="Draft a follow-up plan"
              onSelect={() => {}}
            />
          </>
        }
      />
    </div>
  )
}
