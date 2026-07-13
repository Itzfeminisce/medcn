"use client"

import * as React from "react"
import {
  CheckIcon,
  CopyIcon,
  RotateCcwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"

import {
  AiMessageAction,
  AiMessageActions,
} from "@/registry/medcn/ai-message-actions/ai-message-actions"

const ANSWER =
  "Blood pressure has trended down since the dose change on 4 Feb."

export default function AiMessageActionsDemo() {
  const [copied, setCopied] = React.useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(ANSWER)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-2">
      <p className="text-sm">{ANSWER}</p>

      <AiMessageActions>
        {/* Copy takes the visible text — it does not imply anything was filed. */}
        <AiMessageAction
          label={copied ? "Copied visible text" : "Copy visible text"}
          onClick={copy}
        >
          {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
        </AiMessageAction>
        <AiMessageAction label="Regenerate response">
          <RotateCcwIcon />
        </AiMessageAction>
        <AiMessageAction label="Helpful">
          <ThumbsUpIcon />
        </AiMessageAction>
        <AiMessageAction label="Not helpful">
          <ThumbsDownIcon />
        </AiMessageAction>
      </AiMessageActions>
    </div>
  )
}
