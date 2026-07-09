"use client"

import * as React from "react"
import {
  Activity,
  Bed,
  FlaskConical,
  History,
  Scissors,
  Stethoscope,
  Syringe,
  Video,
} from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { Timeline, TimelineItem } from "@/registry/medcn/timeline/timeline"

export type EncounterKind =
  | "office"
  | "ed"
  | "inpatient"
  | "telehealth"
  | "procedure"
  | "lab"
  | "immunization"
  | "other"

const kindConfig: Record<
  EncounterKind,
  {
    icon: React.ElementType
    color: React.ComponentProps<typeof TimelineItem>["color"]
    label: string
  }
> = {
  office: { icon: Stethoscope, color: "primary", label: "Office visit" },
  ed: { icon: Activity, color: "destructive", label: "ED" },
  inpatient: { icon: Bed, color: "default", label: "Inpatient" },
  telehealth: { icon: Video, color: "primary", label: "Telehealth" },
  procedure: { icon: Scissors, color: "warning", label: "Procedure" },
  lab: { icon: FlaskConical, color: "success", label: "Laboratory" },
  immunization: { icon: Syringe, color: "success", label: "Immunization" },
  other: { icon: Stethoscope, color: "default", label: "Encounter" },
}

export interface EncounterTimelineEntry {
  id?: string
  type?: EncounterKind
  title: React.ReactNode
  /** provider · location line. */
  meta?: React.ReactNode
  date?: React.ReactNode
  summary?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

export interface EncounterTimelinePanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  /** Encounters, newest first. */
  items: EncounterTimelineEntry[]
}

/**
 * A patient's encounter history on a vertical timeline rail — the marker's
 * color and icon encode the encounter type (with a Tooltip). Composes
 * WidgetPanel + Timeline + TimelineItem. Pass items newest-first.
 */
function EncounterTimelinePanel({
  items,
  title = "Encounters",
  icon = <History />,
  empty = "No recorded encounters.",
  state,
  className,
  ...props
}: EncounterTimelinePanelProps) {
  const effectiveState = state ?? (items.length === 0 ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <Timeline>
        {items.map((e, i) => {
          const cfg = kindConfig[e.type ?? "other"]
          const Icon = cfg.icon
          return (
            <TimelineItem
              key={e.id ?? i}
              color={cfg.color}
              marker={<Icon />}
              markerTooltip={cfg.label}
              title={e.title}
              time={e.date}
              interactive={!!e.onClick}
              onClick={e.onClick}
              last={i === items.length - 1}
            >
              {e.meta && (
                <div className="text-xs text-muted-foreground">{e.meta}</div>
              )}
              {e.summary}
            </TimelineItem>
          )
        })}
      </Timeline>
    </WidgetPanel>
  )
}

export { EncounterTimelinePanel }
