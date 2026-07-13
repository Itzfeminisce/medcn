"use client"

import * as React from "react"
import { ClipboardCheckIcon, LockIcon, TriangleAlertIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import { AiAnswerCard } from "@/registry/medcn/ai-answer-card/ai-answer-card"
import { Badge } from "@/registry/medcn/badge/badge"
import { Button } from "@/registry/medcn/button/button"
import { Checkbox } from "@/registry/medcn/checkbox/checkbox"
import { Label } from "@/registry/medcn/label/label"

/** One structured field of the proposed order. Caller-supplied verbatim. */
export interface AiOrderField {
  label: React.ReactNode
  value: React.ReactNode
  /** Draw the eye — a field the reviewer is most likely to need to change. */
  emphasis?: boolean
}

export interface AiOrderSuggestionProps
  extends Omit<
    React.ComponentProps<typeof AiAnswerCard>,
    "title" | "children" | "onSubmit"
  > {
  title?: React.ReactNode
  /** The proposed order in one line, e.g. "Ibuprofen 400 mg oral, TDS, 5 days". */
  orderLabel: React.ReactNode
  /** What kind of order this would be, e.g. "Medication order". */
  orderType?: React.ReactNode
  /** Structured fields of the proposal — dose, route, frequency, duration. */
  fields: AiOrderField[]
  /** Why the order was proposed. Caller-supplied. */
  rationale?: React.ReactNode
  /** Constraints and cautions the reviewer must satisfy before signing. */
  constraints?: React.ReactNode[]
  acknowledgementLabel?: React.ReactNode
  /** Controlled acknowledgement. Omit for internal state. */
  acknowledged?: boolean
  onAcknowledgedChange?: (acknowledged: boolean) => void
  submitLabel?: React.ReactNode
  /**
   * Caller-provided signing/submission handler. Without it the submit control
   * stays disabled: the component cannot place an order on its own.
   */
  onSubmit?: () => void
  /**
   * Additional caller gate — authorisation, local protocol checks, an open
   * encounter. Submit requires acknowledgement AND this.
   */
  canSubmit?: boolean
  /** Secondary actions: edit, discard, send to a prescriber. */
  actions?: React.ReactNode
  children?: React.ReactNode
}

/**
 * Review card for a caller-supplied *proposed* order. It is a form of words,
 * not an order: it renders the structured fields, the rationale, and the
 * constraints, and it keeps submission locked behind an explicit human
 * acknowledgement plus a caller-provided signing handler. It never writes to a
 * record, never checks a local protocol, and has no authorisation model of its
 * own — consumers must wire those in.
 */
function AiOrderSuggestion({
  className,
  title = "Proposed order — awaiting review",
  orderLabel,
  orderType = "Proposed order",
  fields,
  rationale,
  constraints,
  acknowledgementLabel,
  acknowledged,
  onAcknowledgedChange,
  submitLabel = "Sign and submit",
  onSubmit,
  canSubmit = true,
  actions,
  limitations,
  children,
  ...props
}: AiOrderSuggestionProps) {
  const reactId = React.useId()
  const [internal, setInternal] = React.useState(false)
  const isControlled = acknowledged !== undefined
  const checked = isControlled ? acknowledged : internal

  const handleChange = (next: boolean) => {
    if (!isControlled) setInternal(next)
    onAcknowledgedChange?.(next)
  }

  const submittable = checked && canSubmit && Boolean(onSubmit)

  return (
    <AiAnswerCard
      data-slot="ai-order-suggestion"
      className={cn(className)}
      title={title}
      generatedLabel="Not submitted"
      limitations={
        limitations ?? (
          <>
            This is a suggestion for a prescriber to accept, amend, or reject —
            it is not an order and nothing has been placed. Dose, route,
            indication, allergies, interactions, weight, and renal and hepatic
            function are not checked here, and local protocol has not been
            applied. Submission runs whatever authorised workflow the host
            application connects.
          </>
        )
      }
      actions={
        <>
          <Button
            type="button"
            size="sm"
            disabled={!submittable}
            onClick={onSubmit}
            data-slot="ai-order-suggestion-submit"
          >
            {submittable ? (
              <ClipboardCheckIcon aria-hidden />
            ) : (
              <LockIcon aria-hidden />
            )}
            {submitLabel}
          </Button>
          {actions}
        </>
      }
      {...props}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="h-5 font-normal">
              {orderType}
            </Badge>
            <Badge
              variant="warning"
              className="h-5 px-1.5 text-[10px] font-bold uppercase"
            >
              Not submitted
            </Badge>
          </div>
          <p className="text-base leading-snug font-semibold">{orderLabel}</p>
        </div>

        <dl
          data-slot="ai-order-suggestion-fields"
          className="grid grid-cols-[minmax(0,8rem)_1fr] gap-x-4 gap-y-1.5 rounded-md border px-3 py-2.5"
        >
          {fields.map((field, index) => (
            <React.Fragment key={index}>
              <dt className="text-muted-foreground truncate text-xs">
                {field.label}
              </dt>
              <dd
                className={cn(
                  "min-w-0 text-xs",
                  field.emphasis ? "text-warning font-semibold" : "font-medium"
                )}
              >
                {field.value}
              </dd>
            </React.Fragment>
          ))}
        </dl>

        {rationale && (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold">Rationale given</p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {rationale}
            </p>
          </div>
        )}

        {constraints && constraints.length > 0 && (
          <div
            data-slot="ai-order-suggestion-constraints"
            className="flex flex-col gap-1.5"
          >
            <p className="text-xs font-semibold">Check before signing</p>
            <ul className="flex list-none flex-col gap-1">
              {constraints.map((constraint, index) => (
                <li
                  key={index}
                  className="text-muted-foreground flex gap-1.5 text-xs leading-relaxed"
                >
                  <TriangleAlertIcon
                    className="text-warning mt-0.5 size-3 shrink-0"
                    aria-hidden
                  />
                  <span className="min-w-0">{constraint}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {children}

        <div
          data-slot="ai-order-suggestion-acknowledgement"
          className="bg-muted/40 flex items-start gap-2.5 rounded-md border px-3 py-2.5"
        >
          <Checkbox
            id={`${reactId}-ack`}
            checked={checked}
            onCheckedChange={(value) => handleChange(value === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor={`${reactId}-ack`}
            className="text-muted-foreground text-xs leading-relaxed font-normal"
          >
            {acknowledgementLabel ?? (
              <>
                I have reviewed this proposal against the patient record and my
                local protocol, and I take clinical responsibility for it. The
                suggestion has not been checked for safety on my behalf.
              </>
            )}
          </Label>
        </div>

        {!onSubmit && (
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            No submission handler is connected, so this card cannot place an
            order. Wire <code>onSubmit</code> to an authorised ordering
            workflow.
          </p>
        )}
      </div>
    </AiAnswerCard>
  )
}

export { AiOrderSuggestion }
