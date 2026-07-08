"use client"

import * as React from "react"
import { ClockIcon, PlusIcon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type DoseFrequency = "OD" | "BD" | "TDS" | "QDS" | "custom"

export interface FrequencyScheduleValue {
  frequency: DoseFrequency
  /** Dose times as "HH:MM" strings, in the patient's local timezone. */
  times: string[]
}

const FREQUENCIES: { value: DoseFrequency; label: string; full: string }[] = [
  { value: "OD", label: "OD", full: "Once daily" },
  { value: "BD", label: "BD", full: "Twice daily" },
  { value: "TDS", label: "TDS", full: "Three times daily" },
  { value: "QDS", label: "QDS", full: "Four times daily" },
  { value: "custom", label: "Custom", full: "Custom times" },
]

const DEFAULT_TIMES: Record<Exclude<DoseFrequency, "custom">, string[]> = {
  OD: ["09:00"],
  BD: ["08:00", "20:00"],
  TDS: ["08:00", "14:00", "20:00"],
  QDS: ["06:00", "12:00", "18:00", "22:00"],
}

const EMPTY: FrequencyScheduleValue = { frequency: "OD", times: DEFAULT_TIMES.OD }

export interface FrequencyScheduleFieldProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: FrequencyScheduleValue
  defaultValue?: FrequencyScheduleValue
  onValueChange?: (value: FrequencyScheduleValue) => void
  disabled?: boolean
}

/**
 * Turns a dose frequency (OD/BD/TDS/QDS/custom) into an editable list of dose
 * times, keeping the chosen frequency alongside the concrete times.
 */
function FrequencyScheduleField({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: FrequencyScheduleFieldProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<FrequencyScheduleValue>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal

  function commit(next: FrequencyScheduleValue) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function changeFrequency(freq: DoseFrequency) {
    if (freq === "custom") {
      commit({ frequency: "custom", times: current.times })
    } else {
      // A preset implies a concrete default schedule the user can then adjust.
      commit({ frequency: freq, times: [...DEFAULT_TIMES[freq]] })
    }
  }

  function changeTime(index: number, time: string) {
    commit({
      ...current,
      times: current.times.map((t, i) => (i === index ? time : t)),
    })
  }

  function addTime() {
    commit({ ...current, times: [...current.times, "12:00"] })
  }

  function removeTime(index: number) {
    commit({ ...current, times: current.times.filter((_, i) => i !== index) })
  }

  const isCustom = current.frequency === "custom"

  return (
    <div
      data-slot="frequency-schedule-field"
      className={cn("flex w-full max-w-sm flex-col gap-4", className)}
      {...props}
    >
      <Field label="Frequency">
        {() => (
          <ToggleGroup
            type="single"
            variant="outline"
            value={current.frequency}
            onValueChange={(v) => v && changeFrequency(v as DoseFrequency)}
            disabled={disabled}
            className="w-full"
          >
            {FREQUENCIES.map((f) => (
              <Tooltip key={f.value}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value={f.value} aria-label={f.full}>
                    {f.label}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>{f.full}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        )}
      </Field>

      <Field label="Dose times">
        {() => (
          <div className="flex flex-col gap-2">
            {current.times.length === 0 && (
              <p className="text-muted-foreground text-xs">
                No times yet — add one below.
              </p>
            )}
            {current.times.map((time, i) => (
              <div key={i} className="flex items-center gap-2">
                <ClockIcon
                  className="text-muted-foreground size-4 shrink-0"
                  aria-hidden
                />
                <Input
                  type="time"
                  aria-label={`Dose time ${i + 1}`}
                  disabled={disabled}
                  value={time}
                  onChange={(e) => changeTime(i, e.target.value)}
                  className="w-36"
                />
                {isCustom && (
                  <button
                    type="button"
                    onClick={() => removeTime(i)}
                    disabled={disabled}
                    aria-label={`Remove dose time ${i + 1}`}
                    className="text-muted-foreground hover:text-foreground rounded-full p-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:opacity-50"
                  >
                    <XIcon className="size-4" />
                  </button>
                )}
              </div>
            ))}
            {isCustom && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTime}
                disabled={disabled}
                className="w-fit"
              >
                <PlusIcon />
                Add time
              </Button>
            )}
          </div>
        )}
      </Field>
    </div>
  )
}

export { FrequencyScheduleField, DEFAULT_TIMES }
