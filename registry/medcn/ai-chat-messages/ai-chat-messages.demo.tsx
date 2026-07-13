"use client"

import * as React from "react"

import { AiChatMessages } from "@/registry/medcn/ai-chat-messages/ai-chat-messages"
import { AiMessage } from "@/registry/medcn/ai-message/ai-message"
import { Button } from "@/registry/medcn/button/button"

const SEED = [
  { role: "user" as const, text: "What changed since the last visit?" },
  {
    role: "assistant" as const,
    text: "Blood pressure is down from 148/92 to 128/78 across three readings since the 4 Feb dose change.",
  },
  { role: "user" as const, text: "Any weight change?" },
  {
    role: "assistant" as const,
    text: "Weight is stable at 78 kg, last recorded 12 Mar. Confirm against the chart before documenting.",
  },
]

export default function AiChatMessagesDemo() {
  const [messages, setMessages] = React.useState(SEED)

  const append = () =>
    setMessages((current) => [
      ...current,
      {
        role: "assistant" as const,
        text: `Follow-up note ${current.length - SEED.length + 1}: scroll up and add another to see the pending count.`,
      },
    ])

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="h-72 overflow-hidden rounded-xl border">
        <AiChatMessages>
          {messages.map((message, index) => (
            <AiMessage key={index} role={message.role}>
              {message.text}
            </AiMessage>
          ))}
        </AiChatMessages>
      </div>

      <Button size="sm" variant="outline" onClick={append} className="self-start">
        Add a message
      </Button>
    </div>
  )
}
