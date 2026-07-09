import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

/**
 * Responsive 12-column dashboard grid. Stacks on mobile, spans resolve at `lg`.
 * Arrange `WidgetPanel`s (or any children) with `DashboardGridItem span=...`.
 */
function DashboardGrid({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dashboard-grid"
      className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-12", className)}
      {...props}
    />
  )
}

/** Column span at the `lg` breakpoint (of 12). Below `lg`, items stack/2-up. */
export type DashboardSpan =
  | "quarter"
  | "third"
  | "half"
  | "twoThirds"
  | "threeQuarters"
  | "full"

const spanClass: Record<DashboardSpan, string> = {
  quarter: "lg:col-span-3",
  third: "lg:col-span-4",
  half: "lg:col-span-6",
  twoThirds: "lg:col-span-8",
  threeQuarters: "lg:col-span-9",
  full: "lg:col-span-12 md:col-span-2",
}

export interface DashboardGridItemProps extends React.ComponentProps<"div"> {
  /** Width at `lg`. Defaults to "half". */
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
