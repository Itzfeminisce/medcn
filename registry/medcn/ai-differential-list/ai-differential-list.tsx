"use client"

import * as React from "react"
import {
  CheckIcon,
  ChevronDownIcon,
  HelpCircleIcon,
  MinusIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"
import { Progress } from "@/registry/medcn/progress/progress"
import { Separator } from "@/registry/medcn/separator/separator"

/** One caller-supplied candidate consideration. Never a diagnosis. */
export interface AiDifferentialConsideration {
  id: string
  /** The consideration, e.g. "Community-acquired pneumonia". */
  label: React.ReactNode
  /**
   * Model-reported likelihood, 0–100. Rendered only with its caveat: it is
   * the model's own number, not a clinical probability and not severity.
   */
  likelihood?: number
  /** Findings the model treats as supporting this consideration. */
  supporting?: React.ReactNode[]
  /** Findings that argue against it. Required for honest review. */
  contradicting?: React.ReactNode[]
  /** What would discriminate this consideration from the others. */
  gather?: React.ReactNode[]
  /** Free-text caveat for this row. */
  note?: React.ReactNode
}

export interface AiDifferentialListProps
  extends Omit<
    React.ComponentProps<typeof AiAnswerCard>,
    "title" | "children"
  > {
  title?: React.ReactNode
  /** Candidate considerations, in the order the caller wants them listed. */
  considerations: AiDifferentialConsideration[]
  /**
   * Red flags. Pass AiEscalationAlert nodes. Rendered above the list and
   * outside it — a critical possibility must never be a ranked row that a
   * low likelihood can bury.
   */
  redFlags?: React.ReactNode
  /** What the model could not weigh. Shown before the considerations. */
  uncertainty?: React.ReactNode
  /** Information to gather that applies across the whole list. */
  informationToGather?: React.ReactNode[]
  /** Hide the likelihood bars entirely. */
  showLikelihood?: boolean
  /** Ids of rows expanded on first render. */
  defaultExpanded?: string[]
  children?: React.ReactNode
}

function EvidenceLines({
  heading,
  items,
  tone,
  icon: Icon,
}: {
  heading: string
  items: React.ReactNode[]
  tone: string
  icon: React.ElementType
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
        {heading}
      </p>
      <ul className="flex list-none flex-col gap-1">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-muted-foreground flex gap-1.5 text-xs leading-relaxed"
          >
            <Icon className={cn("mt-0.5 size-3 shrink-0", tone)} aria-hidden />
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function AiDifferentialItem({
  className,
  consideration,
  position,
  showLikelihood = true,
  defaultOpen = false,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  consideration: AiDifferentialConsideration
  position: number
  showLikelihood?: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  const supporting = consideration.supporting ?? []
  const contradicting = consideration.contradicting ?? []
  const gather = consideration.gather ?? []
  const hasDetail =
    supporting.length > 0 ||
    contradicting.length > 0 ||
    gather.length > 0 ||
    Boolean(consideration.note)

  return (
    <li
      data-slot="ai-differential-item"
      className={cn("rounded-md border", className)}
      {...props}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          disabled={!hasDetail}
          className="focus-visible:ring-ring/40 flex w-full items-start gap-2.5 rounded-md px-3 py-2.5 text-left outline-none focus-visible:ring-2 disabled:cursor-default"
        >
          <span
            aria-hidden
            className="bg-muted text-muted-foreground mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[11px] font-semibold tabular-nums"
          >
            {position}
          </span>

          <span className="flex min-w-0 flex-1 flex-col gap-1.5">
            <span className="text-sm font-semibold">{consideration.label}</span>

            {showLikelihood && consideration.likelihood !== undefined && (
              <span className="flex items-center gap-2">
                <Progress
                  value={consideration.likelihood}
                  size="sm"
                  className="max-w-40"
                  aria-label={`Model-reported likelihood for ${
                    typeof consideration.label === "string"
                      ? consideration.label
                      : "this consideration"
                  }`}
                />
                <span className="text-muted-foreground text-[11px] tabular-nums">
                  {consideration.likelihood}% model-reported
                </span>
              </span>
            )}
          </span>

          {hasDetail && (
            <ChevronDownIcon
              aria-hidden
              className={cn(
                "text-muted-foreground mt-0.5 size-4 shrink-0 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="flex flex-col gap-3 border-t px-3 py-2.5 pl-10">
            {supporting.length > 0 && (
              <EvidenceLines
                heading="Supporting"
                items={supporting}
                tone="text-success"
                icon={CheckIcon}
              />
            )}
            {contradicting.length > 0 && (
              <EvidenceLines
                heading="Against"
                items={contradicting}
                tone="text-destructive"
                icon={MinusIcon}
              />
            )}
            {gather.length > 0 && (
              <EvidenceLines
                heading="Would discriminate"
                items={gather}
                tone="text-muted-foreground"
                icon={HelpCircleIcon}
              />
            )}
            {consideration.note && (
              <p className="text-muted-foreground border-border/70 border-l-2 pl-2.5 text-xs leading-relaxed">
                {consideration.note}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </li>
  )
}

/**
 * Candidate considerations for a clinician to work through — supporting and
 * contradicting evidence, model-reported likelihood, and the information that
 * would discriminate between them. It is not a diagnosis and its order is not
 * a severity ranking; red flags are rendered in a separate escalation slot
 * above the list so that a dangerous possibility can never be buried by a low
 * likelihood.
 */
function AiDifferentialList({
  className,
  title = "Considerations for review",
  considerations,
  redFlags,
  uncertainty,
  informationToGather,
  showLikelihood = true,
  defaultExpanded,
  limitations,
  children,
  ...props
}: AiDifferentialListProps) {
  const expanded = new Set(defaultExpanded ?? [])

  return (
    <AiAnswerCard
      data-slot="ai-differential-list"
      className={cn(className)}
      title={title}
      generatedLabel="For review"
      limitations={
        limitations ?? (
          <>
            These are candidate considerations, not a diagnosis, and their order
            is not a ranking of danger — a low-likelihood item can be the one
            that harms the patient. Likelihood is the model&apos;s own reported
            number, not a clinical probability. Nothing here replaces
            examination, local protocol, or clinical judgement.
          </>
        )
      }
      {...props}
    >
      <div className="flex flex-col gap-3">
        {redFlags && (
          <div
            data-slot="ai-differential-list-red-flags"
            className="flex flex-col gap-2"
          >
            {redFlags}
          </div>
        )}

        {uncertainty && (
          <p
            data-slot="ai-differential-list-uncertainty"
            className="text-muted-foreground border-border/70 border-l-2 pl-2.5 text-xs leading-relaxed"
          >
            {uncertainty}
          </p>
        )}

        <ul className="flex list-none flex-col gap-2">
          {considerations.map((consideration, index) => (
            <AiDifferentialItem
              key={consideration.id}
              consideration={consideration}
              position={index + 1}
              showLikelihood={showLikelihood}
              defaultOpen={expanded.has(consideration.id)}
            />
          ))}
        </ul>

        {informationToGather && informationToGather.length > 0 && (
          <>
            <Separator />
            <div
              data-slot="ai-differential-list-gather"
              className="flex flex-col gap-1.5"
            >
              <p className="text-xs font-semibold">
                Information suggested to narrow this list
              </p>
              <ul className="flex list-none flex-col gap-1">
                {informationToGather.map((item, index) => (
                  <li
                    key={index}
                    className="text-muted-foreground flex gap-1.5 text-xs leading-relaxed"
                  >
                    <HelpCircleIcon
                      className="mt-0.5 size-3 shrink-0"
                      aria-hidden
                    />
                    <span className="min-w-0">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {children}
      </div>
    </AiAnswerCard>
  )
}

export { AiDifferentialList, AiDifferentialItem }
