import * as React from "react"
import {
  CalendarRangeIcon,
  FileTextIcon,
  LockIcon,
  PillIcon,
  StethoscopeIcon,
  UserRoundIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"

export type AiContextKind =
  | "patient"
  | "encounter"
  | "document"
  | "medication"
  | "date-range"

const KIND_ICONS: Record<AiContextKind, React.ElementType> = {
  patient: UserRoundIcon,
  encounter: StethoscopeIcon,
  document: FileTextIcon,
  medication: PillIcon,
  "date-range": CalendarRangeIcon,
}

export interface AiContextChipProps
  extends Omit<React.ComponentProps<typeof Badge>, "children"> {
  /** What kind of context this is — drives the leading icon. */
  kind?: AiContextKind
  /** Human-readable label, e.g. "Encounter · 12 Mar". */
  children: React.ReactNode
  /** Marks context that carries identifiable or otherwise sensitive data. */
  sensitive?: boolean
  /** Removes this item from the outgoing context. Omit for a fixed chip. */
  onRemove?: () => void
  /** Accessible name for the remove control. Defaults from the label when it is a string. */
  removeLabel?: string
}

/**
 * One token of context that will be sent with the next prompt. Removing a chip
 * changes the outgoing request only — it never deletes a clinical record.
 */
function AiContextChip({
  className,
  kind = "document",
  children,
  sensitive,
  onRemove,
  removeLabel,
  variant = "outline",
  ...props
}: AiContextChipProps) {
  const Icon = KIND_ICONS[kind]
  const fallbackLabel =
    typeof children === "string" ? children : "this context item"

  return (
    <Badge
      data-slot="ai-context-chip"
      data-kind={kind}
      data-sensitive={sensitive ? "" : undefined}
      variant={variant}
      className={cn(
        "text-muted-foreground max-w-56 gap-1.5 py-1 pl-2 font-medium",
        onRemove ? "pr-1" : "pr-2.5",
        sensitive && "border-warning/40 bg-warning/5",
        className
      )}
      {...props}
    >
      <Icon aria-hidden className="shrink-0" />
      <span className="truncate">{children}</span>

      {sensitive && (
        <>
          <LockIcon
            aria-hidden
            className="text-warning-foreground dark:text-warning shrink-0"
          />
          <span className="sr-only">Contains sensitive data</span>
        </>
      )}

      {onRemove && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={removeLabel ?? `Remove ${fallbackLabel} from assistant context`}
          onClick={onRemove}
          className="text-muted-foreground hover:text-foreground -mr-0.5 size-5 shrink-0 rounded-full"
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </Badge>
  )
}

export { AiContextChip, KIND_ICONS as aiContextChipIcons }
