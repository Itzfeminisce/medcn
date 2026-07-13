"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

/** Reveal ticks per second. Chars per tick derive from `speed`. */
const TICK_MS = 40

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false)

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener("change", onChange)
    return () => query.removeEventListener("change", onChange)
  }, [])

  return reduced
}

export interface AiStreamingTextProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** The text known so far. Append to it to stream; replace it to restart. */
  text: string
  /** While true the text is revealed incrementally. Flip to false to complete. */
  streaming?: boolean
  /** Reveal rate in characters per second. */
  speed?: number
  /** Fires once when the reveal catches up with `text`. */
  onComplete?: () => void
  /** Blinking caret while text is still being revealed. */
  cursor?: boolean
}

/**
 * Incrementally reveals caller-supplied text. It renders a plain string — it is
 * not a markdown parser and it does not talk to a model; the caller owns the
 * transport and may complete, cancel, or replace the stream at any time.
 *
 * Reading order is stable: revealed characters are never reordered, and a
 * replacement that shares a prefix with what is already on screen keeps that
 * prefix rather than flashing back to empty.
 */
function AiStreamingText({
  className,
  text,
  streaming = true,
  speed = 60,
  onComplete,
  cursor = true,
  ...props
}: AiStreamingTextProps) {
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = React.useState(() => (streaming ? 0 : text.length))
  const previousText = React.useRef(text)
  const completed = React.useRef(!streaming)

  // The stream was replaced (not appended to): keep the shared prefix if there
  // is one, otherwise start over. Either way, what was read stays read.
  React.useEffect(() => {
    setCount((current) => {
      const kept = Math.min(current, text.length)
      return text.startsWith(previousText.current.slice(0, kept)) ? kept : 0
    })
    previousText.current = text
  }, [text])

  // Reduced motion (or a completed stream) shows the whole thing at once.
  React.useEffect(() => {
    if (!streaming || reducedMotion) setCount(text.length)
  }, [streaming, reducedMotion, text])

  React.useEffect(() => {
    if (!streaming || reducedMotion) return

    const charsPerTick = Math.max(1, Math.round((speed * TICK_MS) / 1000))
    const timer = window.setInterval(() => {
      setCount((current) =>
        current >= text.length ? current : current + charsPerTick
      )
    }, TICK_MS)

    return () => window.clearInterval(timer)
  }, [streaming, reducedMotion, speed, text])

  const revealed = text.slice(0, count)
  const isRevealing = streaming && count < text.length

  React.useEffect(() => {
    if (isRevealing) {
      completed.current = false
      return
    }
    if (completed.current) return
    completed.current = true
    onComplete?.()
  }, [isRevealing, onComplete])

  return (
    <div
      data-slot="ai-streaming-text"
      data-streaming={isRevealing ? "" : undefined}
      aria-busy={isRevealing || undefined}
      className={cn("text-sm leading-relaxed whitespace-pre-wrap", className)}
      {...props}
    >
      {/*
        The animating copy is hidden from assistive tech on purpose: a live
        region over a per-character reveal re-announces the whole paragraph on
        every tick, which is unusable. The settled text is exposed once, in
        order, through the polite region below — so a screen-reader user hears
        the response a single time, complete.
      */}
      <span aria-hidden="true">
        {revealed}
        {cursor && isRevealing && (
          <span
            data-slot="ai-streaming-text-cursor"
            className="bg-primary ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.15em] rounded-xs motion-safe:animate-pulse"
          />
        )}
      </span>

      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isRevealing ? "" : text}
      </span>
    </div>
  )
}

export { AiStreamingText }
