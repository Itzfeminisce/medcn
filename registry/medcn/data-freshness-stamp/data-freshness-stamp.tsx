import * as React from "react"
import { ClockIcon, PlugZapIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type DataFreshness = "fresh" | "stale" | "disconnected"

const FRESHNESS: Record<
  DataFreshness,
  {
    variant: React.ComponentProps<typeof Badge>["variant"]
    icon: React.ComponentType<{ className?: string }>
    fallback: string
  }
> = {
  fresh: { variant: "soft", icon: ClockIcon, fallback: "Up to date" },
  stale: { variant: "warning", icon: TriangleAlertIcon, fallback: "Stale" },
  disconnected: {
    variant: "destructive",
    icon: PlugZapIcon,
    fallback: "Not reporting",
  },
}

export interface DataFreshnessStampProps
  extends Omit<React.ComponentProps<typeof Badge>, "variant" | "children"> {
  /** How old the data is, in the caller's words: "4h ago", "09:12", "2 days ago". */
  age?: React.ReactNode
  status?: DataFreshness
  /** Machine-readable timestamp of the reading, for <time datetime>. */
  datetime?: string
  /** What the age refers to — "Last reading", "Last synced", "Last charted". */
  label?: string
  /** Why it is stale or disconnected: "Sensor offline since 06:40". */
  detail?: React.ReactNode
}

/**
 * The age of the data, next to the data.
 *
 * A chart quietly showing yesterday's values looks exactly like one showing this
 * morning's, and a monitor that has stopped reporting looks exactly like a
 * patient whose values have stopped changing. Age and reporting state are part
 * of the reading, not chrome — `disconnected` says the source went silent, which
 * is never the same claim as "unchanged".
 */
function DataFreshnessStamp({
  age,
  status = "fresh",
  datetime,
  label = "Last reading",
  detail,
  className,
  ...props
}: DataFreshnessStampProps) {
  const { variant, icon: Icon, fallback } = FRESHNESS[status]
  const text = age ?? fallback

  const stamp = (
    <Badge
      data-slot="data-freshness-stamp"
      data-status={status}
      variant={variant}
      className={cn("gap-1 font-normal", className)}
      {...props}
    >
      <Icon aria-hidden />
      <span className="sr-only">{label}: </span>
      {datetime ? <time dateTime={datetime}>{text}</time> : text}
    </Badge>
  )

  if (!detail) return stamp

  return (
    <Tooltip>
      <TooltipTrigger asChild>{stamp}</TooltipTrigger>
      <TooltipContent>{detail}</TooltipContent>
    </Tooltip>
  )
}

export { DataFreshnessStamp }
