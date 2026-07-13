"use client"

import * as React from "react"
import {
  CloudUploadIcon,
  FileTextIcon,
  LoaderCircleIcon,
  MicIcon,
  PauseIcon,
  PlayIcon,
  ShieldCheckIcon,
  SquareIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react"
import { cva } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"
import { Button } from "@/registry/medcn/button/button"
import { Progress } from "@/registry/medcn/progress/progress"

/** Where the recording is in its lifecycle. The caller owns every transition. */
export type AiVoiceInputState =
  | "idle"
  | "recording"
  | "paused"
  | "transcribing"
  | "ready"
  | "error"

/**
 * Where the audio physically is right now. Not a default: the caller must say,
 * because only the caller knows whether its transcription runs on-device.
 */
export type AiVoiceInputHandling = "local" | "uploading" | "transcript"

const aiVoiceInputVariants = cva(
  "bg-card flex flex-col gap-3 rounded-xl border p-3 shadow-xs transition-colors",
  {
    variants: {
      state: {
        idle: "",
        recording: "border-destructive/50",
        paused: "border-warning/50",
        transcribing: "",
        ready: "border-success/50",
        error: "border-destructive/60",
      },
    },
    defaultVariants: {
      state: "idle",
    },
  }
)

const HANDLING_NOTICE: Record<
  AiVoiceInputHandling,
  { icon: React.ElementType; text: string; className: string }
> = {
  local: {
    icon: ShieldCheckIcon,
    text: "Audio stays on this device. Nothing has left it yet.",
    className: "text-muted-foreground",
  },
  uploading: {
    icon: CloudUploadIcon,
    text: "Audio is being uploaded for transcription.",
    className: "text-warning-foreground dark:text-warning",
  },
  transcript: {
    icon: FileTextIcon,
    text: "Audio has become text. The transcript below is what enters the conversation.",
    className: "text-muted-foreground",
  },
}

const STATE_LABEL: Record<AiVoiceInputState, string> = {
  idle: "Ready to record",
  recording: "Recording",
  paused: "Paused",
  transcribing: "Transcribing",
  ready: "Transcript ready for review",
  error: "Recording failed",
}

function formatDuration(seconds: number) {
  const safe = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(safe / 60)
  const rest = safe % 60
  return `${minutes}:${String(rest).padStart(2, "0")}`
}

export interface AiVoiceInputProps
  extends Omit<React.ComponentProps<"div">, "onChange"> {
  /** Controlled state. Every transition is the caller's to make. */
  state?: AiVoiceInputState
  /**
   * Where the audio is right now — local, uploading, or already transcript.
   * Required: this is the disclosure the clinician needs before they speak.
   */
  handling: AiVoiceInputHandling
  /** Override the handling notice copy (e.g. name the transcription vendor). */
  handlingLabel?: React.ReactNode
  /** Elapsed recording time, in seconds. Caller-owned clock. */
  duration?: number
  /** Cap on the recording, in seconds. Drives the progress bar when set. */
  maxDuration?: number
  /** Press-and-hold to record, or click to toggle. */
  mode?: "toggle" | "hold"
  /** The transcript, shown for review in the `ready` state. */
  transcript?: React.ReactNode
  /** What went wrong, shown in the `error` state. */
  error?: React.ReactNode
  disabled?: boolean
  onStart?: () => void
  onStop?: () => void
  onPause?: () => void
  onResume?: () => void
  /** Discards the audio and any transcript. Always offered once either exists. */
  onDiscard?: () => void
  /** Retry after an error. */
  onRetry?: () => void
  /** Accept the reviewed transcript into the composer. */
  onInsert?: () => void
  insertLabel?: string
}

/**
 * Recording control for a clinical assistant. It records nothing: microphone
 * permission, capture, and transcription are all the caller's, and this
 * component renders the state machine and the one fact that matters while a
 * clinician is dictating — whether the audio is still local, in flight, or has
 * already become text.
 */
function AiVoiceInput({
  className,
  state = "idle",
  handling,
  handlingLabel,
  duration = 0,
  maxDuration,
  mode = "toggle",
  transcript,
  error,
  disabled = false,
  onStart,
  onStop,
  onPause,
  onResume,
  onDiscard,
  onRetry,
  onInsert,
  insertLabel = "Insert transcript",
  ...props
}: AiVoiceInputProps) {
  const isRecording = state === "recording"
  const isPaused = state === "paused"
  const isBusy = state === "transcribing"
  const hasAudio = isRecording || isPaused || isBusy || state === "ready"
  const notice = HANDLING_NOTICE[handling]
  const NoticeIcon = notice.icon

  const holdHandlers =
    mode === "hold" && !disabled
      ? {
          onPointerDown: (event: React.PointerEvent<HTMLButtonElement>) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            if (state === "idle" || state === "error") onStart?.()
          },
          onPointerUp: () => {
            if (state === "recording") onStop?.()
          },
          onPointerCancel: () => {
            if (state === "recording") onStop?.()
          },
          onKeyDown: (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key !== " " && event.key !== "Enter") return
            if (event.repeat) return
            event.preventDefault()
            if (state === "idle" || state === "error") onStart?.()
          },
          onKeyUp: (event: React.KeyboardEvent<HTMLButtonElement>) => {
            if (event.key !== " " && event.key !== "Enter") return
            event.preventDefault()
            if (state === "recording") onStop?.()
          },
        }
      : {}

  const handleToggle = () => {
    if (mode === "hold") return
    if (state === "recording") onStop?.()
    else if (state === "paused") onStop?.()
    else if (state === "idle" || state === "error") onStart?.()
  }

  const primaryLabel =
    mode === "hold"
      ? isRecording
        ? "Release to stop recording"
        : "Hold to record"
      : isRecording || isPaused
        ? "Stop recording"
        : "Start recording"

  return (
    <div
      data-slot="ai-voice-input"
      data-state={state}
      className={cn(aiVoiceInputVariants({ state }), className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="icon"
          variant={isRecording ? "destructive" : "outline"}
          disabled={disabled || isBusy}
          aria-label={primaryLabel}
          aria-pressed={mode === "toggle" ? isRecording || isPaused : undefined}
          onClick={handleToggle}
          {...holdHandlers}
        >
          {isBusy ? (
            <LoaderCircleIcon className="motion-safe:animate-spin" />
          ) : isRecording || isPaused ? (
            <SquareIcon className="fill-current" />
          ) : (
            <MicIcon />
          )}
        </Button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span
              role="status"
              aria-live="polite"
              className="flex min-w-0 items-center gap-1.5 text-sm font-semibold"
            >
              {isRecording && (
                <span
                  aria-hidden
                  className="bg-destructive size-2 shrink-0 rounded-full motion-safe:animate-pulse"
                />
              )}
              <span className="truncate">{STATE_LABEL[state]}</span>
            </span>

            {hasAudio && (
              <span className="text-muted-foreground shrink-0 text-xs tabular-nums">
                {formatDuration(duration)}
                {maxDuration ? ` / ${formatDuration(maxDuration)}` : null}
              </span>
            )}
          </div>

          {(isRecording || isPaused || isBusy) && (
            <Progress
              size="sm"
              aria-label={isBusy ? "Transcribing" : "Recording progress"}
              value={
                isBusy
                  ? 100
                  : maxDuration
                    ? Math.min(100, (duration / maxDuration) * 100)
                    : 100
              }
              variant={isBusy ? "default" : isPaused ? "warning" : "destructive"}
              className={cn(isBusy && "motion-safe:animate-pulse")}
            />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {isRecording && mode === "toggle" && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Pause recording"
              onClick={onPause}
            >
              <PauseIcon />
            </Button>
          )}
          {isPaused && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Resume recording"
              onClick={onResume}
            >
              <PlayIcon />
            </Button>
          )}
          {(hasAudio || state === "error") && onDiscard && (
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="text-muted-foreground hover:text-destructive"
              aria-label="Discard recording"
              onClick={onDiscard}
            >
              <Trash2Icon />
            </Button>
          )}
        </div>
      </div>

      <p
        data-slot="ai-voice-input-handling"
        className={cn(
          "flex items-start gap-1.5 text-xs leading-snug",
          notice.className
        )}
      >
        <NoticeIcon aria-hidden className="mt-px size-3.5 shrink-0" />
        <span>{handlingLabel ?? notice.text}</span>
      </p>

      {state === "ready" && transcript && (
        <div
          data-slot="ai-voice-input-transcript"
          className="bg-muted/40 rounded-lg border p-2.5 text-sm leading-relaxed"
        >
          {transcript}
        </div>
      )}

      {state === "error" && (
        <p className="text-destructive flex items-start gap-1.5 text-xs leading-snug">
          <TriangleAlertIcon aria-hidden className="mt-px size-3.5 shrink-0" />
          <span>{error ?? "The recording could not be captured."}</span>
        </p>
      )}

      {(state === "ready" || state === "error") && (
        <div className="flex flex-wrap gap-2">
          {state === "ready" && onInsert && (
            <Button type="button" size="sm" onClick={onInsert}>
              {insertLabel}
            </Button>
          )}
          {state === "error" && onRetry && (
            <Button type="button" size="sm" variant="outline" onClick={onRetry}>
              Try again
            </Button>
          )}
          {onDiscard && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-muted-foreground"
              onClick={onDiscard}
            >
              Discard
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export { AiVoiceInput, aiVoiceInputVariants }
