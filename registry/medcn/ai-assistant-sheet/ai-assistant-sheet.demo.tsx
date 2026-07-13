"use client"

import * as React from "react"

import { AiAssistantButton } from "@/registry/medcn/ai-assistant-button/ai-assistant-button"
import { AiAssistantSheet } from "@/registry/medcn/ai-assistant-sheet/ai-assistant-sheet"
import { AiChatHeader } from "@/registry/medcn/ai-chat-header/ai-chat-header"
import { AiChatMessages } from "@/registry/medcn/ai-chat-messages/ai-chat-messages"
import { AiContextBar } from "@/registry/medcn/ai-context-bar/ai-context-bar"
import { AiContextChip } from "@/registry/medcn/ai-context-chip/ai-context-chip"
import { AiMessage } from "@/registry/medcn/ai-message/ai-message"
import { AiPromptInput } from "@/registry/medcn/ai-prompt-input/ai-prompt-input"

export default function AiAssistantSheetDemo() {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [blocked, setBlocked] = React.useState(false)

  /** A drafted prompt must survive a stray Escape or overlay click. */
  const requestClose = () => {
    if (draft.trim().length === 0) return true
    setBlocked(true)
    return false
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <AiAssistantButton open={open} onClick={() => setOpen(true)}>
        Open assistant
      </AiAssistantButton>

      <p className="text-muted-foreground max-w-xs text-xs">
        {blocked
          ? "Close was blocked: the draft prompt would have been lost. Clear it, then close."
          : "Type a prompt, then try to close the sheet — dismissal is guarded while a draft exists."}
      </p>

      <AiAssistantSheet
        open={open}
        onOpenChange={setOpen}
        onRequestClose={requestClose}
        header={
          <AiChatHeader
            subtitle="Encounter 12 Mar · A. Okonkwo"
            onClose={() => {
              if (requestClose()) setOpen(false)
            }}
          />
        }
        context={
          <AiContextBar>
            <AiContextChip kind="patient" sensitive>
              A. Okonkwo · 54F
            </AiContextChip>
            <AiContextChip kind="encounter">Encounter · 12 Mar</AiContextChip>
          </AiContextBar>
        }
        composer={
          <AiPromptInput
            value={draft}
            onValueChange={(value) => {
              setDraft(value)
              setBlocked(false)
            }}
            onSubmit={() => setDraft("")}
          />
        }
      >
        <AiChatMessages>
          <AiMessage role="user">What changed since the last visit?</AiMessage>
          <AiMessage>
            Blood pressure fell from 148/92 to 128/78 after the 4 Feb dose
            change. Confirm against the chart before documenting.
          </AiMessage>
        </AiChatMessages>
      </AiAssistantSheet>
    </div>
  )
}
