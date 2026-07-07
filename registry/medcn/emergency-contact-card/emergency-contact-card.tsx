import * as React from "react"
import { PencilIcon, PhoneCallIcon } from "lucide-react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/medcn/avatar/avatar"
import { Button } from "@/registry/medcn/button/button"
import { Card } from "@/registry/medcn/card/card"

function formatPhoneForHref(phone: string): string {
  // Keep leading + and digits only for a clean tel: target.
  return phone.replace(/[^\d+]/g, "")
}

function getInitials(name: React.ReactNode): string {
  if (typeof name !== "string") return "?"
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export interface EmergencyContactCardProps
  extends Omit<React.ComponentProps<typeof Card>, "children"> {
  name: React.ReactNode
  relationship?: React.ReactNode
  /** Displayed formatted; the tel: href uses raw digits only. */
  phone: string
  isPrimary?: boolean
  avatarSrc?: string
  onEdit?: () => void
  /** Extra context line, e.g. "Also emergency contact for billing". */
  note?: React.ReactNode
}

/**
 * Emergency contact with a prominent one-tap call affordance. Primary contacts
 * carry a live priority ping and a destructive-toned call button; the phone
 * icon animates on hover (reduced-motion safe).
 */
function EmergencyContactCard({
  name,
  relationship,
  phone,
  isPrimary = false,
  avatarSrc,
  onEdit,
  note,
  className,
  ...props
}: EmergencyContactCardProps) {
  const callLabel = [
    "Call",
    typeof name === "string" ? name : undefined,
    typeof relationship === "string" ? relationship : undefined,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <Card
      data-slot="emergency-contact-card"
      data-primary={isPrimary ? "true" : undefined}
      className={cn(
        "group/ec relative w-full max-w-xs gap-4 overflow-hidden px-5 py-4",
        isPrimary &&
          "border-destructive/30 bg-gradient-to-b from-destructive/8 to-card",
        className
      )}
      {...props}
    >
      {isPrimary && (
        <span
          aria-hidden
          className="bg-destructive absolute inset-x-0 top-0 h-0.5"
        />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="relative shrink-0">
            <Avatar
              className={cn(
                "size-11 ring-2 ring-offset-2 ring-offset-card",
                isPrimary ? "ring-destructive/30" : "ring-border"
              )}
            >
              {avatarSrc && <AvatarImage src={avatarSrc} alt="" />}
              <AvatarFallback
                className={cn(
                  isPrimary && "bg-destructive/12 text-destructive font-semibold"
                )}
              >
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            {isPrimary && (
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 flex size-3"
              >
                <span className="bg-destructive/50 motion-safe:animate-ping absolute inline-flex size-full rounded-full opacity-75" />
                <span className="bg-destructive ring-card relative inline-flex size-3 rounded-full ring-2" />
              </span>
            )}
          </span>

          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="flex items-center gap-1.5">
              <span className="truncate text-sm font-semibold">{name}</span>
            </span>
            <span className="flex items-center gap-1.5">
              {isPrimary && (
                <span className="text-destructive text-[10px] font-bold uppercase tracking-wide">
                  Primary
                </span>
              )}
              {relationship && (
                <span
                  data-slot="emergency-contact-card-relationship"
                  className="text-muted-foreground text-xs"
                >
                  {isPrimary && relationship && (
                    <span className="text-muted-foreground/40 mr-1.5">·</span>
                  )}
                  {relationship}
                </span>
              )}
            </span>
          </div>
        </div>

        {onEdit && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onEdit}
            aria-label="Edit contact"
            className="text-muted-foreground shrink-0"
          >
            <PencilIcon className="size-3.5" />
          </Button>
        )}
      </div>

      {note && (
        <p
          data-slot="emergency-contact-card-note"
          className="text-muted-foreground -mt-1 text-xs leading-relaxed"
        >
          {note}
        </p>
      )}

      <Button
        data-slot="emergency-contact-card-call"
        asChild
        size="lg"
        variant={isPrimary ? "destructive" : "outline"}
        className="w-full justify-center gap-2.5 text-sm"
      >
        <a href={`tel:${formatPhoneForHref(phone)}`} aria-label={callLabel}>
          <PhoneCallIcon
            className="size-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover/ec:-rotate-12"
            aria-hidden
          />
          <span className="tabular-nums">{phone}</span>
        </a>
      </Button>
    </Card>
  )
}

export { EmergencyContactCard }
