import * as React from "react"
import { FileText, Lock, PenLine } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/registry/medcn/card/card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/medcn/tooltip/tooltip"

export type NoteStatus = "signed" | "draft" | "addendum"

const statusConfig: Record<
  NoteStatus,
  { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }
> = {
  signed: { label: "Signed", variant: "success" },
  draft: { label: "Draft", variant: "warning" },
  addendum: { label: "Addendum", variant: "info" },
}

function initials(name?: string) {
  if (!name) return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface ClinicalNoteCardProps
  extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** Note type, e.g. "Progress note (SOAP)". */
  noteType?: React.ReactNode
  author?: { name: string; role?: React.ReactNode; avatarSrc?: string }
  time?: React.ReactNode
  status?: NoteStatus
  /** When signed, a signature line disclosed via a Tooltip on the lock. */
  signedBy?: React.ReactNode
  /** Clamp the body to N lines. */
  clamp?: number
  /** Footer actions. */
  actions?: React.ReactNode
}

/**
 * A clinical note (SOAP / progress / consult) as a card: author avatar, note
 * type, timestamp, a status badge, and a lock affordance whose Tooltip carries
 * the signature. Draft notes are visually distinct so unsigned documentation
 * is never mistaken for the record.
 */
function ClinicalNoteCard({
  className,
  noteType = "Progress note",
  author,
  time,
  status = "signed",
  signedBy,
  clamp,
  actions,
  children,
  ...props
}: ClinicalNoteCardProps) {
  const cfg = statusConfig[status]
  const StatusIcon = status === "draft" ? PenLine : Lock

  return (
    <Card
      data-slot="clinical-note-card"
      data-status={status}
      className={cn(
        "gap-0 py-0 transition-shadow duration-200 hover:shadow-lift",
        status === "draft" && "border-dashed",
        className
      )}
      {...props}
    >
      <CardHeader className="flex-wrap items-center gap-y-2 border-b py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-8 shrink-0 ring-1 ring-border">
            {author?.avatarSrc && <AvatarImage src={author.avatarSrc} alt="" />}
            <AvatarFallback className="text-[10px] font-semibold">
              {initials(author?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="flex size-5 items-center justify-center rounded-md bg-muted text-muted-foreground [&_svg]:size-3">
                <FileText aria-hidden />
              </span>
              <span className="truncate text-sm font-semibold">{noteType}</span>
            </div>
            <span className="truncate text-xs text-muted-foreground">
              {author?.name}
              {author?.role ? ` · ${author.role}` : ""}
              {time ? (
                <>
                  {" · "}
                  <span className="tabular-nums">{time}</span>
                </>
              ) : null}
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Badge variant={cfg.variant} className="shrink-0">
            {cfg.label}
          </Badge>
          {(signedBy || status !== "signed") && (
            <Tooltip>
              <TooltipTrigger
                aria-label={status === "draft" ? "Unsigned draft" : "Signature"}
                className="rounded-full p-0.5 text-muted-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40"
              >
                <StatusIcon className="size-3.5" />
              </TooltipTrigger>
              <TooltipContent>
                {status === "draft"
                  ? "Unsigned — not part of the legal record"
                  : (signedBy ?? "Electronically signed")}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-3">
        <div
          className={cn(
            "text-sm leading-relaxed text-foreground/90",
            clamp && "overflow-hidden"
          )}
          style={
            clamp
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: clamp,
                  WebkitBoxOrient: "vertical",
                }
              : undefined
          }
        >
          {children}
        </div>
      </CardContent>

      {actions && (
        <CardFooter className="gap-2 border-t py-3">{actions}</CardFooter>
      )}
    </Card>
  )
}

export { ClinicalNoteCard }
