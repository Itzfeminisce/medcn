"use client"

import * as React from "react"

import {
  AiVoiceInput,
  type AiVoiceInputHandling,
  type AiVoiceInputState,
} from "@/registry/medcn/ai-voice-input/ai-voice-input"

const TRANSCRIPT =
  "Review of Mr Okonkwo, day three post-op. Wound clean and dry, no erythema. Afebrile overnight. Continue oral co-amoxiclav, plan discharge tomorrow if bloods are stable."

export default function AiVoiceInputDemo() {
  const [state, setState] = React.useState<AiVoiceInputState>("idle")
  const [duration, setDuration] = React.useState(0)

  // Stands in for the caller's recorder: a clock while recording, then a short
  // transcription round-trip. A real integration owns permission and the STT.
  React.useEffect(() => {
    if (state !== "recording") return
    const timer = window.setInterval(
      () => setDuration((value) => value + 1),
      1000
    )
    return () => window.clearInterval(timer)
  }, [state])

  React.useEffect(() => {
    if (state !== "transcribing") return
    const timer = window.setTimeout(() => setState("ready"), 2200)
    return () => window.clearTimeout(timer)
  }, [state])

  const handling: AiVoiceInputHandling =
    state === "transcribing"
      ? "uploading"
      : state === "ready"
        ? "transcript"
        : "local"

  const reset = () => {
    setState("idle")
    setDuration(0)
  }

  return (
    <AiVoiceInput
      className="w-full max-w-md"
      state={state}
      handling={handling}
      handlingLabel={
        handling === "uploading"
          ? "Audio is being uploaded to the transcription service under the trust's BAA."
          : undefined
      }
      duration={duration}
      maxDuration={120}
      transcript={TRANSCRIPT}
      onStart={() => {
        setDuration(0)
        setState("recording")
      }}
      onPause={() => setState("paused")}
      onResume={() => setState("recording")}
      onStop={() => setState("transcribing")}
      onDiscard={reset}
      onRetry={() => setState("recording")}
      onInsert={reset}
      insertLabel="Insert into prompt"
    />
  )
}
