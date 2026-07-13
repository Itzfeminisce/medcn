"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAssistantButton } from "@/registry/medcn/ai-assistant-button/ai-assistant-button"
import { AiAssistantSheet } from "@/registry/medcn/ai-assistant-sheet/ai-assistant-sheet"
import { AiChat } from "@/registry/medcn/ai-chat/ai-chat"
import {
  AiChatHeader,
  type AiAssistantStatus,
} from "@/registry/medcn/ai-chat-header/ai-chat-header"
import { AiChatMessages } from "@/registry/medcn/ai-chat-messages/ai-chat-messages"
import { AiContextBar } from "@/registry/medcn/ai-context-bar/ai-context-bar"
import { AiPromptInput } from "@/registry/medcn/ai-prompt-input/ai-prompt-input"
import { AiSuggestionList } from "@/registry/medcn/ai-suggestion-list/ai-suggestion-list"

export interface ClinicalAiAssistantProps {
  /**
   * `floating` mounts the trigger + sheet; `page` renders the same conversation
   * inline as a full-height workspace and ignores the trigger props.
   */
  variant?: "floating" | "page"

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /**
   * Called before any dismissal. Return false to keep the panel open — e.g. a
   * drafted prompt, an active recording, or an unreviewed answer would be lost.
   */
  onRequestClose?: () => boolean

  /** Replaces the default floating button. Must open the panel itself. */
  trigger?: React.ReactNode
  hideTrigger?: boolean
  triggerPlacement?: "bottom-right" | "bottom-left" | "inline"
  /** New assistant output — never an urgent clinical signal. */
  unread?: boolean | number
  attention?: boolean
  triggerLabel?: string
  triggerTooltip?: React.ReactNode

  /** Replaces the whole header block. */
  header?: React.ReactNode
  title?: React.ReactNode
  subtitle?: React.ReactNode
  status?: AiAssistantStatus
  statusLabel?: React.ReactNode
  onNewChat?: () => void
  headerActions?: React.ReactNode

  /** Context chips — typically ai-context-chip. Rendered in an ai-context-bar. */
  context?: React.ReactNode
  contextLabel?: string
  onManageContext?: () => void
  /** Replaces the context bar — e.g. an ai-patient-context-card. */
  contextBar?: React.ReactNode

  /** The transcript: ai-message, answer cards, ai-thinking, ai-error-state. */
  children?: React.ReactNode
  /** Shown when the transcript is empty — typically ai-empty-state. */
  empty?: React.ReactNode
  autoScroll?: boolean

  /** Prompt chips or suggestion cards, above the composer. */
  suggestions?: React.ReactNode
  suggestionLayout?: "row" | "scroll" | "grid"

  /** Replaces the composer block, disclaimer included. */
  composer?: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onSubmit?: (value: string) => void
  onStop?: () => void
  streaming?: boolean
  disabled?: boolean
  placeholder?: string
  /** PHI/sharing restrictions shown in the composer, before a prompt is sent. */
  restrictions?: React.ReactNode
  /** Voice, attachments, context controls — rendered in the composer toolbar. */
  tools?: React.ReactNode
  /** Safety notice above the composer — typically ai-clinical-disclaimer. */
  disclaimer?: React.ReactNode

  className?: string
}

/**
 * The flagship composition: AiAssistantButton → AiAssistantSheet → AiChat, with
 * a visible context bar, an accessible transcript, suggestions, and a composer.
 * The same props render a full-page workspace (`variant="page"`), so a product
 * can ship both surfaces without a second chat implementation.
 *
 * It owns only panel-open state. Messages, streaming, context, transcription,
 * and every clinical check remain the consumer's — this is the UI shell they
 * are shown in, not the assistant itself.
 */
function ClinicalAiAssistant({
  variant = "floating",
  open,
  defaultOpen = false,
  onOpenChange,
  onRequestClose,
  trigger,
  hideTrigger,
  triggerPlacement = "bottom-right",
  unread,
  attention,
  triggerLabel = "Clinical assistant",
  triggerTooltip,
  header,
  title = "Clinical assistant",
  subtitle,
  status,
  statusLabel,
  onNewChat,
  headerActions,
  context,
  contextLabel,
  onManageContext,
  contextBar,
  children,
  empty,
  autoScroll,
  suggestions,
  suggestionLayout = "row",
  composer,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  onStop,
  streaming,
  disabled,
  placeholder,
  restrictions,
  tools,
  disclaimer,
  className,
}: ClinicalAiAssistantProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isOpen = open ?? uncontrolledOpen

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  /** The header's own close goes through the same guard as Escape and the overlay. */
  const requestClose = () => {
    if (onRequestClose && onRequestClose() === false) return
    setOpen(false)
  }

  const hasMessages = React.Children.count(children) > 0
  const transcript = (
    <AiChatMessages autoScroll={autoScroll}>
      {hasMessages ? children : empty}
    </AiChatMessages>
  )

  const headerNode = header ?? (
    <AiChatHeader
      title={title}
      subtitle={subtitle}
      status={status}
      statusLabel={statusLabel}
      onNewChat={onNewChat}
      onClose={variant === "floating" ? requestClose : undefined}
      actions={headerActions}
    />
  )

  const contextNode =
    contextBar ??
    (context || onManageContext ? (
      <AiContextBar label={contextLabel} onManage={onManageContext}>
        {context}
      </AiContextBar>
    ) : undefined)

  const suggestionsNode = suggestions ? (
    <AiSuggestionList layout={suggestionLayout}>{suggestions}</AiSuggestionList>
  ) : undefined

  const composerNode =
    composer ??
    (onSubmit || onValueChange ? (
      <div className="flex flex-col gap-2">
        {disclaimer}
        <AiPromptInput
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          onSubmit={onSubmit}
          onStop={onStop}
          streaming={streaming}
          disabled={disabled}
          placeholder={placeholder}
          restrictions={restrictions}
          tools={tools}
        />
      </div>
    ) : undefined)

  if (variant === "page") {
    return (
      <AiChat
        className={cn("h-full", className)}
        header={headerNode}
        context={contextNode}
        messages={transcript}
        suggestions={suggestionsNode}
        composer={composerNode}
      />
    )
  }

  return (
    <>
      {!hideTrigger &&
        (trigger ?? (
          <AiAssistantButton
            placement={triggerPlacement}
            open={isOpen}
            unread={unread}
            attention={attention}
            label={triggerLabel}
            tooltip={triggerTooltip}
            onClick={() => setOpen(!isOpen)}
          />
        ))}

      <AiAssistantSheet
        open={isOpen}
        onOpenChange={setOpen}
        onRequestClose={onRequestClose}
        title={typeof title === "string" ? title : triggerLabel}
        header={headerNode}
        context={contextNode}
        composer={composerNode}
        className={className}
      >
        {transcript}
        {suggestionsNode && (
          <div
            data-slot="clinical-ai-assistant-suggestions"
            className="shrink-0 px-3 pb-2"
          >
            {suggestionsNode}
          </div>
        )}
      </AiAssistantSheet>
    </>
  )
}

export { ClinicalAiAssistant }
