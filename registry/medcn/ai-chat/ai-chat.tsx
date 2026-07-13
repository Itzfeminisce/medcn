import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"
import { Card } from "@/registry/medcn/card/card"
import { Separator } from "@/registry/medcn/separator/separator"

const aiChatVariants = cva("flex min-h-0 flex-col gap-0 overflow-hidden py-0", {
  variants: {
    variant: {
      card: "",
      plain: "rounded-none border-0 bg-transparent shadow-none",
    },
  },
  defaultVariants: {
    variant: "card",
  },
})

export interface AiChatProps
  extends Omit<React.ComponentProps<typeof Card>, "variant">,
    VariantProps<typeof aiChatVariants> {
  header?: React.ReactNode
  /** Visible scope of the conversation — what will be sent with the next prompt. */
  context?: React.ReactNode
  /** The transcript. Falls back to `children`. */
  messages?: React.ReactNode
  /** Prompt chips or suggestion cards, between the transcript and the composer. */
  suggestions?: React.ReactNode
  composer?: React.ReactNode
}

/**
 * Layout shell for an assistant conversation. It owns no conversation state, so
 * the same shell serves a floating sheet and a full-page workspace. Context is a
 * visible slot, never hidden metadata.
 */
function AiChat({
  className,
  variant,
  header,
  context,
  messages,
  suggestions,
  composer,
  children,
  ...props
}: AiChatProps) {
  return (
    <Card
      data-slot="ai-chat"
      className={cn(aiChatVariants({ variant }), className)}
      {...props}
    >
      {header}

      {context && (
        <>
          <div data-slot="ai-chat-context" className="px-3 py-1.5">
            {context}
          </div>
          <Separator />
        </>
      )}

      <div
        data-slot="ai-chat-transcript"
        className="flex min-h-0 flex-1 flex-col"
      >
        {messages ?? children}
      </div>

      {suggestions && (
        <div
          data-slot="ai-chat-suggestions"
          className="flex flex-wrap gap-2 px-3 pb-2"
        >
          {suggestions}
        </div>
      )}

      {composer && (
        <div data-slot="ai-chat-composer" className="border-t p-3">
          {composer}
        </div>
      )}
    </Card>
  )
}

export { AiChat, aiChatVariants }
