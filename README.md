# medcn

**Copy-paste UI components for health & medical products.** shadcn-registry compatible — install with the shadcn CLI, own the code. medcn complements [shadcn/ui](https://ui.shadcn.com); it doesn't replace it.

> Full product spec: [PRD.md](./PRD.md)

## Using a component

```bash
npx shadcn@latest add https://medcn.dev/r/vitals-card.json
```

Or register the namespace once in `components.json` (`"registries": { "@medcn": "https://medcn.dev/r/{name}.json" }`) and:

```bash
npx shadcn@latest add @medcn/vitals-card
```

## Repo layout

```
registry/medcn/<name>/     component source of truth — one folder per item:
                           <name>.tsx + <name>.demo.tsx + meta.json
scripts/build-registry.ts  emits public/r/*.json (shadcn registry-item schema)
app/                       the doc site (Next.js) — pages generated from registry folders
public/r/                  generated registry output (gitignored; `pnpm registry:build`)
```

## Development

```bash
pnpm install
pnpm registry:build   # generate public/r/*.json
pnpm dev              # doc site on :3000
pnpm typecheck
```

### Adding a component

1. Create `registry/medcn/<name>/` with `<name>.tsx`, `<name>.demo.tsx`, `meta.json`.
2. Use authoring imports: `@/registry/medcn/lib/utils`, `@/registry/medcn/<dep>/<dep>` — the build rewrites them to `@/lib/utils` / `@/components/ui/<dep>` for consumers.
3. Register the demo in `components/demos.tsx`.
4. `pnpm registry:build && pnpm typecheck`.
5. Quality bar before publishing: see PRD §7 (demo = honest docs, clinical notes, clean install into a scratch app, light+dark, version bumped).

## Status

Proving slice (M0/M1): `button`, `badge`, `card`, `checkbox`, `progress`, `vitals-card`, `dose-checklist` — seeded from `petals_ui`, Petals branding removed. Next: e2e `shadcn add` verification, then Fumadocs (M2) and the curated port (M3). Roadmap in [PRD.md](./PRD.md#11-roadmap).
