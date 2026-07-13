"use client"

import * as React from "react"
import { SquareIcon } from "lucide-react"

import { AiThinking } from "@/registry/medcn/ai-thinking/ai-thinking"
import { Button } from "@/registry/medcn/button/button"

/** Phases a product might report while an assistant turn is in flight. */
const PHASES = [
  "Reading the active encounter",
  "Retrieving approved sources",
  "Drafting a response",
]

export default function AiThinkingDemo() {
  const [step, setStep] = React.useState(0)

  React.useEffect(() => {
    const id = setInterval(
      () => setStep((value) => (value + 1) % PHASES.length),
      1800
    )
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <AiThinking
        variant="bubble"
        phase={PHASES[step]}
        action={
          <Button size="icon-sm" variant="ghost" aria-label="Stop response">
            <SquareIcon />
          </Button>
        }
      />
      <AiThinking phase="Checking which notes you have access to" />
    </div>
  )
}
