import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

export interface DashboardShellProps extends React.ComponentProps<"div"> {
  /** Left navigation column. Hidden below `lg`; render your own mobile nav in `header`. */
  sidebar?: React.ReactNode
  /** Sticky top bar (patient banner, search, user menu). */
  header?: React.ReactNode
  /** Width of the sidebar column. Defaults to "16rem". */
  sidebarWidth?: string
  /** Constrain and center the content column. Defaults to true. */
  contained?: boolean
  contentClassName?: string
}

/**
 * App frame for clinical dashboards: an optional fixed sidebar, a sticky
 * header, and a scrolling content region. Presentational — bring your own nav
 * and routing. Compose `DashboardGrid` inside `children`.
 */
function DashboardShell({
  className,
  sidebar,
  header,
  sidebarWidth = "16rem",
  contained = true,
  contentClassName,
  children,
  ...props
}: DashboardShellProps) {
  return (
    <div
      data-slot="dashboard-shell"
      className={cn("flex min-h-svh w-full bg-muted/30", className)}
      style={
        { "--sidebar-width": sidebarWidth } as React.CSSProperties
      }
      {...props}
    >
      {sidebar && (
        <aside
          data-slot="dashboard-shell-sidebar"
          className="sticky top-0 hidden h-svh w-[var(--sidebar-width)] shrink-0 overflow-y-auto border-r border-border/60 bg-card lg:block"
        >
          {sidebar}
        </aside>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        {header && (
          <header
            data-slot="dashboard-shell-header"
            className="sticky top-0 z-20 border-b border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70"
          >
            {header}
          </header>
        )}
        <main
          data-slot="dashboard-shell-content"
          className={cn(
            "flex-1 p-4 md:p-6",
            contained && "mx-auto w-full max-w-7xl",
            contentClassName
          )}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export { DashboardShell }
