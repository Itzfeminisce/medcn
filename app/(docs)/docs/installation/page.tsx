import {
  REGISTRY_NAMESPACE,
  addByNamespaceCommand,
  addByUrlCommand,
  registriesSnippet,
} from "@/lib/env"
import { CodeBlock } from "@/components/code-block"
import { CommandPill, InlineCode } from "@/components/command-pill"

export const metadata = { title: "Installation" }

export default function InstallationPage() {
  return (
    <article className="flex max-w-3xl flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Installation</h1>
        <p className="text-muted-foreground text-lg">
          Install components with the shadcn CLI you already use.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">Prerequisites</h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          A React project with Tailwind CSS and shadcn initialized:
        </p>
        <CommandPill command="npx shadcn@latest init" />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Install a component
        </h2>
        <CommandPill command={addByUrlCommand("vitals-card")} />
        <p className="text-muted-foreground text-sm leading-relaxed">
          Dependencies resolve automatically —{" "}
          <InlineCode>vitals-card</InlineCode> brings its{" "}
          <InlineCode>card</InlineCode> and <InlineCode>badge</InlineCode>{" "}
          along, plus any npm packages it needs.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold tracking-tight">
          The {REGISTRY_NAMESPACE} namespace
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Register the registry once in <InlineCode>components.json</InlineCode>{" "}
          for shorter commands:
        </p>
        <CodeBlock lang="json" code={registriesSnippet} />
        <CommandPill command={addByNamespaceCommand("vitals-card")} />
      </section>
    </article>
  )
}
