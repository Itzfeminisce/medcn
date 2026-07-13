import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { DatabaseIcon, PillIcon, SearchXIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import { Badge } from "@/registry/medcn/badge/badge"

export type AiMedicationSeverity =
  | "contraindicated"
  | "major"
  | "moderate"
  | "minor"
  | "info"

/** Presentation order — highest-consequence findings first. */
export const aiMedicationSeverities = [
  "contraindicated",
  "major",
  "moderate",
  "minor",
  "info",
] as const satisfies readonly AiMedicationSeverity[]

const SEVERITY_CONFIG: Record<
  AiMedicationSeverity,
  {
    label: string
    badge: "destructive" | "warning" | "secondary" | "info"
  }
> = {
  contraindicated: { label: "Contraindicated", badge: "destructive" },
  major: { label: "Major", badge: "destructive" },
  moderate: { label: "Moderate", badge: "warning" },
  minor: { label: "Minor", badge: "secondary" },
  info: { label: "Informational", badge: "info" },
}

const aiMedicationFindingVariants = cva(
  "flex flex-col gap-2 rounded-md border border-l-2 px-3 py-2.5",
  {
    variants: {
      severity: {
        contraindicated: "border-l-destructive bg-destructive/5",
        major: "border-l-destructive",
        moderate: "border-l-warning",
        minor: "border-l-muted-foreground/50",
        info: "border-l-info",
      },
    },
    defaultVariants: {
      severity: "info",
    },
  }
)

/** One caller-supplied finding returned by the checking service. */
export interface AiMedicationFinding {
  id: string
  /** The interaction or issue, e.g. "Warfarin + Ibuprofen". */
  title: React.ReactNode
  severity: AiMedicationSeverity
  /** The medications the finding involves. */
  medications?: string[]
  /** What the source says about the finding. Quote it; do not paraphrase. */
  description?: React.ReactNode
  /** The source's recommended action for a human to consider. */
  recommendation?: React.ReactNode
  /** The source's own documentation/evidence grading, verbatim. */
  documentation?: React.ReactNode
  /** Provenance for this finding — typically an AiEvidencePanel. */
  evidence?: React.ReactNode
}

/** The validated checking service that produced the findings. */
export interface AiMedicationCheckSource {
  /** Service name, e.g. "First Databank". */
  name: React.ReactNode
  /** Knowledge-base version — findings are only as current as this. */
  version?: React.ReactNode
  /** When the check ran / the data was retrieved. */
  retrievedAt?: React.ReactNode
}

export interface AiMedicationCheckProps
  extends Omit<
    React.ComponentProps<typeof AiAnswerCard>,
    "title" | "children" | "metadata"
  > {
  title?: React.ReactNode
  /** Findings as returned by the checking service. Never computed here. */
  findings: AiMedicationFinding[]
  /** Required. A finding with no attributable source is not reviewable. */
  source: AiMedicationCheckSource
  /** The medications that were screened — makes the coverage gap visible. */
  screened?: string[]
  /**
   * Shown when `findings` is empty. The default deliberately does not
   * reassure: an empty result is not a safety claim.
   */
  emptyState?: React.ReactNode
  /** Extra caller content rendered under the findings. */
  children?: React.ReactNode
}

function AiMedicationFindingItem({
  finding,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  finding: AiMedicationFinding
}) {
  const config = SEVERITY_CONFIG[finding.severity]

  return (
    <li
      data-slot="ai-medication-check-finding"
      data-severity={finding.severity}
      className={cn(
        aiMedicationFindingVariants({ severity: finding.severity }),
        className
      )}
      {...props}
    >
      <div className="flex flex-wrap items-center gap-2">
        <PillIcon
          className="text-muted-foreground size-3.5 shrink-0"
          aria-hidden
        />
        <span className="min-w-0 text-sm font-semibold">{finding.title}</span>
        <Badge
          variant={config.badge}
          className="h-4 shrink-0 px-1.5 py-0 text-[10px] font-bold uppercase"
        >
          {config.label}
        </Badge>
      </div>

      {finding.medications && finding.medications.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {finding.medications.map((medication) => (
            <Badge
              key={medication}
              variant="outline"
              className="h-5 font-normal"
            >
              {medication}
            </Badge>
          ))}
        </div>
      )}

      {finding.description && (
        <p className="text-muted-foreground text-xs leading-relaxed">
          {finding.description}
        </p>
      )}

      {finding.recommendation && (
        <p className="text-xs leading-relaxed">
          <span className="font-semibold">Source recommends reviewing:</span>{" "}
          <span className="text-muted-foreground">{finding.recommendation}</span>
        </p>
      )}

      {finding.documentation && (
        <p className="text-muted-foreground text-[11px]">
          Documentation as graded by the source: {finding.documentation}
        </p>
      )}

      {finding.evidence}
    </li>
  )
}

/**
 * Presentation layer for medication-review findings returned by a validated
 * checking service. It performs no interaction checking of its own: it groups
 * caller-supplied findings by severity, names the service and version behind
 * them, and hands the decision to a human. An empty result is rendered as an
 * absence of findings, never as a statement that the order is safe.
 */
function AiMedicationCheck({
  className,
  title = "Medication review",
  findings,
  source,
  screened,
  emptyState,
  limitations,
  children,
  ...props
}: AiMedicationCheckProps) {
  const grouped = aiMedicationSeverities
    .map((severity) => ({
      severity,
      items: findings.filter((finding) => finding.severity === severity),
    }))
    .filter((group) => group.items.length > 0)

  const metadata = (
    <span className="inline-flex flex-wrap items-center gap-1">
      <DatabaseIcon className="size-3 shrink-0" aria-hidden />
      <span>
        {source.name}
        {source.version ? <> {source.version}</> : null}
        {source.retrievedAt ? <> · retrieved {source.retrievedAt}</> : null}
      </span>
    </span>
  )

  return (
    <AiAnswerCard
      data-slot="ai-medication-check"
      className={cn(className)}
      title={title}
      generatedLabel="For review"
      metadata={metadata}
      limitations={
        limitations ?? (
          <>
            Screening reflects only the medications listed and the source
            version above. It does not confirm that this order is appropriate
            or safe — dose, indication, allergies, renal and hepatic function,
            and local protocol must be checked by the prescriber.
          </>
        )
      }
      {...props}
    >
      <div className="flex flex-col gap-3">
        {screened && screened.length > 0 && (
          <div
            data-slot="ai-medication-check-screened"
            className="flex flex-wrap items-center gap-1.5"
          >
            <span className="text-muted-foreground text-xs font-semibold">
              Screened
            </span>
            {screened.map((medication) => (
              <Badge
                key={medication}
                variant="soft"
                className="h-5 font-normal"
              >
                {medication}
              </Badge>
            ))}
          </div>
        )}

        {grouped.length === 0 ? (
          <div
            data-slot="ai-medication-check-empty"
            className="text-muted-foreground flex gap-2.5 rounded-md border border-dashed px-3 py-3 text-xs leading-relaxed"
          >
            <SearchXIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="flex flex-col gap-1">
              {emptyState ?? (
                <>
                  <span className="text-foreground font-semibold">
                    No findings returned for the medications screened.
                  </span>
                  <span>
                    This is not a statement that the order is safe. The source
                    may not cover this combination, the list screened may be
                    incomplete, and patient-specific factors are outside its
                    scope. Review as you would an unchecked order.
                  </span>
                </>
              )}
            </div>
          </div>
        ) : (
          grouped.map((group) => (
            <section
              key={group.severity}
              data-slot="ai-medication-check-group"
              data-severity={group.severity}
              className="flex flex-col gap-2"
            >
              <h3 className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                {SEVERITY_CONFIG[group.severity].label} ({group.items.length})
              </h3>
              <ul className="flex list-none flex-col gap-2">
                {group.items.map((finding) => (
                  <AiMedicationFindingItem key={finding.id} finding={finding} />
                ))}
              </ul>
            </section>
          ))
        )}

        {children}
      </div>
    </AiAnswerCard>
  )
}

export {
  AiMedicationCheck,
  AiMedicationFindingItem,
  aiMedicationFindingVariants,
  SEVERITY_CONFIG as aiMedicationSeverityConfig,
}
export type AiMedicationFindingVariants = VariantProps<
  typeof aiMedicationFindingVariants
>
