"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/registry/medcn/lib/utils"

/**
 * Series metadata. `unit` is not decoration: a clinical value drawn without its
 * unit is unreadable at best and dangerous at worst, so the tooltip renders it
 * from here rather than leaving it to each caller to remember.
 */
export type ChartConfig = {
  [key: string]: {
    label?: React.ReactNode
    unit?: string
    icon?: React.ComponentType
    color?: string
  }
}

type ChartContextValue = { config: ChartConfig }

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

export interface ChartContainerProps extends Omit<
  React.ComponentProps<"figure">,
  "title"
> {
  config: ChartConfig
  /** A single Recharts element. */
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  /** Describes the chart to assistive tech. Required — an unlabelled plot is unreadable. */
  label: string
  /**
   * The plotted values as a table, for readers who get nothing from an SVG path.
   * Visually hidden by default; `showTable` reveals it. Use ChartDataTable.
   */
  dataTable?: React.ReactNode
  showTable?: boolean
  /** Caption under the chart — units, source of the reference range, or the period. */
  caption?: React.ReactNode
}

/**
 * Themed chart shell: CSS-variable colours, a config-driven tooltip and legend,
 * and an accessible tabular equivalent of the plotted data.
 *
 * It renders the series it is given. It does not resample, interpolate across
 * gaps, or smooth — a smoothed line through missing observations is a
 * measurement that was never taken.
 */
function ChartContainer({
  id,
  className,
  children,
  config,
  label,
  dataTable,
  showTable = false,
  caption,
  ...props
}: ChartContainerProps) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <figure
        data-slot="chart"
        data-chart={chartId}
        className={cn("flex w-full flex-col gap-2", className)}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />

        <div
          role="img"
          aria-label={label}
          className={cn(
            "aspect-video w-full [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-surface]:outline-hidden",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border"
          )}
        >
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>

        {caption && (
          <figcaption className="text-muted-foreground text-xs">
            {caption}
          </figcaption>
        )}

        {dataTable && (
          <div
            className={cn(
              !showTable && "sr-only",
              // When revealed, the table scrolls in its own box rather than
              // widening the figure and pushing the page sideways.
              showTable && "w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            )}
          >
            {dataTable}
          </div>
        )}
      </figure>
    </ChartContext.Provider>
  )
}

/** Per-series colours as CSS variables, so a chart inherits the product's theme. */
function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const colored = Object.entries(config).filter(([, item]) => item.color)
  if (!colored.length) return null

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}] {
${colored.map(([key, item]) => `  --color-${key}: ${item.color};`).join("\n")}
}`,
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

interface ChartTooltipContentProps
  extends
    React.ComponentProps<"div">,
    Pick<
      React.ComponentProps<typeof RechartsPrimitive.Tooltip>,
      "active" | "payload" | "label" | "labelFormatter"
    > {
  hideLabel?: boolean
  hideIndicator?: boolean
  indicator?: "dot" | "line"
  /** Overrides the config unit for every row — e.g. when a UnitToggle is active. */
  unit?: string
}

/**
 * Tooltip body. Every value carries its unit, taken from the series config
 * unless the caller overrides it.
 */
function ChartTooltipContent({
  active,
  payload,
  label,
  labelFormatter,
  className,
  hideLabel = false,
  hideIndicator = false,
  indicator = "dot",
  unit,
  ...props
}: ChartTooltipContentProps) {
  const { config } = useChart()

  if (!active || !payload?.length) return null

  return (
    <div
      data-slot="chart-tooltip"
      className={cn(
        "border-border/50 bg-background grid min-w-[9rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl",
        className
      )}
      {...props}
    >
      {!hideLabel && (
        <div className="font-medium">
          {labelFormatter ? labelFormatter(label, payload) : label}
        </div>
      )}

      <div className="grid gap-1.5">
        {payload.map((item, index) => {
          const key = `${item.dataKey ?? item.name ?? index}`
          const series = config[key]
          const seriesUnit = unit ?? series?.unit

          return (
            <div
              key={key}
              className="flex w-full items-center gap-2 [&>svg]:size-2.5"
            >
              {!hideIndicator && (
                <span
                  aria-hidden
                  className={cn(
                    "shrink-0 bg-(--color-series)",
                    indicator === "dot" && "size-2.5 rounded-[2px]",
                    indicator === "line" && "h-0.5 w-3 rounded-full"
                  )}
                  style={
                    {
                      "--color-series": item.color ?? `var(--color-${key})`,
                    } as React.CSSProperties
                  }
                />
              )}
              <span className="text-muted-foreground">
                {series?.label ?? item.name ?? key}
              </span>
              <span className="text-foreground ml-auto font-mono font-medium tabular-nums">
                {typeof item.value === "number"
                  ? item.value.toLocaleString()
                  : item.value}
                {seriesUnit && (
                  <span className="text-muted-foreground ml-0.5 font-sans font-normal">
                    {seriesUnit}
                  </span>
                )}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  payload,
  verticalAlign = "bottom",
}: React.ComponentProps<"div"> &
  Pick<
    React.ComponentProps<typeof RechartsPrimitive.Legend>,
    "payload" | "verticalAlign"
  >) {
  const { config } = useChart()

  if (!payload?.length) return null

  return (
    <div
      data-slot="chart-legend"
      className={cn(
        "flex flex-wrap items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload.map((item, index) => {
        const key = `${item.dataKey ?? index}`
        const series = config[key]

        return (
          <div
            key={key}
            className="text-muted-foreground flex items-center gap-1.5 text-xs"
          >
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-[2px]"
              style={{ background: item.color }}
            />
            {series?.label ?? key}
            {series?.unit && (
              <span className="text-muted-foreground/70">({series.unit})</span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export interface ChartDataTableProps extends React.ComponentProps<"table"> {
  caption: string
  columns: { key: string; label: React.ReactNode; unit?: string }[]
  rows: Record<string, React.ReactNode>[]
  /** Rendered where a value was not measured. Never "0", never blank. */
  missingLabel?: string
}

/**
 * The plotted values, as a table. Pass to ChartContainer's `dataTable` so a
 * screen-reader user reaches the same data the chart draws — and so a value
 * that was never measured reads as "not measured" rather than as a gap.
 */
function ChartDataTable({
  caption,
  columns,
  rows,
  missingLabel = "Not measured",
  className,
  ...props
}: ChartDataTableProps) {
  return (
    <table
      data-slot="chart-data-table"
      className={cn("w-full text-left text-xs", className)}
      {...props}
    >
      <caption className="text-muted-foreground pb-2 text-left">
        {caption}
      </caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col" className="px-2 py-1 font-medium">
              {column.label}
              {column.unit ? ` (${column.unit})` : ""}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index} className="border-border/50 border-t">
            {columns.map((column) => (
              <td key={column.key} className="px-2 py-1 tabular-nums">
                {row[column.key] ?? missingLabel}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartDataTable,
  useChart,
}
