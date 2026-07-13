"use client"

import * as React from "react"

import { AiContextBar } from "@/registry/medcn/ai-context-bar/ai-context-bar"
import { AiContextChip } from "@/registry/medcn/ai-context-chip/ai-context-chip"

const INITIAL = [
  { id: "patient", kind: "patient" as const, label: "A. Okonkwo · 54F", sensitive: true },
  { id: "encounter", kind: "encounter" as const, label: "Encounter · 12 Mar" },
  { id: "labs", kind: "document" as const, label: "Lipid panel" },
  { id: "range", kind: "date-range" as const, label: "Last 90 days" },
]

export default function AiContextBarDemo() {
  const [items, setItems] = React.useState(INITIAL)

  return (
    <div className="w-full max-w-md rounded-xl border p-2">
      <AiContextBar onManage={() => setItems(INITIAL)}>
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
      </AiContextBar>
    </div>
  )
}
