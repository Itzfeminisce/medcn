import type { MetadataRoute } from "next"

import { getRegistryItems } from "@/lib/registry"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcn.dev"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await getRegistryItems()
  const now = new Date()

  const staticRoutes = [
    "",
    "/components",
    "/docs",
    "/docs/installation",
    "/docs/theming",
    "/docs/agents",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  const componentRoutes = items.map((item) => ({
    url: `${SITE_URL}/components/${item.name}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...componentRoutes]
}
