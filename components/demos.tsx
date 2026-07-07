import type * as React from "react"

import BadgeDemo from "@/registry/medcn/badge/badge.demo"
import ButtonDemo from "@/registry/medcn/button/button.demo"
import CardDemo from "@/registry/medcn/card/card.demo"
import CheckboxDemo from "@/registry/medcn/checkbox/checkbox.demo"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import ProgressDemo from "@/registry/medcn/progress/progress.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"

/**
 * name → demo component. Hand-maintained for the proving slice;
 * candidate for generation once the catalog grows.
 */
export const demos: Record<string, React.ComponentType> = {
  badge: BadgeDemo,
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  "dose-checklist": DoseChecklistDemo,
  progress: ProgressDemo,
  "vitals-card": VitalsCardDemo,
}
