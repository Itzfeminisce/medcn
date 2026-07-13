import * as React from "react"
import { InfoIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Alert, AlertDescription } from "@/registry/medcn/alert/alert"
import { Badge } from "@/registry/medcn/badge/badge"

export interface AiClinicalDisclaimerProps
  extends Omit<React.ComponentProps<typeof Alert>, "variant"> {
  /** `warning` is for a real review boundary, not decoration. */
  severity?: "info" | "warning"
  /** Provenance badge. Pass null to drop it where provenance is already clear. */
  label?: React.ReactNode
  /** The disclaimer copy. Name the actual review boundary. */
  children: React.ReactNode
}

/**
 * Contextual safety notice for generated clinical material. The copy is yours:
 * a disclaimer that says what specifically must be checked is read, a blanket
 * one stapled to every message is not.
 */
function AiClinicalDisclaimer({
  className,
  severity = "info",
  label = "Generated",
  children,
  ...props
}: AiClinicalDisclaimerProps) {
  const Icon = severity === "warning" ? TriangleAlertIcon : InfoIcon

  return (
    <Alert
      data-slot="ai-clinical-disclaimer"
      data-severity={severity}
      variant={severity}
      className={cn("gap-x-2.5 px-3 py-2.5", className)}
      {...props}
    >
      <Icon aria-hidden />
      <AlertDescription className="text-muted-foreground flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
        {label && (
          <Badge
            variant={severity === "warning" ? "warning" : "soft"}
            className="h-4 px-1.5 py-0 text-[10px] font-semibold"
          >
            {label}
          </Badge>
        )}
        <span className="min-w-0 flex-1">{children}</span>
      </AlertDescription>
    </Alert>
  )
}

export { AiClinicalDisclaimer }
