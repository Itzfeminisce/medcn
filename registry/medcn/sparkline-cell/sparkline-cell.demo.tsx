import { SparklineCell } from "@/registry/medcn/sparkline-cell/sparkline-cell"

const ROWS = [
  {
    label: "Heart rate",
    value: 124,
    unit: "bpm",
    data: [78, 84, 92, 98, 108, 116, 124],
    thresholdMax: 100,
    color: "destructive" as const,
  },
  {
    label: "SpO₂",
    value: 89,
    unit: "%",
    data: [97, 96, 95, 94, 92, 90, 89],
    thresholdMin: 94,
    color: "warning" as const,
  },
  {
    label: "Weight",
    value: 83.9,
    unit: "kg",
    data: [78.2, 79.6, 81.1, 82.4, 83.9],
  },
]

export default function SparklineCellDemo() {
  return (
    <table className="w-full max-w-sm text-sm">
      <caption className="text-muted-foreground pb-2 text-left text-xs">
        The value is the reading. The glyph is a second encoding of it, and is
        hidden from assistive tech.
      </caption>
      <tbody>
        {ROWS.map((row) => (
          <tr key={row.label} className="border-border/60 border-t">
            <th scope="row" className="py-2 text-left font-medium">
              {row.label}
            </th>
            <td className="py-2">
              <SparklineCell
                align="end"
                value={row.value}
                unit={row.unit}
                data={row.data}
                thresholdMin={row.thresholdMin}
                thresholdMax={row.thresholdMax}
                color={row.color}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
