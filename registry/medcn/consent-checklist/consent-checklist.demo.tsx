"use client"

import * as React from "react"

import {
  ConsentChecklist,
  type ConsentAcceptance,
} from "@/registry/medcn/consent-checklist/consent-checklist"

const ITEMS = [
  {
    id: "treatment",
    label: "I consent to the treatment described above",
    description: "Including the procedures, risks, and alternatives discussed.",
    href: "#",
    version: "2026-01",
  },
  {
    id: "data",
    label: "I consent to sharing my records with my care team",
    description: "Clinicians directly involved in my care may access my record.",
    href: "#",
    version: "2026-01",
  },
  {
    id: "research",
    label: "Use my de-identified data for research",
    required: false,
    version: "2026-01",
  },
]

export default function ConsentChecklistDemo() {
  const [accepted, setAccepted] = React.useState<ConsentAcceptance[]>([])

  return (
    <ConsentChecklist
      items={ITEMS}
      value={accepted}
      onValueChange={setAccepted}
      onSubmit={(a) => console.log("submitted", a)}
    />
  )
}
