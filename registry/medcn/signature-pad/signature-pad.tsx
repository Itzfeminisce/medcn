"use client"

import * as React from "react"
import { Undo2Icon, XIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Input } from "@/registry/medcn/input/input"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/medcn/toggle-group/toggle-group"

type Point = { x: number; y: number }

export interface SignatureValue {
  mode: "draw" | "type"
  /** PNG data URL when drawn. */
  dataUrl?: string
  /** Typed name when using the non-drawing path. */
  typedName?: string
  /** ISO timestamp of when it was signed. */
  signedAt: string
}

export interface SignaturePadProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  onChange?: (value: SignatureValue | null) => void
  width?: number
  height?: number
  disabled?: boolean
}

/**
 * Signature capture with a drawing canvas (clear + undo) and a typed-name
 * fallback for accessibility. Emits a data URL or typed name plus a timestamp,
 * because a signature without a "when" is weak evidence of consent.
 */
function SignaturePad({
  onChange,
  width = 340,
  height = 150,
  disabled,
  className,
  ...props
}: SignaturePadProps) {
  const [mode, setMode] = React.useState<"draw" | "type">("draw")
  const [typedName, setTypedName] = React.useState("")
  const [hasInk, setHasInk] = React.useState(false)

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const strokesRef = React.useRef<Point[][]>([])
  const drawingRef = React.useRef(false)

  const onChangeRef = React.useRef(onChange)
  onChangeRef.current = onChange

  const strokeColor = React.useCallback((): string => {
    const c = canvasRef.current
    if (!c) return "#000"
    return getComputedStyle(c).color || "#000"
  }, [])

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, width, height)
    ctx.strokeStyle = strokeColor()
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0]!.x, stroke[0]!.y)
      for (let i = 1; i < stroke.length; i++) ctx.lineTo(stroke[i]!.x, stroke[i]!.y)
      // A single tap should leave a dot.
      if (stroke.length === 1) ctx.lineTo(stroke[0]!.x + 0.1, stroke[0]!.y + 0.1)
      ctx.stroke()
    }
  }, [width, height, strokeColor])

  // Size the backing store for the device pixel ratio, then draw.
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = width * dpr
    canvas.height = height * dpr
    redraw()
  }, [width, height, redraw])

  // Recolour existing ink when the theme changes (strokes are stored, not baked).
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const obs = new MutationObserver(redraw)
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    })
    mq.addEventListener("change", redraw)
    return () => {
      obs.disconnect()
      mq.removeEventListener("change", redraw)
    }
  }, [redraw])

  function emitDrawn() {
    const canvas = canvasRef.current
    const ink = strokesRef.current.some((s) => s.length > 0)
    setHasInk(ink)
    if (!canvas || !ink) {
      onChangeRef.current?.(null)
      return
    }
    onChangeRef.current?.({
      mode: "draw",
      dataUrl: canvas.toDataURL("image/png"),
      signedAt: new Date().toISOString(),
    })
  }

  function pointFromEvent(e: React.PointerEvent): Point {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return
    drawingRef.current = true
    canvasRef.current?.setPointerCapture(e.pointerId)
    strokesRef.current.push([pointFromEvent(e)])
    redraw()
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drawingRef.current) return
    const stroke = strokesRef.current[strokesRef.current.length - 1]
    stroke?.push(pointFromEvent(e))
    redraw()
  }

  function onPointerUp() {
    if (!drawingRef.current) return
    drawingRef.current = false
    emitDrawn()
  }

  function clear() {
    strokesRef.current = []
    redraw()
    setHasInk(false)
    onChangeRef.current?.(null)
  }

  function undo() {
    strokesRef.current.pop()
    redraw()
    emitDrawn()
  }

  function changeTyped(v: string) {
    setTypedName(v)
    onChangeRef.current?.(
      v.trim()
        ? { mode: "type", typedName: v.trim(), signedAt: new Date().toISOString() }
        : null
    )
  }

  return (
    <div
      data-slot="signature-pad"
      className={cn("flex flex-col gap-3", className)}
      style={{ width }}
      {...props}
    >
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        value={mode}
        onValueChange={(v) => v && setMode(v as "draw" | "type")}
        disabled={disabled}
        className="w-full"
      >
        <ToggleGroupItem value="draw">Draw</ToggleGroupItem>
        <ToggleGroupItem value="type">Type name</ToggleGroupItem>
      </ToggleGroup>

      {mode === "draw" ? (
        <>
          <div className="relative rounded-xl border border-input bg-card">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label="Signature drawing area"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
              style={{ width, height, touchAction: "none" }}
              className="text-foreground block cursor-crosshair"
            />
            {!hasInk && (
              <span className="text-muted-foreground pointer-events-none absolute inset-0 flex items-center justify-center text-sm">
                Sign here
              </span>
            )}
            <span className="bg-border absolute inset-x-6 bottom-9 h-px" aria-hidden />
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={undo}
              disabled={disabled || !hasInk}
            >
              <Undo2Icon />
              Undo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={clear}
              disabled={disabled || !hasInk}
            >
              <XIcon />
              Clear
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signature-typed" className="text-sm font-medium">
            Type your full name
          </label>
          <Input
            id="signature-typed"
            placeholder="Full legal name"
            disabled={disabled}
            value={typedName}
            onChange={(e) => changeTyped(e.target.value)}
            className="font-[cursive] text-lg"
          />
          <p className="text-muted-foreground text-xs">
            Typing your name counts as your signature.
          </p>
        </div>
      )}
    </div>
  )
}

export { SignaturePad }
