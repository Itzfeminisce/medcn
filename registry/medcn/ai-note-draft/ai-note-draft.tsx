"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CheckIcon,
  CopyIcon,
  PencilIcon,
  ShieldCheckIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Label } from "@/registry/medcn/label/label"
import { Separator } from "@/registry/medcn/separator/separator"
import { Textarea } from "@/registry/medcn/textarea/textarea"

export interface AiNoteDraftSection {
  /** Stable key, and the id the caller receives on every change. */
  id: string
  heading: React.ReactNode
  /** Current draft text. Controlled by the caller. */
  content: string
  /**
   * True once the reviewer has changed the generated text. Caller-owned, so the
   * indicator can never claim an edit the caller did not record.
   */
  edited?: boolean
  placeholder?: string
  /** Per-section sources — AiCitation elements or an AiEvidencePanel. */
  provenance?: React.ReactNode
  /** Blocks editing of this section only (for example, a locked template field). */
  readOnly?: boolean
}

/** The draft's position in the review flow. Never advanced by the component itself. */
export type AiNoteDraftStatus = "draft" | "accepted" | "discarded"

export const aiNoteDraftSectionVariants = cva(
  "flex flex-col gap-2 rounded-lg border px-3.5 py-3",
  {
    variants: {
      state: {
        review: "bg-muted/30",
        editing: "border-ring/40 bg-transparent",
      },
      edited: {
        true: "border-l-primary/70 border-l-2",
        false: "",
      },
    },
    defaultVariants: { state: "review", edited: false },
  }
)

export type AiNoteDraftSectionVariants = VariantProps<
  typeof aiNoteDraftSectionVariants
>

export interface AiNoteDraftProps
  extends Omit<
    React.ComponentProps<typeof AiAnswerCard>,
    "title" | "children" | "actions" | "onChange"
  > {
  title?: React.ReactNode
  /** Sectioned draft content. Controlled — the component holds no text of its own. */
  sections: AiNoteDraftSection[]
  /** Where the draft sits in the review flow. Only the caller advances it. */
  status?: AiNoteDraftStatus
  /** Read-only until this is true. Controlled. */
  editing?: boolean
  onEditingChange?: (editing: boolean) => void
  /** Fires per keystroke while editing. The caller owns the text. */
  onSectionChange?: (id: string, content: string) => void
  /**
   * Original text beside the generated draft — a diff, two columns, whatever the
   * caller has. Rendered above the sections so a reviewer sees what changed
   * before deciding anything.
   */
  comparison?: React.ReactNode
  comparisonLabel?: React.ReactNode
  /**
   * Accept the draft into the record. Caller-owned: this component never writes.
   * Omit to hide the accept control entirely (for example, without permission).
   */
  onAccept?: () => void
  /** Discard the draft. Non-destructive — it must not touch the underlying record. */
  onDiscard?: () => void
  onCopy?: () => void
  /**
   * Accept is a two-step confirmation, so generated documentation cannot enter
   * the legal record on a single mis-click.
   */
  confirmAccept?: boolean
  acceptLabel?: string
  confirmAcceptLabel?: string
  editLabel?: string
  doneEditingLabel?: string
  discardLabel?: string
  copyLabel?: string
  /** Extra footer controls, rendered after the built-in review actions. */
  extraActions?: React.ReactNode
}

/**
 * Editable note draft. Content is read-only until the reviewer deliberately
 * enters edit mode, edited sections are marked, and accepting is a separate,
 * caller-owned, two-step act — because a draft becoming part of the legal
 * record should never be something that merely happened.
 */
function AiNoteDraft({
  className,
  title = "Note draft",
  sections,
  status = "draft",
  editing = false,
  onEditingChange,
  onSectionChange,
  comparison,
  comparisonLabel = "Original vs generated",
  onAccept,
  onDiscard,
  onCopy,
  confirmAccept = true,
  acceptLabel = "Accept into note",
  confirmAcceptLabel = "Confirm — add to record",
  editLabel = "Edit",
  doneEditingLabel = "Done editing",
  discardLabel = "Discard",
  copyLabel = "Copy",
  extraActions,
  generatedLabel,
  ...props
}: AiNoteDraftProps) {
  const [confirming, setConfirming] = React.useState(false)

  const accepted = status === "accepted"
  const discarded = status === "discarded"
  const settled = accepted || discarded
  const dirty = sections.some((section) => section.edited)
  const isEditing = editing && !settled

  // Any change to the text invalidates a pending confirmation.
  React.useEffect(() => {
    if (isEditing || settled) setConfirming(false)
  }, [isEditing, settled])

  function handleAccept() {
    if (confirmAccept && !confirming) {
      setConfirming(true)
      return
    }
    setConfirming(false)
    onAccept?.()
  }

  return (
    <AiAnswerCard
      data-slot="ai-note-draft"
      data-status={status}
      data-editing={isEditing}
      className={cn(className)}
      title={title}
      generatedLabel={
        generatedLabel ??
        (accepted ? "Accepted" : discarded ? "Discarded" : "Draft · not filed")
      }
      actions={
        settled ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
              {accepted ? (
                <>
                  <ShieldCheckIcon className="size-3.5 shrink-0" aria-hidden />
                  Accepted by a reviewer. Any further change belongs in the
                  record itself.
                </>
              ) : (
                <>
                  <Trash2Icon className="size-3.5 shrink-0" aria-hidden />
                  Draft discarded. The underlying record was not changed.
                </>
              )}
            </p>
            {extraActions}
          </div>
        ) : (
          <>
            {onAccept && (
              <Button
                type="button"
                size="sm"
                disabled={isEditing}
                aria-live="polite"
                className={cn(confirming && "ring-primary/40 ring-2")}
                onClick={handleAccept}
              >
                {confirming ? <ShieldCheckIcon /> : <CheckIcon />}
                {confirming ? confirmAcceptLabel : acceptLabel}
              </Button>
            )}

            {onEditingChange && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => onEditingChange(!isEditing)}
              >
                {isEditing ? <CheckIcon /> : <PencilIcon />}
                {isEditing ? doneEditingLabel : editLabel}
              </Button>
            )}

            {onCopy && (
              <Button type="button" size="sm" variant="outline" onClick={onCopy}>
                <CopyIcon />
                {copyLabel}
              </Button>
            )}

            {onDiscard && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-muted-foreground"
                onClick={onDiscard}
              >
                <Trash2Icon />
                {discardLabel}
              </Button>
            )}

            {extraActions}

            {isEditing && (
              <span className="text-muted-foreground basis-full text-xs">
                Finish editing before accepting — the text you accept is the text
                that is filed.
              </span>
            )}
          </>
        )
      }
      {...props}
    >
      <div className="flex flex-col gap-3">
        {(dirty || comparison) && (
          <div
            data-slot="ai-note-draft-review"
            className="flex flex-col gap-2 rounded-lg border p-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs font-semibold">
                {comparisonLabel}
              </span>
              {dirty && (
                <Badge
                  variant="info"
                  className="h-5 shrink-0 gap-1 text-[10px] font-semibold"
                >
                  <PencilIcon aria-hidden />
                  Edited by reviewer
                </Badge>
              )}
            </div>
            {comparison ?? (
              <p className="text-muted-foreground text-xs leading-relaxed">
                No original was supplied for comparison — this draft is being
                reviewed on its own.
              </p>
            )}
          </div>
        )}

        {sections.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            The draft is empty. Nothing here can be accepted.
          </p>
        ) : (
          <div
            data-slot="ai-note-draft-sections"
            className="flex flex-col gap-3"
          >
            {sections.map((section) => {
              const sectionEditable = isEditing && !section.readOnly
              const inputId = `ai-note-draft-${section.id}`

              return (
                <section
                  key={section.id}
                  data-slot="ai-note-draft-section"
                  data-edited={Boolean(section.edited)}
                  className={aiNoteDraftSectionVariants({
                    state: sectionEditable ? "editing" : "review",
                    edited: Boolean(section.edited),
                  })}
                >
                  <header className="flex items-center gap-2">
                    <Label
                      htmlFor={sectionEditable ? inputId : undefined}
                      className="text-foreground min-w-0 flex-1 truncate text-xs font-semibold tracking-wide uppercase"
                    >
                      {section.heading}
                    </Label>
                    {section.edited && (
                      <Badge
                        variant="info"
                        className="h-5 shrink-0 text-[10px] font-semibold"
                      >
                        Edited
                      </Badge>
                    )}
                    {section.readOnly && isEditing && (
                      <Badge
                        variant="outline"
                        className="h-5 shrink-0 text-[10px] font-semibold"
                      >
                        Locked
                      </Badge>
                    )}
                  </header>

                  {sectionEditable ? (
                    <Textarea
                      id={inputId}
                      value={section.content}
                      placeholder={section.placeholder}
                      className="min-h-24 text-sm"
                      onChange={(event) =>
                        onSectionChange?.(section.id, event.target.value)
                      }
                    />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {section.content || (
                        <span className="text-muted-foreground italic">
                          Nothing was generated for this section.
                        </span>
                      )}
                    </p>
                  )}

                  {section.provenance && (
                    <div data-slot="ai-note-draft-section-provenance">
                      {section.provenance}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}

        {!settled && (
          <>
            <Separator />
            <p className="text-muted-foreground flex items-start gap-1.5 text-xs leading-relaxed">
              <TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span>
                This draft is not part of the record. It becomes documentation
                only when a clinician accepts it.
              </span>
            </p>
          </>
        )}
      </div>
    </AiAnswerCard>
  )
}

export { AiNoteDraft }
