"use client"

import * as React from "react"
import { CalendarDays } from "lucide-react"

import { WidgetPanel } from "@/registry/medcn/widget-panel/widget-panel"
import { AppointmentRow } from "@/registry/medcn/appointment-row/appointment-row"
import { AppointmentCheckIn } from "@/registry/medcn/appointment-check-in/appointment-check-in"

export type AppointmentEntry = React.ComponentProps<typeof AppointmentRow> & {
  id?: string
}

export interface AppointmentsPanelProps
  extends Omit<React.ComponentProps<typeof WidgetPanel>, "children"> {
  items: AppointmentEntry[]
  /** Optional live check-in tracker pinned above the agenda. */
  checkIn?: React.ComponentProps<typeof AppointmentCheckIn>
}

/**
 * An agenda / appointments panel. Composes WidgetPanel + AppointmentRow, with
 * an optional AppointmentCheckIn tracker pinned above the list.
 */
function AppointmentsPanel({
  items,
  checkIn,
  title = "Appointments",
  icon = <CalendarDays />,
  empty = "No appointments scheduled.",
  state,
  className,
  ...props
}: AppointmentsPanelProps) {
  const effectiveState =
    state ?? (items.length === 0 && !checkIn ? "empty" : "ready")

  return (
    <WidgetPanel
      title={title}
      icon={icon}
      empty={empty}
      state={effectiveState}
      className={className}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {checkIn && (
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <AppointmentCheckIn {...checkIn} />
          </div>
        )}
        {items.length > 0 && (
          <div className="flex flex-col gap-2">
            {items.map(({ id, ...item }, i) => (
              <AppointmentRow key={id ?? i} {...item} />
            ))}
          </div>
        )}
      </div>
    </WidgetPanel>
  )
}

export { AppointmentsPanel }
