"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "size-6 text-xs",
        default: "size-9 text-sm",
        lg: "size-12 text-base",
        xl: "size-16 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> &
  VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  )
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-accent text-accent-foreground flex size-full items-center justify-center rounded-full font-medium",
        className
      )}
      {...props}
    />
  )
}

const avatarStatusVariants = cva(
  "absolute right-0 bottom-0 block rounded-full ring-2 ring-card",
  {
    variants: {
      status: {
        online: "bg-success",
        offline: "bg-muted-foreground/50",
        busy: "bg-destructive",
        away: "bg-warning",
      },
      size: {
        sm: "size-1.5",
        default: "size-2.5",
        lg: "size-3",
        xl: "size-3.5",
      },
    },
    defaultVariants: {
      status: "online",
      size: "default",
    },
  }
)

/** Presence dot, rendered inside an `Avatar`. */
function AvatarStatus({
  className,
  status,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarStatusVariants>) {
  return (
    <span
      data-slot="avatar-status"
      data-status={status}
      className={cn(avatarStatusVariants({ status, size }), className)}
      {...props}
    />
  )
}

/** Overlapping row of avatars; give children an explicit `size` for even stacking. */
function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-card",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarStatus, AvatarGroup }
