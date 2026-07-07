import * as React from "react"
import { ActivityIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

const colorClass = {
  default: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
} as const

/** One PQRST beat as [xFraction, amplitude] with amplitude in [-0.3, 1] (R = 1). */
const BEAT: [number, number][] = [
  [0.0, 0], [0.1, 0], [0.14, 0.15], [0.18, 0.15], [0.22, 0],
  [0.3, 0], [0.33, -0.06], [0.36, 1.0], [0.39, -0.28], [0.43, 0],
  [0.55, 0], [0.64, 0.22], [0.72, 0.28], [0.8, 0.1], [0.86, 0], [1.0, 0],
]

/** Build a PQRST path across `beats` beats in the viewBox, baseline centred. */
function sinusPath(beats: number, width: number, height: number): string {
  const mid = height / 2
  const amp = height * 0.4
  const beatW = width / beats
  const pts: string[] = []
  for (let b = 0; b < beats; b++) {
    for (const [fx, a] of BEAT) {
      const x = (b + fx) * beatW
      const y = mid - a * amp
      pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`)
    }
  }
  return "M " + pts.join(" L ")
}

/** Map an arbitrary sample array to a path, normalised by peak amplitude. */
function samplesPath(data: number[], width: number, height: number): string {
  const mid = height / 2
  const peak = Math.max(1e-6, ...data.map((v) => Math.abs(v)))
  const amp = height * 0.4
  const step = data.length > 1 ? width / (data.length - 1) : width
  return (
    "M " +
    data
      .map((v, i) => `${(i * step).toFixed(1)} ${(mid - (v / peak) * amp).toFixed(1)}`)
      .join(" L ")
  )
}

export interface EcgStripProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Waveform samples; falls back to a canned normal-sinus rhythm. */
  data?: number[]
  /** Beats to draw when using the canned rhythm. Default 4. */
  beats?: number
  /** Heart rate label, e.g. 72. */
  rate?: number
  /** Lead name, e.g. "II". */
  lead?: string
  /** Animate the stroke drawing on. Default true (reduced-motion safe). */
  animate?: boolean
  /** Draw a calibration grid — only pass when `data` is scaled/calibrated. */
  showGrid?: boolean
  color?: keyof typeof colorClass
  width?: number
  height?: number
}

/**
 * Illustrative ECG rhythm strip: renders a provided waveform (or a canned
 * normal-sinus rhythm) as an animated SVG stroke with rate and lead labels.
 * This is a decorative-but-honest motif — NOT a diagnostic trace viewer; it
 * makes no measurement claims unless you pass calibrated data with a grid.
 */
function EcgStrip({
  data,
  beats = 4,
  rate,
  lead = "II",
  animate = true,
  showGrid = false,
  color = "default",
  width = 320,
  height = 72,
  className,
  ...props
}: EcgStripProps) {
  const gid = React.useId().replace(/[:]/g, "")
  const d = data ? samplesPath(data, width, height) : sinusPath(beats, width, height)

  const accessibleName = `Illustrative ECG rhythm strip, lead ${lead}${
    rate ? `, ${rate} beats per minute` : ""
  }. Not a diagnostic tracing.`

  return (
    <div
      data-slot="ecg-strip"
      role="img"
      aria-label={accessibleName}
      className={cn(
        "bg-card relative overflow-hidden rounded-xl border border-border/60 shadow-soft",
        className
      )}
      {...props}
    >
      {(rate !== undefined || lead) && (
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-3 py-2">
          <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wide">
            Lead {lead}
          </span>
          {rate !== undefined && (
            <span className={cn("inline-flex items-center gap-1 text-sm font-bold tabular-nums", colorClass[color])}>
              <ActivityIcon className="size-3.5" aria-hidden />
              {rate}
              <span className="text-muted-foreground text-[10px] font-medium">bpm</span>
            </span>
          )}
        </div>
      )}

      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        className={cn("block", colorClass[color])}
        aria-hidden
      >
        <style>{`
          @media (prefers-reduced-motion: no-preference) {
            .ecg-draw-${gid} {
              stroke-dasharray: 100;
              stroke-dashoffset: 100;
              animation: ecg-sweep-${gid} 3.5s linear infinite;
            }
          }
          @keyframes ecg-sweep-${gid} {
            0% { stroke-dashoffset: 100; }
            60%, 100% { stroke-dashoffset: 0; }
          }
        `}</style>

        {showGrid && (
          <g aria-hidden className="text-destructive/15" stroke="currentColor" strokeWidth={0.5}>
            {Array.from({ length: Math.floor(width / 16) + 1 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 16} y1={0} x2={i * 16} y2={height} />
            ))}
            {Array.from({ length: Math.floor(height / 16) + 1 }).map((_, i) => (
              <line key={`h${i}`} x1={0} y1={i * 16} x2={width} y2={i * 16} />
            ))}
          </g>
        )}

        <path
          d={d}
          pathLength={100}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className={animate ? `ecg-draw-${gid}` : undefined}
        />
      </svg>
    </div>
  )
}

export { EcgStrip }
