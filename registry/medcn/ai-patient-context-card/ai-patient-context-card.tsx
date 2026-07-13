import * as React from "react"
import { ClockIcon, UserRoundIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import { Card } from "@/registry/medcn/card/card"

export interface AiPatientContextCardProps
  extends React.ComponentProps<typeof Card> {
  /** Display name. You decide what is safe to show on this surface. */
  name: React.ReactNode
  /** Initials for the avatar. Falls back to a generic person icon. */
  initials?: string
  /**
   * Identifiers you have chosen to display (age/sex, MRN, DOB). Supplied as a
   * node, never assembled from a demographic record by this component.
   */
  identifiers?: React.ReactNode
  /** Encounter or scope label, e.g. "Follow-up · 12 Mar". */
  encounter?: React.ReactNode
  /** Allergy/alert badges. Presentational — the component asserts nothing. */
  alerts?: React.ReactNode
  /** When the underlying data was last refreshed. */
  lastUpdated?: React.ReactNode
  /** Trailing controls, e.g. a "Change patient" button. */
  actions?: React.ReactNode
}

/**
 * The patient and encounter an assistant request is scoped to, shown in full
 * rather than as a chip. What appears here is exactly what the caller passes —
 * there is no default demographic payload.
 */
function AiPatientContextCard({
  className,
  name,
  initials,
  identifiers,
  encounter,
  alerts,
  lastUpdated,
  actions,
  children,
  ...props
}: AiPatientContextCardProps) {
  return (
    <Card
      data-slot="ai-patient-context-card"
      className={cn("gap-3 py-4", className)}
      {...props}
    >
      <div className="flex items-start gap-3 px-4">
        <Avatar className="mt-0.5 shrink-0">
          <AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
            {initials ?? <UserRoundIcon className="size-4" aria-hidden />}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-semibold">{name}</span>
          {identifiers && (
            <span className="text-muted-foreground truncate text-xs">
              {identifiers}
            </span>
          )}
          {encounter && (
            <Badge
              variant="outline"
              className="mt-1 h-5 w-fit text-[10px] font-medium"
            >
              {encounter}
            </Badge>
          )}
        </div>

        {actions && <div className="flex shrink-0 items-center gap-1">{actions}</div>}
      </div>

      {alerts && (
        <div
          data-slot="ai-patient-context-card-alerts"
          className="flex flex-wrap gap-1.5 border-t px-4 pt-3"
        >
          {alerts}
        </div>
      )}

      {children && <div className="px-4">{children}</div>}

      {lastUpdated && (
        <p className="text-muted-foreground/80 flex items-center gap-1.5 px-4 text-[11px]">
          <ClockIcon className="size-3 shrink-0" aria-hidden />
          Context last updated {lastUpdated}
        </p>
      )}
    </Card>
  )
}

export { AiPatientContextCard }
