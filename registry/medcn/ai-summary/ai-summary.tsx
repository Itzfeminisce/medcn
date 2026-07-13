import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CircleSlashIcon,
  CopyIcon,
  FileInputIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

/**
 * How a section came to exist. The distinction is clinical, not cosmetic:
 * a section that was reviewed and found empty is not the same as a section
 * that was never generated, and neither is the same as text lifted verbatim
 * from the record.
 */
export type AiSummarySectionStatus =
  /** Model-written prose. Must be reviewed. */
  | "generated"
  /** Reviewed by the generation, and there was nothing to report. */
  | "empty"
  /** Not produced — the source was not read, or the model returned nothing. */
  | "omitted"
  /** Copied unchanged from the record. Not generated. */
  | "verbatim"

export interface AiSummarySection {
  /** Stable key. */
  id: string
  heading: React.ReactNode
  /** Prose for `generated` / `verbatim` sections. */
  content?: React.ReactNode
  /** Defaults to `generated` when `content` is present, `omitted` when it is not. */
  status?: AiSummarySectionStatus
  /**
   * Shown in place of content for `empty` and `omitted` sections. Say what was
   * checked ("No medications reviewed") or what was missed ("Results not read").
   */
  statusDetail?: React.ReactNode
  /**
   * Per-section provenance — an AiEvidencePanel, AiCitation elements, badges.
   * A `generated` or `empty` section with no provenance is rendered as
   * unsourced, and says so.
   */
  provenance?: React.ReactNode
  /** What is uncertain or contested in this section. */
  uncertainty?: React.ReactNode
}

const STATUS_BADGE: Record<
  AiSummarySectionStatus,
  { label: string; variant: "soft" | "secondary" | "outline" } | null
> = {
  generated: { label: "Generated", variant: "soft" },
  empty: { label: "Generated · nothing found", variant: "secondary" },
  omitted: { label: "Not generated", variant: "outline" },
  verbatim: { label: "From record", variant: "outline" },
}

export const aiSummarySectionVariants = cva(
  "flex flex-col gap-2 rounded-lg border px-3.5 py-3",
  {
    variants: {
      status: {
        generated: "bg-muted/30",
        empty: "bg-muted/20",
        omitted: "border-dashed bg-transparent",
        verbatim: "bg-transparent",
      },
      /** Unsourced generated content is flagged on the section itself. */
      sourced: {
        true: "",
        false: "border-l-warning/70 border-l-2",
      },
    },
    defaultVariants: { status: "generated", sourced: true },
  }
)

export type AiSummarySectionVariants = VariantProps<
  typeof aiSummarySectionVariants
>

export interface AiSummaryProps
  extends Omit<
    React.ComponentProps<typeof AiAnswerCard>,
    "title" | "children"
  > {
  title?: React.ReactNode
  /** The summary itself. Order is the caller's. */
  sections: AiSummarySection[]
  /** Copy one section's text. The component never touches the clipboard itself. */
  onCopySection?: (section: AiSummarySection) => void
  /**
   * Hand one section to the caller for insertion. The caller writes to the
   * record — this component never does.
   */
  onInsertSection?: (section: AiSummarySection) => void
  copySectionLabel?: string
  insertSectionLabel?: string
  /** Shown when `sections` is empty. */
  emptyState?: React.ReactNode
}

/**
 * Reviewable structured summary. Every section carries its own status and its
 * own provenance, so a reader can tell generated prose from record text, an
 * explicit negative from a gap, and a sourced claim from an unsourced one —
 * which is the difference between a summary and a guess with headings.
 */
function AiSummary({
  className,
  title = "Clinical summary",
  sections,
  onCopySection,
  onInsertSection,
  copySectionLabel = "Copy",
  insertSectionLabel = "Insert",
  emptyState = "No sections were produced for this summary.",
  ...props
}: AiSummaryProps) {
  return (
    <AiAnswerCard
      data-slot="ai-summary"
      className={cn(className)}
      title={title}
      {...props}
    >
      {sections.length === 0 ? (
        <p className="text-muted-foreground text-sm">{emptyState}</p>
      ) : (
        <div data-slot="ai-summary-sections" className="flex flex-col gap-3">
          {sections.map((section) => {
            const status: AiSummarySectionStatus =
              section.status ?? (section.content ? "generated" : "omitted")
            const badge = STATUS_BADGE[status]
            const expectsSource = status === "generated" || status === "empty"
            const sourced = !expectsSource || Boolean(section.provenance)
            const actionable = status === "generated" || status === "verbatim"

            return (
              <section
                key={section.id}
                data-slot="ai-summary-section"
                data-status={status}
                data-sourced={sourced}
                className={aiSummarySectionVariants({ status, sourced })}
              >
                <header className="flex items-center gap-2">
                  <h3 className="text-foreground min-w-0 flex-1 truncate text-xs font-semibold tracking-wide uppercase">
                    {section.heading}
                  </h3>
                  {badge && (
                    <Badge
                      variant={badge.variant}
                      className="h-5 shrink-0 text-[10px] font-semibold"
                    >
                      {badge.label}
                    </Badge>
                  )}
                </header>

                {status === "generated" || status === "verbatim" ? (
                  <div className="text-sm leading-relaxed">
                    {section.content}
                  </div>
                ) : (
                  <p className="text-muted-foreground flex items-start gap-1.5 text-sm italic">
                    <CircleSlashIcon
                      className="mt-0.5 size-3.5 shrink-0"
                      aria-hidden
                    />
                    <span>
                      {section.statusDetail ??
                        (status === "empty"
                          ? "Reviewed — nothing to report."
                          : "Not generated. Do not read this as a negative finding.")}
                    </span>
                  </p>
                )}

                {section.uncertainty && (
                  <p
                    data-slot="ai-summary-section-uncertainty"
                    className="text-muted-foreground border-border/70 border-l-2 pl-2.5 text-xs leading-relaxed"
                  >
                    {section.uncertainty}
                  </p>
                )}

                {section.provenance ? (
                  <div data-slot="ai-summary-section-provenance">
                    {section.provenance}
                  </div>
                ) : (
                  expectsSource && (
                    <p
                      data-slot="ai-summary-section-provenance"
                      className="text-warning flex items-center gap-1.5 text-xs font-medium"
                    >
                      <TriangleAlertIcon className="size-3.5 shrink-0" aria-hidden />
                      No source attached — verify against the record.
                    </p>
                  )
                )}

                {actionable && (onCopySection || onInsertSection) && (
                  <div
                    data-slot="ai-summary-section-actions"
                    className="flex flex-wrap gap-1 pt-0.5"
                  >
                    {onInsertSection && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                        onClick={() => onInsertSection(section)}
                      >
                        <FileInputIcon />
                        {insertSectionLabel}
                      </Button>
                    )}
                    {onCopySection && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                        onClick={() => onCopySection(section)}
                      >
                        <CopyIcon />
                        {copySectionLabel}
                      </Button>
                    )}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </AiAnswerCard>
  )
}

export { AiSummary }
