import { HeartPulseIcon } from "lucide-react"
import { notFound } from "next/navigation"

import {
  CATEGORIES,
  getItemDemoSource,
  getItemSource,
  getRegistryItem,
  getRegistryItems,
} from "@/lib/registry"
import { Badge } from "@/registry/medcn/badge/badge"
import { ComponentPreview } from "@/components/component-preview"
import { CopyButton } from "@/components/copy-button"
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

function CommandPill({ command }: { command: string }) {
  return (
    <div className="border-border/60 bg-card flex items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-[13px]">
      <span className="text-primary select-none">$</span>
      <span className="text-muted-foreground flex-1 overflow-x-auto whitespace-nowrap">
        {command}
      </span>
      <CopyButton value={command} />
    </div>
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

  return (
    <article className="flex max-w-4xl flex-col gap-12">
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
      </header>

      <ComponentPreview code={demoSource}>
        <Demo />
      </ComponentPreview>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Installation</h2>
        <CommandPill
          command={`npx shadcn@latest add https://medcn.dev/r/${name}.json`}
        />
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

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Source</h2>
        <div className="relative">
          <CopyButton
            value={source}
            className="bg-code/80 text-code-foreground/60 hover:text-code-foreground absolute top-3 right-3"
          />
          <pre className="bg-code text-code-foreground max-h-125 overflow-auto rounded-xl p-5 font-mono text-[13px] leading-relaxed">
            <code>{source}</code>
          </pre>
        </div>
      </section>

      {item.props?.length ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold tracking-tight">API</h2>
          <div className="border-border/60 overflow-x-auto rounded-xl border">
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
        <section className="flex flex-col gap-3">
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
  )
}
