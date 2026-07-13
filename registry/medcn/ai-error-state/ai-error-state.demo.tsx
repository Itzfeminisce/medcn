"use client"

import * as React from "react"

import { AiErrorState } from "@/registry/medcn/ai-error-state/ai-error-state"

const DRAFT =
  "Summarise the last three encounters and flag anything that changed in her antihypertensive regimen."

export default function AiErrorStateDemo() {
  const [status, setStatus] = React.useState<string | null>(null)

  return (
    <div className="bg-card w-full max-w-md rounded-xl border">
      <AiErrorState
        draft={DRAFT}
        onRetry={() => setStatus("Retrying with the same prompt...")}
        onEdit={() => setStatus("Draft returned to the composer.")}
      />
      {status && (
        <p
          className="text-muted-foreground border-t px-4 py-2 text-center text-xs"
          aria-live="polite"
        >
          {status}
        </p>
      )}
    </div>
  )
}
