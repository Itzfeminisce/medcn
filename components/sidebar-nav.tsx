"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export interface SidebarGroup {
  label: string
  items: { title: string; href: string }[]
}

export function SidebarNav({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label} className="flex flex-col gap-1.5">
          <h4 className="text-primary/80 px-2 font-mono text-[11px] font-semibold tracking-[0.18em] uppercase">
            {group.label}
          </h4>
          <ul className="flex flex-col">
            {group.items.map((item) => {
              const active = pathname === item.href
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-2 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}
