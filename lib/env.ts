/**
 * env.ts — single source of truth for environment variables.
 *
 * Add every `process.env.*` read here so configuration lives in one place.
 * `NEXT_PUBLIC_*` values are inlined into the client bundle at build time.
 */

/** Public site origin. Used for metadata base, sitemap, and robots. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://medcn.dev"

/**
 * Registry base URL for `registryDependencies` in generated registry JSON.
 * Read by the `registry:build` script only.
 */
export const REGISTRY_URL = process.env.REGISTRY_URL ?? "https://medcn.dev/r"
