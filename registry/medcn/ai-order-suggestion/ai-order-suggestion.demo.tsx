"use client"

import * as React from "react"

import {
  AiOrderSuggestion,
  type AiOrderField,
} from "@/registry/medcn/ai-order-suggestion/ai-order-suggestion"
import { Button } from "@/registry/medcn/button/button"

const fields: AiOrderField[] = [
  { label: "Drug", value: "Amoxicillin (oral suspension)" },
  { label: "Dose", value: "500 mg", emphasis: true },
  { label: "Route", value: "Oral" },
  { label: "Frequency", value: "Three times daily" },
  { label: "Duration", value: "5 days" },
  { label: "Indication", value: "Community-acquired pneumonia (suspected)" },
  { label: "Proposed for", value: "A. Okafor · 68 y · 71 kg" },
]

export default function AiOrderSuggestionDemo() {
  const [submitted, setSubmitted] = React.useState(false)

  return (
    <AiOrderSuggestion
      className="w-full max-w-lg"
      title="Proposed order — awaiting prescriber review"
      metadata="Drafted 10:24 · from the 12 Mar triage note"
      orderType="Medication order"
      orderLabel="Amoxicillin 500 mg oral, three times daily, 5 days"
      fields={fields}
      rationale="Drafted from the working impression recorded in the triage note. Dose and duration follow the template the clinician selected; neither was calculated or validated by this component."
      constraints={[
        "Penicillin allergy status is recorded as “not asked” — confirm before signing.",
        "eGFR 48 on 2 Mar. Confirm whether dose adjustment applies under local protocol.",
        "Interaction screening has not been run against the active medication list.",
      ]}
      onSubmit={() => setSubmitted(true)}
      actions={
        <>
          <Button size="sm" variant="outline">
            Edit order
          </Button>
          <Button size="sm" variant="ghost" className="text-muted-foreground">
            Discard
          </Button>
          {submitted && (
            <span className="text-muted-foreground self-center text-xs">
              Sent to the host application&apos;s ordering workflow for signing.
            </span>
          )}
        </>
      }
    />
  )
}
