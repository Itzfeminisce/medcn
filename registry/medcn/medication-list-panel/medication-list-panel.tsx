"use client"

import * as React from "react"
import { Pill } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"
import { PrescriptionCard } from "@/registry/medcn/prescription-card/prescription-card"
import { DrugInteractionAlert } from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert"
import { AdherenceRing } from "@/registry/medcn/adherence-ring/adherence-ring"

export type MedicationEntry = React.ComponentProps<typeof PrescriptionCard> & {
  id?: string
}
export type InteractionEntry = React.ComponentProps<
  typeof DrugInteractionAlert
> & { id?: string }

export interface MedicationListPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  medications: MedicationEntry[]
  /** Interaction warnings surfaced above the list. */
  interactions?: InteractionEntry[]
  /** Adherence summary shown in the header. */
  adherence?: React.ComponentProps<typeof AdherenceRing>
}

/**
 * The medication list as a panel: interaction warnings on top, then the active
 * prescriptions, with an optional adherence ring in the header. Composes
 * WidgetPanel + PrescriptionCard + DrugInteractionAlert + AdherenceRing.
 */
function MedicationListPanel({
  medications,
  interactions,
  adherence,
  title = "Medications",
  icon = <Pill />,
  empty = "No active medications.",
  state,
  action,
  className,
  ...props
}: MedicationListPanelProps) {
  const effectiveState =
    state ?? (medications.length === 0 && !interactions?.length ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      action={
        action ??
        (adherence ? <AdherenceRing size="sm" {...adherence} /> : undefined)
      }
      className={className}
      {...props}
    >
      <div className="flex flex-col gap-4">
        {interactions && interactions.length > 0 && (
          <div className="flex flex-col gap-2">
            {interactions.map(({ id, ...it }, i) => (
              <DrugInteractionAlert key={id ?? i} {...it} />
            ))}
          </div>
        )}
        {medications.length > 0 && (
          <div className="flex flex-col gap-3">
            {interactions && interactions.length > 0 && (
              <SectionHeader as="h3" title="Active medications" className="gap-0" />
            )}
            {medications.map(({ id, ...m }, i) => (
              <PrescriptionCard key={id ?? i} {...m} className="w-full" />
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { MedicationListPanel }
