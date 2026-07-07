import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarStatus,
} from "@/registry/medcn/avatar/avatar"

export default function AvatarDemo() {
  return (
    <div className="flex items-center gap-6">
      <Avatar>
        <AvatarFallback>AO</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>DR</AvatarFallback>
        <AvatarStatus status="online" size="lg" />
      </Avatar>
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>JK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>MN</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>+3</AvatarFallback>
        </Avatar>
      </AvatarGroup>
    </div>
  )
}
