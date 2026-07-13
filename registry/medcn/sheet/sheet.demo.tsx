"use client"

import { Button } from "@/registry/medcn/button/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/registry/medcn/sheet/sheet"

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open encounter notes</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Encounter notes</SheetTitle>
          <SheetDescription>
            Follow-up visit &middot; 12 Mar 2026 &middot; Dr. Adeyemi
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-5 text-sm leading-relaxed">
          <p className="text-muted-foreground">
            Patient reports improved exercise tolerance since the dose change.
            No orthopnoea, no ankle swelling. BP 128/78, HR 72 regular.
          </p>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
