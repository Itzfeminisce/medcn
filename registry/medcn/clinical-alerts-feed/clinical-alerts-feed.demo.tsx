"use client"

import * as React from "react"

import { Badge } from "@/registry/medcn/badge/badge"
import { ClinicalAlertsFeed } from "@/registry/medcn/clinical-alerts-feed/clinical-alerts-feed"

type Alert = React.ComponentProps<typeof ClinicalAlertsFeed>["items"][number]

const seed: Alert[] = [
  {
    id: "a1",
    severity: "warning",
    title: "Interaction: warfarin + ibuprofen",
    category: "Drug interaction",
    source: "First DataBank severity: major",
    message: "Increased bleeding risk. Consider acetaminophen.",
    time: "11:03",
  },
  {
    id: "a2",
    severity: "critical",
    title: "Critical potassium 6.4 mmol/L",
    category: "Critical lab",
    source: "Auto-flagged by rule LAB-K-HIGH (≥6.0)",
    message: "Ada Obi · Bed 4B. Repeat sample and notify the physician.",
    time: "12:41",
  },
  {
    id: "a3",
    severity: "info",
    title: "New result: Lipid panel",
    category: "Result",
    time: "09:20",
  },
]

export default function ClinicalAlertsFeedDemo() {
  const [items, setItems] = React.useState(seed)
  const dismiss = (id?: string) =>
    setItems((xs) => xs.filter((x) => x.id !== id))

  return (
    <ClinicalAlertsFeed
      className="w-full max-w-lg"
      action={<Badge variant="soft">{items.length}</Badge>}
      empty="All clear — no active alerts."
      items={items.map((a) => ({
        ...a,
        onDismiss: () => dismiss(a.id),
        onAcknowledge: a.severity === "critical" ? () => dismiss(a.id) : undefined,
      }))}
    />
  )
}
