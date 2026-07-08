"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  BloodPressureBadge,
  classifyBP,
} from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge"
import {
  BloodPressureInput,
  type BloodPressureValue,
} from "@/registry/medcn/blood-pressure-input/blood-pressure-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/medcn/card/card"
import { DateField } from "@/registry/medcn/date-field/date-field"
import { Field } from "@/registry/medcn/field/field"
import {
  GlucoseLogInput,
  type GlucoseLogValue,
} from "@/registry/medcn/glucose-log-input/glucose-log-input"
import { Input } from "@/registry/medcn/input/input"
import { Progress } from "@/registry/medcn/progress/progress"
import { Spo2Dial } from "@/registry/medcn/spo2-dial/spo2-dial"
import { TemperatureField } from "@/registry/medcn/temperature-field/temperature-field"

export interface VitalsSet {
  /** ISO datetime the set was taken. */
  takenAt: string
  bp: BloodPressureValue
  /** Heart rate, bpm. */
  hr: number | null
  /** Respiratory rate, breaths/min. */
  rr: number | null
  /** Temperature, canonical °C. */
  temp: number | null
  /** Oxygen saturation, %. */
  spo2: number | null
  glucose: GlucoseLogValue | null
}

function nowLocalISO(): string {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16)
}

function emptySet(): VitalsSet {
  return {
    takenAt: nowLocalISO(),
    bp: { systolic: null, diastolic: null },
    hr: null,
    rr: null,
    temp: null,
    spo2: null,
    glucose: null,
  }
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export interface VitalsEntryFormProps
  extends Omit<
    React.ComponentProps<"div">,
    "onChange" | "defaultValue" | "title"
  > {
  defaultValue?: Partial<VitalsSet>
  onValueChange?: (value: VitalsSet) => void
  title?: React.ReactNode
  disabled?: boolean
}

/**
 * A full vitals set (BP, HR, RR, temp, SpO₂, glucose) in one card, each row
 * reusing the single-vital fields, with a live summary and a completeness
 * indicator. Partial sets are valid — nothing is required.
 */
function VitalsEntryForm({
  defaultValue,
  onValueChange,
  title = "Record vitals",
  disabled,
  className,
  ...props
}: VitalsEntryFormProps) {
  const [set, setSet] = React.useState<VitalsSet>(() => ({
    ...emptySet(),
    ...defaultValue,
  }))

  function patch(p: Partial<VitalsSet>) {
    setSet((prev) => {
      const next = { ...prev, ...p }
      onValueChange?.(next)
      return next
    })
  }

  const bpComplete = set.bp.systolic != null && set.bp.diastolic != null
  const filled = [
    bpComplete,
    set.hr != null,
    set.rr != null,
    set.temp != null,
    set.spo2 != null,
    set.glucose?.value != null,
  ]
  const count = filled.filter(Boolean).length

  return (
    <Card
      data-slot="vitals-entry-form"
      className={cn("w-full max-w-md", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <span className="text-muted-foreground text-xs font-normal tabular-nums">
            {count}/6 recorded
          </span>
        </CardTitle>
        <Progress
          value={(count / 6) * 100}
          size="sm"
          className="mt-2"
          aria-label={`${count} of 6 vitals recorded`}
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Taken at</span>
          <div className="flex flex-wrap items-center gap-2">
            <DateField
              value={set.takenAt.split("T")[0] ?? ""}
              onValueChange={(iso) =>
                patch({
                  takenAt: `${iso ?? ""}T${set.takenAt.split("T")[1] ?? "00:00"}`,
                })
              }
              disabled={disabled}
            />
            <Input
              type="time"
              aria-label="Time taken"
              disabled={disabled}
              value={set.takenAt.split("T")[1] ?? ""}
              onChange={(e) =>
                patch({
                  takenAt: `${set.takenAt.split("T")[0] ?? ""}T${e.target.value}`,
                })
              }
              className="w-32 dark:[color-scheme:dark]"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Blood pressure</span>
          <BloodPressureInput
            value={set.bp}
            onValueChange={(bp) => patch({ bp })}
            showBadge={false}
            disabled={disabled}
            className="max-w-none"
          />
        </div>

        <div className="flex items-start gap-3">
          <Field label="Heart rate" className="flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="bpm"
              disabled={disabled}
              value={set.hr ?? ""}
              onChange={(e) => patch({ hr: parseNum(e.target.value) })}
            />
          </Field>
          <Field label="Resp. rate" className="flex-1">
            <Input
              type="number"
              inputMode="numeric"
              placeholder="/min"
              disabled={disabled}
              value={set.rr ?? ""}
              onChange={(e) => patch({ rr: parseNum(e.target.value) })}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Temperature</span>
          <TemperatureField
            label={null}
            defaultValue={set.temp}
            onValueChange={(temp) => patch({ temp })}
            disabled={disabled}
            className="max-w-none"
          />
        </div>

        <Field label="Oxygen saturation (SpO₂)">
          <Input
            type="number"
            inputMode="numeric"
            placeholder="%"
            disabled={disabled}
            value={set.spo2 ?? ""}
            onChange={(e) => patch({ spo2: parseNum(e.target.value) })}
          />
        </Field>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium">Blood glucose</span>
          <GlucoseLogInput
            defaultValue={set.glucose ?? undefined}
            onValueChange={(glucose) => patch({ glucose })}
            showBadge={false}
            disabled={disabled}
            className="max-w-none"
          />
        </div>

        {/* Live summary */}
        {(bpComplete || set.spo2 != null) && (
          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
            {bpComplete && (
              <BloodPressureBadge
                systolic={set.bp.systolic!}
                diastolic={set.bp.diastolic!}
                category={classifyBP(set.bp.systolic!, set.bp.diastolic!)}
                size="sm"
              />
            )}
            {set.spo2 != null && <Spo2Dial value={set.spo2} size="sm" />}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { VitalsEntryForm }
