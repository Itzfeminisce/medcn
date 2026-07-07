import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  AllergyList,
  type AllergyBadgeProps,
} from "@/registry/medcn/allergy-badge/allergy-badge"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"

const sexLabel = {
  female: "Female",
  male: "Male",
  other: "Other",
  unspecified: "Unspecified",
} as const

export interface PatientBannerProps
  extends Omit<React.ComponentProps<"header">, "children"> {
  name: React.ReactNode
  avatarSrc?: string
  /** Either dob or age; if dob given, derive and show both ("34y · 12 Mar 1992"). */
  dob?: Date | string
  age?: number
  sex?: keyof typeof sexLabel
  /** Medical record number / patient ID. */
  mrn?: React.ReactNode
  /** Renders an AllergyList inline when provided. */
  allergies?: AllergyBadgeProps[]
  /** e.g. pregnancy status, insurance plan. */
  tags?: React.ReactNode
  /** Right-aligned slot. */
  actions?: React.ReactNode
  variant?: "default" | "compact"
}

function toDate(d: Date | string): Date {
  return typeof d === "string" ? new Date(d) : d
}

function deriveAge(dob: Date): number {
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const beforeBirthday =
    now.getMonth() < dob.getMonth() ||
    (now.getMonth() === dob.getMonth() && now.getDate() < dob.getDate())
  if (beforeBirthday) age -= 1
  return age
}

function formatDob(d: Date): string {
  return d.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function initials(name: React.ReactNode): string {
  if (typeof name !== "string") return "?"
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

/** Compact patient-context header for the top of clinical/provider screens. */
function PatientBanner({
  name,
  avatarSrc,
  dob,
  age,
  sex,
  mrn,
  allergies,
  tags,
  actions,
  variant = "default",
  className,
  ...props
}: PatientBannerProps) {
  const birthDate = dob !== undefined ? toDate(dob) : undefined
  const resolvedAge = birthDate ? deriveAge(birthDate) : age
  const compact = variant === "compact"

  const demographics = [
    resolvedAge !== undefined &&
      (birthDate ? `${resolvedAge}y · ${formatDob(birthDate)}` : `${resolvedAge}y`),
    sex && sexLabel[sex],
  ].filter(Boolean) as string[]

  return (
    <header
      data-slot="patient-banner"
      data-variant={variant}
      aria-label="Patient information"
      className={cn(
        "bg-card flex w-full items-center gap-3 rounded-xl border border-border/60 shadow-soft",
        compact ? "px-3 py-2" : "flex-wrap px-5 py-4",
        className
      )}
      {...props}
    >
      <Avatar size={compact ? "sm" : "lg"}>
        {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
        <AvatarFallback>{initials(name)}</AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "flex min-w-0 flex-1",
          compact ? "items-baseline gap-x-2.5 truncate" : "flex-col gap-1.5"
        )}
      >
        <div
          className={cn(
            "flex min-w-0 items-baseline gap-x-2.5 gap-y-0.5",
            !compact && "flex-wrap"
          )}
        >
          <span
            data-slot="patient-banner-name"
            className={cn("truncate font-semibold", compact ? "text-sm" : "text-base")}
          >
            {name}
          </span>
          <span
            data-slot="patient-banner-demographics"
            className="text-muted-foreground flex shrink-0 items-baseline gap-2.5 text-xs"
          >
            {demographics.map((part, i) => (
              <span key={i} className="tabular-nums">
                {part}
              </span>
            ))}
            {mrn && (
              <span data-slot="patient-banner-mrn" className="font-mono">
                MRN <span className="text-foreground/80">{mrn}</span>
              </span>
            )}
          </span>
        </div>

        {!compact && (allergies || tags) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {allergies && <AllergyList allergies={allergies} max={3} />}
            {tags}
          </div>
        )}
      </div>

      {compact && allergies && (
        <AllergyList
          allergies={allergies}
          max={1}
          className="hidden shrink-0 sm:flex"
        />
      )}

      {actions && (
        <div
          data-slot="patient-banner-actions"
          className="flex shrink-0 items-center gap-2"
        >
          {actions}
        </div>
      )}
    </header>
  )
}

export { PatientBanner }
