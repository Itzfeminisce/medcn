"use client"

import * as React from "react"
import { PanelLeft, X } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"

export interface DashboardShellProps extends React.ComponentProps<"div"> {
  /** Left navigation column. Static when the shell is wide; a toggled drawer when narrow. */
  sidebar?: React.ReactNode
  /** Sticky top bar (patient banner, search, user menu). */
  header?: React.ReactNode
  /** Width of the sidebar column / drawer. Defaults to "16rem". */
  sidebarWidth?: string
  /** Allow the narrow-width drawer + header toggle. Defaults to true. */
  collapsible?: boolean
  /** Constrain and center the content column. Defaults to true. */
  contained?: boolean
  contentClassName?: string
}

/**
 * App frame for clinical dashboards, sized by **container queries** so it adapts
 * to the width it's embedded in, not the viewport. Wide: a static sidebar +
 * sticky header + scrolling content. Narrow: the sidebar collapses to a toggled
 * drawer with a hamburger in the header. Presentational — bring your own nav.
 */
function DashboardShell({
  className,
  sidebar,
  header,
  sidebarWidth = "16rem",
  collapsible = true,
  contained = true,
  contentClassName,
  children,
  ...props
}: DashboardShellProps) {
  const [open, setOpen] = React.useState(false)
  const showToggle = !!sidebar && collapsible

  return (
    <div
      data-slot="dashboard-shell"
      className={cn(
        "@container/shell relative flex min-h-svh w-full bg-muted/30",
        className
      )}
      style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}
      {...props}
    >
      {/* Static sidebar — only when the container is wide. */}
      {sidebar && (
        <aside
          data-slot="dashboard-shell-sidebar"
          className="sticky top-0 hidden h-svh w-[var(--sidebar-width)] shrink-0 overflow-y-auto border-r border-border/60 bg-card @4xl/shell:block"
        >
          {sidebar}
        </aside>
      )}

      {/* Drawer + backdrop — only when narrow and toggled open. */}
      {sidebar && collapsible && open && (
        <div className="absolute inset-0 z-40 @4xl/shell:hidden" role="dialog" aria-modal="true">
          <button
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[1px] animate-in fade-in-0"
          />
          <aside
            data-slot="dashboard-shell-drawer"
            className="absolute inset-y-0 left-0 flex w-[var(--sidebar-width)] flex-col overflow-y-auto border-r border-border/60 bg-card shadow-lift animate-in slide-in-from-left-2 duration-200"
          >
            <div className="flex justify-end p-2">
              <button
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {(header || showToggle) && (
          <header
            data-slot="dashboard-shell-header"
            className="sticky top-0 z-20 flex items-center gap-1 border-b border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/70"
          >
            {showToggle && (
              <button
                aria-label="Open navigation"
                onClick={() => setOpen(true)}
                className="ml-2 shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 @4xl/shell:hidden"
              >
                <PanelLeft className="size-4" />
              </button>
            )}
            <div className="min-w-0 flex-1">{header}</div>
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
