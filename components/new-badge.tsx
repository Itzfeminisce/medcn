import { cn } from "@/lib/utils"

/**
 * Marks a recently shipped registry item in the docs nav and index. It is a
 * docs-site affordance, not a registry component — nothing about it ships to a
 * consumer's project. The badge expires on its own: see NEW_WINDOW_DAYS.
 */
export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "bg-primary/10 text-primary ring-primary/20 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 ring-inset",
        className
      )}
    >
      New
    </span>
  )
}
