import * as React from "react"
import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export interface LabDeltaIndicatorProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> {
  current: number
  prior: number
  unit?: string
  /** When the prior result was taken — a delta without an interval is unreadable. */
  interval?: React.ReactNode
  /**
   * Change beyond which the caller considers the difference meaningful — the
   * assay's reference change value, or their own threshold. Without it, the
   * component reports the change and asserts nothing about it.
   */
  significantChange?: number
  /** Show the change as a percentage rather than in absolute units. */
  asPercent?: boolean
  /** Direction that is clinically worse, if the caller wants it marked. */
  concerningDirection?: "up" | "down"
}

/**
 * The change since the prior result.
 *
 * A delta is only meaningful against the assay's own variability: a creatinine
 * that moves 3 µmol/L has probably not moved at all. Without
 * `significantChange`, this reports the difference in a neutral badge and makes
 * no claim about it — the arrow is a direction, not a verdict. Supply the
 * threshold and it will mark the change as significant; supply
 * `concerningDirection` and it will say which way is worse.
 */
function LabDeltaIndicator({
  current,
  prior,
  unit,
  interval,
  significantChange,
  asPercent = false,
  concerningDirection,
  className,
  ...props
}: LabDeltaIndicatorProps) {
  const change = current - prior
  const percent = prior === 0 ? null : (change / Math.abs(prior)) * 100
  const magnitude = Math.abs(change)

  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat"
  const Icon =
    direction === "up"
      ? ArrowUpIcon
      : direction === "down"
        ? ArrowDownIcon
        : ArrowRightIcon

  const significant =
    significantChange !== undefined && magnitude >= significantChange
  const concerning =
    significant && concerningDirection !== undefined
      ? direction === concerningDirection
      : false

  const shown =
    asPercent && percent !== null
      ? `${percent > 0 ? "+" : ""}${percent.toFixed(0)}%`
      : `${change > 0 ? "+" : ""}${Number(change.toFixed(2))}${unit ? ` ${unit}` : ""}`

  const badge = (
    <Badge
      data-slot="lab-delta-indicator"
      data-direction={direction}
      data-significant={significant || undefined}
      variant={concerning ? "destructive" : significant ? "warning" : "outline"}
      className={cn("gap-1 font-mono font-normal tabular-nums", className)}
      {...props}
    >
      <Icon aria-hidden />
      {shown}
      {significant && (
        // The word, not just the colour — a badge read in greyscale must still say it.
        <span className="font-sans text-[10px] font-semibold uppercase">
          Significant
        </span>
      )}
    </Badge>
  )

  const detail = (
    <>
      Prior {prior}
      {unit ? ` ${unit}` : ""}
      {interval ? <> · {interval}</> : null}
      {significantChange === undefined && (
        <>
          <br />
          No significance threshold supplied — this is the change, not a verdict.
        </>
      )}
    </>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>{badge}</TooltipTrigger>
      <TooltipContent>{detail}</TooltipContent>
    </Tooltip>
  )
}

export { LabDeltaIndicator }
