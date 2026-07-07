import { CodeBlock } from "@/components/code-block"
import { CommandPill, InlineCode } from "@/components/command-pill"

export const metadata = { title: "For Agents" }

export default function AgentsPage() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">For Agents</h1>
        <p className="text-muted-foreground text-lg">
          medcn is built to be consumed by coding agents as well as humans.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">llms.txt</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A machine-readable index of every component — name, description,
          docs URL, and registry URL:
        </p>
        <CommandPill command="curl https://medcn.dev/llms.txt" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Registry endpoints
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Everything an agent needs to evaluate a component is in its registry
          item: full source, npm dependencies, registry dependencies, props,
          and clinical notes under <InlineCode>meta</InlineCode>.
        </p>
        <CodeBlock
          lang="bash"
          code={`# index of all components
curl https://medcn.dev/r/registry.json

# one component: source + dependencies + props + clinical notes
curl https://medcn.dev/r/vitals-card.json`}
        />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">shadcn MCP</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          medcn works with the shadcn MCP server. Register the{" "}
          <InlineCode>@medcn</InlineCode> namespace in{" "}
          <InlineCode>components.json</InlineCode> and MCP-connected agents can
          search, view, and install medcn components alongside shadcn&apos;s
          own:
        </p>
        <CodeBlock
          lang="json"
          code={`{
  "registries": {
    "@medcn": "https://medcn.dev/r/{name}.json"
  }
}`}
        />
        <CommandPill command="npx shadcn@latest mcp init" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Prompting tips
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Tell your agent the registry exists and let the CLI do the work —
          for example: <em>&quot;Use medcn for health UI. Install components
          with </em>
          <InlineCode>npx shadcn add @medcn/&lt;name&gt;</InlineCode>
          <em>; the catalog is at </em>
          <InlineCode>https://medcn.dev/llms.txt</InlineCode>
          <em>. Read the clinical notes in each registry item before wiring
          data.&quot;</em>
        </p>
      </section>
    </article>
  )
}
