import * as React from "react"
import { WindIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

export type Spo2Band = "normal" | "low" | "critical"

/** Gauge domain: SpO₂ below 70% is off-scale and clamped. */
const DOMAIN_MIN = 70
const DOMAIN_MAX = 100
const SWEEP = 270 // degrees
const START = -135 // degrees, clockwise from top

function bandFor(value: number): Spo2Band {
  if (value >= 95) return "normal"
  if (value >= 90) return "low"
  return "critical"
}

const bandMeta: Record<Spo2Band, { label: string; stroke: string; text: string }> = {
  normal: { label: "Normal", stroke: "stroke-success", text: "text-success" },
  low: { label: "Low", stroke: "stroke-warning", text: "text-warning-foreground dark:text-warning" },
  critical: { label: "Critical", stroke: "stroke-destructive", text: "text-destructive" },
}

const sizeConfig = {
  sm: { box: 100, r: 40, w: 9, num: "text-2xl", unit: "text-[10px]" },
  default: { box: 132, r: 54, w: 11, num: "text-4xl", unit: "text-xs" },
} as const

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.sin(a), cy - r * Math.cos(a)]
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [x0, y0] = polar(cx, cy, r, startDeg)
  const [x1, y1] = polar(cx, cy, r, endDeg)
  const large = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`
}

const angleOf = (value: number) =>
  START + ((clamp(value) - DOMAIN_MIN) / (DOMAIN_MAX - DOMAIN_MIN)) * SWEEP

function clamp(v: number): number {
  return Math.min(DOMAIN_MAX, Math.max(DOMAIN_MIN, v))
}

export interface Spo2DialProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** SpO₂ percentage. */
  value: number
  /** Override the auto-derived band. */
  band?: Spo2Band
  /** Flag that the reading is on supplemental oxygen. */
  supplemental?: boolean
  size?: "sm" | "default"
}

/**
 * Compact arc gauge for oxygen saturation with threshold bands (≥95 normal,
 * 90–94 low, <90 critical), the value large and central. Pulses on critical
 * (motion-safe). Shows the measured value and flags dubious readings rather
 * than hiding them — pulse oximetry has real accuracy caveats.
 */
function Spo2Dial({
  value,
  band: bandProp,
  supplemental = false,
  size = "default",
  className,
  ...props
}: Spo2DialProps) {
  const band = bandProp ?? bandFor(value)
  const meta = bandMeta[band]
  const sc = sizeConfig[size]
  const cx = sc.box / 2
  const cy = sc.box / 2

  const zones: { from: number; to: number; cls: string }[] = [
    { from: DOMAIN_MIN, to: 90, cls: "stroke-destructive/25" },
    { from: 90, to: 95, cls: "stroke-warning/25" },
    { from: 95, to: DOMAIN_MAX, cls: "stroke-success/25" },
  ]

  const [mx, my] = polar(cx, cy, sc.r, angleOf(value))

  const accessibleName = `Oxygen saturation ${value} percent, ${
    band === "critical" ? "critically low" : meta.label.toLowerCase()
  }${supplemental ? ", on supplemental oxygen" : ""}`

  return (
    <div
      data-slot="spo2-dial"
      data-band={band}
      role="img"
      aria-label={accessibleName}
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: sc.box, height: sc.box }}
      {...props}
    >
      <svg width={sc.box} height={sc.box} viewBox={`0 0 ${sc.box} ${sc.box}`} aria-hidden>
        {/* Faint band zones */}
        {zones.map((z) => (
          <path
            key={z.from}
            d={arcPath(cx, cy, sc.r, angleOf(z.from), angleOf(z.to))}
            fill="none"
            strokeWidth={sc.w}
            strokeLinecap="round"
            className={z.cls}
          />
        ))}
        {/* Value arc up to the reading */}
        <path
          d={arcPath(cx, cy, sc.r, START, angleOf(value))}
          fill="none"
          strokeWidth={sc.w}
          strokeLinecap="round"
          className={cn(meta.stroke, "transition-all duration-500", band === "critical" && "motion-safe:animate-pulse")}
        />
        {/* Marker at the value */}
        <circle cx={mx} cy={my} r={sc.w / 2 + 1.5} className={cn("fill-card", meta.stroke)} strokeWidth={2} />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={cn("font-bold tabular-nums", sc.num, meta.text)}>
          {value}
          <span className={cn("text-muted-foreground align-top font-semibold", sc.unit)}>%</span>
        </span>
        <span className="text-muted-foreground mt-1 text-[10px] font-medium uppercase tracking-wide">
          SpO₂
        </span>
        {supplemental && (
          <span className="text-info mt-1 inline-flex items-center gap-0.5 text-[10px] font-semibold">
            <WindIcon className="size-3" aria-hidden />
            O₂
          </span>
        )}
      </div>
    </div>
  )
}

export { Spo2Dial }
