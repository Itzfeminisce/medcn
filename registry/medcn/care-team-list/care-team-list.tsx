import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarStatus,
} from "@/registry/medcn/avatar/avatar"
import { Badge } from "@/registry/medcn/badge/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/medcn/popover/popover"

export type CareTeamStatus = "online" | "busy" | "away" | "offline"

const statusLabel: Record<CareTeamStatus, string> = {
  online: "Available",
  busy: "Busy",
  away: "Away",
  offline: "Off duty",
}

export interface CareTeamMember {
  name: string
  /** Load-bearing text label, e.g. "Attending", "Named nurse". */
  role: string
  specialty?: string
  status?: CareTeamStatus
  avatarSrc?: string
  /** Contact action, e.g. a Button/link. */
  contact?: React.ReactNode
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function MemberDetail({ member }: { member: CareTeamMember }) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-start gap-3">
        <Avatar size="lg" className="ring-border shrink-0 ring-1">
          {member.avatarSrc && <AvatarImage src={member.avatarSrc} alt="" />}
          <AvatarFallback className="font-semibold">
            {getInitials(member.name)}
          </AvatarFallback>
          {member.status && (
            <AvatarStatus status={member.status} size="lg" />
          )}
        </Avatar>
        <div className="flex min-w-0 flex-col gap-1">
          <span className="text-sm font-semibold leading-tight">
            {member.name}
          </span>
          <Badge variant="soft" className="w-fit">
            {member.role}
          </Badge>
          {member.specialty && (
            <span className="text-muted-foreground text-xs">
              {member.specialty}
            </span>
          )}
          {member.status && (
            <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  member.status === "online" && "bg-success",
                  member.status === "busy" && "bg-destructive",
                  member.status === "away" && "bg-warning",
                  member.status === "offline" && "bg-muted-foreground/50"
                )}
                aria-hidden
              />
              {statusLabel[member.status]}
            </span>
          )}
        </div>
      </div>
      {member.contact && <div>{member.contact}</div>}
    </div>
  )
}

export interface CareTeamListProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  members: CareTeamMember[]
  /** Avatars shown before collapsing the rest into a +N overflow. Default 5. */
  max?: number
}

/**
 * Overlapping avatar group of the care team; each avatar opens a popover with
 * the member's role, specialty, availability, and a contact action. Role
 * labels are always text ("attending" vs "resident" vs "named nurse" are
 * load-bearing), never conveyed by avatar alone.
 */
function CareTeamList({
  members,
  max = 5,
  className,
  ...props
}: CareTeamListProps) {
  const visible = members.slice(0, max)
  const overflow = members.slice(max)

  return (
    <div data-slot="care-team-list" className={cn("flex", className)} {...props}>
      <AvatarGroup>
        {visible.map((member, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <button
                className="focus-visible:ring-ring relative rounded-full transition-transform hover:z-10 hover:-translate-y-0.5 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2"
                aria-label={`${member.name}, ${member.role}${
                  member.status ? `, ${statusLabel[member.status]}` : ""
                }`}
              >
                <Avatar className="ring-card ring-2">
                  {member.avatarSrc && (
                    <AvatarImage src={member.avatarSrc} alt="" />
                  )}
                  <AvatarFallback className="text-xs font-semibold">
                    {getInitials(member.name)}
                  </AvatarFallback>
                  {member.status && <AvatarStatus status={member.status} />}
                </Avatar>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <MemberDetail member={member} />
            </PopoverContent>
          </Popover>
        ))}

        {overflow.length > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="focus-visible:ring-ring ring-card bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground relative flex size-9 items-center justify-center rounded-full text-xs font-semibold ring-2 transition-colors focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2"
                aria-label={`Show ${overflow.length} more team ${
                  overflow.length === 1 ? "member" : "members"
                }`}
              >
                +{overflow.length}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <p className="text-muted-foreground mb-3 text-[10px] font-semibold uppercase tracking-wide">
                {overflow.length} more{" "}
                {overflow.length === 1 ? "member" : "members"}
              </p>
              <div className="flex flex-col gap-4">
                {overflow.map((member, i) => (
                  <MemberDetail key={i} member={member} />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </AvatarGroup>
    </div>
  )
}

export { CareTeamList }
