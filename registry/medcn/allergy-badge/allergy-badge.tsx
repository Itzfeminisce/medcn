import * as React from "react"
import { ShieldAlertIcon, ShieldCheckIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type AllergySeverity = "mild" | "moderate" | "severe"

const severityMeta: Record<
  AllergySeverity,
  {
    label: string
    /** Number of lit pips (of 3) in the severity meter. */
    pips: number
    /** Chip container tone. */
    chip: string
    /** Lit-pip + accent tone. */
    accent: string
  }
> = {
  mild: {
    label: "Mild",
    pips: 1,
    chip: "bg-info/10 border-info/20 text-info",
    accent: "bg-info",
  },
  moderate: {
    label: "Moderate",
    pips: 2,
    chip: "bg-warning/15 border-warning/25 text-warning-foreground dark:text-warning",
    accent: "bg-warning",
  },
  severe: {
    label: "Severe",
    pips: 3,
    chip: "bg-destructive/10 border-destructive/25 text-destructive",
    accent: "bg-destructive",
  },
}

export interface AllergyBadgeProps {
  /** Allergen name, e.g. "Penicillin". */
  label: React.ReactNode
  severity?: AllergySeverity
  /** Shown in tooltip, e.g. "Anaphylaxis". */
  reaction?: React.ReactNode
  className?: string
}

/** Three-dot severity meter — lit pips convey severity without relying on color. */
function SeverityPips({ severity }: { severity: AllergySeverity }) {
  const { pips, accent } = severityMeta[severity]
  return (
    <span
      data-slot="allergy-badge-severity"
      className="ml-0.5 flex items-center gap-0.5"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full transition-colors",
            i < pips ? accent : "bg-current opacity-20"
          )}
        />
      ))}
    </span>
  )
}

/** Severity-coded allergy chip with a pip meter and optional reaction tooltip. */
function AllergyBadge({ label, severity, reaction, className }: AllergyBadgeProps) {
  const meta = severity ? severityMeta[severity] : undefined
  const accessibleName = [
    typeof label === "string" ? label : "Allergy",
    meta ? `${meta.label} severity` : undefined,
    reaction && typeof reaction === "string" ? `reaction ${reaction}` : undefined,
  ]
    .filter(Boolean)
    .join(", ")

  const chip = (
    <span
      data-slot="allergy-badge"
      data-severity={severity}
      aria-label={accessibleName}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-shadow hover:shadow-soft",
        meta ? meta.chip : "bg-muted/50 border-border/60 text-foreground",
        className
      )}
    >
      {severity === "severe" && (
        <ShieldAlertIcon className="size-3.5 shrink-0" aria-hidden />
      )}
      <span className="truncate">{label}</span>
      {meta && <SeverityPips severity={severity!} />}
      {meta && <span className="sr-only"> — {meta.label} severity</span>}
    </span>
  )

  if (!reaction) return chip

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent>
        {meta && (
          <p className="font-semibold">
            {typeof label === "string" ? label : "Allergen"} · {meta.label}
          </p>
        )}
        <p className="text-background/70 text-[11px]">Reaction: {reaction}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export interface AllergyListProps {
  allergies: AllergyBadgeProps[]
  /** Collapse extras beyond this count into a "+N more" popover. */
  max?: number
  emptyLabel?: React.ReactNode
  className?: string
}

/** Overflow-collapsing allergy chip list with a reassuring NKA empty state. */
function AllergyList({
  allergies,
  max = 4,
  emptyLabel = "No known allergies (NKA)",
  className,
}: AllergyListProps) {
  if (allergies.length === 0) {
    return (
      <span
        data-slot="allergy-list"
        data-empty="true"
        className={cn(
          "bg-success/10 text-success inline-flex items-center gap-1.5 rounded-full border border-success/20 px-2.5 py-1 text-xs font-medium",
          className
        )}
      >
        <ShieldCheckIcon className="size-3.5 shrink-0" aria-hidden />
        {emptyLabel}
      </span>
    )
  }

  // Surface the most severe allergies first so overflow hides the least critical.
  const rank: Record<AllergySeverity, number> = { severe: 3, moderate: 2, mild: 1 }
  const sorted = [...allergies].sort(
    (a, b) => (rank[b.severity ?? "mild"] ?? 0) - (rank[a.severity ?? "mild"] ?? 0)
  )
  const visible = sorted.slice(0, max)
  const overflow = sorted.slice(max)

  return (
    <div
      data-slot="allergy-list"
      className={cn("flex flex-wrap items-center gap-1.5", className)}
    >
      {visible.map((a, i) => (
        <AllergyBadge key={i} {...a} />
      ))}
      {overflow.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <button
              data-slot="allergy-list-overflow"
              className="bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground focus-visible:ring-ring inline-flex items-center rounded-full border border-border/60 px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2"
              aria-label={`Show ${overflow.length} more ${overflow.length === 1 ? "allergy" : "allergies"}`}
            >
              +{overflow.length} more
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto max-w-xs">
            <p className="text-muted-foreground mb-2 text-[11px] font-medium uppercase tracking-wide">
              {overflow.length} more {overflow.length === 1 ? "allergy" : "allergies"}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {overflow.map((a, i) => (
                <AllergyBadge key={i} {...a} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export { AllergyBadge, AllergyList }
