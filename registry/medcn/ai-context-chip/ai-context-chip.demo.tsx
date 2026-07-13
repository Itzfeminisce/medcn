"use client"

import * as React from "react"

import { AiContextChip } from "@/registry/medcn/ai-context-chip/ai-context-chip"

const INITIAL = [
  { id: "patient", kind: "patient" as const, label: "A. Okonkwo · 54F", sensitive: true },
  { id: "encounter", kind: "encounter" as const, label: "Encounter · 12 Mar" },
  { id: "meds", kind: "medication" as const, label: "Active medications (7)" },
  { id: "range", kind: "date-range" as const, label: "Last 90 days" },
]

export default function AiContextChipDemo() {
  const [items, setItems] = React.useState(INITIAL)

  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <AiContextChip
            key={item.id}
            kind={item.kind}
            sensitive={item.sensitive}
            onRemove={() =>
              setItems((current) => current.filter((it) => it.id !== item.id))
            }
          >
            {item.label}
          </AiContextChip>
        ))}
      </div>

      <p className="text-muted-foreground text-xs">
        Removing a chip narrows what is sent with the next prompt. The record
        itself is untouched.{" "}
        {items.length < INITIAL.length && (
          <button
            type="button"
            className="text-primary underline underline-offset-4"
            onClick={() => setItems(INITIAL)}
          >
            Reset
          </button>
        )}
      </p>
    </div>
  )
}
