"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import type { NavGroup } from "@/lib/registry"
import { NewBadge } from "@/components/new-badge"
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
  const activeRef = React.useRef<HTMLAnchorElement>(null)

  /**
   * Land on a component page with its nav entry already in view — the catalog is
   * long enough that the active item is otherwise below the fold. Scrolls the
   * rail only, and only when the item is actually out of view, so clicking a
   * visible link doesn't jump the list under the cursor.
   */
  React.useLayoutEffect(() => {
    const link = activeRef.current
    const rail = link?.closest<HTMLElement>('[data-sidebar="content"]')
    if (!link || !rail) return

    const linkBox = link.getBoundingClientRect()
    const railBox = rail.getBoundingClientRect()
    if (linkBox.top >= railBox.top && linkBox.bottom <= railBox.bottom) return

    rail.scrollTop +=
      linkBox.top -
      railBox.top -
      (railBox.height - linkBox.height) / 2
  }, [pathname])

  return (
    /**
     * The shell sets `inset-y-0 h-svh` on this same element, so `top`/`height`
     * are forced here rather than left to stylesheet order — the rail must
     * start below the site header and end at the viewport, never behind it.
     */
    <Sidebar className="top-14! h-[calc(100svh-3.5rem)]!">
      <SidebarContent className="no-scrollbar gap-1 py-4">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-primary/80 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className="text-muted-foreground hover:text-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium"
                      >
                        <Link
                          ref={isActive ? activeRef : undefined}
                          href={item.href}
                          onClick={() => setOpenMobile(false)}
                        >
                          <span className="truncate">{item.title}</span>
                          {item.isNew && <NewBadge className="ml-auto" />}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
