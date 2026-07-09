import { ArrowUpRightIcon, HeartPulseIcon } from "lucide-react"
import { notFound } from "next/navigation"

import { addByUrlCommand } from "@/lib/env"
import {
  CATEGORIES,
  getItemDemoSource,
  getItemSource,
  getRegistryItem,
  getRegistryItems,
} from "@/lib/registry"
import { Badge } from "@/registry/medcn/badge/badge"
import { BlockPreview } from "@/components/block-preview"
import { CodeBlock } from "@/components/code-block"
import { CommandPill } from "@/components/command-pill"
import { ComponentPreview } from "@/components/component-preview"
import { demos } from "@/components/demos"

export async function generateStaticParams() {
  const items = await getRegistryItems()
  return items.map((item) => ({ name: item.name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = await getRegistryItem(name)
  return { title: item?.title ?? name, description: item?.description }
}

function RefPill({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="bg-secondary text-secondary-foreground hover:bg-secondary/70 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors"
    >
      {label}
      <ArrowUpRightIcon className="size-3" />
    </a>
  )
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const item = await getRegistryItem(name)
  const Demo = demos[name]
  if (!item || !Demo) notFound()

  const [source, demoSource] = await Promise.all([
    getItemSource(name),
    getItemDemoSource(name),
  ])

  const toc = [
    { id: "installation", label: "Installation" },
    { id: "source", label: "Source" },
    ...(item.props?.length ? [{ id: "api", label: "API" }] : []),
    ...(item.clinicalNotes
      ? [{ id: "clinical-notes", label: "Clinical notes" }]
      : []),
  ]

  return (
    <div className="flex gap-10">
      <article className="flex max-w-3xl min-w-0 flex-1 flex-col gap-12">
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{item.title}</h1>
            <Badge variant="soft">
              {CATEGORIES[item.category] ?? item.category}
            </Badge>
            <span className="text-muted-foreground font-mono text-xs">
              v{item.version}
            </span>
          </div>
          <p className="text-muted-foreground text-lg">{item.description}</p>
          {item.links && (item.links.radix || item.links.shadcn) ? (
            <div className="flex items-center gap-2">
              {item.links.radix ? (
                <RefPill href={item.links.radix} label="Radix API" />
              ) : null}
              {item.links.shadcn ? (
                <RefPill href={item.links.shadcn} label="shadcn/ui" />
              ) : null}
            </div>
          ) : null}
        </header>

        {item.category === "blocks" ? (
          <BlockPreview
            name={name}
            codeView={<CodeBlock code={demoSource} />}
          />
        ) : (
          <ComponentPreview codeView={<CodeBlock code={demoSource} />}>
            <Demo />
          </ComponentPreview>
        )}

        <section
          id="installation"
          className="flex scroll-mt-24 flex-col gap-3"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            Installation
          </h2>
          <CommandPill command={addByUrlCommand(name)} />
          <p className="text-muted-foreground text-sm">
            Manual: copy the source below into{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
              components/ui/{name}.tsx
            </code>
            {item.dependencies?.length ? (
              <>
                {" "}
                · requires{" "}
                <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                  {item.dependencies.join(" ")}
                </code>
              </>
            ) : null}
          </p>
        </section>

        <section id="source" className="flex scroll-mt-24 flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Source</h2>
          <CodeBlock code={source} />
        </section>

        {item.props?.length ? (
          <section id="api" className="flex scroll-mt-24 flex-col gap-3">
            <h2 className="text-xl font-semibold tracking-tight">API</h2>
            <div className="border-border/60 no-scrollbar overflow-x-auto rounded-xl border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-border/60 bg-muted/50 border-b text-left">
                    <th className="px-4 py-2.5 font-semibold">Prop</th>
                    <th className="px-4 py-2.5 font-semibold">Type</th>
                    <th className="px-4 py-2.5 font-semibold">Default</th>
                    <th className="px-4 py-2.5 font-semibold">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {item.props.map((prop) => (
                    <tr
                      key={prop.name}
                      className="border-border/40 border-b last:border-0"
                    >
                      <td className="text-primary px-4 py-2.5 font-mono text-xs font-semibold">
                        {prop.name}
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5 font-mono text-xs">
                        {prop.type}
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5 font-mono text-xs">
                        {prop.default ?? "—"}
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5">
                        {prop.description ?? ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {item.clinicalNotes ? (
          <section
            id="clinical-notes"
            className="flex scroll-mt-24 flex-col gap-3"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold tracking-tight">
              <HeartPulseIcon className="text-primary size-5" />
              Clinical notes
            </h2>
            <div className="border-info/25 bg-info/5 rounded-xl border p-5 text-sm leading-relaxed">
              {item.clinicalNotes}
            </div>
          </section>
        ) : null}
      </article>

      <aside className="sticky top-24 hidden w-40 shrink-0 self-start xl:block">
        <h4 className="mb-2 text-xs font-semibold">On this page</h4>
        <ul className="flex flex-col gap-1.5">
          {toc.map((entry) => (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {entry.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  )
}
