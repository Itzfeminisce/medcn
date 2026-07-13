"use client"

import * as React from "react"

import { AiCitation } from "@/registry/medcn/ai-citation/ai-citation"
import {
  AiNoteDraft,
  type AiNoteDraftStatus,
} from "@/registry/medcn/ai-note-draft/ai-note-draft"
import { Button } from "@/registry/medcn/button/button"

const GENERATED = {
  subjective:
    "Attends for review of hypertension. Reports that the headaches he described in February have stopped since the dose change. Walking the dog twice daily without breathlessness. Denies chest pain, palpitations, or ankle swelling. Says he has been taking the tablets every morning.",
  objective:
    "BP 128/78 seated, right arm, manual cuff. HR 72 and regular. Weight 81 kg (81 kg in February). Chest clear on auscultation. No peripheral oedema.",
  assessment:
    "Blood pressure now within the target agreed at the February visit. Symptoms reported as improved. No new complaints raised at this visit.",
  plan: "Clinician to confirm the plan before this note is filed.",
}

const ORIGINAL_PLAN =
  "Continue amlodipine 10 mg. Repeat U&E in 2 weeks. Review in 3 months."

export default function AiNoteDraftDemo() {
  const [content, setContent] = React.useState(GENERATED)
  const [editing, setEditing] = React.useState(false)
  const [status, setStatus] = React.useState<AiNoteDraftStatus>("draft")

  const isEdited = (key: keyof typeof GENERATED) =>
    content[key] !== GENERATED[key]

  return (
    <AiNoteDraft
      className="w-full max-w-xl"
      title="Consultation note — R. Okafor, 64"
      metadata="Drafted 09:12 from the ambient transcript · not filed"
      limitations="Drafted from the visit transcript only. The medication list, results, and past notes were not read, so nothing here can be assumed to reconcile with them."
      status={status}
      editing={editing}
      onEditingChange={setEditing}
      onSectionChange={(id, value) =>
        setContent((prev) => ({ ...prev, [id]: value }))
      }
      comparison={
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
              Plan in the record (12 Feb)
            </span>
            <p className="text-xs leading-relaxed">{ORIGINAL_PLAN}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-[10px] font-semibold tracking-wide uppercase">
              Plan in this draft
            </span>
            <p className="text-xs leading-relaxed">{content.plan}</p>
          </div>
        </div>
      }
      sections={[
        {
          id: "subjective",
          heading: "Subjective",
          content: content.subjective,
          edited: isEdited("subjective"),
          provenance: (
            <div className="flex flex-wrap gap-1.5">
              <AiCitation
                index={1}
                title="Visit transcript · 09:02–09:11"
                publisher="Ambient capture"
                date="14 Mar 2026"
                locator="Turns 4–17"
                excerpt="“The headaches stopped after you changed the dose. I walk the dog morning and night.”"
              />
            </div>
          ),
        },
        {
          id: "objective",
          heading: "Objective",
          content: content.objective,
          edited: isEdited("objective"),
          provenance: (
            <div className="flex flex-wrap gap-1.5">
              <AiCitation
                index={2}
                title="Clinic observations · 14 Mar"
                publisher="Vitals device"
                date="14 Mar 2026"
                locator="BP 128/78, HR 72, weight 81 kg"
              />
            </div>
          ),
        },
        {
          id: "assessment",
          heading: "Assessment",
          content: content.assessment,
          edited: isEdited("assessment"),
        },
        {
          id: "plan",
          heading: "Plan",
          content: content.plan,
          edited: isEdited("plan"),
          placeholder:
            "Write the plan. Nothing is prescribed or ordered from this note.",
        },
      ]}
      onAccept={() => setStatus("accepted")}
      onDiscard={() => {
        setContent(GENERATED)
        setEditing(false)
        setStatus("discarded")
      }}
      onCopy={() => console.log("copy draft")}
      extraActions={
        status !== "draft" ? (
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => {
              setContent(GENERATED)
              setStatus("draft")
            }}
          >
            Reset demo
          </Button>
        ) : null
      }
    />
  )
}
