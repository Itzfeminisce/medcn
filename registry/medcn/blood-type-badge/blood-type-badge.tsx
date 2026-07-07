import * as React from "react"
import { DropletIcon, HelpCircleIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge, badgeVariants } from "@/registry/medcn/badge/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"

export type AboGroup = "O" | "A" | "B" | "AB"
export type RhFactor = "+" | "-"
export type BloodType =
  | "O-"
  | "O+"
  | "A-"
  | "A+"
  | "B-"
  | "B+"
  | "AB-"
  | "AB+"

/**
 * Static ABO/Rh red-cell compatibility. Informational only — a real
 * transfusion requires a crossmatch, never a lookup table.
 */
const RBC_COMPAT: Record<
  BloodType,
  { receiveFrom: BloodType[]; donateTo: BloodType[] }
> = {
  "O-": {
    receiveFrom: ["O-"],
    donateTo: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
  },
  "O+": { receiveFrom: ["O-", "O+"], donateTo: ["O+", "A+", "B+", "AB+"] },
  "A-": { receiveFrom: ["O-", "A-"], donateTo: ["A-", "A+", "AB-", "AB+"] },
  "A+": {
    receiveFrom: ["O-", "O+", "A-", "A+"],
    donateTo: ["A+", "AB+"],
  },
  "B-": { receiveFrom: ["O-", "B-"], donateTo: ["B-", "B+", "AB-", "AB+"] },
  "B+": {
    receiveFrom: ["O-", "O+", "B-", "B+"],
    donateTo: ["B+", "AB+"],
  },
  "AB-": {
    receiveFrom: ["O-", "A-", "B-", "AB-"],
    donateTo: ["AB-", "AB+"],
  },
  "AB+": {
    receiveFrom: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
    donateTo: ["AB+"],
  },
}

/** Proper minus sign (−, U+2212) reads better than a hyphen in the chip. */
const RH_SYMBOL: Record<RhFactor, string> = { "+": "+", "-": "−" }

export interface BloodTypeBadgeProps {
  group: AboGroup
  rh: RhFactor
  /** Self-reported vs lab-confirmed — self-reported is never enough for transfusion. */
  unverified?: boolean
  /** Show the compatibility popover. Default: true. */
  showCompatibility?: boolean
  className?: string
}

function TypeChips({ types }: { types: BloodType[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {types.map((t) => (
        <span
          key={t}
          className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums"
        >
          {t.replace("-", "−")}
        </span>
      ))}
    </div>
  )
}

/**
 * ABO/Rh blood-type chip in a fixed monospace treatment, with an optional
 * popover listing red-cell donor/recipient compatibility. Self-reported types
 * render an `unverified` state — the component is informational, not a
 * crossmatch, and forces UIs to distinguish reported from lab-confirmed.
 */
function BloodTypeBadge({
  group,
  rh,
  unverified = false,
  showCompatibility = true,
  className,
}: BloodTypeBadgeProps) {
  const type = `${group}${rh}` as BloodType
  const display = `${group} ${RH_SYMBOL[rh]}`
  const spoken = `${group} ${rh === "+" ? "positive" : "negative"}`
  const accessibleName = `Blood type ${spoken}${
    unverified ? ", self-reported and unverified" : ""
  }`
  const compat = RBC_COMPAT[type]

  const chipClass = cn(
    badgeVariants({ variant: unverified ? "warning" : "outline" }),
    "gap-1 font-mono text-sm tracking-tight tabular-nums",
    unverified && "border-dashed",
    className
  )

  if (!showCompatibility) {
    return (
      <Badge
        data-slot="blood-type-badge"
        data-type={type}
        data-unverified={unverified || undefined}
        variant={unverified ? "warning" : "outline"}
        aria-label={accessibleName}
        className={cn(
          "gap-1 font-mono text-sm tracking-tight tabular-nums",
          unverified && "border-dashed",
          className
        )}
      >
        {display}
        {unverified && <HelpCircleIcon className="size-3" aria-hidden />}
      </Badge>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          data-slot="blood-type-badge"
          data-type={type}
          data-unverified={unverified || undefined}
          aria-label={`${accessibleName}. Show compatibility.`}
          className={cn(
            chipClass,
            "focus-visible:ring-ring cursor-pointer transition-shadow hover:shadow-soft focus-visible:outline-none focus-visible:ring-2"
          )}
        >
          {display}
          {unverified && <HelpCircleIcon className="size-3" aria-hidden />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="mb-3 flex items-center gap-2">
          <span className="bg-destructive/10 text-destructive flex size-8 shrink-0 items-center justify-center rounded-lg">
            <DropletIcon className="size-4" aria-hidden />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-mono text-base font-bold tabular-nums">
              {display}
            </span>
            <span
              className={cn(
                "text-[11px] font-medium",
                unverified
                  ? "text-warning-foreground dark:text-warning"
                  : "text-muted-foreground"
              )}
            >
              {unverified ? "Self-reported · unverified" : "Lab-confirmed"}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          <div>
            <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wide">
              Can receive from
            </p>
            <TypeChips types={compat.receiveFrom} />
          </div>
          <div>
            <p className="text-muted-foreground mb-1 text-[10px] font-semibold uppercase tracking-wide">
              Can donate to
            </p>
            <TypeChips types={compat.donateTo} />
          </div>
        </div>

        <p className="text-muted-foreground/80 mt-3 border-t border-border/60 pt-2 text-[10px] leading-snug">
          Red-cell compatibility only. Always crossmatch before transfusion
          {unverified ? "; self-reported type is not sufficient." : "."}
        </p>
      </PopoverContent>
    </Popover>
  )
}

export { BloodTypeBadge, RBC_COMPAT }
