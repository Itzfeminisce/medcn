"use client"

import * as React from "react"
import { ExternalLinkIcon, FileTextIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"

export type AiCitationState = "available" | "stale" | "unavailable"

const STATE_LABELS: Record<AiCitationState, string | null> = {
  available: null,
  stale: "May be out of date",
  unavailable: "Source unavailable",
}

export interface AiCitationProps
  extends Omit<React.ComponentProps<typeof Button>, "title" | "children"> {
  /** Footnote marker, e.g. 1. Omit for the inline form. */
  index?: number
  /** What the source is. Required — "sources available" is not a citation. */
  title: React.ReactNode
  publisher?: React.ReactNode
  /** Publication or observation date. */
  date?: React.ReactNode
  /** Where in the source the claim sits — page, section, or field. */
  locator?: React.ReactNode
  href?: string
  state?: AiCitationState
  /** Quoted supporting passage. */
  excerpt?: React.ReactNode
}

/**
 * Reference to the source behind a claim. It names the source in the popover
 * rather than asserting that sources merely exist, so a reader can decide
 * whether the evidence actually supports the sentence it is attached to.
 */
function AiCitation({
  className,
  index,
  title,
  publisher,
  date,
  locator,
  href,
  state = "available",
  excerpt,
  ...props
}: AiCitationProps) {
  const flag = STATE_LABELS[state]
  const unavailable = state === "unavailable"

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-slot="ai-citation"
          data-state-flag={state}
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Source${index ? ` ${index}` : ""}: ${
            typeof title === "string" ? title : "view details"
          }`}
          className={cn(
            "text-muted-foreground hover:text-foreground h-6 max-w-48 gap-1 rounded-full px-2 text-xs font-medium",
            state === "stale" && "border-warning/40",
            unavailable && "border-dashed opacity-70",
            className
          )}
          {...props}
        >
          {index !== undefined ? (
            <span className="text-primary font-bold tabular-nums">{index}</span>
          ) : (
            <FileTextIcon aria-hidden />
          )}
          <span className="truncate">{title}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-80 p-0">
        <div className="flex flex-col gap-1 border-b p-3">
          <p className="text-sm leading-snug font-semibold">{title}</p>
          {(publisher || date) && (
            <p className="text-muted-foreground text-xs">
              {publisher}
              {publisher && date && " · "}
              {date}
            </p>
          )}
          {flag && (
            <Badge
              variant={unavailable ? "secondary" : "warning"}
              className="mt-1 w-fit gap-1 text-[10px] font-semibold"
            >
              <TriangleAlertIcon aria-hidden />
              {flag}
            </Badge>
          )}
        </div>

        {locator && (
          <p className="text-muted-foreground border-b px-3 py-2 text-xs">
            <span className="text-foreground font-semibold">Located at:</span>{" "}
            {locator}
          </p>
        )}

        {excerpt && (
          <blockquote className="text-muted-foreground border-border/70 mx-3 my-2 border-l-2 pl-3 text-xs leading-relaxed">
            {excerpt}
          </blockquote>
        )}

        {href && !unavailable && (
          <div className="p-3 pt-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="w-full"
            >
              <a href={href} target="_blank" rel="noreferrer">
                <ExternalLinkIcon />
                Open source
              </a>
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export { AiCitation }
