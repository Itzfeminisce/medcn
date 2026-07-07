import * as React from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Card } from "@/registry/medcn/card/card"

const vitalStatusBadge = {
  normal: { variant: "success", label: "Normal" },
  elevated: { variant: "warning", label: "Elevated" },
  high: { variant: "destructive", label: "High" },
  low: { variant: "info", label: "Low" },
} as const

export interface VitalsCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Vital name, e.g. "Blood pressure". */
  label: React.ReactNode
  /** The reading, e.g. "118/76". */
  value: React.ReactNode
  /** e.g. "mmHg", "bpm", "°C". */
  unit?: React.ReactNode
  icon?: React.ReactNode
  status?: keyof typeof vitalStatusBadge
  /** Override the derived status badge entirely. */
  badge?: React.ReactNode
  trend?: "up" | "down" | "stable"
  /** e.g. "+4 vs last week"; colored by `trendDirection`. */
  trendLabel?: React.ReactNode
  /** Whether the trend is a good or bad sign; colors the trend line. */
  trendDirection?: "good" | "bad" | "neutral"
  /** e.g. "Normal: 90–120 / 60–80". */
  referenceRange?: React.ReactNode
  /** When the reading was taken, e.g. "Today, 8:04 AM". */
  time?: React.ReactNode
}

/** Single vital-sign reading with status, trend, and reference range. */
function VitalsCard({
  label,
  value,
  unit,
  icon,
  status,
  badge,
  trend,
  trendLabel,
  trendDirection = "neutral",
  referenceRange,
  time,
  className,
  ...props
}: VitalsCardProps) {
  const statusBadge = status ? vitalStatusBadge[status] : undefined

  return (
    <Card
      data-slot="vitals-card"
      className={cn("w-full max-w-56 gap-2 px-5 py-4", className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground flex items-center gap-1.5 text-sm font-medium [&_svg:not([class*='size-'])]:size-4">
          {icon}
          {label}
        </span>
        {badge ??
          (statusBadge && (
            <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
          ))}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span
          data-slot="vitals-card-value"
          className="text-2xl font-bold tracking-tight"
        >
          {value}
        </span>
        {unit && (
          <span className="text-muted-foreground text-sm">{unit}</span>
        )}
      </div>
      {(trend || trendLabel) && (
        <span
          data-slot="vitals-card-trend"
          data-direction={trendDirection}
          className={cn(
            "inline-flex items-center gap-1 text-xs font-semibold",
            trendDirection === "good" && "text-success",
            trendDirection === "bad" && "text-destructive",
            trendDirection === "neutral" && "text-muted-foreground"
          )}
        >
          {trend === "up" && <TrendingUpIcon className="size-3.5" />}
          {trend === "down" && <TrendingDownIcon className="size-3.5" />}
          {trendLabel}
        </span>
      )}
      {(referenceRange || time) && (
        <div className="text-muted-foreground flex flex-col gap-0.5 text-xs">
          {referenceRange && <span>{referenceRange}</span>}
          {time && <span className="text-muted-foreground/70">{time}</span>}
        </div>
      )}
    </Card>
  )
}

export { VitalsCard }
