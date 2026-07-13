import { AiTypingIndicator } from "@/registry/medcn/ai-typing-indicator/ai-typing-indicator"
import { Avatar, AvatarFallback } from "@/registry/medcn/avatar/avatar"

export default function AiTypingIndicatorDemo() {
  return (
    <div className="flex w-full max-w-md items-end gap-2.5">
      <Avatar size="sm">
        <AvatarFallback className="text-[10px] font-semibold">AI</AvatarFallback>
      </Avatar>
      <AiTypingIndicator />
    </div>
  )
}
