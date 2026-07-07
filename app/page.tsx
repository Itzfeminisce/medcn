import Link from "next/link"

import { Button } from "@/registry/medcn/button/button"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"
import { CopyButton } from "@/components/copy-button"

const heroCommand = "npx shadcn@latest add https://medcn.dev/r/vitals-card.json"

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

export default function Home() {
  return (
    <div className="flex flex-col gap-20">
      <section className="bg-grid mask-fade relative -mx-6 flex flex-col items-center gap-6 px-6 pt-20 pb-14 text-center">
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
            <Link href="/docs">Docs</Link>
          </Button>
        </div>
        <div className="border-border/60 bg-card/80 flex items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-[13px] backdrop-blur">
          <span className="text-primary select-none">$</span>
          <span className="text-muted-foreground overflow-x-auto whitespace-nowrap">
            {heroCommand}
          </span>
          <CopyButton value={heroCommand} />
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1fr_auto]">
        <div className="border-border/60 bg-grid rounded-2xl border p-8">
          <VitalsCardDemo />
        </div>
        <div className="border-border/60 rounded-2xl border p-8">
          <DoseChecklistDemo />
        </div>
      </section>
    </div>
  )
}
