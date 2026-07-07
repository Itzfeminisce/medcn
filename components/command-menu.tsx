"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { BookOpenIcon, BoxIcon, SearchIcon } from "lucide-react"

import type { NavGroup } from "@/lib/registry"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

/**
 * ⌘K palette over the same nav groups as the sidebar: Getting Started pages
 * plus every registry component. The trigger renders in the site header.
 */
export function CommandMenu({ groups }: { groups: NavGroup[] }) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="border-input bg-muted/40 text-muted-foreground hover:bg-muted/70 hidden h-8 w-52 cursor-pointer items-center gap-2 rounded-md border px-2.5 text-sm transition-colors sm:inline-flex"
      >
        <SearchIcon className="size-3.5" />
        <span className="flex-1 text-left">Search…</span>
        <kbd className="bg-background text-muted-foreground pointer-events-none rounded border px-1.5 font-mono text-[10px] font-medium">
          ⌘K
        </kbd>
      </button>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setOpen(true)}
        className="text-muted-foreground hover:text-foreground hover:bg-accent/60 inline-flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors sm:hidden"
      >
        <SearchIcon className="size-4" />
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search"
        description="Search docs and components"
      >
        <CommandInput placeholder="Search docs and components…" />
        <CommandList className="no-scrollbar">
          <CommandEmpty>No results found.</CommandEmpty>
          {groups.map((group) => (
            <CommandGroup key={group.label} heading={group.label}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  value={`${group.label} ${item.title}`}
                  onSelect={() => {
                    setOpen(false)
                    router.push(item.href)
                  }}
                >
                  {item.href.startsWith("/docs") ? (
                    <BookOpenIcon />
                  ) : (
                    <BoxIcon />
                  )}
                  {item.title}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  )
}
