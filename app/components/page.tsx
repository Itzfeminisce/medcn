import Link from "next/link"

import { CATEGORIES, getRegistryItems } from "@/lib/registry"

export const metadata = { title: "Components" }

export default async function ComponentsIndex() {
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

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Components</h1>
        <p className="text-muted-foreground">
          {items.length} components — preview, copy, or install with the
          shadcn CLI.
        </p>
      </div>
      {[...byCategory.entries()]
        .sort(([a], [b]) => rank(a) - rank(b))
        .map(([category, list]) => (
          <section key={category} className="flex flex-col gap-4">
            <h2 className="text-primary/80 font-mono text-xs font-semibold tracking-[0.2em] uppercase">
              {CATEGORIES[category] ?? category}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <Link
                  key={item.name}
                  href={`/components/${item.name}`}
                  className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-glow-sm rounded-xl border p-5 transition-all hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm">
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
    </div>
  )
}
