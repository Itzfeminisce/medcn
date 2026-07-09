# medcn — Dashboard Layer Milestones

**Status:** planning approved · 2026-07-09
**Owner protocol:** this file is the single source of truth for build progress. Update the
`Status` cell of a row the moment you start (`in-progress`) and finish (`completed`) it.
Do not build ahead of dependencies (see the ordering rule per milestone).

---

## 1. Why this layer exists

medcn's registry today is **72 atoms and molecules** — single badges, single fields,
single cards (`blood-pressure-badge`, `prescription-card`, `lab-result`,
`triage-queue-row`). They are correct and reusable, but a developer cannot drop them in
and get a working screen. Real clinical/EHR dashboards are built from two layers *above*
the atom:

- **Organisms (panels/widgets)** — a *Medication panel*, not one prescription card.
- **Templates (blocks/screens)** — a *Patient Chart* or *Provider Dashboard* arranging
  panels in a shell.

This is the standard clinical summary surface described across the literature — vitals,
meds, **problem list**, allergies, labs, **risk scores**, **care gaps**, and care-team
contacts, consolidated per patient with role-specific views and drill-down
([JMIR 2024 component study](https://www.jmir.org/2024/1/e55267),
[ED clinical dashboard, PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4420000/),
[Healthcare dashboard UX best practices](https://www.aufaitux.com/blog/healthcare-dashboard-ui-ux-design-best-practices/)).
Three of those — **problem list, care gaps, risk scores** — have no atom in medcn yet and
are added in Milestone 1. Everything else composes atoms that already ship.

It is also the `/blocks` surface already named in the PRD, and the natural **freemium**
unit (see §6).

### The composition model
```
atoms (exist) → wrapped by widget-panel → panels (M2) → arranged by dashboard-grid → blocks (M3)
```
Nothing here discards existing work. M2 is almost entirely *composition* of the 72 atoms;
M1 fills the 9 genuine data-row gaps; M0 is the only new plumbing.

---

## 2. Conventions every builder must follow

Read `AGENTS.md` first — it governs. Deltas/reminders specific to this layer:

- **Authoring layout** is unchanged: one folder per item under `registry/medcn/<name>/`
  with `<name>.tsx`, `<name>.demo.tsx`, `meta.json`. `@/` aliases, `cn()` merge, cva for
  variants, `data-slot`, no `forwardRef` (React 19).
- **Dogffood, always.** A panel MUST compose existing registry items via
  `registryDependencies` rather than re-implementing a badge/card/row. If you find
  yourself re-writing an atom, stop and use the atom (or fix the atom).
- **New categories** — add these keys to `CATEGORIES` in `lib/registry.ts` (in this order,
  after `triage`):
  ```ts
  layout: "Layout",       // M0 scaffolding
  dashboard: "Dashboard", // M2 panels/organisms
  blocks: "Blocks",       // M3 full screens
  ```
- **`type` field in meta.json:** M0/M1/M2 use `"registry:ui"`. M3 blocks use
  `"registry:block"`.
- **Every clinical item needs `clinicalNotes`** (units, reference ranges, severity
  semantics, a11y). This is the medcn differentiator — no exceptions for panels/blocks.
- **Register the demo in `components/demos.tsx`** (add the import + the `name → Demo` map
  entry). This map is hand-maintained and is NOT auto-generated from the registry. The doc
  page `/components/[name]` calls `notFound()` when `demos[name]` is missing — skipping this
  makes the component 404 even though it builds into the registry fine. Then run
  `pnpm registry:build` so the JSON + nav pick it up.
- **Data-shape props:** panels take arrays of plain data + render the atoms. Keep them
  **controlled and presentational** — no data fetching, no global state. Loading/empty/
  error are props/slots, not internal concerns.
- **a11y in clinical context:** status is never color-alone; abnormal values carry a text
  label; tables are keyboard-navigable; alerts use `role="status"`/`role="alert"`.

### Interaction & polish bar (non-negotiable — applies to every item)

M0 review flagged components that felt static, non-responsive, and under-polished, with
tooltips treated as an afterthought. That is a defect, not a style preference. Every item
from here on must clear this bar:

- **Energy / motion.** Reuse the system's motion vocabulary (see `button`/`card`): interactive
  surfaces get `transition-all duration-200 ease-out`, `hover:shadow-lift hover:-translate-y-px`,
  `active:scale-[0.98] active:duration-75`, and a visible `focus-visible` ring. Anything
  clickable (tiles, rows, cards) MUST visibly respond to hover, press, and keyboard focus.
  Prefer tinted status accents (`bg-<tone>/10`, `border-<tone>/30`, `text-<tone>`) over flat
  `muted` where the color conveys clinical state. Icons live in tinted chips, not bare.
- **Responsiveness.** Mobile-first and tablet/bedside is first-class. Content stacks cleanly,
  flexible text uses `min-w-0` + truncation, header/action clusters `flex-wrap`, numeric data
  is `tabular-nums`, and nothing overflows the viewport horizontally.
- **Tooltip-first.** Use the `Tooltip` component — **never** the native `title` attribute
  ([[medcn-tooltip-and-datetime-conventions]]). Every icon-only control needs BOTH an
  `aria-label` and a `Tooltip`. Use tooltips to reveal truncated text, expand abbreviations/
  units, explain a delta's comparison period, and surface reference ranges / status semantics.
  Demos must demonstrate at least one real tooltip. Add `tooltip` to `registryDependencies`
  whenever the component renders one.

A component that builds and typechecks but is flat and mute does **not** count as `completed`.

### Status legend
`not-started` · `in-progress` · `completed`
Optional suffix in the Notes cell: `⚠ blocked: <dep>` if you cannot proceed.

---

## 3. Milestone 0 — Dashboard scaffolding primitives

**Category:** `layout` · **Build order:** first. Everything else sits inside these.
**Ordering rule:** `widget-panel` and `dashboard-grid` before any M2 panel.

| ID   | Component        | Status      | Composes / from        | Why it's needed |
|------|------------------|-------------|------------------------|-----------------|
| L-1  | widget-panel     | completed   | card, empty-state, button | The titled container every panel uses: header, action slot, footer, and **loading / empty / error** states. The single most-reused unit in the layer. |
| L-2  | dashboard-grid   | completed   | primitives             | Responsive 12-col grid + named spans; stacks on mobile. How blocks lay panels out. |
| L-3  | dashboard-shell  | completed   | dashboard-grid, widget-panel | App frame: sidebar nav + sticky header + centered content region. The outer skeleton of every M3 block. |
| L-4  | stat-tile        | completed   | trend-sparkline, card  | Big-number KPI with label, intent-split delta, inline trend. The "quick glance" metric unit (census counts, today's vitals). |
| L-5  | section-header   | completed   | button, badge          | Title + description + right-aligned actions row, heading-semantic. Standardizes panel and block headers. |
| L-6  | empty-state      | completed   | button                 | "No data / no results / not available yet" clinical placeholder. Panels reference it for their empty state. |
| L-7  | timeline         | completed   | primitives             | Vertical event rail used by encounters and activity feeds (M1 encounter-item, M2 EncounterTimelinePanel). |

> **M0 completed 2026-07-09.** All 7 emitted to the registry (now 79 items); `tsc --noEmit`
> clean; `registry:build` green. New `CATEGORIES` keys `layout`/`dashboard`/`blocks` added to
> `lib/registry.ts`. Uncommitted.

---

## 4. Milestone 1 — Missing clinical atoms

**Category:** as noted per row (`records` / `triage` / `scheduling`) · **Build order:**
after M0, in parallel with each other. These are the data rows M2 panels need but the
registry lacks. Each is a standard atom (same size/shape as existing ones).

| ID   | Component            | Status      | Category   | Why it's needed |
|------|----------------------|-------------|------------|-----------------|
| A-1  | problem-list-item    | completed   | records    | ICD-10 diagnosis + onset + active/resolved status. **Core EHR gap** — feeds ProblemListPanel and PatientSummary. |
| A-2  | care-gap-item        | completed   | records    | Overdue screening / vaccine / HbA1c with due date + quick action. **Core gap** — feeds CareGapsPanel; central to value-based care. |
| A-3  | risk-score-gauge     | completed   | triage     | ASCVD / sepsis / readmission / fall score as a labeled semicircular gauge. **Core gap** — feeds RiskScoresPanel. Distinct from `fall-risk-indicator` (single, specialized). |
| A-4  | clinical-task-row    | completed   | scheduling | Worklist item: checkbox, priority, due, assignee. Feeds TaskWorklistPanel and the Provider block. |
| A-5  | clinical-alert-item  | completed   | triage     | Severity + category + acknowledge/dismiss. Feed row for ClinicalAlertsFeed. |
| A-6  | encounter-item       | completed   | records    | Visit/encounter row (type, date, provider, summary). Feeds EncounterTimelinePanel on the `timeline` rail. |
| A-7  | clinical-note-card   | completed   | records    | SOAP / summary note with author + timestamp + signature. Used in Patient Chart + Telehealth console. |
| A-8  | appointment-row      | completed   | scheduling | Agenda line: time, patient/provider, type, status. Pairs with existing `appointment-check-in`. Feeds AppointmentsPanel. |
| A-9  | message-inbox-row    | completed   | scheduling | Secure-message / result-inbox item: sender, subject, unread, priority. Feeds the Provider/Patient inbox. |

> **M1 completed 2026-07-09** to the Interaction & polish bar (tooltip-first, energy, responsive).
> All 9 emitted (registry now **88 items**); demos registered; `tsc --noEmit` clean;
> `registry:build` green; all 9 `/components/<name>` pages verified rendering live on the dev
> server. **M0 was also retrofitted** to the same bar (widget-panel/stat-tile/timeline/
> section-header/empty-state gained tooltips + motion). Uncommitted.

---

## 5. Milestone 2 — Panel organisms (the dashboard units)

**Category:** `dashboard` · **Build order:** after its atom deps exist (M0 L-1/L-2 always;
plus the atoms listed). Panels are independent of each other — parallelizable.
Each panel is **controlled + presentational**: props in, atoms rendered, no fetching.

| ID   | Panel                   | Status      | Composes (deps) | Why it's needed |
|------|-------------------------|-------------|-----------------|-----------------|
| P-1  | PatientSummaryPanel ⭐   | completed   | patient-banner, vitals-card, allergy-badge, problem-list-item(A-1), prescription-card, widget-panel | The "at-a-glance" chart face — the flagship. One panel = a clinician's first 5-second read of a patient. |
| P-2  | VitalsOverviewPanel     | completed   | blood-pressure-badge, glucose-badge, spo2-dial, bmi-gauge, temperature-field(display), trend-sparkline, stat-tile(L-4), widget-panel | Grid of vital tiles with trends + abnormal flagging. The single most-requested clinical widget. |
| P-3  | MedicationListPanel     | completed   | prescription-card, adherence-ring, drug-interaction-alert, refill-countdown, widget-panel | Active/discontinued med list with adherence + interaction warnings + refills in one place. |
| P-4  | ProblemListPanel        | completed   | problem-list-item(A-1), section-header(L-5), widget-panel | Active/resolved diagnoses, sortable. Core chart section. |
| P-5  | AllergyPanel            | completed   | allergy-badge, widget-panel | Allergies with reaction + severity; safety-critical, deserves its own panel. |
| P-6  | LabResultsPanel         | completed   | lab-result, lab-trend-panel, lab-order-status, widget-panel | Results + trends + pending orders + reference ranges + abnormal flags. |
| P-7  | CareGapsPanel           | completed   | care-gap-item(A-2), section-header(L-5), widget-panel | Overdue-first list of open care gaps with quick action. Drives preventive care. |
| P-8  | AppointmentsPanel       | completed   | appointment-row(A-8), appointment-check-in, widget-panel | Today's / upcoming agenda with check-in. |
| P-9  | TaskWorklistPanel       | completed   | clinical-task-row(A-4), section-header(L-5), widget-panel | Filterable task/order worklist by status. |
| P-10 | ClinicalAlertsFeed      | completed   | clinical-alert-item(A-5), widget-panel | Acknowledge/dismiss stream of clinical alerts. |
| P-11 | RiskScoresPanel         | completed   | risk-score-gauge(A-3), fall-risk-indicator, widget-panel | Row of risk gauges for a patient. |
| P-12 | CareTeamPanel           | completed   | care-team-list, emergency-contact-card, widget-panel | Care team + emergency contacts, contactable. |
| P-13 | EncounterTimelinePanel  | completed   | timeline(L-7), encounter-item(A-6), widget-panel | Chronological visit history on the timeline rail. |
| P-14 | ImmunizationPanel       | completed   | immunization-schedule, vaccination-record-row, widget-panel | Vaccine history + schedule status (atoms already exist). |
| P-15 | PatientRosterTable      | completed   | triage-queue-row, patient rows, section-header(L-5), widget-panel | Sortable/filterable multi-patient census. Basis of the Provider + Triage blocks. |
| P-16 | MessagesInboxPanel      | completed   | message-inbox-row(A-9), section-header(L-5), widget-panel | Secure-message / result inbox. |

> **M2 completed 2026-07-09** to the Interaction & polish bar. All 16 emitted
> (registry now **104 items**); demos registered; `tsc --noEmit` clean; `registry:build`
> green; **all 16 `/components/<name>` pages verified rendering live (HTTP 200 + content)**.
> `type: registry:block`, category `dashboard`, all `"use client"`. Each panel is a thin,
> typed WidgetPanel composition (item arrays via `React.ComponentProps<typeof Atom>`) with a
> derived empty state and sensible sort order. One bug caught in live verify + fixed: a demo
> passing an `onDismiss` fn from a Server Component needed `"use client"`. Uncommitted.
> **M3 blocks are next** — they arrange these panels in a `dashboard-shell` + `dashboard-grid`.

---

## 6. Milestone 3 — Full dashboard blocks (freemium units)

**Category:** `blocks` · **`type: registry:block`** · **Build order:** after the panels a
block lists are `completed`. Each block = `dashboard-shell` + `dashboard-grid` arranging
M2 panels, shipped as one installable item.

| ID   | Block                          | Status      | Panels used | Audience / why |
|------|--------------------------------|-------------|-------------|----------------|
| B-1  | Patient Chart / 360 Summary ⭐  | completed   | P-1,P-2,P-3,P-4,P-5,P-6,P-13 | Single-patient clinical face-sheet. Densest, most reusable, best proof-of-concept — **recommended first block.** |
| B-2  | Provider / Clinician Dashboard | completed   | P-15,P-8,P-9,P-10,P-16 | Multi-patient census: roster + agenda + tasks + alerts + inbox. |
| B-3  | Patient / Consumer Health      | completed   | P-2,P-3,P-8,P-7,P-16 | Patient-facing; directly reusable upstream in the Petals user app. |
| B-4  | Triage / ED Board              | completed   | P-15,P-11,P-2 | Acuity + vitals + wait times. Leans on existing triage atoms; strong differentiator. |
| B-5  | Medication Management          | completed   | P-3,P-8 (+ dose-checklist, medication-timing-strip) | Meds + adherence + interactions + refills + schedule. |
| B-6  | Telehealth Visit Console       | completed   | telehealth-call-card, P-1, P-2, clinical-note-card(A-7) | Live-visit console: call + summary + vitals + notes. |

> **M3 completed 2026-07-09.** All 6 blocks emitted (`type: registry:block`, category
> `blocks`, all `"use client"`) — registry now **110 items**; demos registered; `tsc --noEmit`
> **clean** (also fixed 3 latent type errors that had shipped in the M2 commit: the
> `lab-results-panel` `results` reserved-attr collision, a `patient-summary-panel`
> `action`→`actions` typo, and `noUncheckedIndexedAccess` on adherence demo arrays);
> `registry:build` green; **all 6 `/components/<name>` pages verified rendering live**. Each
> block takes each panel's own props object (`React.ComponentProps<typeof Panel>`) and arranges
> them in a `dashboard-shell` + `dashboard-grid`, with a built-in nav/header (overridable).
> **The full atoms→panels→blocks layer (M0–M3) is now complete.** Uncommitted.

> **Responsiveness + preview refit 2026-07-09** (after the blocks looked squeezed in the docs
> preview): root cause was *viewport* breakpoints firing at desktop while the preview column is
> narrow. Fixed at the source, not the demo — (1) `dashboard-grid` + `dashboard-shell` + the
> multi-col panel grids (vitals/risk/summary/provider-stats) now use **Tailwind v4 container
> queries** (`@container` + `@xl/@3xl/@4xl`), so blocks reflow by their own width anywhere they're
> embedded; (2) `dashboard-shell` is now **collapsible** (`"use client"`): static sidebar when
> wide, hamburger + off-canvas drawer when narrow; (3) docs give `category: "blocks"` a
> **resizable iframe preview** (`components/block-preview.tsx` → `app/preview/[name]` full-bleed
> route, chrome hidden via a `:has([data-preview-root])` rule in globals.css) with Desktop/Tablet/
> Mobile toggles + drag handle. tsc clean; registry 110 items; verified live: block pages iframe →
> /preview, atoms unchanged, shell toggle renders when narrow. Uncommitted.

### Freemium mapping (proposal, not locked)
- **Free:** all of M0 (layout) + all M1 atoms + 2 starter panels (suggest P-2 Vitals,
  P-3 Medications). Keeps the open registry genuinely useful and drives adoption.
- **Premium:** remaining M2 panels + all M3 blocks. The "install a whole working screen"
  convenience is the paid value — same shape as shadcn's paid blocks.

---

## 7. Recommended sequence

1. **M0** L-1 → L-2 → (L-3…L-7 parallel).
2. **M1** all nine atoms in parallel (no interdependencies).
3. **M2** build the panels **B-1 needs first** (P-1..P-6, P-13) to unblock the flagship
   block, then the rest.
4. **M3** B-1 as the vertical-slice proof, then B-2/B-3, then B-4..B-6.

Reassess the freemium split (§6) once B-1 ships and we can see the real value line.
