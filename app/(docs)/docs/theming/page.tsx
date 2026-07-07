import { CodeBlock } from "@/components/code-block"
import { InlineCode } from "@/components/command-pill"

export const metadata = { title: "Theming" }

export default function ThemingPage() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Theming</h1>
        <p className="text-muted-foreground text-lg">
          Standard shadcn tokens, plus clinical status channels.
        </p>
      </div>

      <section className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          medcn components style themselves with the shadcn token set you
          already have (<InlineCode>--primary</InlineCode>,{" "}
          <InlineCode>--muted</InlineCode>, <InlineCode>--border</InlineCode>,
          …), so they pick up your theme automatically. On top of that they use
          three clinical status channels — <InlineCode>--success</InlineCode>,{" "}
          <InlineCode>--warning</InlineCode>, <InlineCode>--info</InlineCode> —
          and two shadows. Add these to your CSS if you don&apos;t define them
          yet:
        </p>
      </section>

      <CodeBlock
        lang="css"
        code={`@theme inline {
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
}

.dark {
  --success: oklch(0.75 0.15 160);
  --success-foreground: oklch(0.12 0.03 160);
  --warning: oklch(0.83 0.12 85);
  --warning-foreground: oklch(0.16 0.03 85);
  --info: oklch(0.72 0.12 220);
  --info-foreground: oklch(0.12 0.02 220);
}`}
      />

      <section className="text-muted-foreground flex flex-col gap-4 text-sm leading-relaxed">
        <p>
          Status colors carry clinical meaning (normal / elevated / critical /
          low), so keep them distinguishable and check contrast in both themes.
          Components never rely on color alone — states are always paired with
          a text label.
        </p>
      </section>
    </article>
  )
}
