import * as React from "react"
import {
  ClockIcon,
  DatabaseIcon,
  ExternalLinkIcon,
  Globe2Icon,
  ShieldIcon,
  UserRoundIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/registry/medcn/alert/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type AiPrivacyFactKind =
  | "use"
  | "retention"
  | "external"
  | "identifiability"

const FACT_ICONS: Record<AiPrivacyFactKind, React.ElementType> = {
  use: DatabaseIcon,
  retention: ClockIcon,
  external: Globe2Icon,
  identifiability: UserRoundIcon,
}

export interface AiPrivacyFact {
  /** Stable identifier for the disclosure line. */
  id: string
  /** Drives the leading icon. */
  kind?: AiPrivacyFactKind
  /** The disclosure itself, in the caller's words — e.g. "Retained for 30 days". */
  label: React.ReactNode
  /**
   * The specifics behind the label: legal basis, processor, region, deletion
   * route. Shown on hover/focus and always exposed to assistive technology.
   */
  detail?: React.ReactNode
}

export interface AiPrivacyNoticeProps
  extends Omit<React.ComponentProps<typeof Alert>, "title" | "children"> {
  title?: React.ReactNode
  /** Every fact is caller-supplied; the component asserts nothing on its own. */
  facts: AiPrivacyFact[]
  /** Link to the product's authoritative privacy notice or controls. */
  detailHref?: string
  detailLabel?: React.ReactNode
}

/**
 * Compact inline disclosure of how prompt data is used, retained, and processed
 * externally — the notice that sits beside an action, not a replacement for the
 * product's privacy notice or its controls.
 */
function AiPrivacyNotice({
  className,
  variant = "info",
  title = "How this data is used",
  facts,
  detailHref,
  detailLabel = "Privacy notice",
  ...props
}: AiPrivacyNoticeProps) {
  return (
    <Alert
      data-slot="ai-privacy-notice"
      variant={variant}
      className={cn("gap-y-1.5 px-3.5 py-2.5", className)}
      {...props}
    >
      <ShieldIcon aria-hidden />

      <AlertTitle className="text-[13px]">{title}</AlertTitle>

      <AlertDescription className="gap-1.5">
        <ul
          data-slot="ai-privacy-notice-facts"
          className="flex w-full flex-col gap-1"
        >
          {facts.map((fact) => {
            const Icon = FACT_ICONS[fact.kind ?? "use"]

            return (
              <li
                key={fact.id}
                data-slot="ai-privacy-notice-fact"
                data-kind={fact.kind ?? "use"}
                className="flex items-start gap-2 text-xs leading-relaxed"
              >
                <Icon
                  aria-hidden
                  className="text-muted-foreground mt-0.5 size-3.5 shrink-0"
                />
                {fact.detail ? (
                  <Tooltip>
                    <TooltipTrigger
                      type="button"
                      className="focus-visible:ring-ring/40 decoration-muted-foreground/50 rounded-sm text-left underline decoration-dotted underline-offset-4 outline-none focus-visible:ring-[3px]"
                    >
                      {fact.label}
                      <span className="sr-only"> — {fact.detail}</span>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-64 text-pretty">
                      {fact.detail}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span>{fact.label}</span>
                )}
              </li>
            )
          })}
        </ul>

        {detailHref && (
          <a
            href={detailHref}
            className="text-foreground hover:text-primary inline-flex items-center gap-1 text-xs font-medium underline underline-offset-4"
          >
            {detailLabel}
            <ExternalLinkIcon className="size-3" aria-hidden />
          </a>
        )}
      </AlertDescription>
    </Alert>
  )
}

export { AiPrivacyNotice, FACT_ICONS as aiPrivacyNoticeIcons }
