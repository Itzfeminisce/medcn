import * as React from "react"
import { InfoIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/medcn/card/card"
import { EmptyState } from "@/registry/medcn/empty-state/empty-state"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type WidgetPanelState = "ready" | "loading" | "empty" | "error"
export type WidgetPanelTone =
  | "primary"
  | "success"
  | "warning"
  | "destructive"
  | "info"
  | "muted"

const toneChip: Record<WidgetPanelTone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
  muted: "bg-muted text-muted-foreground",
}

const toneAccent: Record<WidgetPanelTone, string> = {
  primary: "before:bg-primary",
  success: "before:bg-success",
  warning: "before:bg-warning",
  destructive: "before:bg-destructive",
  info: "before:bg-info",
  muted: "before:bg-border",
}

export interface WidgetPanelProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Leading icon; rendered in a tinted chip keyed to `tone`. */
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  /** Accent color for the icon chip and (optional) top rule. Defaults to "primary". */
  tone?: WidgetPanelTone
  /** Draw a thin colored accent rule along the top edge. */
  accent?: boolean
  /** Info affordance beside the title — an icon button with a Tooltip. */
  info?: React.ReactNode
  /** Right-aligned header controls (buttons, menus, "View all"). */
  action?: React.ReactNode
  /** Footer content, e.g. a link to the full record. */
  footer?: React.ReactNode
  /** Drives which body is shown. Defaults to "ready". */
  state?: WidgetPanelState
  /** Skeleton row count while `state="loading"`. */
  loadingRows?: number
  /** Body for `state="empty"`. A string renders a default EmptyState. */
  empty?: React.ReactNode
  /** Body for `state="error"`. A string renders a default error message. */
  error?: React.ReactNode
  /** Remove the default content padding (for edge-to-edge tables/lists). */
  flush?: boolean
  contentClassName?: string
}

function LoadingRows({ rows }: { rows: number }) {
  return (
    <div data-slot="widget-panel-loading" className="space-y-3" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div
              className="h-3 animate-pulse rounded bg-muted"
              style={{ width: `${55 - i * 8}%` }}
            />
            <div
              className="h-3 animate-pulse rounded bg-muted"
              style={{ width: `${80 - i * 6}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * The titled container every dashboard panel sits in: a tinted-icon header
 * (title, description, info tooltip, actions), a body that swaps between
 * ready / loading / empty / error, and an optional footer. Composes Card +
 * EmptyState + Tooltip. Presentational — the caller decides `state`.
 */
function WidgetPanel({
  className,
  contentClassName,
  icon,
  title,
  description,
  tone = "primary",
  accent = false,
  info,
  action,
  footer,
  state = "ready",
  loadingRows = 3,
  empty,
  error,
  flush = false,
  children,
  ...props
}: WidgetPanelProps) {
  const hasHeader = icon || title || description || action || info

  let body: React.ReactNode = children
  if (state === "loading") {
    body = <LoadingRows rows={loadingRows} />
  } else if (state === "error") {
    body =
      typeof error === "string" || error == null ? (
        <EmptyState
          role="alert"
          size="sm"
          title="Couldn’t load this data"
          description={
            (error as string) ?? "Something went wrong. Try again shortly."
          }
        />
      ) : (
        error
      )
  } else if (state === "empty") {
    body =
      typeof empty === "string" || empty == null ? (
        <EmptyState size="sm" title={(empty as string) ?? "No data yet"} />
      ) : (
        empty
      )
  }

  return (
    <Card
      data-slot="widget-panel"
      data-state={state}
      className={cn(
        "group/panel gap-0 overflow-hidden py-0 transition-[box-shadow,border-color] duration-200 hover:border-border hover:shadow-lift",
        accent &&
          cn(
            "relative before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:content-['']",
            toneAccent[tone]
          ),
        className
      )}
      {...props}
    >
      {hasHeader && (
        <CardHeader className="flex-wrap gap-y-2 border-b py-4">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <span
                aria-hidden
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover/panel:scale-105 [&_svg]:size-4",
                  toneChip[tone]
                )}
              >
                {icon}
              </span>
            )}
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                {title && (
                  <CardTitle className="truncate text-sm font-semibold">
                    {title}
                  </CardTitle>
                )}
                {info && (
                  <Tooltip>
                    <TooltipTrigger
                      className="text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 rounded-full"
                      aria-label="More information"
                    >
                      <InfoIcon className="size-3.5" />
                    </TooltipTrigger>
                    <TooltipContent>{info}</TooltipContent>
                  </Tooltip>
                )}
              </div>
              {description && (
                <CardDescription className="text-xs">
                  {description}
                </CardDescription>
              )}
            </div>
          </div>
          {action && <CardAction className="row-start-1">{action}</CardAction>}
        </CardHeader>
      )}
      <CardContent
        aria-busy={state === "loading" || undefined}
        className={cn(!flush && "py-4", flush && "px-0", contentClassName)}
      >
        {body}
      </CardContent>
      {footer && (
        <CardFooter className="border-t py-3 text-sm text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  )
}

export { WidgetPanel }
