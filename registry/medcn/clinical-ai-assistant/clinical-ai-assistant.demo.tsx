"use client"

import * as React from "react"

import { AiClinicalDisclaimer } from "@/registry/medcn/ai-clinical-disclaimer/ai-clinical-disclaimer"
import { AiContextChip } from "@/registry/medcn/ai-context-chip/ai-context-chip"
import { AiEmptyState } from "@/registry/medcn/ai-empty-state/ai-empty-state"
import { AiMessage } from "@/registry/medcn/ai-message/ai-message"
import { AiPromptChip } from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip"
import { ClinicalAiAssistant } from "@/registry/medcn/clinical-ai-assistant/clinical-ai-assistant"

const STARTERS = [
  "What changed since the last visit?",
  "Summarise today's encounter",
  "Any outstanding results?",
]

/** Static, caller-supplied answers — the block never calls a model. */
const ANSWERS: Record<string, string> = {
  "What changed since the last visit?":
    "Blood pressure fell from 148/92 to 128/78 after the 4 Feb dose change. Confirm against the chart before documenting.",
}

export default function ClinicalAiAssistantDemo() {
  const [open, setOpen] = React.useState(false)
  const [draft, setDraft] = React.useState("")
  const [turns, setTurns] = React.useState<
    { role: "user" | "assistant"; text: string }[]
  >([])
  const [blocked, setBlocked] = React.useState(false)

  const send = (prompt: string) => {
    const text = prompt.trim()
    if (!text) return
    setDraft("")
    setBlocked(false)
    setTurns((prev) => [
      ...prev,
      { role: "user", text },
      {
        role: "assistant",
        text:
          ANSWERS[text] ??
          "This demo returns fixed copy — wire your own model and clinical checks behind onSubmit.",
      },
    ])
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <p className="text-muted-foreground max-w-sm text-xs">
        {blocked
          ? "Close was blocked: the drafted prompt would have been lost."
          : "Open the assistant from the button, bottom right. A drafted prompt guards dismissal."}
      </p>

      <ClinicalAiAssistant
        open={open}
        onOpenChange={setOpen}
        onRequestClose={() => {
          if (draft.trim().length === 0) return true
          setBlocked(true)
          return false
        }}
        triggerPlacement="inline"
        unread={turns.length === 0 ? 1 : false}
        subtitle="Encounter 12 Mar · A. Okonkwo"
        status="available"
        onNewChat={() => setTurns([])}
        context={
          <>
            <AiContextChip kind="patient" sensitive>
              A. Okonkwo · 54F
            </AiContextChip>
            <AiContextChip kind="encounter">Encounter · 12 Mar</AiContextChip>
          </>
        }
        onManageContext={() => undefined}
        empty={
          <AiEmptyState
            suggestions={STARTERS.map((prompt) => (
              <AiPromptChip
                key={prompt}
                prompt={prompt}
                mode="submit"
                onSelect={send}
              />
            ))}
          />
        }
        suggestions={
          turns.length > 0
            ? STARTERS.slice(1).map((prompt) => (
                <AiPromptChip
                  key={prompt}
                  prompt={prompt}
                  mode="insert"
                  onSelect={(next) => setDraft(next)}
                />
              ))
            : undefined
        }
        value={draft}
        onValueChange={(value) => {
          setDraft(value)
          setBlocked(false)
        }}
        onSubmit={send}
        restrictions="De-identified prompts only."
        disclaimer={
          <AiClinicalDisclaimer>
            Generated for review. Verify against the chart before it informs
            care.
          </AiClinicalDisclaimer>
        }
      >
        {turns.map((turn, index) => (
          <AiMessage key={index} role={turn.role}>
            {turn.text}
          </AiMessage>
        ))}
      </ClinicalAiAssistant>
    </div>
  )
}
