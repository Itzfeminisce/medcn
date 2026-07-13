"use client"

import { AiChatHeader } from "@/registry/medcn/ai-chat-header/ai-chat-header"

export default function AiChatHeaderDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="bg-card overflow-hidden rounded-xl border">
        <AiChatHeader
          subtitle="Encounter 12 Mar · A. Okonkwo"
          status="working"
          onNewChat={() => {}}
          onClose={() => {}}
        />
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <AiChatHeader status="available" subtitle="No patient in context" />
      </div>

      <div className="bg-card overflow-hidden rounded-xl border">
        <AiChatHeader
          status="unavailable"
          subtitle="Assistant is disabled for paediatric charts"
        />
      </div>
    </div>
  )
}
