import { CopyButton } from "@/components/copy-button"

/** The one way a shell command appears anywhere on the site. */
export function CommandPill({ command }: { command: string }) {
  return (
    <div className="border-border/60 bg-card flex items-center gap-3 rounded-lg border px-4 py-2.5 font-mono text-[13px]">
      <span className="text-primary select-none">$</span>
      <span className="text-muted-foreground no-scrollbar flex-1 overflow-x-auto whitespace-nowrap">
        {command}
      </span>
      <CopyButton value={command} />
    </div>
  )
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
      {children}
    </code>
  )
}
