import { SITE_NAME, addByNamespaceCommand } from "@/lib/env"
import { CATEGORIES, getRegistryItem, getRegistryItems } from "@/lib/registry"
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og"

export const alt = `${SITE_NAME} component`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export async function generateStaticParams() {
  const items = await getRegistryItems()
  return items.map((item) => ({ name: item.name }))
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = await getRegistryItem(name)

  return renderOg({
    kicker: item ? (CATEGORIES[item.category] ?? item.category) : "component",
    title: item?.title ?? name,
    subtitle:
      item?.description ??
      `A health & medical UI component from the ${SITE_NAME} registry.`,
    footer: addByNamespaceCommand(name),
  })
}
