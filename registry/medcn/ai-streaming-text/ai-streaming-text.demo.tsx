"use client"

import * as React from "react"

import { AiStreamingText } from "@/registry/medcn/ai-streaming-text/ai-streaming-text"
import { Button } from "@/registry/medcn/button/button"

const RESPONSE =
  "Latest BP readings for Mrs Adeyemi: 148/92 on 3 Mar, 142/88 on 17 Mar, and 138/84 today. The 17 Mar reading was taken after the amlodipine increase to 10 mg. Medications, allergies, and lab results were not read for this answer."

export default function AiStreamingTextDemo() {
  const [streaming, setStreaming] = React.useState(true)
  const [text, setText] = React.useState(RESPONSE)
  const [run, setRun] = React.useState(0)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="bg-card min-h-30 rounded-xl border p-4">
        <AiStreamingText
          key={run}
          text={text}
          streaming={streaming}
          speed={45}
          onComplete={() => setStreaming(false)}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setText(RESPONSE)
            setStreaming(true)
            setRun((value) => value + 1)
          }}
        >
          Replay stream
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!streaming}
          onClick={() => setStreaming(false)}
        >
          Complete now
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-muted-foreground"
          disabled={!streaming}
          onClick={() => {
            setText(
              "Latest BP readings for Mrs Adeyemi: response cancelled by the clinician."
            )
            setStreaming(false)
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
