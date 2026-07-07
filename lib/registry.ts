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

/** Category display order + labels for the sidebar/index. */
export const CATEGORIES: Record<string, string> = {
  primitives: "Primitives",
  forms: "Forms",
  data: "Data",
  vitals: "Vitals",
  medication: "Medication",
  scheduling: "Scheduling",
  records: "Records",
  triage: "Triage",
}
