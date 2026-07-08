"use client"

import * as React from "react"
import { TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Progress } from "@/registry/medcn/progress/progress"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/registry/medcn/radio-group/radio-group"

export interface ScaleOption {
  label: React.ReactNode
  value: number
}

export interface ScaleItem {
  id: string
  text: React.ReactNode
  /** Flag this item's positive answers separately from the aggregate (e.g. self-harm). */
  critical?: boolean
}

export interface ScaleBand {
  min: number
  max: number
  label: React.ReactNode
  variant?: "default" | "success" | "warning" | "destructive"
}

const bandText: Record<NonNullable<ScaleBand["variant"]>, string> = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning-foreground dark:text-warning",
  destructive: "text-destructive",
}

export interface QuestionnaireScaleProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  items: ScaleItem[]
  /** Shared answer options with point values, applied to every item. */
  options: ScaleOption[]
  value?: Record<string, number>
  defaultValue?: Record<string, number>
  onValueChange?: (value: Record<string, number>) => void
  /** Result bands keyed on the total score; only shown once every item is answered. */
  bands?: ScaleBand[]
  /** A critical item counts as flagged when its value passes this test. Default: > 0. */
  criticalWhen?: (value: number) => boolean
  disabled?: boolean
}

/**
 * Generalised Likert instrument (PHQ-9, GAD-7, …): a labelled radio row per
 * item with point values, a live running score, completion progress, and a
 * banded result shown only when every item is answered. Critical items surface
 * separately from the aggregate.
 */
function QuestionnaireScale({
  items,
  options,
  value,
  defaultValue,
  onValueChange,
  bands,
  criticalWhen = (v) => v > 0,
  disabled,
  className,
  ...props
}: QuestionnaireScaleProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<Record<string, number>>(
    defaultValue ?? {}
  )
  const answers = isControlled ? value : internal
  const baseId = React.useId()

  function commit(itemId: string, v: number) {
    const next = { ...answers, [itemId]: v }
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  const answeredCount = items.filter((i) => answers[i.id] !== undefined).length
  const complete = answeredCount === items.length && items.length > 0
  const total = items.reduce((sum, i) => sum + (answers[i.id] ?? 0), 0)
  const pct = items.length ? (answeredCount / items.length) * 100 : 0
  const band = complete
    ? bands?.find((b) => total >= b.min && total <= b.max)
    : undefined
  const flagged = items.filter(
    (i) => i.critical && answers[i.id] !== undefined && criticalWhen(answers[i.id]!)
  )

  return (
    <div
      data-slot="questionnaire-scale"
      className={cn("flex w-full max-w-xl flex-col gap-5", className)}
      {...props}
    >
      {/* Progress + running score */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs font-medium">
          <span className="text-muted-foreground">
            {answeredCount} of {items.length} answered
          </span>
          <span className="tabular-nums">
            Score <span className="font-semibold">{total}</span>
          </span>
        </div>
        <Progress
          value={pct}
          variant={complete ? "success" : "default"}
          aria-label={`${answeredCount} of ${items.length} items answered`}
        />
      </div>

      {/* Critical-item flag, kept separate from the total. */}
      {flagged.length > 0 && (
        <div
          role="alert"
          className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border px-3.5 py-3 text-sm"
        >
          <TriangleAlertIcon className="mt-0.5 size-4 shrink-0" aria-hidden />
          <div>
            <p className="font-semibold">Critical item flagged</p>
            <p className="text-destructive/80 text-xs">
              Review regardless of the total score.
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => {
          const selected = answers[item.id]
          const groupId = `${baseId}-${item.id}`
          return (
            <fieldset
              key={item.id}
              className={cn(
                "rounded-xl border px-4 py-3",
                item.critical
                  ? "border-destructive/25 bg-destructive/5"
                  : "border-border/60 bg-card"
              )}
            >
              <legend className="text-sm font-medium">
                <span className="text-muted-foreground mr-1.5 tabular-nums">
                  {idx + 1}.
                </span>
                {item.text}
              </legend>
              <RadioGroup
                className="mt-3 flex flex-wrap gap-x-4 gap-y-2"
                value={selected !== undefined ? String(selected) : undefined}
                onValueChange={(v) => commit(item.id, Number(v))}
                disabled={disabled}
                aria-label={typeof item.text === "string" ? item.text : undefined}
              >
                {options.map((opt) => {
                  const optId = `${groupId}-${opt.value}`
                  return (
                    <label
                      key={opt.value}
                      htmlFor={optId}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <RadioGroupItem id={optId} value={String(opt.value)} />
                      {opt.label}
                    </label>
                  )
                })}
              </RadioGroup>
            </fieldset>
          )
        })}
      </div>

      {/* Banded result — only once complete. */}
      {complete ? (
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
          <span className="text-sm font-medium">Total score</span>
          <span className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tabular-nums">{total}</span>
            {band && (
              <span
                className={cn(
                  "text-sm font-semibold",
                  bandText[band.variant ?? "default"]
                )}
              >
                {band.label}
              </span>
            )}
          </span>
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-xs">
          Answer all {items.length} items to see the total.
        </p>
      )}
    </div>
  )
}

export { QuestionnaireScale }
