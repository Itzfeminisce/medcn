"use client"

import * as React from "react"
import { ArrowDownIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"

/** Distance from the bottom, in px, still treated as "at the latest message". */
const BOTTOM_THRESHOLD = 32

export interface AiChatMessagesProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  children: React.ReactNode
  /** Follow new messages while the reader is at the bottom. */
  autoScroll?: boolean
  /** Fired when the reader arrives back at the latest message. */
  onReachLatest?: () => void
  /** Copy for the jump control when the pending count is unknown. */
  jumpLabel?: string
}

/**
 * Scrollable transcript that anchors to the newest message but stops following
 * the moment a reader scrolls up to re-read something. Messages that arrive
 * while they are away are counted, not silently scrolled past.
 */
function AiChatMessages({
  className,
  children,
  autoScroll = true,
  onReachLatest,
  onScroll,
  jumpLabel = "Jump to latest",
  ...props
}: AiChatMessagesProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null)
  const [atBottom, setAtBottom] = React.useState(true)
  const [pending, setPending] = React.useState(0)

  const count = React.Children.count(children)
  const previousCount = React.useRef(count)

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior) => {
    const viewport = viewportRef.current
    if (!viewport) return
    viewport.scrollTo({ top: viewport.scrollHeight, behavior })
  }, [])

  // Open on the newest message: a transcript that starts at the top hides the
  // answer the clinician came for.
  React.useLayoutEffect(() => {
    if (autoScroll) scrollToBottom("auto")
  }, [autoScroll, scrollToBottom])

  React.useEffect(() => {
    const added = count - previousCount.current
    previousCount.current = count
    if (added <= 0) return

    if (atBottom && autoScroll) {
      scrollToBottom("smooth")
    } else {
      // Reader is up the transcript: count the arrivals instead of yanking them down.
      setPending((value) => value + added)
    }
  }, [count, atBottom, autoScroll, scrollToBottom])

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const viewport = event.currentTarget
    const distance =
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight
    const bottom = distance <= BOTTOM_THRESHOLD

    setAtBottom(bottom)
    if (bottom) {
      setPending(0)
      onReachLatest?.()
    }
    onScroll?.(event)
  }

  const jump = () => {
    scrollToBottom("smooth")
    setPending(0)
    setAtBottom(true)
    onReachLatest?.()
  }

  return (
    <div data-slot="ai-chat-messages" className="relative flex min-h-0 flex-1">
      <div
        ref={viewportRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Assistant conversation"
        tabIndex={0}
        onScroll={handleScroll}
        className={cn(
          "flex w-full flex-col gap-5 overflow-y-auto p-4",
          "focus-visible:ring-ring/40 outline-none focus-visible:ring-2",
          className
        )}
        {...props}
      >
        {children}
      </div>

      {!atBottom && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={jump}
          className="bg-card absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full shadow-lift"
        >
          <ArrowDownIcon />
          {pending > 0
            ? `${pending} new ${pending === 1 ? "message" : "messages"}`
            : jumpLabel}
        </Button>
      )}
    </div>
  )
}

export { AiChatMessages }
