"use client"

import * as React from "react"

import { AiPromptChip } from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip"

export default function AiPromptChipDemo() {
  const [log, setLog] = React.useState<string | null>(null)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <AiPromptChip
          mode="submit"
          prompt="Summarise this encounter"
          onSelect={(prompt) => setLog(`Sent: ${prompt}`)}
        />
        <AiPromptChip
          mode="insert"
          prompt="Draft a follow-up plan"
          onSelect={(prompt) => setLog(`Inserted into composer: ${prompt}`)}
        />
        <AiPromptChip
          mode="insert"
          prompt="What changed since the last visit?"
          onSelect={(prompt) => setLog(`Inserted into composer: ${prompt}`)}
        />
      </div>

      <p className="text-muted-foreground text-xs" aria-live="polite">
        {log ?? "Chips that send show a return arrow; chips that only fill the composer show a plus."}
      </p>
    </div>
  )
}
