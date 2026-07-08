import Link from "next/link"

import { SITE_NAME, addByUrlCommand } from "@/lib/env"
import { CommandPill, InlineCode } from "@/components/command-pill"

export const metadata = { title: "Introduction" }

export default function DocsPage() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
        <p className="text-muted-foreground text-lg">
          Health &amp; medical UI components, distributed as source through the
          shadcn registry.
        </p>
      </div>

      <section className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          {SITE_NAME} is not a component library you install from npm. Each
          component
          is delivered as source code into your project — you can read it,
          restyle it, and change its behavior. There is nothing to upgrade
          around and no API surface you don&apos;t control.
        </p>
        <p>
          Components follow shadcn/ui conventions exactly: Tailwind CSS,{" "}
          <InlineCode>cn()</InlineCode>, cva variants, Radix primitives where
          interaction demands them, <InlineCode>data-slot</InlineCode>{" "}
          attributes. If you use shadcn/ui today, {SITE_NAME} components drop
          into the same <InlineCode>components/ui</InlineCode> folder and feel
          native next to them.
        </p>
        <p>
          What makes {SITE_NAME} different is the domain. Components model
          clinical
          UI — vitals, medication, scheduling, triage, records — and each one
          documents its clinical reasoning: units, reference ranges, why a
          trend arrow and its goodness are separate props. The registry
          metadata carries this too, so tooling and agents see it, not just
          humans.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Quick start</h2>
        <CommandPill command={addByUrlCommand("vitals-card")} />
        <p className="text-muted-foreground text-sm">
          Full setup in{" "}
          <Link
            href="/docs/installation"
            className="text-primary underline-offset-4 hover:underline"
          >
            Installation
          </Link>
          .
        </p>
      </section>
    </article>
  )
}
