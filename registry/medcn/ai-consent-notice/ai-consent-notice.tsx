"use client"

import * as React from "react"
import { ExternalLinkIcon, ShieldCheckIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from "@/registry/medcn/alert/alert"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Label } from "@/registry/medcn/label/label"

export interface AiConsentItem {
  /** Stable identifier recorded against the acknowledgement. */
  id: string
  /** The single permission being granted. One permission per item — never bundled. */
  label: React.ReactNode
  /** Scope, recipients, or limits of this permission. */
  description?: React.ReactNode
  /** Required items gate the confirm action; optional ones never do. */
  required?: boolean
}

export interface AiConsentNoticeProps
  extends Omit<React.ComponentProps<typeof Alert>, "title" | "children"> {
  title?: React.ReactNode
  /** What the consent covers, in the caller's own words. */
  description?: React.ReactNode
  /** Each legally distinct permission, acknowledged separately. */
  items: AiConsentItem[]
  /** Acknowledged item ids (controlled). */
  acknowledged?: string[]
  /** Fires with the full set of acknowledged ids on every change. */
  onAcknowledgedChange?: (ids: string[]) => void
  /** Version identifier of the consent text, e.g. "v3.2 · effective 1 Jan 2026". */
  version?: React.ReactNode
  /** Link to the full, authoritative consent document. */
  detailHref?: string
  detailLabel?: React.ReactNode
  /** Confirm action. Disabled until every required item is acknowledged. */
  confirmLabel?: React.ReactNode
  onConfirm?: (acknowledged: string[]) => void
  declineLabel?: React.ReactNode
  onDecline?: () => void
  /** Disables the confirm control while the caller records the acknowledgement. */
  pending?: boolean
  /** Extra small print under the actions — audit trail, withdrawal instructions. */
  footnote?: React.ReactNode
}

/**
 * Explicit acknowledgement surface for workflows that require consent before AI
 * processing or sharing. Each permission is acknowledged on its own line, nothing
 * starts checked, and confirm stays disabled until every required item is ticked.
 * The component records intent in the UI only — the caller owns the audit record.
 */
function AiConsentNotice({
  className,
  variant = "default",
  title = "Consent required",
  description,
  items,
  acknowledged,
  onAcknowledgedChange,
  version,
  detailHref,
  detailLabel = "Read the full consent",
  confirmLabel = "I consent",
  onConfirm,
  declineLabel,
  onDecline,
  pending,
  footnote,
  ...props
}: AiConsentNoticeProps) {
  const fieldId = React.useId()

  // Deliberately no `defaultAcknowledged`: consent never starts pre-checked, so
  // the uncontrolled fallback can only ever begin empty.
  const [internal, setInternal] = React.useState<string[]>([])
  const value = acknowledged ?? internal

  const setValue = (next: string[]) => {
    if (acknowledged === undefined) setInternal(next)
    onAcknowledgedChange?.(next)
  }

  const toggle = (id: string, checked: boolean) => {
    setValue(checked ? [...value.filter((v) => v !== id), id] : value.filter((v) => v !== id))
  }

  const outstanding = items.filter(
    (item) => item.required && !value.includes(item.id)
  )
  const canConfirm = outstanding.length === 0 && !pending

  return (
    <Alert
      data-slot="ai-consent-notice"
      variant={variant}
      className={cn("gap-y-2", className)}
      {...props}
    >
      <ShieldCheckIcon aria-hidden />

      <AlertTitle className="line-clamp-none flex flex-wrap items-center gap-2">
        {title}
        {version && (
          <Badge
            variant="outline"
            className="text-muted-foreground h-5 font-normal"
          >
            {version}
          </Badge>
        )}
      </AlertTitle>

      <AlertDescription className="gap-3">
        {description && <p>{description}</p>}

        <div
          data-slot="ai-consent-notice-items"
          role="group"
          aria-label="Permissions to acknowledge"
          className="grid w-full gap-2.5"
        >
          {items.map((item) => {
            const id = `${fieldId}-${item.id}`
            const checked = value.includes(item.id)

            return (
              <div
                key={item.id}
                data-slot="ai-consent-notice-item"
                data-required={item.required ? "" : undefined}
                className={cn(
                  "bg-background/40 grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 rounded-lg border p-3",
                  checked && "border-primary/40"
                )}
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={(state) => toggle(item.id, state === true)}
                  aria-describedby={item.description ? `${id}-desc` : undefined}
                  className="mt-0.5"
                />
                <Label
                  htmlFor={id}
                  className="text-foreground flex-wrap items-center gap-x-2 gap-y-1 text-[13px] leading-snug"
                >
                  <span>{item.label}</span>
                  <Badge
                    variant={item.required ? "soft" : "outline"}
                    className="h-4 px-1.5 text-[10px] font-semibold"
                  >
                    {item.required ? "Required" : "Optional"}
                  </Badge>
                </Label>
                {item.description && (
                  <p
                    id={`${id}-desc`}
                    className="text-muted-foreground col-start-2 text-xs leading-relaxed"
                  >
                    {item.description}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        {detailHref && (
          <a
            href={detailHref}
            className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4"
          >
            {detailLabel}
            <ExternalLinkIcon className="size-3" aria-hidden />
          </a>
        )}
      </AlertDescription>

      <AlertActions>
        <Button
          type="button"
          size="sm"
          disabled={!canConfirm}
          onClick={() => onConfirm?.(value)}
        >
          {confirmLabel}
        </Button>

        {declineLabel && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-muted-foreground"
            onClick={onDecline}
          >
            {declineLabel}
          </Button>
        )}

        {outstanding.length > 0 && (
          <span
            data-slot="ai-consent-notice-outstanding"
            className="text-muted-foreground text-xs"
            role="status"
          >
            {outstanding.length} required{" "}
            {outstanding.length === 1 ? "acknowledgement" : "acknowledgements"}{" "}
            outstanding
          </span>
        )}
      </AlertActions>

      {footnote && (
        <p className="text-muted-foreground col-start-2 mt-1 text-[11px] leading-relaxed">
          {footnote}
        </p>
      )}
    </Alert>
  )
}

export { AiConsentNotice }
