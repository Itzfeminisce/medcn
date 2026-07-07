"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/registry/medcn/lib/utils"

const sliderRangeVariants = cva(
  "absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary",
        success: "bg-success",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface SliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root>,
    VariantProps<typeof sliderRangeVariants> {
  /** Render a dot at each `step` interval ("stepper slider"). */
  showMarks?: boolean
  /** Optional labels keyed by value, shown under their mark. */
  markLabels?: Record<number, React.ReactNode>
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step = 1,
  showMarks = false,
  markLabels,
  variant,
  ...props
}: SliderProps) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  const marks = React.useMemo(() => {
    if (!showMarks || !step || step <= 0) return []
    const out: number[] = []
    for (let v = min; v <= max; v += step) out.push(v)
    return out
  }, [showMarks, min, max, step])

  return (
    <div className={cn("w-full", showMarks && markLabels && "pb-5")}>
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        step={step}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            "bg-primary/15 relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(sliderRangeVariants({ variant }))}
          />
        </SliderPrimitive.Track>
        {marks.map((mark) => {
          const pct = ((mark - min) / (max - min)) * 100
          const active = _values.length > 0 && mark <= Math.max(..._values)
          return (
            <span
              key={mark}
              aria-hidden
              data-slot="slider-mark"
              className={cn(
                "pointer-events-none absolute top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full",
                active ? "bg-primary-foreground/70" : "bg-muted-foreground/40"
              )}
              style={{ left: `${pct}%` }}
            >
              {markLabels?.[mark] != null && (
                <span className="text-muted-foreground absolute top-3.5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap">
                  {markLabels[mark]}
                </span>
              )}
            </span>
          )
        })}
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="border-primary bg-card ring-ring/40 block size-5 shrink-0 cursor-grab rounded-full border-2 shadow-soft transition-[box-shadow,transform] duration-150 hover:scale-110 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  )
}

export { Slider, sliderRangeVariants }
