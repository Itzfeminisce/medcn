import {
  Accessibility,
  Activity,
  ArrowRight,
  Bot,
  Boxes,
  CalendarClock,
  ClipboardList,
  FileText,
  FolderHeart,
  Gauge,
  HeartPulse,
  Layers,
  LineChart,
  PanelsTopLeft,
  Pill,
  ShieldCheck,
  Siren,
  Terminal,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  SITE_NAME,
  addByNamespaceCommand,
  addByUrlCommand,
  registriesSnippet,
} from "@/lib/env"
import { CATEGORIES, getRegistryItems } from "@/lib/registry"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import AdherenceRingDemo from "@/registry/medcn/adherence-ring/adherence-ring.demo"
import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import DataFreshnessStampDemo from "@/registry/medcn/data-freshness-stamp/data-freshness-stamp.demo"
import EcgStripDemo from "@/registry/medcn/ecg-strip/ecg-strip.demo"
import LabDeltaIndicatorDemo from "@/registry/medcn/lab-delta-indicator/lab-delta-indicator.demo"
import LabTrendPanelDemo from "@/registry/medcn/lab-trend-panel/lab-trend-panel.demo"
import MedicationTimingStripDemo from "@/registry/medcn/medication-timing-strip/medication-timing-strip.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import Spo2DialDemo from "@/registry/medcn/spo2-dial/spo2-dial.demo"
import TimeInRangeBarDemo from "@/registry/medcn/time-in-range-bar/time-in-range-bar.demo"
import TriageLevelIndicatorDemo from "@/registry/medcn/triage-level-indicator/triage-level-indicator.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"
import { CodeBlock } from "@/components/code-block"
import { CommandPill } from "@/components/command-pill"
import { CopyButton } from "@/components/copy-button"

const heroCommand = addByUrlCommand("vitals-card")

function EcgTrace() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 640 80"
      className="text-primary/50 pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2"
      fill="none"
    >
      <path
        className="ecg-path"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        d="M0 40 H180 l10 -8 10 8 14 0 6 -26 8 44 8 -30 6 12 H460 l10 -8 10 8 H640"
      />
    </svg>
  )
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-primary font-mono text-xs font-semibold tracking-widest uppercase">
      {children}
    </span>
  )
}

interface ShowcaseItem {
  name: string
  node: React.ReactNode
  /** Tile width. Capped against the viewport so a 460px card still fits a phone. */
  width: string
}

const ROW_ONE: ShowcaseItem[] = [
  { name: "patient-banner", node: <PatientBannerDemo />, width: "w-[min(86vw,460px)]" },
  { name: "vitals-card", node: <VitalsCardDemo />, width: "w-[min(80vw,320px)]" },
  { name: "spo2-dial", node: <Spo2DialDemo />, width: "w-[min(60vw,220px)]" },
  { name: "lab-trend-panel", node: <LabTrendPanelDemo />, width: "w-[min(86vw,440px)]" },
  { name: "time-in-range-bar", node: <TimeInRangeBarDemo />, width: "w-[min(86vw,360px)]" },
  { name: "triage-level-indicator", node: <TriageLevelIndicatorDemo />, width: "w-[min(80vw,300px)]" },
]

const ROW_TWO: ShowcaseItem[] = [
  { name: "adherence-ring", node: <AdherenceRingDemo />, width: "w-[min(64vw,240px)]" },
  { name: "prescription-card", node: <PrescriptionCardDemo />, width: "w-[min(84vw,340px)]" },
  { name: "medication-timing-strip", node: <MedicationTimingStripDemo />, width: "w-[min(86vw,440px)]" },
  { name: "lab-delta-indicator", node: <LabDeltaIndicatorDemo />, width: "w-[min(84vw,340px)]" },
  { name: "allergy-badge", node: <AllergyBadgeDemo />, width: "w-[min(80vw,320px)]" },
  { name: "data-freshness-stamp", node: <DataFreshnessStampDemo />, width: "w-[min(84vw,340px)]" },
  { name: "blood-pressure-badge", node: <BloodPressureBadgeDemo />, width: "w-[min(80vw,300px)]" },
  { name: "ecg-strip", node: <EcgStripDemo />, width: "w-[min(86vw,440px)]" },
]

/** One tile in the showcase — a link, so the marquee is a way in, not just decor. */
function Tile({ item }: { item: ShowcaseItem }) {
  return (
    <Link
      href={`/components/${item.name}`}
      tabIndex={-1}
      className={`border-border/60 bg-card/80 shadow-soft hover:border-primary/40 flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-4 backdrop-blur-sm transition-colors ${item.width}`}
    >
      {item.node}
    </Link>
  )
}

/**
 * A self-duplicating marquee row. The track carries two copies of the tiles and
 * travels -50%, so the loop is seamless at any width — nothing depends on a
 * pixel count that a new tile would break.
 *
 * It degrades honestly: with reduced motion the animation stops and the row
 * becomes a plain swipeable strip, which is also how it behaves on touch.
 */
function ShowcaseRow({
  items,
  direction = "left",
}: {
  items: ShowcaseItem[]
  direction?: "left" | "right"
}) {
  const copy = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
    >
      {items.map((item) => (
        <Tile key={`${item.name}-${hidden ? "copy" : "src"}`} item={item} />
      ))}
    </div>
  )

  return (
    <div className="marquee-row group relative overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="marquee-track flex w-max" data-direction={direction}>
        {copy(false)}
        {copy(true)}
      </div>
    </div>
  )
}

const CATEGORY_META: Record<
  string,
  { icon: LucideIcon; blurb: string; flagship: string }
> = {
  primitives: {
    icon: Boxes,
    blurb: "Buttons, inputs, selects — the shadcn base, themed clinical.",
    flagship: "button",
  },
  layout: {
    icon: PanelsTopLeft,
    blurb: "Shells, grids and panels that lay out by container, not viewport.",
    flagship: "dashboard-shell",
  },
  forms: {
    icon: ClipboardList,
    blurb: "Data capture built for real clinical forms.",
    flagship: "vitals-entry-form",
  },
  data: {
    icon: LineChart,
    blurb: "Charts, flowsheets and reference ranges — no value without its units.",
    flagship: "vitals-flowsheet",
  },
  vitals: {
    icon: Activity,
    blurb: "BP, glucose, SpO₂, growth — reading straight to badge or trend.",
    flagship: "vitals-card",
  },
  medication: {
    icon: Pill,
    blurb: "Dosing, schedules, adherence and interaction checks.",
    flagship: "dose-checklist",
  },
  scheduling: {
    icon: CalendarClock,
    blurb: "Appointments, reminders and dose times.",
    flagship: "appointment-check-in",
  },
  records: {
    icon: FolderHeart,
    blurb: "Allergies, immunizations and patient history.",
    flagship: "immunization-schedule",
  },
  triage: {
    icon: Siren,
    blurb: "Severity scales, queues, acuity and early-warning scores.",
    flagship: "early-warning-score",
  },
  dashboard: {
    icon: Gauge,
    blurb: "Ready-made panels for the surfaces clinicians live in.",
    flagship: "patient-summary-panel",
  },
  ai: {
    icon: Bot,
    blurb: "Assistant UI with context, citations and consent made visible.",
    flagship: "clinical-ai-assistant",
  },
  blocks: {
    icon: Layers,
    blurb: "Whole screens — monitoring, labs review, telehealth — in one install.",
    flagship: "patient-monitoring-block",
  },
}

const WHY = [
  {
    icon: ShieldCheck,
    title: "You own the code",
    body: "Copy-paste or CLI-install. The source lands in your repo — no runtime dependency, no lock-in, no black box.",
  },
  {
    icon: HeartPulse,
    title: "Clinical notes included",
    body: "Every health component ships units, reference ranges and severity semantics — so the UI matches the medicine.",
  },
  {
    icon: Accessibility,
    title: "Accessible by default",
    body: "Keyboard paths, ARIA roles and colorblind-safe severity built in — every chart carries a table a screen reader can read.",
  },
  {
    icon: Terminal,
    title: "shadcn-native",
    body: "Same CLI, same aliases, same conventions. Dependency chains resolve automatically. Add ours next to shadcn's.",
  },
]

export default async function Home() {
  // Counts come from the registry itself, so the landing page cannot drift out
  // of date the way a hand-written "80+ components" claim would.
  const items = await getRegistryItems()
  const countByCategory = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1
    return acc
  }, {})
  const blockCount = countByCategory.blocks ?? 0

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 sm:gap-28 sm:px-6 sm:pb-28">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-grid mask-fade relative -mx-4 flex flex-col items-center gap-6 px-4 pt-16 pb-8 text-center sm:-mx-6 sm:px-6 sm:pt-24">
        <EcgTrace />
        <Badge variant="soft" className="font-mono">
          {items.length} components · {blockCount} blocks · MIT
        </Badge>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-balance sm:text-6xl">
          The component library for{" "}
          <span className="text-primary">health</span>.
        </h1>
        <p className="text-muted-foreground max-w-xl text-base text-balance sm:text-lg">
          Vitals, medication, triage, records, clinical charts and an AI
          assistant layer. Accessible, composable, shadcn-compatible — the code
          lands in your project and it&apos;s yours.
        </p>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          <Button asChild size="lg" className="shadow-glow">
            <Link href="/components">Browse components</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>
        <div className="border-border/60 bg-card/80 flex w-full max-w-full items-center gap-3 rounded-lg border px-3 py-2.5 font-mono text-xs backdrop-blur sm:w-auto sm:px-4 sm:text-[13px]">
          <span className="text-primary shrink-0 select-none">$</span>
          <span className="text-muted-foreground min-w-0 flex-1 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {heroCommand}
          </span>
          <CopyButton value={heroCommand} />
        </div>
      </section>

      {/* ── Full-bleed showcase ──────────────────────────────── */}
      <section className="relative left-1/2 -mt-10 w-screen -translate-x-1/2 overflow-hidden pt-4 pb-20 sm:-mt-14 sm:pb-24">
        <div className="bg-grid mask-fade absolute inset-0 -z-20" />
        <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[380px] w-[820px] max-w-[140vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

        {/* The rows drift in opposite directions and clip at both edges. */}
        <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)] sm:gap-5">
          <ShowcaseRow items={ROW_ONE} />
          <ShowcaseRow items={ROW_TWO} direction="right" />
        </div>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          Every tile is a real component, rendered from its own demo.{" "}
          <Link href="/components" className="text-primary hover:underline">
            See all {items.length}
          </Link>
          .
        </p>

        <div className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent" />
      </section>

      {/* ── Install ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Kicker>Install in seconds</Kicker>
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
            Register once. Add anything.
          </h2>
          <p className="text-muted-foreground max-w-xl text-balance">
            {SITE_NAME} is a standard shadcn registry. Point the CLI at the
            namespace, then install components by name — dependency chains
            included.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs">
                1
              </span>
              Register the namespace in components.json
            </div>
            <CodeBlock code={registriesSnippet} lang="json" />
          </div>
          <div className="flex min-w-0 flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs">
                2
              </span>
              Add a component
            </div>
            <CommandPill command={addByNamespaceCommand("vitals-card")} />
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs">
                3
              </span>
              It&apos;s in your repo — own it, edit it, ship it.
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
            Domain-aware.
          </h2>
          <p className="text-muted-foreground max-w-xl text-balance">
            From base primitives to early-warning scores — the pieces health
            products rebuild every time, done once and done right.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Object.entries(CATEGORIES).map(([key, label]) => {
            const meta = CATEGORY_META[key]
            const count = countByCategory[key]
            if (!meta || !count) return null
            const Icon = meta.icon
            return (
              <Link
                key={key}
                href={`/components/${meta.flagship}`}
                className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-glow-sm flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon className="text-primary size-5 shrink-0" />
                  <span className="text-muted-foreground font-mono text-xs">
                    {count}
                  </span>
                </div>
                <div>
                  <div className="font-semibold">{label}</div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {meta.blurb}
                  </p>
                </div>
                <span className="text-primary mt-auto inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
                  Browse <ArrowRight className="size-3" />
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Why medcn ────────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Kicker>Why {SITE_NAME}</Kicker>
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
            Built the shadcn way, for health.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="border-border/60 bg-card flex flex-col gap-3 rounded-2xl border p-5 sm:p-6"
              >
                <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
                  <Icon className="size-5" />
                </div>
                <div className="font-semibold">{item.title}</div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── For agents ───────────────────────────────────────── */}
      <section className="border-border/60 from-primary/5 to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 sm:p-10">
        <div className="flex flex-col gap-4 sm:max-w-2xl">
          <div className="flex items-center gap-2">
            <Bot className="text-primary size-5" />
            <Kicker>For coding agents</Kicker>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-balance sm:text-3xl">
            Machine-readable to the core.
          </h2>
          <p className="text-muted-foreground text-balance">
            Every component exposes source, props, dependencies and clinical
            notes as JSON. Point your agent at{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              /llms.txt
            </code>{" "}
            and it can install and wire components on its own.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline" size="sm">
              <a href="/llms.txt">
                <FileText className="size-4" />
                llms.txt
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="/r/registry.json">
                <Terminal className="size-4" />
                registry.json
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/docs/agents">
                For agents guide <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="bg-grid mask-fade relative -mx-4 flex flex-col items-center gap-6 px-4 py-14 text-center sm:-mx-6 sm:px-6 sm:py-16">
        <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-balance sm:text-5xl">
          Ship the clinical UI. Skip the rebuild.
        </h2>
        <p className="text-muted-foreground max-w-lg text-balance">
          Accessible, composable, MIT-licensed — yours to keep.
        </p>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
          <Button asChild size="lg" className="shadow-glow">
            <Link href="/components">Browse components</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/docs/installation">Get started</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
