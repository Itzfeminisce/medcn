"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

export type RosAnswer = "yes" | "no" | "unknown"

export interface RosSymptom {
  id: string
  label: React.ReactNode
}

export interface RosSystem {
  id: string
  label: React.ReactNode
  symptoms: RosSymptom[]
}

/** Answers keyed by symptom id. Absent = not asked (distinct from "no"). */
export type RosValue = Record<string, RosAnswer>

export interface ReviewOfSystemsFormProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  systems: RosSystem[]
  value?: RosValue
  defaultValue?: RosValue
  onValueChange?: (value: RosValue) => void
  disabled?: boolean
}

/**
 * Review of systems: collapsible sections per system, each symptom a
 * yes/no/unknown toggle, with a per-system "all negative" quick-set and a
 * running positives summary. "Unknown" and "not asked" stay distinct from "no".
 */
function ReviewOfSystemsForm({
  systems,
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: ReviewOfSystemsFormProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<RosValue>(defaultValue ?? {})
  const answers = isControlled ? value : internal

  function commit(next: RosValue) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function setAnswer(symptomId: string, answer: RosAnswer) {
    commit({ ...answers, [symptomId]: answer })
  }

  function allNegative(system: RosSystem) {
    // Records an explicit "no" per item — never a blank.
    const next = { ...answers }
    for (const s of system.symptoms) next[s.id] = "no"
    commit(next)
  }

  const positives = systems.flatMap((sys) =>
    sys.symptoms.filter((s) => answers[s.id] === "yes")
  )

  return (
    <div
      data-slot="review-of-systems-form"
      className={cn("flex w-full max-w-xl flex-col gap-3", className)}
      {...props}
    >
      {/* Positives summary on top */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-border/60 bg-muted/40 px-3.5 py-3">
        <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
          Positives
        </span>
        {positives.length === 0 ? (
          <span className="text-muted-foreground text-sm">None recorded</span>
        ) : (
          positives.map((s) => (
            <Badge key={s.id} variant="warning">
              {s.label}
            </Badge>
          ))
        )}
      </div>

      {systems.map((system) => {
        const answered = system.symptoms.filter(
          (s) => answers[s.id] !== undefined
        ).length
        const posCount = system.symptoms.filter(
          (s) => answers[s.id] === "yes"
        ).length
        return (
          <Collapsible
            key={system.id}
            defaultOpen={false}
            className="rounded-xl border border-border/60 bg-card"
          >
            <CollapsibleTrigger className="group/ros flex w-full items-center justify-between gap-3 px-4 py-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/40 rounded-xl">
              <span className="flex items-center gap-2 text-sm font-semibold">
                {system.label}
                {posCount > 0 && (
                  <Badge variant="warning">{posCount} positive</Badge>
                )}
              </span>
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs tabular-nums">
                  {answered}/{system.symptoms.length}
                </span>
                <ChevronDownIcon className="text-muted-foreground size-4 transition-transform group-data-[state=open]/ros:rotate-180" />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t border-border/60 px-4 py-3">
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => allNegative(system)}
                  disabled={disabled}
                  className="text-primary inline-flex items-center gap-1 text-xs font-medium hover:underline disabled:opacity-50"
                >
                  <CheckIcon className="size-3.5" />
                  All negative
                </button>
              </div>
              <div className="flex flex-col gap-2.5">
                {system.symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm">{symptom.label}</span>
                    <ToggleGroup
                      type="single"
                      variant="outline"
                      size="sm"
                      value={answers[symptom.id] ?? ""}
                      onValueChange={(v) =>
                        v && setAnswer(symptom.id, v as RosAnswer)
                      }
                      disabled={disabled}
                      aria-label={
                        typeof symptom.label === "string"
                          ? symptom.label
                          : undefined
                      }
                    >
                      <ToggleGroupItem value="yes">Yes</ToggleGroupItem>
                      <ToggleGroupItem value="no">No</ToggleGroupItem>
                      <ToggleGroupItem value="unknown">?</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}

export { ReviewOfSystemsForm }
