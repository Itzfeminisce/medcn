"use client"

import * as React from "react"
import { ChevronRightIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"
import { LabDeltaIndicator } from "@/registry/medcn/lab-delta-indicator/lab-delta-indicator"

export type LabAnalyteFlag = "normal" | "low" | "high" | "critical"

export interface LabAnalyte {
  key: string
  label: string
  value: number
  unit: string
  /** From the laboratory, not the UI. */
  flag?: LabAnalyteFlag
  referenceLow?: number
  referenceHigh?: number
  prior?: { value: number; date: string }
  significantChange?: number
  concerningDirection?: "up" | "down"
  /** Method, specimen, comment — the detail behind the number. */
  detail?: React.ReactNode
}

export interface LabPanelGroup {
  key: string
  /** "Full blood count", "Renal profile" — the laboratory's grouping. */
  label: string
  analytes: LabAnalyte[]
  /** Collapsed by default. Ignored when the group holds a critical result. */
  defaultCollapsed?: boolean
}

export interface LabPanelTableProps extends React.ComponentProps<"div"> {
  groups: LabPanelGroup[]
  collectedAt?: React.ReactNode
  caption?: string
}

const FLAG_BADGE: Record<
  LabAnalyteFlag,
  { variant: React.ComponentProps<typeof Badge>["variant"]; text: string }
> = {
  normal: { variant: "outline", text: "" },
  low: { variant: "warning", text: "Low" },
  high: { variant: "warning", text: "High" },
  critical: { variant: "destructive", text: "Critical" },
}

/**
 * Grouped laboratory results with flags, deltas, and a collapsible detail row.
 *
 * A group holding a critical result cannot be collapsed shut: `defaultCollapsed`
 * is ignored for it, and the group is annotated so the reader knows why it is
 * open. Hiding a critical value behind a disclosure is the one failure this
 * table exists to make impossible.
 *
 * Grouping, flags, and reference ranges come from the laboratory — the component
 * classifies nothing. A flag is rendered as a word as well as a colour.
 */
function LabPanelTable({
  groups,
  collectedAt,
  caption,
  className,
  ...props
}: LabPanelTableProps) {
  return (
    <div
      data-slot="lab-panel-table"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    >
      {collectedAt && (
        <p className="text-muted-foreground text-xs">Collected {collectedAt}</p>
      )}

      {groups.map((group) => {
        const critical = group.analytes.some(
          (analyte) => analyte.flag === "critical"
        )

        return (
          <LabPanelGroupRow
            key={group.key}
            group={group}
            critical={critical}
            caption={caption}
          />
        )
      })}
    </div>
  )
}

function LabPanelGroupRow({
  group,
  critical,
  caption,
}: {
  group: LabPanelGroup
  critical: boolean
  caption?: string
}) {
  // A critical result overrides the caller's collapse preference. It is not a
  // suggestion the component weighs — it simply cannot be hidden.
  const [open, setOpen] = React.useState(
    critical ? true : !group.defaultCollapsed
  )

  return (
    <Collapsible
      open={open}
      onOpenChange={(next) => {
        if (critical && !next) return
        setOpen(next)
      }}
      className="rounded-xl border"
    >
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-semibold",
          critical && "cursor-default"
        )}
      >
        <ChevronRightIcon
          aria-hidden
          className={cn(
            "size-4 shrink-0 transition-transform",
            open && "rotate-90",
            critical && "opacity-0"
          )}
        />
        {group.label}
        {critical && (
          <Badge variant="destructive" className="ml-auto">
            Critical result — kept open
          </Badge>
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        {/* The table scrolls inside its own panel; a block must never scroll sideways. */}
        <div className="w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[28rem] text-sm">
            {caption && <caption className="sr-only">{caption}</caption>}
            <thead>
              <tr className="text-muted-foreground border-t text-xs">
                <th scope="col" className="px-4 py-1.5 text-left font-medium">
                  Analyte
                </th>
                <th scope="col" className="px-4 py-1.5 text-right font-medium">
                  Result
                </th>
                <th scope="col" className="px-4 py-1.5 text-left font-medium">
                  Reference
                </th>
                <th scope="col" className="px-4 py-1.5 text-left font-medium">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {group.analytes.map((analyte) => {
                const flag = analyte.flag ?? "normal"
                const badge = FLAG_BADGE[flag]

                return (
                  <tr key={analyte.key} className="border-t align-top">
                    <td className="px-4 py-2">
                      <span className="font-medium">{analyte.label}</span>
                      {analyte.detail && (
                        <span className="text-muted-foreground block text-xs">
                          {analyte.detail}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2 text-right">
                      <span className="flex items-center justify-end gap-1.5">
                        <span className="font-mono font-medium tabular-nums">
                          {analyte.value}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {analyte.unit}
                        </span>
                        {badge.text && (
                          // The word, not only the colour.
                          <Badge variant={badge.variant}>{badge.text}</Badge>
                        )}
                      </span>
                    </td>

                    <td className="text-muted-foreground px-4 py-2 font-mono text-xs tabular-nums">
                      {analyte.referenceLow ?? "—"}–
                      {analyte.referenceHigh ?? "—"}
                    </td>

                    <td className="px-4 py-2">
                      {analyte.prior ? (
                        <LabDeltaIndicator
                          current={analyte.value}
                          prior={analyte.prior.value}
                          unit={analyte.unit}
                          interval={`prior ${analyte.prior.date}`}
                          significantChange={analyte.significantChange}
                          concerningDirection={analyte.concerningDirection}
                        />
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          No prior result
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

export { LabPanelTable }
