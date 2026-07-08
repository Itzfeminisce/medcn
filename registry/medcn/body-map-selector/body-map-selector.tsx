"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type BodyView = "front" | "back"

export interface BodyRegion {
  id: string
  label: string
  /** Position as percentages of the diagram box. */
  x: number
  y: number
  view: BodyView
}

// Laterality is the PATIENT's own: on the front, patient-right is viewer-left
// (x < 50); on the back, patient-right is viewer-right (x > 50).
const FRONT: BodyRegion[] = [
  { id: "head", label: "Head", x: 50, y: 8, view: "front" },
  { id: "neck", label: "Neck", x: 50, y: 17, view: "front" },
  { id: "chest", label: "Chest", x: 50, y: 27, view: "front" },
  { id: "abdomen", label: "Abdomen", x: 50, y: 38, view: "front" },
  { id: "pelvis", label: "Pelvis", x: 50, y: 48, view: "front" },
  { id: "r-shoulder", label: "Right shoulder", x: 34, y: 22, view: "front" },
  { id: "l-shoulder", label: "Left shoulder", x: 66, y: 22, view: "front" },
  { id: "r-arm", label: "Right arm", x: 26, y: 34, view: "front" },
  { id: "l-arm", label: "Left arm", x: 74, y: 34, view: "front" },
  { id: "r-hand", label: "Right hand", x: 21, y: 49, view: "front" },
  { id: "l-hand", label: "Left hand", x: 79, y: 49, view: "front" },
  { id: "r-thigh", label: "Right thigh", x: 42, y: 62, view: "front" },
  { id: "l-thigh", label: "Left thigh", x: 58, y: 62, view: "front" },
  { id: "r-shin", label: "Right lower leg", x: 42, y: 82, view: "front" },
  { id: "l-shin", label: "Left lower leg", x: 58, y: 82, view: "front" },
  { id: "r-foot", label: "Right foot", x: 42, y: 96, view: "front" },
  { id: "l-foot", label: "Left foot", x: 58, y: 96, view: "front" },
]

const BACK: BodyRegion[] = [
  { id: "head-back", label: "Back of head", x: 50, y: 8, view: "back" },
  { id: "upper-back", label: "Upper back", x: 50, y: 27, view: "back" },
  { id: "lower-back", label: "Lower back", x: 50, y: 40, view: "back" },
  { id: "r-buttock", label: "Right buttock", x: 58, y: 50, view: "back" },
  { id: "l-buttock", label: "Left buttock", x: 42, y: 50, view: "back" },
  { id: "r-shoulder-b", label: "Right shoulder", x: 66, y: 22, view: "back" },
  { id: "l-shoulder-b", label: "Left shoulder", x: 34, y: 22, view: "back" },
  { id: "r-calf", label: "Right calf", x: 58, y: 82, view: "back" },
  { id: "l-calf", label: "Left calf", x: 42, y: 82, view: "back" },
]

const ALL = [...FRONT, ...BACK]
const labelOf = (id: string) => ALL.find((r) => r.id === id)?.label ?? id

/** Simple gender-neutral silhouette shared by both views. */
function Silhouette() {
  return (
    <svg
      viewBox="0 0 240 440"
      className="text-muted/60 h-full w-full"
      aria-hidden
      fill="currentColor"
    >
      <circle cx="120" cy="38" r="26" />
      <rect x="110" y="60" width="20" height="16" rx="6" />
      <rect x="84" y="74" width="72" height="130" rx="26" />
      {/* arms */}
      <rect x="58" y="80" width="20" height="120" rx="10" />
      <rect x="162" y="80" width="20" height="120" rx="10" />
      {/* hands */}
      <circle cx="68" cy="212" r="12" />
      <circle cx="172" cy="212" r="12" />
      {/* legs */}
      <rect x="92" y="198" width="24" height="170" rx="12" />
      <rect x="124" y="198" width="24" height="170" rx="12" />
      {/* feet */}
      <rect x="88" y="404" width="28" height="16" rx="6" />
      <rect x="124" y="404" width="28" height="16" rx="6" />
    </svg>
  )
}

export interface BodyMapSelectorProps
  extends Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> {
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (regions: string[]) => void
  defaultView?: BodyView
  disabled?: boolean
}

/**
 * Front/back body diagram: click or keyboard-select regions to mark pain or
 * symptom locations. Every region is a labelled button reachable without a
 * pointer; laterality is the patient's own and mirrored correctly per view.
 */
function BodyMapSelector({
  value,
  defaultValue,
  onValueChange,
  defaultView = "front",
  disabled,
  className,
  ...props
}: BodyMapSelectorProps) {
  const isControlled = value !== undefined
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? [])
  const selected = isControlled ? value : internal
  const [view, setView] = React.useState<BodyView>(defaultView)

  function commit(next: string[]) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function toggle(id: string) {
    commit(selected.includes(id) ? selected.filter((r) => r !== id) : [...selected, id])
  }

  const regions = view === "front" ? FRONT : BACK

  return (
    <div
      data-slot="body-map-selector"
      className={cn("flex w-full max-w-sm flex-col gap-4", className)}
      {...props}
    >
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={view}
        onValueChange={(v) => v && setView(v as BodyView)}
        disabled={disabled}
        className="w-full"
      >
        <ToggleGroupItem value="front">Front</ToggleGroupItem>
        <ToggleGroupItem value="back">Back</ToggleGroupItem>
      </ToggleGroup>

      <div
        role="group"
        aria-label={`Body map, ${view} view`}
        className="relative mx-auto h-[400px] w-[220px]"
      >
        <Silhouette />
        {regions.map((r) => {
          const on = selected.includes(r.id)
          return (
            <Tooltip key={r.id}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={r.label}
                  disabled={disabled}
                  onClick={() => toggle(r.id)}
                  style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  className={cn(
                    "absolute size-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    on
                      ? "border-destructive bg-destructive/80 shadow-glow-sm scale-110"
                      : "border-ring/40 bg-card/80 hover:border-ring hover:bg-accent"
                  )}
                >
                  <span className="sr-only">{r.label}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>{r.label}</TooltipContent>
            </Tooltip>
          )
        })}
      </div>

      {/* Selected summary — text labels, removable, across both views. */}
      <div className="flex flex-wrap items-center gap-1.5">
        {selected.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            No regions marked.
          </span>
        ) : (
          selected.map((id) => (
            <Badge key={id} variant="destructive" asChild>
              <button
                type="button"
                onClick={() => toggle(id)}
                disabled={disabled}
                aria-label={`Remove ${labelOf(id)}`}
                className="cursor-pointer"
              >
                {labelOf(id)} ✕
              </button>
            </Badge>
          ))
        )}
      </div>
    </div>
  )
}

export { BodyMapSelector, FRONT as bodyFrontRegions, BACK as bodyBackRegions }
