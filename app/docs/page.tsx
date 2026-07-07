import Link from "next/link"

import { CopyButton } from "@/components/copy-button"

export const metadata = { title: "Docs" }

function Command({ children }: { children: string }) {
  return (
    <div className="border-border/60 bg-card flex items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-[13px]">
      <span className="text-primary select-none">$</span>
      <span className="text-muted-foreground flex-1 overflow-x-auto whitespace-nowrap">
        {children}
      </span>
      <CopyButton value={children} />
    </div>
  )
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  )
}

export default function DocsPage() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Getting started</h1>
        <p className="text-muted-foreground text-lg">
          medcn components install with the shadcn CLI and land as source in
          your project.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Prerequisites</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A React project with Tailwind CSS and shadcn initialized:
        </p>
        <Command>npx shadcn@latest init</Command>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Install a component
        </h2>
        <Command>
          npx shadcn@latest add https://medcn.dev/r/vitals-card.json
        </Command>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Dependencies resolve automatically — <Code>vitals-card</Code> brings
          its <Code>card</Code> and <Code>badge</Code> along.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Shorter commands
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Register the namespace once in <Code>components.json</Code>:
        </p>
        <pre className="bg-code text-code-foreground overflow-x-auto rounded-xl p-5 font-mono text-[13px] leading-relaxed">
          {`{
  "registries": {
    "@medcn": "https://medcn.dev/r/{name}.json"
  }
}`}
        </pre>
        <Command>npx shadcn@latest add @medcn/vitals-card</Command>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Theming</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Components use standard shadcn tokens plus three clinical status
          channels — <Code>--success</Code>, <Code>--warning</Code>,{" "}
          <Code>--info</Code> — and two shadows, <Code>--shadow-soft</Code> and{" "}
          <Code>--shadow-lift</Code>. Add them to your theme:
        </p>
        <pre className="bg-code text-code-foreground overflow-x-auto rounded-xl p-5 font-mono text-[13px] leading-relaxed">
          {`@theme inline {
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --shadow-soft: 0 0 0 1px oklch(0.93 0.01 220 / 0.6),
    0 2px 8px -2px oklch(0.24 0.03 240 / 0.04);
  --shadow-lift: 0 0 0 1px oklch(0.91 0.015 220 / 0.5),
    0 10px 24px -8px oklch(0.24 0.04 240 / 0.06);
}

:root {
  --success: oklch(0.63 0.15 145);
  --success-foreground: oklch(0.99 0.003 220);
  --warning: oklch(0.78 0.12 80);
  --warning-foreground: oklch(0.25 0.04 80);
  --info: oklch(0.58 0.13 225);
  --info-foreground: oklch(0.99 0.003 220);
}`}
        </pre>
      </section>

      <p className="text-sm">
        <Link
          href="/components"
          className="text-primary underline-offset-4 hover:underline"
        >
          Browse the components →
        </Link>
      </p>
    </article>
  )
}
