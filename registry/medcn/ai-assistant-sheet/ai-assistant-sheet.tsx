"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/registry/medcn/sheet/sheet"

export interface AiAssistantSheetProps
  extends Omit<React.ComponentProps<typeof Sheet>, "children"> {
  /** Accessible title. Rendered visually unless `header` replaces it. */
  title?: React.ReactNode
  description?: React.ReactNode
  /** Replaces the default title block — e.g. an AiChatHeader. */
  header?: React.ReactNode
  /** Visible context strip under the header. */
  context?: React.ReactNode
  /** The conversation. */
  children?: React.ReactNode
  /** Composer, pinned to the bottom of the sheet. */
  composer?: React.ReactNode
  /**
   * Called before any dismissal — close button, overlay click, or Escape.
   * Return false to keep the sheet open, e.g. when a draft prompt, an active
   * recording, or an unreviewed answer would be lost.
   */
  onRequestClose?: () => boolean
  className?: string
}

/**
 * Right-side panel on desktop, bottom sheet on narrow screens. Focus is trapped
 * while open and returns to the trigger on close. Dismissal is routed through
 * `onRequestClose` so unsaved clinical work cannot be lost to a stray Escape.
 */
function AiAssistantSheet({
  title = "Clinical assistant",
  description,
  header,
  context,
  children,
  composer,
  onRequestClose,
  onOpenChange,
  className,
  ...props
}: AiAssistantSheetProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open && onRequestClose && onRequestClose() === false) return
    onOpenChange?.(open)
  }

  return (
    <Sheet onOpenChange={handleOpenChange} {...props}>
      <SheetContent
        data-slot="ai-assistant-sheet"
        // Bottom sheet on narrow screens, side panel from sm up.
        className={cn(
          "inset-x-0 inset-y-auto bottom-0 h-[85vh] w-full max-w-none rounded-t-2xl border-t p-0",
          "data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom",
          "sm:inset-y-0 sm:right-0 sm:left-auto sm:h-full sm:w-3/4 sm:max-w-md sm:rounded-none sm:border-t-0 sm:border-l",
          "sm:data-[state=open]:slide-in-from-right sm:data-[state=closed]:slide-out-to-right",
          className
        )}
      >
        {header ?? (
          <div className="flex flex-col gap-1 border-b px-5 py-4 pr-12">
            <SheetTitle>{title}</SheetTitle>
            {description && <SheetDescription>{description}</SheetDescription>}
          </div>
        )}

        {/* Radix requires an accessible title; keep one even when `header` replaces the visual block. */}
        {header && (
          <SheetTitle className="sr-only">
            {typeof title === "string" ? title : "Clinical assistant"}
          </SheetTitle>
        )}

        {context && (
          <div
            data-slot="ai-assistant-sheet-context"
            className="border-b px-3 py-1.5"
          >
            {context}
          </div>
        )}

        <div
          data-slot="ai-assistant-sheet-body"
          className="flex min-h-0 flex-1 flex-col"
        >
          {children}
        </div>

        {composer && (
          <div
            data-slot="ai-assistant-sheet-composer"
            className="border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          >
            {composer}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export { AiAssistantSheet }
