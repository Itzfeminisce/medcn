import { SITE_NAME, addByNamespaceCommand } from "@/lib/env"
import { OG_CONTENT_TYPE, OG_SIZE, renderOg } from "@/lib/og"

export const alt = `${SITE_NAME} — shadcn for health & medical UI`
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default function OpengraphImage() {
  return renderOg({
    kicker: "shadcn for health",
    title: "Copy-paste health UI.",
    subtitle:
      "Accessible React components for vitals, medication, scheduling & triage. Install with the shadcn CLI.",
    footer: addByNamespaceCommand("vitals-card"),
  })
}
