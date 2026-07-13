import * as React from "react"
import {
  ActivityIcon,
  FileTextIcon,
  FlaskConicalIcon,
  PillIcon,
  StethoscopeIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Timeline, TimelineItem } from "@/registry/medcn/timeline/timeline"
import {
  SparklineCell,
  type SparklineCellProps,
} from "@/registry/medcn/sparkline-cell/sparkline-cell"

export type ObservationKind =
  | "vital"
  | "result"
  | "note"
  | "medication"
  | "encounter"

/** Who or what produced the entry. A device reading is not a clinician's assessment. */
export type ObservationSource = "clinician" | "device" | "patient" | "system"

const KIND_ICON: Record<ObservationKind, React.ComponentType> = {
  vital: ActivityIcon,
  result: FlaskConicalIcon,
  note: FileTextIcon,
  medication: PillIcon,
  encounter: StethoscopeIcon,
}

const KIND_COLOR: Record<
  ObservationKind,
  React.ComponentProps<typeof TimelineItem>["color"]
> = {
  vital: "primary",
  result: "default",
  note: "default",
  medication: "success",
  encounter: "primary",
}

const SOURCE_LABEL: Record<ObservationSource, string> = {
  clinician: "Clinician",
  device: "Device",
  patient: "Patient-reported",
  system: "System-generated",
}

export interface Observation {
  key: string
  kind: ObservationKind
  title: React.ReactNode
  time: React.ReactNode
  /** Required: the reader must be able to tell who said this. */
  source: ObservationSource
  /** Who authored it, where the source is a person. */
  author?: React.ReactNode
  description?: React.ReactNode
  /** An inline trend for this observation — value plus glyph. */
  trend?: Pick<
    SparklineCellProps,
    "value" | "unit" | "data" | "thresholdMin" | "thresholdMax" | "color"
  >
  flagged?: boolean
}

export interface ObservationTimelineProps
  extends Omit<React.ComponentProps<typeof Timeline>, "children"> {
  observations: Observation[]
}

/**
 * Clinical observations in one chronological stream — vitals, results, notes,
 * medications, encounters — with an inline trend where a value has one.
 *
 * Interleaving record types is the point, and it is also the risk: a device
 * reading, a patient's own report, and a clinician's assessment carry very
 * different weight, and a timeline that rendered them identically would quietly
 * launder one into another. `source` is required for exactly that reason, and it
 * is shown on every entry.
 */
function ObservationTimeline({
  observations,
  className,
  ...props
}: ObservationTimelineProps) {
  return (
    <Timeline
      data-slot="observation-timeline"
      className={cn(className)}
      {...props}
    >
      {observations.map((observation, index) => {
        const Icon = KIND_ICON[observation.kind]

        return (
          <TimelineItem
            key={observation.key}
            marker={<Icon />}
            color={observation.flagged ? "warning" : KIND_COLOR[observation.kind]}
            time={observation.time}
            last={index === observations.length - 1}
            title={
              <span className="flex flex-wrap items-center gap-2">
                {observation.title}
                <Badge variant="outline" className="font-normal">
                  {SOURCE_LABEL[observation.source]}
                  {observation.author ? ` · ${observation.author}` : ""}
                </Badge>
              </span>
            }
          >
            {observation.description && (
              <p className="text-muted-foreground text-sm">
                {observation.description}
              </p>
            )}

            {observation.trend && (
              <SparklineCell className="mt-1" {...observation.trend} />
            )}
          </TimelineItem>
        )
      })}
    </Timeline>
  )
}

export { ObservationTimeline, SOURCE_LABEL as observationSources }
