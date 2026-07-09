import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

/**
 * Responsive dashboard grid driven by **container queries** — panels lay out by
 * the grid's own width, not the viewport, so a block looks right embedded in a
 * narrow column, a split pane, or the docs preview. Arrange children with
 * `DashboardGridItem span=...`.
 */
function DashboardGrid({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dashboard-grid"
      className={cn("@container/dgrid", className)}
      {...props}
    >
      <div className="grid grid-cols-1 gap-4 @xl/dgrid:grid-cols-2 @4xl/dgrid:grid-cols-12">
        {children}
      </div>
    </div>
  )
}

/** Column span once the grid container is wide (`@4xl`, of 12). Below, stacks/2-up. */
export type DashboardSpan =
  | "quarter"
  | "third"
  | "half"
  | "twoThirds"
  | "threeQuarters"
  | "full"

const spanClass: Record<DashboardSpan, string> = {
  quarter: "@4xl/dgrid:col-span-3",
  third: "@4xl/dgrid:col-span-4",
  half: "@4xl/dgrid:col-span-6",
  twoThirds: "@4xl/dgrid:col-span-8",
  threeQuarters: "@4xl/dgrid:col-span-9",
  full: "@xl/dgrid:col-span-2 @4xl/dgrid:col-span-12",
}

export interface DashboardGridItemProps extends React.ComponentProps<"div"> {
  /** Width once the grid container is wide. Defaults to "half". */
  span?: DashboardSpan
}

function DashboardGridItem({
  className,
  span = "half",
  ...props
}: DashboardGridItemProps) {
  return (
    <div
      data-slot="dashboard-grid-item"
      data-span={span}
      className={cn("min-w-0", spanClass[span], className)}
      {...props}
    />
  )
}

export { DashboardGrid, DashboardGridItem }
