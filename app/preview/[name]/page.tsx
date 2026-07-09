import { notFound } from "next/navigation"

import { getRegistryItems } from "@/lib/registry"
import { demos } from "@/components/demos"

export async function generateStaticParams() {
  const items = await getRegistryItems()
  return items.map((item) => ({ name: item.name }))
}

export const dynamic = "error"

/**
 * Full-bleed, chrome-free render of a component demo — loaded inside the
 * BlockPreview iframe so blocks display at a real, isolated viewport width.
 * The site header/footer are hidden via a scoped `:has([data-preview-root])`
 * rule in globals.css.
 */
export default async function PreviewPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const Demo = demos[name]
  if (!Demo) notFound()

  return (
    <div data-preview-root className="flex min-h-svh w-full flex-col p-4 sm:p-6">
      <Demo />
    </div>
  )
}
