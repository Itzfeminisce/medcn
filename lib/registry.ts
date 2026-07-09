import { promises as fs } from "node:fs"
import path from "node:path"

const REGISTRY_SRC = path.join(process.cwd(), "registry", "medcn")

export interface RegistryProp {
  name: string
  type: string
  default?: string
  description?: string
}

export interface RegistryItemMeta {
  name: string
  title: string
  description: string
  category: string
  type: string
  version: string
  dependencies?: string[]
  registryDependencies?: string[]
  props?: RegistryProp[]
  clinicalNotes?: string
  notes?: string
  /** External references: the Radix primitive a component wraps, or the shadcn counterpart. */
  links?: { radix?: string; shadcn?: string }
}

export async function getRegistryItems(): Promise<RegistryItemMeta[]> {
  const entries = await fs.readdir(REGISTRY_SRC, { withFileTypes: true })
  const items: RegistryItemMeta[] = []
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === "lib") continue
    const meta = await getRegistryItem(entry.name)
    if(meta) items.push(meta)
  }
  return items.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getRegistryItem(
  name: string
): Promise<RegistryItemMeta | null> {
  try {
    return JSON.parse(
      await fs.readFile(path.join(REGISTRY_SRC, name, "meta.json"), "utf8")
    ) as RegistryItemMeta
  } catch {
    return null
  }
}

export async function getItemSource(name: string): Promise<string> {
  return fs.readFile(path.join(REGISTRY_SRC, name, `${name}.tsx`), "utf8")
}

export async function getItemDemoSource(name: string): Promise<string> {
  return fs.readFile(path.join(REGISTRY_SRC, name, `${name}.demo.tsx`), "utf8")
}

export interface NavGroup {
  label: string
  items: { title: string; href: string }[]
}

/**
 * Site navigation: the Getting Started pages followed by one group per
 * registry category, in CATEGORIES order. Feeds the docs sidebar and the
 * ⌘K command menu.
 */
export async function getNavGroups(): Promise<NavGroup[]> {
  const items = await getRegistryItems()
  const byCategory = new Map<string, RegistryItemMeta[]>()
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

  return [
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
}

/** Category display order + labels for the sidebar/index. */
export const CATEGORIES: Record<string, string> = {
  primitives: "Primitives",
  layout: "Layout",
  forms: "Forms",
  data: "Data",
  vitals: "Vitals",
  medication: "Medication",
  scheduling: "Scheduling",
  records: "Records",
  triage: "Triage",
  dashboard: "Dashboard",
  blocks: "Blocks",
}
