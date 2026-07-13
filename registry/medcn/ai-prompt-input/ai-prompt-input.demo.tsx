"use client"

import * as React from "react"
import { PaperclipIcon } from "lucide-react"

import { AiPromptInput } from "@/registry/medcn/ai-prompt-input/ai-prompt-input"
import { Button } from "@/registry/medcn/button/button"

export default function AiPromptInputDemo() {
  const [streaming, setStreaming] = React.useState(false)
  const [sent, setSent] = React.useState<string | null>(null)

  const send = (prompt: string) => {
    setSent(prompt)
    setStreaming(true)
    setTimeout(() => setStreaming(false), 2000)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <AiPromptInput
        streaming={streaming}
        onSubmit={send}
        onStop={() => setStreaming(false)}
        maxLength={500}
        restrictions="Do not paste identifiers from outside the active encounter."
        tools={
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label="Attach a document"
            className="text-muted-foreground"
          >
            <PaperclipIcon />
          </Button>
        }
      />

      <p className="text-muted-foreground px-1 text-xs" aria-live="polite">
        {streaming
          ? "Responding — press stop to cancel."
          : sent
            ? `Sent: "${sent}"`
            : "Enter sends. Shift+Enter adds a line."}
      </p>
    </div>
  )
}
