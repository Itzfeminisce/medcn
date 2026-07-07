import { CATEGORIES, getRegistryItems } from "@/lib/registry"
import { SidebarNav, type SidebarGroup } from "@/components/sidebar-nav"

export default async function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const items = await getRegistryItems()

  const byCategory = new Map<string, typeof items>()
  for (const item of items) {
    const list = byCategory.get(item.category) ?? []
    list.push(item)
    byCategory.set(item.category, list)
  }
  const order = Object.keys(CATEGORIES)
  const rank = (c: string) => {
    const i = order.indexOf(c)
    return i === -1 ? order.length : i
  }

  const groups: SidebarGroup[] = [
    {
      label: "Getting Started",
      items: [
        { title: "Introduction", href: "/docs" },
        { title: "Installation", href: "/docs/installation" },
        { title: "Theming", href: "/docs/theming" },
        { title: "For Agents", href: "/docs/agents" },
      ],
    },
    ...[...byCategory.entries()]
      .sort(([a], [b]) => rank(a) - rank(b))
      .map(([category, list]) => ({
        label: CATEGORIES[category] ?? category,
        items: list.map((item) => ({
          title: item.title,
          href: `/components/${item.name}`,
        })),
      })),
  ]

  return (
    <div className="flex gap-10">
      <aside className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] w-56 shrink-0 self-start overflow-y-auto lg:block">
        <SidebarNav groups={groups} />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
