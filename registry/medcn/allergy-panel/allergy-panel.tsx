"use client"

import * as React from "react"
import { ShieldAlert } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { AllergyList } from "@/registry/medcn/allergy-badge/allergy-badge"

type Allergies = React.ComponentProps<typeof AllergyList>["allergies"]

export interface AllergyPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  allergies: Allergies
  /** Collapse to N before a "+N more". Forwarded to AllergyList. */
  max?: number
}

/**
 * Allergies & intolerances as a safety-tinted panel. Composes WidgetPanel +
 * AllergyList; the list renders its own "No known allergies" state, so the
 * panel never shows a blank body.
 */
function AllergyPanel({
  allergies,
  max,
  title = "Allergies & intolerances",
  icon = <ShieldAlert />,
  tone = "destructive",
  state,
  className,
  ...props
}: AllergyPanelProps) {
  return (
    <WidgetPanel
      title={title}
      icon={icon}
      tone={tone}
      state={state ?? "ready"}
      className={className}
      {...props}
    >
      <AllergyList allergies={allergies} max={max} />
    </WidgetPanel>
  )
}

export { AllergyPanel }
