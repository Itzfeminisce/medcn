"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavGroup } from "@/lib/registry"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

/**
 * Docs navigation on the shadcn Sidebar: fixed rail below the site header on
 * desktop, an offcanvas sheet on mobile. Groups come from lib/registry
 * `getNavGroups()`.
 */
export function DocsSidebar({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className="top-14 h-[calc(100svh-3.5rem)]">
      <SidebarContent className="no-scrollbar gap-1 py-4">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-primary/80 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      className="text-muted-foreground hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium"
                    >
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
