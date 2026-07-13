"use client"

import * as React from "react"
import {
  LoaderCircleIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  aiContextChipIcons,
  type AiContextKind,
} from "@/registry/medcn/ai-context-chip/ai-context-chip"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Input } from "@/registry/medcn/input/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"
import { Separator } from "@/registry/medcn/separator/separator"

export interface AiContextPickerItem {
  /** Stable identifier — what `onSelectedChange` reports. */
  id: string
  /** Non-identifying label. Never put record contents here for restricted items. */
  label: string
  /** Secondary line: date, author, dose. Suppressed for restricted items. */
  meta?: string
  /** Drives the leading icon. */
  kind?: AiContextKind
  /**
   * The current user is not permitted to see this source. It is listed so its
   * absence is explainable, rendered without its contents, and cannot be selected.
   */
  restricted?: boolean
  /** Why access is withheld — a policy reason, never a preview of the content. */
  restrictedReason?: string
  /** The source exists but cannot be retrieved right now (system offline, still filing). */
  unavailable?: boolean
  /** Why it cannot be attached right now. */
  unavailableReason?: string
}

export interface AiContextPickerGroup {
  /** Stable identifier for the group. */
  id: string
  /** Group heading, e.g. "Documents", "Observations", "Medications". */
  label: string
  items: AiContextPickerItem[]
}

export interface AiContextPickerProps
  extends Omit<React.ComponentProps<typeof PopoverContent>, "onSelect"> {
  /** Caller-provided sources, already grouped and authorized. */
  groups: AiContextPickerGroup[]
  /** Selected item ids (controlled). */
  selected?: string[]
  /** Initial selection when uncontrolled. */
  defaultSelected?: string[]
  onSelectedChange?: (ids: string[]) => void
  /** Search query (controlled). Omit to let the picker filter internally. */
  search?: string
  onSearchChange?: (query: string) => void
  searchPlaceholder?: string
  /** Sources are still being fetched. */
  loading?: boolean
  loadingMessage?: React.ReactNode
  /** Shown when nothing matches the query. */
  emptyMessage?: React.ReactNode
  /** Heading inside the panel. */
  heading?: React.ReactNode
  /** Custom trigger. Defaults to an "Add context" button carrying the count. */
  trigger?: React.ReactNode
  triggerLabel?: React.ReactNode
  /** Small print under the list — scope, audit, or retention reminders. */
  footnote?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

function matches(item: AiContextPickerItem, query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return (
    item.label.toLowerCase().includes(q) ||
    (item.meta?.toLowerCase().includes(q) ?? false)
  )
}

/**
 * Searchable, grouped picker over caller-provided sources. It selects context
 * for the next prompt; it retrieves nothing, authorizes nothing, and reads no
 * record. Restricted sources are listed by label and reason only — never by
 * their contents — so a clinician can see that context exists and is withheld.
 */
function AiContextPicker({
  className,
  groups,
  selected,
  defaultSelected,
  onSelectedChange,
  search,
  onSearchChange,
  searchPlaceholder = "Search documents, observations, medications…",
  loading,
  loadingMessage = "Loading available context…",
  emptyMessage = "No matching context.",
  heading = "Attach context",
  trigger,
  triggerLabel = "Add context",
  footnote,
  open,
  defaultOpen,
  onOpenChange,
  align = "start",
  ...props
}: AiContextPickerProps) {
  const searchId = React.useId()

  const [internalSelected, setInternalSelected] = React.useState<string[]>(
    defaultSelected ?? []
  )
  const selection = selected ?? internalSelected

  const [internalSearch, setInternalSearch] = React.useState("")
  const query = search ?? internalSearch

  const setSelection = (next: string[]) => {
    if (selected === undefined) setInternalSelected(next)
    onSelectedChange?.(next)
  }

  const toggle = (id: string, checked: boolean) => {
    setSelection(
      checked
        ? [...selection.filter((v) => v !== id), id]
        : selection.filter((v) => v !== id)
    )
  }

  const setQuery = (next: string) => {
    if (search === undefined) setInternalSearch(next)
    onSearchChange?.(next)
  }

  const filtered = groups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => matches(item, query)),
    }))
    .filter((group) => group.items.length > 0)

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button type="button" variant="outline" size="sm">
            <PlusIcon aria-hidden />
            {triggerLabel}
            {selection.length > 0 && (
              <Badge
                variant="soft"
                className="ml-0.5 h-4 min-w-4 px-1 text-[10px] font-semibold"
              >
                {selection.length}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent
        data-slot="ai-context-picker"
        align={align}
        className={cn("w-80 gap-0 p-0", className)}
        {...props}
      >
        <div className="flex flex-col gap-2 p-3">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold">{heading}</span>
            {selection.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground -mr-1.5 h-6 px-2 text-[11px]"
                onClick={() => setSelection([])}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="relative">
            <SearchIcon
              aria-hidden
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2"
            />
            <Input
              id={searchId}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search available context"
              className="h-8 pl-8 text-xs md:text-xs"
            />
          </div>
        </div>

        <Separator />

        <div
          data-slot="ai-context-picker-list"
          role="group"
          aria-label="Available context"
          aria-busy={loading || undefined}
          className="max-h-72 overflow-y-auto p-1.5"
        >
          {loading ? (
            <p className="text-muted-foreground flex items-center gap-2 px-2 py-6 text-xs">
              <LoaderCircleIcon
                aria-hidden
                className="size-3.5 shrink-0 animate-spin"
              />
              {loadingMessage}
            </p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground px-2 py-6 text-center text-xs">
              {emptyMessage}
            </p>
          ) : (
            filtered.map((group) => (
              <div
                key={group.id}
                data-slot="ai-context-picker-group"
                className="mb-1 last:mb-0"
              >
                <p className="text-muted-foreground px-2 py-1.5 text-[10px] font-bold tracking-wide uppercase">
                  {group.label}
                </p>

                {group.items.map((item) => {
                  const Icon = aiContextChipIcons[item.kind ?? "document"]
                  const blocked = item.restricted || item.unavailable
                  const checked = selection.includes(item.id)
                  const reason = item.restricted
                    ? (item.restrictedReason ??
                      "Restricted — you do not have access to this source.")
                    : item.unavailableReason

                  if (blocked) {
                    return (
                      <div
                        key={item.id}
                        data-slot="ai-context-picker-item"
                        data-state={item.restricted ? "restricted" : "unavailable"}
                        aria-disabled
                        className="grid grid-cols-[1.125rem_1fr] items-start gap-x-2.5 gap-y-0.5 rounded-lg px-2 py-2 opacity-70"
                      >
                        {item.restricted ? (
                          <LockIcon
                            aria-hidden
                            className="text-warning-foreground dark:text-warning mt-0.5 size-4"
                          />
                        ) : (
                          <TriangleAlertIcon
                            aria-hidden
                            className="text-muted-foreground mt-0.5 size-4"
                          />
                        )}
                        <span className="text-muted-foreground truncate text-[13px] font-medium">
                          {item.label}
                        </span>
                        {/* No `meta` here, by design: a source the user may not
                            read must not leak its contents through the picker. */}
                        {reason && (
                          <span className="text-muted-foreground col-start-2 text-[11px] leading-relaxed">
                            {reason}
                          </span>
                        )}
                      </div>
                    )
                  }

                  return (
                    <label
                      key={item.id}
                      data-slot="ai-context-picker-item"
                      data-state={checked ? "selected" : "available"}
                      className={cn(
                        "hover:bg-accent/60 grid cursor-pointer grid-cols-[auto_auto_1fr] items-center gap-x-2.5 gap-y-0.5 rounded-lg px-2 py-2 transition-colors",
                        checked && "bg-accent/40"
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(state) => toggle(item.id, state === true)}
                        className="size-4"
                      />
                      <Icon
                        aria-hidden
                        className="text-muted-foreground size-4 shrink-0"
                      />
                      <span className="truncate text-[13px] font-medium">
                        {item.label}
                      </span>
                      {item.meta && (
                        <span className="text-muted-foreground col-start-3 truncate text-[11px]">
                          {item.meta}
                        </span>
                      )}
                    </label>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {footnote && (
          <>
            <Separator />
            <p className="text-muted-foreground px-3 py-2 text-[11px] leading-relaxed">
              {footnote}
            </p>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { AiContextPicker }
