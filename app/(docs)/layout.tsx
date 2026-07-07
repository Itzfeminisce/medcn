import { getNavGroups } from "@/lib/registry"
import { DocsSidebar } from "@/components/docs-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default async function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const groups = await getNavGroups()

  return (
    <SidebarProvider className="min-h-[calc(100svh-3.5rem)]">
      <DocsSidebar groups={groups} />
      <SidebarInset className="min-w-0">
        <div className="border-border/60 bg-background/75 sticky top-14 z-30 flex h-11 items-center gap-2 border-b px-3 backdrop-blur-md md:hidden">
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
