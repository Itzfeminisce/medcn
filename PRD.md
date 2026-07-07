# medcn — Product Requirements Document

**Status:** v1 draft · 2026-07-06
**Working name:** medcn (`medcn.dev` tentative, subject to domain availability)
**Repo:** standalone, independent project. Seeded by copying curated components from `petals_ui`, then diverging.

---

## 1. Vision

**medcn is shadcn for health & medical software.** A catalog of highly creative, production-grade UI components and icons focused exclusively on the med/health domain — vitals, medication, scheduling, triage, records — distributed the shadcn way: browse a live doc site, copy the code, or install via the shadcn CLI. You own the code.

medcn **complements shadcn, it does not replace it.** A developer keeps `npx shadcn add button` from the official registry and adds `npx shadcn add @medcn/vitals-card` from ours — same project, same aliases, same conventions.

Long-term, medcn also becomes an **archive/catalog of health icons**: professional-role icons (doctor, nurse, surgeon, pharmacist…), instruments, capsules/medication forms, and general medical iconography — curated, consistent, searchable.

## 2. Problem

Health-product teams rebuild the same domain UI from generic kits every time: vital-sign cards, dose checklists, severity scales, triage indicators, cycle pickers. shadcn gives them excellent primitives but nothing domain-aware; component libraries with health widgets are closed, dated, or npm-locked. There is no "copy-paste, you-own-it" catalog for health UI.

## 3. Goals / Non-goals

**Goals (v1)**
1. A doc site with the ease and energy of ui.shadcn.com: live preview → Code tab → copy button → CLI install, per component.
2. A shadcn-compatible registry: `npx shadcn add @medcn/<name>` works end-to-end, resolving dependency chains (`vitals-card` → `card`, `badge`).
3. A **small, curated set of high-quality components** ported from petals_ui — validated and improved until the standard is met — before any expansion.
4. Knowledge-base docs: not just API tables, but clinical/domain notes per component (units, reference ranges, a11y for clinical contexts).

**Non-goals (v1)**
- **No npm package.** Registry + copy button only. (Icons will be npm-first later; components may add npm in v2.)
- No custom CLI — shadcn's CLI is the installer.
- No icon archive yet (phase 2).
- Not a general-purpose kit — anything shadcn already does well and isn't health-flavored is out unless a health component depends on it.
- No auth, no accounts, no paid tier decisions in v1.

## 4. Users

1. **Health-product frontend dev** (primary): React + Tailwind (+ often shadcn already). Wants domain components fast, wants to own the code.
2. **Petals internal teams**: eventual upstream for the six Petals apps (medcn is intended upstream long-term; petals_ui trends to maintenance-only).
3. **Designer/founder browsing**: evaluates the catalog visually; copy-paste from the site without any tooling.

## 5. Product surfaces

```
medcn.dev
├─ /                      Landing: hero, live block demo, one install command
├─ /docs                  Knowledge base: intro, installation, theming, clinical color system
├─ /components            Index grid, grouped by category
├─ /components/[name]     Component page (core surface, see below)
├─ /blocks                (post-v1) full health screens, installable as one item
├─ /icons                 (phase 2) gallery: search, category chips, copy SVG/JSX, download
└─ /r/[name].json         The registry itself — static JSON, generated
```

**Component page anatomy** (top to bottom):
1. Title, category badge, description, source link
2. **Preview/Code tabs** — the live component rendered from its real demo file; Code shows the demo source with a copy button
3. **Installation** — CLI tab (`npx shadcn add …`) / Manual tab (copy the file, listed deps)
4. Usage snippet + more examples
5. API/props table (from `meta.json`, hand-written; docgen automation later)
6. **Clinical notes** — units, reference ranges, severity semantics, a11y guidance. This section is the medcn differentiator; every health component must have it.

**Site chrome:** category-grouped sidebar (Primitives / Forms / Data / **Vitals / Medication / Scheduling / Records / Triage**), dark mode, ⌘K search across components (and icons in phase 2).

## 6. Architecture

### 6.1 Authoring model — registry-native, one folder per item

Components are authored directly in shadcn-registry layout with `@/` aliases (**inverse of petals_ui**, where npm-relative imports were primary). The registry is the zero-transform flagship channel.

```
registry/medcn/
├─ lib/utils.ts                     # cn() — mirrors shadcn's utils
└─ <name>/
   ├─ <name>.tsx                    # the component (source of truth)
   ├─ <name>.demo.tsx               # demo — rendered live in docs AND shown as copyable code
   └─ meta.json                     # name, title, description, category, version,
                                    # dependencies, registryDependencies, props, clinicalNotes
```

Everything downstream — registry JSON, doc pages, sidebar nav, search index — is **generated from these folders**. Adding a component = adding a folder. No manual barrel exports, no separate playground wiring, no status board to update by hand.

**Import convention inside registry source:**
- `@/registry/medcn/lib/utils` → rewritten on emit to `@/lib/utils`
- `@/registry/medcn/<name>/<name>` → rewritten to `@/components/ui/<name>`

The doc site resolves the un-rewritten paths natively (tsconfig `@/* → ./*`), so the site always renders the true source.

### 6.2 Registry output (generated by `scripts/build-registry.ts`)

- `public/r/registry.json` — index manifest (`$schema: https://ui.shadcn.com/schema/registry.json`)
- `public/r/<name>.json` — one per item (`registry-item.json` schema): full source inlined in `files[].content`, npm `dependencies`, `registryDependencies` as absolute URLs (base URL configurable via `REGISTRY_URL`, default `https://medcn.dev/r`), optional `cssVars` for clinical tokens.

Static JSON — hosting is a folder; no server. Users can register the namespace once in `components.json`:

```json
{ "registries": { "@medcn": "https://medcn.dev/r/{name}.json" } }
```

then `npx shadcn add @medcn/vitals-card`.

### 6.3 Theme

medcn ships its **own neutral clinical theme** (globals.css tokens; later also a `registry:theme` item). It does **not** import Petals branding — no brand-pink/brand-teal; ported components drop those variants. Token surface: shadcn-standard tokens + `success/warning/info` status colors + `shadow-soft`/`shadow-lift` + clinical severity scales (future: `vital-normal/elevated/critical`, triage levels — with contrast/colorblind review).

### 6.4 Doc site stack

Next.js (App Router) + Tailwind v4. v0 scaffold uses plain generated pages; **Fumadocs integration is the planned docs engine** for /docs prose + MDX component pages (roadmap M2). Component pages are generated from registry folders either way.

## 7. Quality bar (the "standard to be met")

A component ships only when:
- Ported code is **reviewed, not copied blind**: Petals-brand variants removed, naming generic, props documented in `meta.json`
- Has a demo that is honest documentation (users copy it)
- Has clinical notes (health components) or a rationale note (primitives)
- Installs cleanly via `npx shadcn add` into a fresh Next + shadcn scratch app — including its whole `registryDependencies` chain
- Renders correctly in light + dark
- `version` set in `meta.json`; changes bump it and land in the changelog

## 8. Upgrade story

Copy-paste = users own snapshots. v1 mitigation: per-item `version` in `meta.json` surfaced in registry JSON + a `/changelog` page grouped by component, so users can deliberately re-run `add`. Diff tooling is future work (an area to *surpass* shadcn, whose `diff` is weak).

## 9. Relationship to petals_ui

- petals_ui is the **seed**, not a dependency. Components are copied over one-by-one through the quality bar (curation pass, not `cp -r`).
- Direction of flow: **medcn is upstream long-term**; petals_ui trends to maintenance-only. Fix bugs in medcn first once a component has migrated.
- ~90 components exist in petals_ui; expect ~60 to be worth porting; health-first ordering.

## 10. Icons (phase 2 — recorded now so the architecture reserves space)

- **Different pipeline from components**: SVG source of truth → SVGO normalize → SVGR React components (`@medcn/icons`, npm-first, tree-shakeable) → `manifest.json` (name/category/tags/aliases) powering the gallery + search.
- **Icon contract locked before ingesting art**: 24px grid, `currentColor`, fixed stroke width, naming convention, category taxonomy (roles / instruments / capsules / general).
- Start with a **50-icon curated pilot in one category** to prove the visual language. Differentiation is curation + consistency + role taxonomy (healthicons.org already exists; a dump won't differentiate).
- Distribution: npm, gallery copy/download, optional Iconify collection, optional registry bundles.
- Biggest risk is **artwork production** (draw / commission / redraw open-licensed) — decide before industrializing.

## 11. Roadmap

| Milestone | Scope | Exit criteria |
|---|---|---|
| **M0 — Scaffold** (this) | Repo, PRD, registry-native structure, build script, proving-slice components, minimal doc pages | `registry:build` emits valid JSON; site renders previews locally |
| **M1 — Proving slice e2e** | `button`, `badge`, `card`, `checkbox`, `progress`, `vitals-card`, `dose-checklist` | `npx shadcn add @medcn/vitals-card` + `@medcn/dose-checklist` install cleanly into a scratch app with full dep chains |
| **M2 — Docs engine** | Fumadocs, ⌘K search, dark mode, install tabs, clinical-notes sections, landing page | Site is presentable; every ported component fully documented |
| **M3 — Curated port** | ~15–25 best petals_ui components through the quality bar, health-first | Each passes §7 |
| **M4 — Blocks + launch** | 3 health blocks (patient summary, medication schedule, triage intake); domain/org/scope locked; deploy | Public launch |
| **M5 — Icons pilot** | Icon contract + 50-icon pilot + gallery | Pilot category shippable |

## 12. Risks & open questions

- **Name/domain**: `medcn.dev` unverified; also GitHub org + (later) `@medcn` npm scope. Reserve before public references. Fallbacks worth checking early.
- **Design authority**: medcn needs its own visual identity beyond "petals minus pink" — schedule a theme pass before launch.
- **Icon artwork production** (see §10) — the pipeline is easy; the art is the project.
- **Props-table automation**: react-docgen-typescript struggles with cva + `ComponentProps<typeof X>`; hand-written props in `meta.json` is the v1 answer.
- **Overlap policy**: for primitives shadcn also has (button, card…), medcn ships its own styled versions for coherence — is that the permanent stance, or do health components eventually target upstream shadcn primitives? Revisit at M3.

## 13. Success metrics (directional, v1)

- Time-to-first-component for a new dev: < 2 minutes from landing page (one CLI command or one copy button).
- Proving slice installs with zero manual fixes in a fresh shadcn app.
- Every published component meets the §7 bar — no "draft" items in the public registry.
