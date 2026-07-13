"use client"

import * as React from "react"

import { AiChat } from "@/registry/medcn/ai-chat/ai-chat"
import { AiChatHeader } from "@/registry/medcn/ai-chat-header/ai-chat-header"
import { AiChatMessages } from "@/registry/medcn/ai-chat-messages/ai-chat-messages"
import { AiClinicalDisclaimer } from "@/registry/medcn/ai-clinical-disclaimer/ai-clinical-disclaimer"
import { AiContextBar } from "@/registry/medcn/ai-context-bar/ai-context-bar"
import { AiContextChip } from "@/registry/medcn/ai-context-chip/ai-context-chip"
import { AiMessage } from "@/registry/medcn/ai-message/ai-message"
import { AiPromptChip } from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip"
import { AiPromptInput } from "@/registry/medcn/ai-prompt-input/ai-prompt-input"
import { AiTypingIndicator } from "@/registry/medcn/ai-typing-indicator/ai-typing-indicator"

interface Turn {
  role: "user" | "assistant"
  text: string
}

const SEED: Turn[] = [
  { role: "user", text: "What changed since the last visit?" },
  {
    role: "assistant",
    text: "Blood pressure fell from 148/92 to 128/78 across three readings after the 4 Feb dose change. Weight and eGFR are unchanged.",
  },
]

export default function AiChatDemo() {
  const [turns, setTurns] = React.useState(SEED)
  const [pending, setPending] = React.useState(false)

  const ask = (prompt: string) => {
    setTurns((current) => [...current, { role: "user", text: prompt }])
    setPending(true)
    setTimeout(() => {
      setTurns((current) => [
        ...current,
        {
          role: "assistant",
          text: "This demo does not call a model. Wire onSubmit to your own assistant.",
        },
      ])
      setPending(false)
    }, 1600)
  }

  return (
    <AiChat
      className="h-[32rem] w-full max-w-md"
      header={
        <AiChatHeader
          subtitle="Encounter 12 Mar · A. Okonkwo"
          status={pending ? "working" : "available"}
          onNewChat={() => setTurns(SEED)}
        />
      }
      context={
        <AiContextBar onManage={() => {}}>
          <AiContextChip kind="patient" sensitive>
            A. Okonkwo · 54F
          </AiContextChip>
          <AiContextChip kind="encounter">Encounter · 12 Mar</AiContextChip>
        </AiContextBar>
      }
      messages={
        <AiChatMessages>
          {turns.map((turn, index) => (
            <AiMessage key={index} role={turn.role}>
              {turn.text}
            </AiMessage>
          ))}
          {pending && <AiTypingIndicator />}
        </AiChatMessages>
      }
      suggestions={
        <AiPromptChip
          mode="insert"
          prompt="Draft a follow-up plan"
          onSelect={() => {}}
        />
      }
      composer={
        <div className="flex flex-col gap-2">
          <AiClinicalDisclaimer>
            Generated answers need clinician review before they enter the record.
          </AiClinicalDisclaimer>
          <AiPromptInput onSubmit={ask} streaming={pending} />
        </div>
      }
    />
  )
}
