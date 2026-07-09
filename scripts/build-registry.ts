/**
 * build-registry.ts — generates the shadcn-compatible registry from
 * `registry/medcn/<name>/` folders.
 *
 * Outputs:
 *   public/r/registry.json   — index manifest (registry.json schema)
 *   public/r/<name>.json     — one per item (registry-item.json schema),
 *                              with source inlined and imports rewritten
 *                              from authoring paths to consumer paths:
 *
 *   @/registry/medcn/lib/utils        -> @/lib/utils
 *   @/registry/medcn/<name>/<file>    -> @/components/ui/<file>
 *
 * Base URL for registryDependencies is REGISTRY_URL (default
 * https://medcn.dev/r). shadcn's own item names (e.g. "utils") pass
 * through untouched so they resolve against the official registry.
 */
import { promises as fs } from "node:fs"
import path from "node:path"

import { REGISTRY_NAMESPACE, REGISTRY_URL, SITE_NAME } from "../lib/env"

const ROOT = path.resolve(import.meta.dirname, "..")
const REGISTRY_SRC = path.join(ROOT, "registry", SITE_NAME)
const OUT_DIR = path.join(ROOT, "public", "r")
const BASE_URL = REGISTRY_URL
const SITE_URL = BASE_URL.replace(/\/r$/, "")

interface Meta {
  name: string
  title: string
  description: string
  category: string
  type: string
  version: string
  dependencies?: string[]
  registryDependencies?: string[]
  props?: unknown[]
  clinicalNotes?: string
  notes?: string
  links?: { radix?: string; shadcn?: string }
}

/** shadcn built-in item names that should NOT be resolved to our base URL. */
const SHADCN_BUILTINS = new Set(["utils"])

function rewriteImports(source: string): string {
  return source
    .replaceAll(`"@/registry/${SITE_NAME}/lib/utils"`, `["@/lib/utils"]`)
    .replace(
      new RegExp(`"@\/registry\/${SITE_NAME}\/[a-z0-9-]+\/([a-z0-9-]+)"`, "g"),
      `["@/components/ui/$1"]`
    )
}

async function main() {
  const entries = await fs.readdir(REGISTRY_SRC, { withFileTypes: true })
  const itemDirs = entries
    .filter((e) => e.isDirectory() && e.name !== "lib")
    .map((e) => e.name)
    .sort()

  await fs.rm(OUT_DIR, { recursive: true, force: true })
  await fs.mkdir(OUT_DIR, { recursive: true })

  const indexItems: object[] = []

  for (const dir of itemDirs) {
    const itemDir = path.join(REGISTRY_SRC, dir)
    const meta: Meta = JSON.parse(
      await fs.readFile(path.join(itemDir, "meta.json"), "utf8")
    )
    if (meta.name !== dir) {
      throw new Error(`meta.json name "${meta.name}" != folder "${dir}"`)
    }

    const componentSource = await fs.readFile(
      path.join(itemDir, `${meta.name}.tsx`),
      "utf8"
    )

    const registryDependencies = (meta.registryDependencies ?? []).map((dep) =>
      SHADCN_BUILTINS.has(dep) ? dep : `${BASE_URL}/${dep}.json`
    )

    const item = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: meta.name,
      type: meta.type,
      title: meta.title,
      description: meta.description,
      dependencies: meta.dependencies ?? [],
      registryDependencies,
      files: [
        {
          path: `registry/${SITE_NAME}/${meta.name}/${meta.name}.tsx`,
          type: meta.type,
          target: `components/ui/${meta.name}.tsx`,
          content: rewriteImports(componentSource),
        },
      ],
      // Extra metadata so agents/tooling get the full picture from one fetch
      meta: {
        category: meta.category,
        version: meta.version,
        docs: `${SITE_URL}/components/${meta.name}`,
        ...(meta.props ? { props: meta.props } : {}),
        ...(meta.clinicalNotes ? { clinicalNotes: meta.clinicalNotes } : {}),
        ...(meta.links ? { links: meta.links } : {}),
      },
    }

    await fs.writeFile(
      path.join(OUT_DIR, `${meta.name}.json`),
      JSON.stringify(item, null, 2) + "\n"
    )

    indexItems.push({
      name: meta.name,
      type: meta.type,
      title: meta.title,
      description: meta.description,
    })

    console.log(`  ✓ r/${meta.name}.json`)
  }

  const index = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "medcn",
    homepage: SITE_URL,
    items: indexItems,
  }
  await fs.writeFile(
    path.join(OUT_DIR, "registry.json"),
    JSON.stringify(index, null, 2) + "\n"
  )
  console.log(`  ✓ r/registry.json (${indexItems.length} items)`)

  await writeLlmsTxt(indexItems as { name: string; description: string }[])
}

/** llms.txt — machine-readable catalog for coding agents. */
async function writeLlmsTxt(items: { name: string; description: string }[]) {
  const lines = [
    `# ${SITE_NAME}`,
    "",
    "> Copy-paste UI components for health & medical products (vitals, medication, scheduling, triage, records). Distributed as source through the shadcn registry — shadcn/ui conventions (Tailwind CSS, Radix, cva); the code lands in your project and you own it.",
    "",
    "Install any component with the shadcn CLI:",
    "",
    `    npx shadcn@latest add ${BASE_URL}/<name>.json`,
    "",
    `Or register the namespace in components.json — "registries": { "${REGISTRY_NAMESPACE}": "${BASE_URL}/{name}.json" } — then \`npx shadcn@latest add ${REGISTRY_NAMESPACE}/<name>\`.`,
    "",
    `Each registry item (${BASE_URL}/<name>.json) contains the full source, npm dependencies, registry dependencies, and under \`meta\`: props, version, docs URL, and clinical notes. Read the clinical notes before wiring data.`,
    "",
    "## Components",
    "",
    ...items.map(
      (item) =>
        `- [${item.name}](${SITE_URL}/components/${item.name}): ${item.description} Registry: ${BASE_URL}/${item.name}.json`
    ),
    "",
    "## Index",
    "",
    `- [Registry index](${BASE_URL}/registry.json)`,
    `- [Docs](${SITE_URL}/docs)`,
    "",
  ]
  await fs.writeFile(
    path.join(ROOT, "public", "llms.txt"),
    lines.join("\n")
  )
  console.log("  ✓ llms.txt")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
