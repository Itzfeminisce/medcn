import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const alertVariants = cva(
  "relative grid w-full items-start gap-y-1 rounded-xl border px-4 py-3 text-sm has-[>svg]:grid-cols-[1rem_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-border shadow-soft",
        info: "bg-info/8 text-foreground border-info/30 [&>svg]:text-info",
        success:
          "bg-success/8 text-foreground border-success/30 [&>svg]:text-success",
        warning:
          "bg-warning/10 text-foreground border-warning/30 [&>svg]:text-warning-foreground dark:[&>svg]:text-warning",
        destructive:
          "bg-destructive/8 text-foreground border-destructive/30 [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * Status/notice banner. Pass `role="alert"` for conditions that must interrupt
 * a screen-reader user; the default `role="status"` announces politely.
 */
function Alert({
  className,
  variant,
  role = "status",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      data-variant={variant}
      role={role}
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-[13px] leading-relaxed [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

/** Action row (buttons/links) aligned under the title column. */
function AlertActions({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-actions"
      className={cn("col-start-2 mt-2 flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, AlertActions, alertVariants }
