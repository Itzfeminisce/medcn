import * as React from "react"
import {
  FileAudioIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon,
  LoaderCircleIcon,
  RotateCwIcon,
  TriangleAlertIcon,
  VideoIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Card } from "@/registry/medcn/card/card"
import { Progress } from "@/registry/medcn/progress/progress"

export type AiAttachmentKind =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "file"

/** Lifecycle of the attachment. `ready` means available for a human to read. */
export type AiAttachmentStatus =
  | "pending"
  | "uploading"
  | "analyzing"
  | "ready"
  | "error"

const KIND_ICON: Record<AiAttachmentKind, React.ElementType> = {
  image: ImageIcon,
  document: FileTextIcon,
  audio: FileAudioIcon,
  video: VideoIcon,
  file: FileIcon,
}

const STATUS_BADGE: Record<
  AiAttachmentStatus,
  {
    label: string
    variant: React.ComponentProps<typeof Badge>["variant"]
  }
> = {
  pending: { label: "Queued", variant: "outline" },
  uploading: { label: "Uploading", variant: "info" },
  analyzing: { label: "Being read", variant: "info" },
  ready: { label: "Attached", variant: "success" },
  error: { label: "Failed", variant: "destructive" },
}

const SIZE_UNITS = ["B", "KB", "MB", "GB"] as const

function formatBytes(bytes: number) {
  let value = Math.max(0, bytes)
  let unitIndex = 0

  while (value >= 1024 && unitIndex < SIZE_UNITS.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const unit = SIZE_UNITS[unitIndex] ?? "B"
  const rounded = unitIndex === 0 || value >= 10 ? Math.round(value) : value.toFixed(1)
  return `${rounded} ${unit}`
}

export interface AiAttachmentCardProps
  extends React.ComponentProps<typeof Card> {
  /** File name, shown in full on hover via the native title. */
  name: string
  kind?: AiAttachmentKind
  /** Size in bytes. Formatted for display. */
  size?: number
  status?: AiAttachmentStatus
  /** Upload or analysis progress, 0–100. Shown while uploading. */
  progress?: number
  /** Override the status badge copy. */
  statusLabel?: React.ReactNode
  /** Thumbnail slot — an <img>, a page preview, or nothing. */
  thumbnail?: React.ReactNode
  /** Non-diagnostic context, e.g. "3 pages · text extracted". */
  note?: React.ReactNode
  /** What went wrong, shown in the error state. */
  error?: React.ReactNode
  onRemove?: () => void
  onRetry?: () => void
  /** Extra caller-owned actions, e.g. "Open in viewer". */
  actions?: React.ReactNode
}

/**
 * A reviewable attachment: what the file is, how big it is, where it is in the
 * upload/analysis lifecycle, and how to remove or retry it. It deliberately has
 * no slot for a finding — an attachment card never claims what an image or a
 * document shows. `note` is for neutral processing facts only; anything a model
 * concluded belongs in a sourced answer that a clinician can review.
 */
function AiAttachmentCard({
  className,
  name,
  kind = "file",
  size,
  status = "ready",
  progress,
  statusLabel,
  thumbnail,
  note,
  error,
  onRemove,
  onRetry,
  actions,
  ...props
}: AiAttachmentCardProps) {
  const KindIcon = KIND_ICON[kind]
  const badge = STATUS_BADGE[status]
  const isWorking = status === "uploading" || status === "analyzing"

  return (
    <Card
      data-slot="ai-attachment-card"
      data-status={status}
      className={cn(
        "flex-row items-start gap-3 rounded-xl border p-3 shadow-xs",
        status === "error" && "border-destructive/50",
        className
      )}
      {...props}
    >
      <div
        data-slot="ai-attachment-card-thumbnail"
        aria-hidden={thumbnail ? undefined : true}
        className="bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border [&_img]:size-full [&_img]:object-cover"
      >
        {thumbnail ?? <KindIcon className="size-5" />}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-0.5">
            <span
              title={name}
              className="truncate text-sm font-semibold tracking-[-0.006em]"
            >
              {name}
            </span>
            <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
              <span className="uppercase">{kind}</span>
              {size !== undefined && (
                <>
                  <span aria-hidden>·</span>
                  <span className="tabular-nums">{formatBytes(size)}</span>
                </>
              )}
            </span>
          </div>

          <Badge
            variant={badge.variant}
            className="h-5 shrink-0 gap-1 text-[10px] font-semibold"
          >
            {isWorking && (
              <LoaderCircleIcon
                aria-hidden
                className="size-2.5 motion-safe:animate-spin"
              />
            )}
            {statusLabel ?? badge.label}
          </Badge>
        </div>

        {status === "uploading" && (
          <Progress
            size="sm"
            className="mt-1"
            aria-label={`Uploading ${name}`}
            value={progress ?? 0}
          />
        )}

        {note && status !== "error" && (
          <p className="text-muted-foreground text-xs leading-snug">{note}</p>
        )}

        {status === "error" && (
          <p className="text-destructive flex items-start gap-1.5 text-xs leading-snug">
            <TriangleAlertIcon aria-hidden className="mt-px size-3.5 shrink-0" />
            <span>{error ?? "This file could not be attached."}</span>
          </p>
        )}

        {(actions || (status === "error" && onRetry)) && (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {status === "error" && onRetry && (
              <Button type="button" size="sm" variant="outline" onClick={onRetry}>
                <RotateCwIcon />
                Retry
              </Button>
            )}
            {actions}
          </div>
        )}
      </div>

      {onRemove && (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          aria-label={`Remove ${name}`}
          className="text-muted-foreground hover:text-destructive -mt-0.5 -mr-0.5 shrink-0"
          onClick={onRemove}
        >
          <XIcon />
        </Button>
      )}
    </Card>
  )
}

export { AiAttachmentCard }
