"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Field } from "@/registry/medcn/field/field"
import { Input } from "@/registry/medcn/input/input"
import { Label } from "@/registry/medcn/label/label"
import { RouteOfAdministrationField } from "@/registry/medcn/route-of-administration-field/route-of-administration-field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/registry/medcn/select/select"
import { Switch } from "@/registry/medcn/switch/switch"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

const DOSE_UNITS = [
  "tab",
  "capsule",
  "mL",
  "mg",
  "mcg",
  "g",
  "puff",
  "drop",
  "unit",
  "patch",
  "spray",
  "sachet",
]

const FREQUENCIES: { value: string; full: string }[] = [
  { value: "OD", full: "Once daily" },
  { value: "BD", full: "Twice daily" },
  { value: "TDS", full: "Three times daily" },
  { value: "QDS", full: "Four times daily" },
]

export interface DosageSig {
  amount: number | null
  unit: string
  route: string | undefined
  frequency: string | undefined
  prn: boolean
  indication: string
}

export interface DosageValue extends DosageSig {
  /** Human-readable sig assembled from the structured parts, e.g. "1 tab PO TDS PRN pain". */
  text: string
  /** Whether the sig has every required part (and an indication if PRN). */
  complete: boolean
}

const EMPTY: DosageSig = {
  amount: null,
  unit: "tab",
  route: undefined,
  frequency: undefined,
  prn: false,
  indication: "",
}

function assemble(sig: DosageSig): { text: string; complete: boolean } {
  const hasCore =
    sig.amount != null && !!sig.unit && !!sig.route && !!sig.frequency
  const complete = hasCore && (!sig.prn || sig.indication.trim() !== "")
  const parts = [
    sig.amount != null ? `${sig.amount} ${sig.unit}` : null,
    sig.route,
    sig.frequency,
    sig.prn ? `PRN${sig.indication.trim() ? ` ${sig.indication.trim()}` : ""}` : null,
  ].filter(Boolean)
  return { text: parts.join(" "), complete }
}

function parseNum(raw: string): number | null {
  if (raw.trim() === "") return null
  const n = Number(raw)
  return Number.isFinite(n) && n >= 0 ? n : null
}

export interface DosageBuilderProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: DosageSig
  defaultValue?: DosageSig
  onValueChange?: (value: DosageValue) => void
  disabled?: boolean
}

/**
 * Structured sig builder: dose + unit, route, frequency, and optional PRN with
 * indication, assembling a canonical sig object and a human-readable string for
 * verification. Sigs are built from parts, never free-typed.
 */
function DosageBuilder({
  value,
  defaultValue,
  onValueChange,
  disabled,
  className,
  ...props
}: DosageBuilderProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<DosageSig>(
    defaultValue ?? EMPTY
  )
  const current = isControlled ? value : internal

  function commit(patch: Partial<DosageSig>) {
    const next = { ...current, ...patch }
    if (!isControlled) setInternal(next)
    const { text, complete } = assemble(next)
    onValueChange?.({ ...next, text, complete })
  }

  const { text, complete } = assemble(current)
  const prnNeedsIndication =
    current.prn && current.indication.trim() === ""

  return (
    <div
      data-slot="dosage-builder"
      className={cn("flex w-full max-w-sm flex-col gap-4", className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <Field label="Dose" className="flex-1">
          <Input
            type="number"
            inputMode="decimal"
            placeholder="1"
            disabled={disabled}
            value={current.amount ?? ""}
            onChange={(e) => commit({ amount: parseNum(e.target.value) })}
          />
        </Field>
        <Field label="Unit" className="flex-1">
          {(controlProps) => (
            <Select
              value={current.unit}
              onValueChange={(v) => commit({ unit: v })}
              disabled={disabled}
            >
              <SelectTrigger {...controlProps} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DOSE_UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </Field>
      </div>

      <Field label="Route">
        {() => (
          <RouteOfAdministrationField
            value={current.route}
            onValueChange={(r) => commit({ route: r })}
            disabled={disabled}
          />
        )}
      </Field>

      <Field label="Frequency">
        {() => (
          <ToggleGroup
            type="single"
            variant="outline"
            value={current.frequency ?? ""}
            onValueChange={(v) => commit({ frequency: v || undefined })}
            disabled={disabled}
            className="w-full"
          >
            {FREQUENCIES.map((f) => (
              <Tooltip key={f.value}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem value={f.value} aria-label={f.full}>
                    {f.value}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent>{f.full}</TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>
        )}
      </Field>

      <div className="flex flex-col gap-3">
        <Label className="justify-between font-normal">
          As needed (PRN)
          <Switch
            checked={current.prn}
            onCheckedChange={(c) => commit({ prn: c })}
            disabled={disabled}
          />
        </Label>
        {current.prn && (
          <Field
            label="Indication"
            required
            error={prnNeedsIndication ? "A PRN order needs a reason." : undefined}
          >
            <Input
              placeholder="e.g. pain, nausea"
              disabled={disabled}
              value={current.indication}
              onChange={(e) => commit({ indication: e.target.value })}
            />
          </Field>
        )}
      </div>

      {/* Assembled English sig, shown back for verification. */}
      <div
        data-slot="dosage-builder-sig"
        className={cn(
          "rounded-lg border px-3.5 py-3",
          complete
            ? "border-primary/30 bg-primary/5"
            : "border-border/60 bg-muted/40"
        )}
      >
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-wide">
          Sig
        </p>
        <p className="mt-1 text-sm font-semibold">
          {text || <span className="text-muted-foreground font-normal">Incomplete</span>}
        </p>
      </div>
    </div>
  )
}

export { DosageBuilder, assemble as assembleSig }
