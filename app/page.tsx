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
  HeartPulse,
  LineChart,
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
import { CATEGORIES } from "@/lib/registry"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import AdherenceRingDemo from "@/registry/medcn/adherence-ring/adherence-ring.demo"
import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import EcgStripDemo from "@/registry/medcn/ecg-strip/ecg-strip.demo"
import LabTrendPanelDemo from "@/registry/medcn/lab-trend-panel/lab-trend-panel.demo"
import MedicationTimingStripDemo from "@/registry/medcn/medication-timing-strip/medication-timing-strip.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import Spo2DialDemo from "@/registry/medcn/spo2-dial/spo2-dial.demo"
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

/** A floating component tile in the full-bleed showcase. */
function Tile({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`border-border/60 bg-card/80 shadow-soft flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border p-4 backdrop-blur-sm ${className ?? ""}`}
    >
      {children}
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
  forms: {
    icon: ClipboardList,
    blurb: "Data capture built for real clinical forms.",
    flagship: "vitals-entry-form",
  },
  data: {
    icon: LineChart,
    blurb: "Trends, sparklines and lab panels for records.",
    flagship: "lab-trend-panel",
  },
  vitals: {
    icon: Activity,
    blurb: "BP, glucose, SpO₂, BMI — reading straight to badge.",
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
    blurb: "Severity scales, queues and acuity levels.",
    flagship: "triage-level-indicator",
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
    body: "Keyboard paths, ARIA roles and colorblind-safe severity built in — not bolted on after a review.",
  },
  {
    icon: Terminal,
    title: "shadcn-native",
    body: "Same CLI, same aliases, same conventions. Dependency chains resolve automatically. Add ours next to shadcn's.",
  },
]

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-28 px-6 pb-28">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-grid mask-fade relative -mx-6 flex flex-col items-center gap-6 px-6 pt-24 pb-8 text-center">
        <EcgTrace />
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-6xl">
          The component library for{" "}
          <span className="text-primary">health</span>.
        </h1>
        <p className="text-muted-foreground max-w-xl text-lg text-balance">
          Vitals, medication, scheduling, triage. Accessible, composable,
          shadcn-compatible — the code lands in your project and it&apos;s
          yours.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="shadow-glow">
            <Link href="/components">Browse components</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/docs">Documentation</Link>
          </Button>
        </div>
        <div className="border-border/60 bg-card/80 flex max-w-full items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-[13px] backdrop-blur">
          <span className="text-primary select-none">$</span>
          <span className="text-muted-foreground no-scrollbar overflow-x-auto whitespace-nowrap">
            {heroCommand}
          </span>
          <CopyButton value={heroCommand} />
        </div>
      </section>

      {/* ── Full-bleed showcase (peeks off both edges, fades out) ─ */}
      <section className="relative left-1/2 -mt-14 w-screen -translate-x-1/2 overflow-hidden pt-4 pb-24">
        {/* backdrops */}
        <div className="bg-grid mask-fade absolute inset-0 -z-20" />
        <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[380px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />

        {/* wider-than-viewport rows, centered so both ends clip; masked L/R */}
        <div className="flex flex-col gap-5 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]">
          <div className="mx-auto flex w-max -translate-x-8 items-start gap-5">
            <Tile className="w-[460px] justify-start">
              <PatientBannerDemo />
            </Tile>
            <Tile className="w-[320px]">
              <VitalsCardDemo />
            </Tile>
            <Tile className="w-[220px]">
              <Spo2DialDemo />
            </Tile>
            <Tile className="w-[440px] justify-start">
              <LabTrendPanelDemo />
            </Tile>
            <Tile className="w-[300px] justify-start">
              <TriageLevelIndicatorDemo />
            </Tile>
          </div>
          <div className="mx-auto flex w-max translate-x-8 items-start gap-5">
            <Tile className="w-[240px]">
              <AdherenceRingDemo />
            </Tile>
            <Tile className="w-[340px] justify-start">
              <PrescriptionCardDemo />
            </Tile>
            <Tile className="w-[440px] justify-start">
              <MedicationTimingStripDemo />
            </Tile>
            <Tile className="w-[320px] justify-start">
              <AllergyBadgeDemo />
            </Tile>
            <Tile className="w-[300px]">
              <BloodPressureBadgeDemo />
            </Tile>
            <Tile className="w-[440px] justify-start">
              <EcgStripDemo />
            </Tile>
          </div>
        </div>

        {/* bottom fade — dissolves into the next section */}
        <div className="to-background pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent" />
      </section>

      {/* ── Install ──────────────────────────────────────────── */}
      <section className="flex flex-col gap-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <Kicker>Install in seconds</Kicker>
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Register once. Add anything.
          </h2>
          <p className="text-muted-foreground max-w-xl text-balance">
            {SITE_NAME} is a standard shadcn registry. Point the CLI at the
            namespace,
            then install components by name — dependency chains included.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 items-center justify-center rounded-full font-mono text-xs">
                1
              </span>
              Register the namespace in components.json
            </div>
            <CodeBlock code={registriesSnippet} lang="json" />
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 items-center justify-center rounded-full font-mono text-xs">
                2
              </span>
              Add a component
            </div>
            <CommandPill command={addByNamespaceCommand("vitals-card")} />
            <div className="mt-1 flex items-center gap-2 text-sm font-semibold">
              <span className="bg-primary/15 text-primary flex size-6 items-center justify-center rounded-full font-mono text-xs">
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
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Domain-aware.
          </h2>
          <p className="text-muted-foreground max-w-xl text-balance">
            From base primitives to triage acuity — the pieces health products
            rebuild every time, done once and done right.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(CATEGORIES).map(([key, label]) => {
            const meta = CATEGORY_META[key]
            if (!meta) return null
            const Icon = meta.icon
            return (
              <Link
                key={key}
                href={`/components/${meta.flagship}`}
                className="group border-border/60 bg-card hover:border-primary/40 hover:shadow-glow-sm flex flex-col gap-3 rounded-2xl border p-5 transition-all hover:-translate-y-0.5"
              >
                <Icon className="text-primary size-5" />
                <div>
                  <div className="font-semibold">{label}</div>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {meta.blurb}
                  </p>
                </div>
                <span className="text-primary inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100">
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
          <h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
            Built the shadcn way, for health.
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {WHY.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="border-border/60 bg-card flex flex-col gap-3 rounded-2xl border p-6"
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
      <section className="border-border/60 from-primary/5 to-card relative overflow-hidden rounded-2xl border bg-gradient-to-br p-8 sm:p-10">
        <div className="flex flex-col gap-4 sm:max-w-2xl">
          <div className="flex items-center gap-2">
            <Bot className="text-primary size-5" />
            <Kicker>For coding agents</Kicker>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
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
      <section className="bg-grid mask-fade relative -mx-6 flex flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          Ship the clinical UI. Skip the rebuild.
        </h2>
        <p className="text-muted-foreground max-w-lg text-balance">
          Accessible, composable, MIT-licensed — yours to keep.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
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
