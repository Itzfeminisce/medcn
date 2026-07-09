import * as React from "react"
import { InfoIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export interface SectionHeaderProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  /** Leading icon, muted. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Small count/status pill shown next to the title, e.g. a Badge. */
  badge?: React.ReactNode
  /** Info affordance beside the title — an icon button with a Tooltip. */
  info?: React.ReactNode
  /** Right-aligned controls: filters, sort, buttons. */
  actions?: React.ReactNode
  /** Render as a heading level for the a11y tree. Defaults to "h2". */
  as?: "h1" | "h2" | "h3" | "h4"
}

/**
 * Standard title + description + actions row for dashboard panels and page
 * sections. Keeps heading semantics and the action cluster consistent.
 */
function SectionHeader({
  className,
  icon,
  title,
  description,
  badge,
  info,
  actions,
  as: Heading = "h2",
  ...props
}: SectionHeaderProps) {
  return (
    <div
      data-slot="section-header"
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-4 gap-y-2",
        className
      )}
      {...props}
    >
      <div className="flex min-w-0 items-start gap-2.5">
        {icon && (
          <span
            data-slot="section-header-icon"
            aria-hidden
            className="mt-0.5 text-muted-foreground [&_svg]:size-5"
          >
            {icon}
          </span>
        )}
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <Heading
              data-slot="section-header-title"
              className="truncate text-base font-semibold tracking-[-0.01em] text-foreground"
            >
              {title}
            </Heading>
            {badge}
            {info && (
              <Tooltip>
                <TooltipTrigger
                  className="shrink-0 rounded-full text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
                  aria-label="More information"
                >
                  <InfoIcon className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>{info}</TooltipContent>
              </Tooltip>
            )}
          </div>
          {description && (
            <p
              data-slot="section-header-description"
              className="text-sm text-muted-foreground"
            >
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div
          data-slot="section-header-actions"
          className="flex shrink-0 items-center gap-2"
        >
          {actions}
        </div>
      )}
    </div>
  )
}

export { SectionHeader }
