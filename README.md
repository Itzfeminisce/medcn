# medcn

**UI components for health & medical products.** Vitals, medication, scheduling, triage, records — built on shadcn/ui conventions and distributed as source through the shadcn registry. Install with the CLI you already use; the code lands in your project and it's yours.

medcn complements [shadcn/ui](https://ui.shadcn.com), it doesn't replace it. It also **strictly uses** the shadcn approach itself: Tailwind CSS, Radix primitives, cva variants, `cn()` — and the doc site is built from medcn's own registry components (we dogfood everything we ship).

## Quick start

```bash
npx shadcn@latest add https://medcn.dev/r/vitals-card.json
```

Or register the namespace once in `components.json`:

```json
{ "registries": { "@medcn": "https://medcn.dev/r/{name}.json" } }
```

```bash
npx shadcn@latest add @medcn/vitals-card
```

Dependency chains resolve automatically (`vitals-card` → `card`, `badge`).

## Using with coding agents

medcn is agent-first:

- **`https://medcn.dev/llms.txt`** — machine-readable component catalog.
- **Registry items** (`/r/<name>.json`) carry full source plus `meta.props`, `meta.clinicalNotes`, and a docs URL — one fetch tells an agent everything.
- Works with the **shadcn MCP server** once the `@medcn` namespace is registered.
- See `/docs/agents` on the site, and [AGENTS.md](./AGENTS.md) if you're pointing an agent at this repo itself.

## What's inside

| Path | Purpose |
|---|---|
| `registry/medcn/<name>/` | Component source of truth: `<name>.tsx` + demo + `meta.json` (props, clinical notes, deps) |
| `scripts/build-registry.ts` | Generates `public/r/*.json` (shadcn registry schema) + `public/llms.txt` |
| `app/` | Doc site — Next.js, dark-default clinical theme, shiki-highlighted code, sidebar docs |
| `PRD.md` / `docs/DESIGN.md` / `AGENTS.md` | Product spec · design spec · contributor/agent guide |

Every health component documents its clinical reasoning (units, reference ranges, why `trend` and `trendDirection` are separate props) — on its page and in its registry metadata.

## Development

```bash
pnpm install
pnpm registry:build   # generate /r/*.json + llms.txt
pnpm dev              # doc site on :3000
pnpm build            # full gate: registry + typecheck + static build
```

Adding components: see [AGENTS.md](./AGENTS.md) — the conventions apply to humans too.

## License

MIT
