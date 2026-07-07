import { codeToHtml } from "shiki"

import { cn } from "@/lib/utils"
import { CopyButton } from "@/components/copy-button"

/**
 * Server component: shiki-highlighted code on the fixed dark code surface
 * (identical in both themes, per docs/DESIGN.md). Use for every code block
 * shown to users.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  className,
}: {
  code: string
  lang?: string
  className?: string
}) {
  const html = await codeToHtml(code.trimEnd(), {
    lang,
    theme: "github-dark-default",
  })

  return (
    <div className={cn("code-block group relative", className)}>
      <CopyButton
        value={code}
        className="bg-code/80 text-code-foreground/60 hover:text-code-foreground absolute top-3 right-3 z-10"
      />
      <div
        className="bg-code max-h-125 overflow-auto rounded-xl font-mono text-[13px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
