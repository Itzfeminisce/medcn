"use client"

import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import { PatientBanner } from "@/registry/medcn/patient-banner/patient-banner"
import { SectionHeader } from "@/registry/medcn/section-header/section-header"
import { VitalsCard } from "@/registry/medcn/vitals-card/vitals-card"
import { ProblemListItem } from "@/registry/medcn/problem-list-item/problem-list-item"
import { PrescriptionCard } from "@/registry/medcn/prescription-card/prescription-card"

type WithId<T> = T & { id?: string }

export interface PatientSummaryPanelProps
  extends Omit<React.ComponentProps<"div">, "title"> {
  patient: React.ComponentProps<typeof PatientBanner>
  vitals?: WithId<React.ComponentProps<typeof VitalsCard>>[]
  problems?: WithId<React.ComponentProps<typeof ProblemListItem>>[]
  medications?: WithId<React.ComponentProps<typeof PrescriptionCard>>[]
}

function Section({
  title,
  action,
  children,
}: {
  title: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 px-4 py-4 sm:px-5">
      <SectionHeader as="h3" title={title} action={action} className="gap-0" />
      {children}
    </section>
  )
}

/**
 * The at-a-glance patient snapshot — a flush PatientBanner over condensed
 * vitals, problems, and medications sections. Composes PatientBanner +
 * VitalsCard + ProblemListItem + PrescriptionCard (allergies ride in the
 * banner). The dense first-read; the full chart is the B-1 block.
 */
function PatientSummaryPanel({
  patient,
  vitals,
  problems,
  medications,
  className,
  ...props
}: PatientSummaryPanelProps) {
  return (
    <div
      data-slot="patient-summary-panel"
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft",
        className
      )}
      {...props}
    >
      <PatientBanner
        {...patient}
        className={cn(
          "rounded-none border-0 border-b border-border/60 shadow-none",
          patient.className
        )}
      />

      <div className="divide-y divide-border/60">
        {vitals && vitals.length > 0 && (
          <Section title="Vitals">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {vitals.map(({ id, ...v }, i) => (
                <VitalsCard key={id ?? i} {...v} className="w-full" />
              ))}
            </div>
          </Section>
        )}

        {problems && problems.length > 0 && (
          <Section title="Problems">
            <div className="flex flex-col gap-2">
              {problems.map(({ id, ...p }, i) => (
                <ProblemListItem key={id ?? i} {...p} />
              ))}
            </div>
          </Section>
        )}

        {medications && medications.length > 0 && (
          <Section title="Medications">
            <div className="flex flex-col gap-3">
              {medications.map(({ id, ...m }, i) => (
                <PrescriptionCard key={id ?? i} {...m} className="w-full" />
              ))}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

export { PatientSummaryPanel }
