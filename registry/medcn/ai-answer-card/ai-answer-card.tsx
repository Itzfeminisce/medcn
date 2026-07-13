import * as React from "react"
import { SparklesIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/medcn/card/card"
import { Separator } from "@/registry/medcn/separator/separator"

export interface AiAnswerCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  title?: React.ReactNode
  /** Provenance badge on the header. */
  generatedLabel?: React.ReactNode
  /** Model, version, or timestamp — shown as small print under the title. */
  metadata?: React.ReactNode
  /**
   * Model-reported confidence. Rendered as metadata, never as a clinical claim,
   * so it always appears next to the limitations it qualifies.
   */
  confidence?: React.ReactNode
  /** What this answer does not cover, and what must be checked. */
  limitations?: React.ReactNode
  /** Citations / provenance — typically an evidence panel. */
  evidence?: React.ReactNode
  /** Review actions: accept, insert, discard, copy. */
  actions?: React.ReactNode
}

/**
 * Structured surface for a generated answer: content, the limits of that
 * content, the evidence behind it, and the actions a reviewer may take. Base
 * for the specialised clinical outputs (summary, note draft, medication check).
 */
function AiAnswerCard({
  className,
  title = "Generated response",
  generatedLabel = "Generated",
  metadata,
  confidence,
  limitations,
  evidence,
  actions,
  children,
  ...props
}: AiAnswerCardProps) {
  return (
    <Card
      data-slot="ai-answer-card"
      className={cn("gap-0 py-0", className)}
      {...props}
    >
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-x-3 border-b px-5 py-3.5">
        <div className="flex min-w-0 flex-col gap-0.5">
          <CardTitle className="flex items-center gap-2 text-sm">
            <SparklesIcon className="text-primary size-4 shrink-0" aria-hidden />
            <span className="truncate">{title}</span>
          </CardTitle>
          {metadata && (
            <span className="text-muted-foreground pl-6 text-[11px]">
              {metadata}
            </span>
          )}
        </div>

        {generatedLabel && (
          <Badge variant="soft" className="h-5 shrink-0 text-[10px] font-semibold">
            {generatedLabel}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-5 py-4 text-sm leading-relaxed">
        {children}
      </CardContent>

      {(confidence || limitations) && (
        <>
          <Separator />
          <div
            data-slot="ai-answer-card-limitations"
            className="text-muted-foreground flex flex-col gap-1 px-5 py-3 text-xs"
          >
            {confidence && (
              <p className="flex items-center gap-1.5">
                <span className="text-foreground font-semibold">
                  Model confidence: {confidence}
                </span>
                <span>— metadata about the generation, not clinical accuracy.</span>
              </p>
            )}
            {limitations && <p>{limitations}</p>}
          </div>
        </>
      )}

      {evidence && (
        <>
          <Separator />
          <div data-slot="ai-answer-card-evidence" className="px-5 py-3">
            {evidence}
          </div>
        </>
      )}

      {actions && (
        <CardFooter className="flex-wrap gap-2 border-t px-5 py-3">
          {actions}
        </CardFooter>
      )}
    </Card>
  )
}

export { AiAnswerCard }
