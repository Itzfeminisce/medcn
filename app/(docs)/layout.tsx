import { getNavGroups } from "@/lib/registry"
import { DocsSidebar } from "@/components/docs-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const groups = await getNavGroups()

  return (
    /**
     * The docs own the viewport below the site header: the nav rail holds still
     * and the content column is its own scroll container, so a long component
     * page no longer drags a 150-item nav off screen with it.
     *
     * `data-docs-shell` lets globals.css drop the site footer on these routes —
     * once the panes scroll independently, a page-level footer would need a
     * second, page-level scrollbar to reach, which is the thing we are removing.
     */
    <SidebarProvider
      data-docs-shell
      className="no-scrollbar h-[calc(100svh-3.5rem)] min-h-0 flex-1 overflow-hidden"
    >
      <DocsSidebar groups={groups} />
      <SidebarInset className="no-scrollbar h-full min-w-0 overflow-y-auto">
        <div className="border-border/60 bg-background/75 sticky top-0 z-30 flex h-11 items-center gap-2 border-b px-3 backdrop-blur-md md:hidden">
          <SidebarTrigger className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">Browse</span>
        </div>
        <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 md:py-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
