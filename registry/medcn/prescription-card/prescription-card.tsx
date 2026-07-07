import * as React from "react"
import { PillIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Card } from "@/registry/medcn/card/card"
import { Separator } from "@/registry/medcn/separator/separator"

export type PrescriptionStatus = "active" | "completed" | "cancelled" | "expired"

const statusMeta: Record<
  PrescriptionStatus,
  {
    label: string
    badgeVariant: React.ComponentProps<typeof Badge>["variant"]
    disc: string
  }
> = {
  active: {
    label: "Active",
    badgeVariant: "success",
    disc: "bg-primary/10 text-primary",
  },
  completed: {
    label: "Completed",
    badgeVariant: "secondary",
    disc: "bg-muted text-muted-foreground",
  },
  cancelled: {
    label: "Cancelled",
    badgeVariant: "destructive",
    disc: "bg-muted text-muted-foreground",
  },
  expired: {
    label: "Expired",
    badgeVariant: "warning",
    disc: "bg-muted text-muted-foreground",
  },
}

export interface PrescriptionCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** e.g. "Amoxicillin". */
  drugName: React.ReactNode
  /** e.g. "500 mg capsule". */
  strength?: React.ReactNode
  /** Dosage instructions, e.g. "Take 1 capsule 3× daily for 7 days". */
  sig: React.ReactNode
  quantity?: React.ReactNode
  refillsRemaining?: number
  prescriber?: React.ReactNode
  issuedDate?: Date | string
  status?: PrescriptionStatus
  /** Alert slot — render a DrugInteractionAlert here. */
  alert?: React.ReactNode
  /** e.g. a "Request refill" button. */
  actions?: React.ReactNode
}

function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

/** Prescription with drug, sig, refill/prescriber metadata, status, and an alert slot. */
function PrescriptionCard({
  drugName,
  strength,
  sig,
  quantity,
  refillsRemaining,
  prescriber,
  issuedDate,
  status,
  alert,
  actions,
  className,
  ...props
}: PrescriptionCardProps) {
  const meta = status ? statusMeta[status] : undefined
  const noRefillsLeft = status === "active" && refillsRemaining === 0

  return (
    <Card
      data-slot="prescription-card"
      data-status={status}
      className={cn("w-full max-w-md gap-3 px-5 py-4", className)}
      {...props}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4.5",
            meta ? meta.disc : "bg-primary/10 text-primary"
          )}
        >
          <PillIcon />
        </span>
        <div className="flex min-w-0 flex-1 flex-col">
          <span
            data-slot="prescription-card-drug"
            className="truncate text-sm font-semibold"
          >
            {drugName}
          </span>
          {strength && (
            <span className="text-muted-foreground text-xs">{strength}</span>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {meta && <Badge variant={meta.badgeVariant}>{meta.label}</Badge>}
          {noRefillsLeft && (
            <Badge data-slot="prescription-card-refill-warning" variant="warning">
              No refills left
            </Badge>
          )}
        </div>
      </div>

      <p
        data-slot="prescription-card-sig"
        className="bg-muted/50 rounded-lg px-3 py-2 text-sm"
      >
        {sig}
      </p>

      {(quantity !== undefined ||
        refillsRemaining !== undefined ||
        prescriber ||
        issuedDate) && (
        <dl className="text-muted-foreground grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
          {quantity !== undefined && (
            <div className="flex flex-col">
              <dt className="text-muted-foreground/70">Quantity</dt>
              <dd className="text-foreground font-medium">{quantity}</dd>
            </div>
          )}
          {refillsRemaining !== undefined && (
            <div className="flex flex-col">
              <dt className="text-muted-foreground/70">Refills remaining</dt>
              <dd
                className={cn(
                  "font-medium tabular-nums",
                  noRefillsLeft
                    ? "text-warning-foreground dark:text-warning"
                    : "text-foreground"
                )}
              >
                {refillsRemaining}
              </dd>
            </div>
          )}
          {prescriber && (
            <div className="flex flex-col">
              <dt className="text-muted-foreground/70">Prescriber</dt>
              <dd className="text-foreground font-medium">{prescriber}</dd>
            </div>
          )}
          {issuedDate && (
            <div className="flex flex-col">
              <dt className="text-muted-foreground/70">Issued</dt>
              <dd className="text-foreground font-medium tabular-nums">
                {formatDate(issuedDate)}
              </dd>
            </div>
          )}
        </dl>
      )}

      {alert && <div data-slot="prescription-card-alert">{alert}</div>}

      {actions && (
        <>
          <Separator />
          <div
            data-slot="prescription-card-actions"
            className="flex items-center justify-end gap-2"
          >
            {actions}
          </div>
        </>
      )}
    </Card>
  )
}

export { PrescriptionCard }
