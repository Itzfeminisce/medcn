"use client"

import * as React from "react"
import { Monitor, RotateCcw, Smartphone, Tablet } from "lucide-react"

import { cn } from "@/lib/utils"

type Device = "mobile" | "tablet" | "desktop"

const deviceWidth: Record<Device, number | null> = {
  mobile: 390,
  tablet: 820,
  desktop: null, // full width
}

const devices: { id: Device; label: string; icon: React.ElementType }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet", label: "Tablet", icon: Tablet },
  { id: "mobile", label: "Mobile", icon: Smartphone },
]

/**
 * Preview/Code tabs for a full-screen block. The Preview tab renders the demo
 * inside an iframe (real, isolated viewport) at a selectable / draggable width,
 * so blocks show their true responsive layout instead of squeezing into the
 * docs column.
 */
export function BlockPreview({
  name,
  codeView,
  className,
  height = 640,
}: {
  name: string
  codeView: React.ReactNode
  className?: string
  height?: number
}) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview")
  const [device, setDevice] = React.useState<Device>("desktop")
  const [width, setWidth] = React.useState<number | null>(null)
  const frameRef = React.useRef<HTMLDivElement>(null)
  const dragging = React.useRef(false)

  function pick(d: Device) {
    setDevice(d)
    setWidth(deviceWidth[d])
  }

  function onDragStart(e: React.PointerEvent) {
    e.preventDefault()
    dragging.current = true
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onDrag(e: React.PointerEvent) {
    if (!dragging.current || !frameRef.current) return
    const rect = frameRef.current.getBoundingClientRect()
    // Handle sits on the right edge; width = pointer - left, clamped.
    const next = Math.max(320, Math.min(rect.width, e.clientX - rect.left))
    setWidth(next)
    setDevice("desktop")
  }
  function onDragEnd() {
    dragging.current = false
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border/60">
        <div className="flex items-center gap-5">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "-mb-px cursor-pointer border-b-2 pb-2.5 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "preview" && (
          <div className="mb-1.5 ml-auto flex items-center gap-1">
            {devices.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={device === id}
                onClick={() => pick(id)}
                className={cn(
                  "rounded-md p-1.5 transition-colors",
                  device === id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
              </button>
            ))}
            <button
              type="button"
              title="Reset width"
              aria-label="Reset width"
              onClick={() => pick("desktop")}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
            >
              <RotateCcw className="size-4" />
            </button>
            {width && (
              <span className="ml-1 w-14 text-right text-xs tabular-nums text-muted-foreground">
                {Math.round(width)}px
              </span>
            )}
          </div>
        )}
      </div>

      <div className={cn(tab !== "preview" && "hidden")}>
        <div
          ref={frameRef}
          className="relative flex justify-center rounded-xl border border-border/60 bg-grid p-3"
        >
          <div
            className="relative shrink-0 no-scrollbar overflow-hidden rounded-lg border border-border/60 bg-background shadow-soft transition-[width] duration-200"
            style={{ width: width ? `${width}px` : "100%", height }}
          >
            <iframe
              title={`${name} preview`}
              src={`/preview/${name}`}
              className="h-full w-full"
              loading="lazy"
            />
          </div>
          {/* Drag handle on the right edge of the frame. */}
          <div
            onPointerDown={onDragStart}
            onPointerMove={onDrag}
            onPointerUp={onDragEnd}
            className="absolute inset-y-0 right-3 hidden w-3 cursor-ew-resize touch-none items-center justify-center sm:flex"
          >
            <div className="h-10 w-1.5 rounded-full bg-border transition-colors hover:bg-ring/60" />
          </div>
        </div>
      </div>

      <div className={cn(tab !== "code" && "hidden")}>{codeView}</div>
    </div>
  )
}
