"use client"

import * as React from "react"

import { AiConsentNotice } from "@/registry/medcn/ai-consent-notice/ai-consent-notice"

export default function AiConsentNoticeDemo() {
  const [acknowledged, setAcknowledged] = React.useState<string[]>([])

  return (
    <AiConsentNotice
      className="w-full max-w-md"
      title="Consent to AI-assisted consultation notes"
      version="v3.2 · effective 1 Jan 2026"
      description="Before the assistant drafts a note for this appointment, the patient must agree to each item below. Read them aloud and record their answers."
      items={[
        {
          id: "record-audio",
          label: "Record the consultation audio",
          description:
            "Audio is captured for the duration of this appointment only, and is deleted once the note is signed.",
          required: true,
        },
        {
          id: "process-transcript",
          label: "Process the transcript to draft a clinical note",
          description:
            "The draft is reviewed and edited by the clinician before anything is filed to the record.",
          required: true,
        },
        {
          id: "quality-review",
          label: "Retain a de-identified transcript for quality review",
          description:
            "Optional. Declining does not affect this appointment or the care that follows it.",
        },
      ]}
      acknowledged={acknowledged}
      onAcknowledgedChange={setAcknowledged}
      detailHref="#"
      detailLabel="Read the full consent text"
      confirmLabel="Record consent"
      declineLabel="Patient declines"
      footnote="Consent is recorded against this appointment with your user ID and the version above. The patient may withdraw it at any time by telling any member of the team."
    />
  )
}
