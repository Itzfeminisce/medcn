import { CopyIcon, RotateCcwIcon } from "lucide-react"

import { AiMessage } from "@/registry/medcn/ai-message/ai-message"
import {
  AiMessageAction,
  AiMessageActions,
} from "@/registry/medcn/ai-message-actions/ai-message-actions"

export default function AiMessageDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <AiMessage role="system">
        Context: A. Okonkwo · encounter 12 Mar · last 90 days of observations.
      </AiMessage>

      <AiMessage role="user" metadata="14:02">
        What changed in her blood pressure since the dose increase?
      </AiMessage>

      <AiMessage
        metadata="14:02"
        actions={
          <AiMessageActions revealOnHover>
            <AiMessageAction label="Copy visible text">
              <CopyIcon />
            </AiMessageAction>
            <AiMessageAction label="Regenerate response">
              <RotateCcwIcon />
            </AiMessageAction>
          </AiMessageActions>
        }
      >
        Three readings since 4 Feb: 148/92, 138/86, 128/78. The trend is
        downward. Confirm against the chart before documenting.
      </AiMessage>

      <AiMessage state="streaming" metadata="now">
        Comparing against the last recorded weight
      </AiMessage>

      <AiMessage state="error" metadata="14:04">
        The response could not be completed. Your prompt was kept.
      </AiMessage>
    </div>
  )
}
