/**
 * env.ts — single source of truth for environment variables and the site
 * identity derived from them (brand name, URLs, install commands).
 *
 * Change the domain or brand here and it propagates everywhere: metadata,
 * landing page, docs, sitemap, robots, and the generated registry.
 * `NEXT_PUBLIC_*` values are inlined into the client bundle at build time.
 */

// ── Environment ──────────────────────────────────────────────────────

/**
 * Public site origin. Used for metadata base, sitemap, robots, and every
 * install command/URL shown in the UI.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcn.dev"

/**
 * Registry base URL baked into generated registry JSON's
 * `registryDependencies`. Read by the `registry:build` script only;
 * defaults to the site's own `/r` path.
 */
export const REGISTRY_URL = process.env.REGISTRY_URL ?? `${SITE_URL}/r`

// ── Site identity (derived) ──────────────────────────────────────────

/** Brand / product name. */
export const SITE_NAME = "medcn"

/** shadcn registry namespace, used as e.g. `@medcn/vitals-card`. */
export const REGISTRY_NAMESPACE = `@${SITE_NAME}`

/** Public base URL where the registry JSON is served (the site's own `/r`). */
export const REGISTRY_BASE_URL = `${SITE_URL}/r`

/** URL of the registry index manifest. */
export const REGISTRY_INDEX_URL = `${REGISTRY_BASE_URL}/registry.json`

/** URL of the machine-readable component catalog. */
export const LLMS_TXT_URL = `${SITE_URL}/llms.txt`

/** URL of a single registry item's JSON, e.g. `…/r/vitals-card.json`. */
export const registryItemUrl = (name: string) =>
  `${REGISTRY_BASE_URL}/${name}.json`

/** shadcn install command using the item's full JSON URL. */
export const addByUrlCommand = (name: string) =>
  `npx shadcn@latest add ${registryItemUrl(name)}`

/** shadcn install command using the registered namespace. */
export const addByNamespaceCommand = (name: string) =>
  `npx shadcn@latest add ${REGISTRY_NAMESPACE}/${name}`

/** `components.json` snippet that registers the namespace. */
export const registriesSnippet = `{
  "registries": {
    "${REGISTRY_NAMESPACE}": "${registryItemUrl("{name}")}"
  }
}`
