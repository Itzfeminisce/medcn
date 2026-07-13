"use client"

import * as React from "react"

import { AiAssistantButton } from "@/registry/medcn/ai-assistant-button/ai-assistant-button"

export default function AiAssistantButtonDemo() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex flex-wrap items-center gap-4">
      <AiAssistantButton
        open={open}
        unread={open ? false : 2}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close assistant" : "Ask assistant"}
      </AiAssistantButton>

      <AiAssistantButton
        variant="outline"
        label="Open clinical assistant"
        tooltip="Open clinical assistant"
      />

      <AiAssistantButton
        variant="outline"
        attention
        label="Visit summary drafted — ready for review"
        tooltip="Visit summary drafted — ready for review"
      />
    </div>
  )
}
