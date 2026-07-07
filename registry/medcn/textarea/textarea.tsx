import * as React from "react"

import { cn } from "@/registry/medcn/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-lg border bg-card px-3.5 py-2.5 text-base shadow-xs transition-[color,box-shadow,border-color] duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-ring/50 focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
