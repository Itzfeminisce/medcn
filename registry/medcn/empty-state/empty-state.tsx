import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center",
  {
    variants: {
      size: {
        sm: "gap-2 px-4 py-6",
        default: "gap-3 px-6 py-10",
        lg: "gap-4 px-8 py-16",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface EmptyStateProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof emptyStateVariants> {
  /** Illustrative icon, rendered in a muted circular frame. */
  icon?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary/secondary actions, e.g. an "Add reading" button. */
  action?: React.ReactNode
}

/**
 * Neutral "no data / no results / not available yet" placeholder for dashboard
 * panels, tables, and empty forms. Presentational only.
 */
function EmptyState({
  className,
  size,
  icon,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(emptyStateVariants({ size }), className)}
      {...props}
    >
      {icon && (
        <div
          data-slot="empty-state-icon"
          aria-hidden
          className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground ring-8 ring-muted/40 [&_svg]:size-5"
        >
          {icon}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <p
          data-slot="empty-state-title"
          className="text-sm font-semibold text-foreground"
        >
          {title}
        </p>
        {description && (
          <p
            data-slot="empty-state-description"
            className="mx-auto max-w-sm text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
      </div>
      {action && (
        <div data-slot="empty-state-action" className="mt-1 flex gap-2">
          {action}
        </div>
      )}
    </div>
  )
}

export { EmptyState, emptyStateVariants }
