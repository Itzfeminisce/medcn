"use client"

import * as React from "react"
import { ChevronDownIcon, LibraryIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/registry/medcn/collapsible/collapsible"

export interface AiEvidencePanelProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  title?: React.ReactNode
  /** When the sources were retrieved — evidence ages. */
  retrievedAt?: React.ReactNode
  /** Citations. Usually AiCitation elements. */
  children: React.ReactNode
  /** What the evidence does not establish. Caller-authored. */
  limitations?: React.ReactNode
  /** Count override. Defaults to the number of children. */
  count?: number
  defaultOpen?: boolean
}

/**
 * Collapsed provenance for an answer: the sources, when they were retrieved,
 * and what they do not establish. Keeps the answer readable while preserving
 * the trail a clinician needs to evaluate it.
 */
function AiEvidencePanel({
  className,
  title = "Evidence",
  retrievedAt,
  children,
  limitations,
  count,
  defaultOpen = false,
  ...props
}: AiEvidencePanelProps) {
  const [open, setOpen] = React.useState(defaultOpen)
  const total = count ?? React.Children.count(children)

  return (
    <div
      data-slot="ai-evidence-panel"
      className={cn("bg-muted/40 rounded-lg border", className)}
      {...props}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          data-slot="ai-evidence-panel-trigger"
          className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/40 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors outline-none focus-visible:ring-2"
        >
          <LibraryIcon className="size-3.5 shrink-0" aria-hidden />
          <span>
            {title} ({total})
          </span>
          {retrievedAt && (
            <span className="text-muted-foreground/80 truncate font-normal">
              · retrieved {retrievedAt}
            </span>
          )}
          <ChevronDownIcon
            aria-hidden
            className={cn(
              "ml-auto size-3.5 shrink-0 transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
          <div className="flex flex-col gap-2 border-t px-3 py-2.5">
            <div
              data-slot="ai-evidence-panel-citations"
              className="flex flex-wrap gap-1.5"
            >
              {children}
            </div>

            {limitations && (
              <p
                data-slot="ai-evidence-panel-limitations"
                className="text-muted-foreground border-border/70 border-l-2 pl-2.5 text-xs leading-relaxed"
              >
                {limitations}
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export { AiEvidencePanel }
