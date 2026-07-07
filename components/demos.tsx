import type * as React from "react"

import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import AvatarDemo from "@/registry/medcn/avatar/avatar.demo"
import BadgeDemo from "@/registry/medcn/badge/badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import ButtonDemo from "@/registry/medcn/button/button.demo"
import CardDemo from "@/registry/medcn/card/card.demo"
import CheckboxDemo from "@/registry/medcn/checkbox/checkbox.demo"
import CollapsibleDemo from "@/registry/medcn/collapsible/collapsible.demo"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import DrugInteractionAlertDemo from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert.demo"
import EmergencyContactCardDemo from "@/registry/medcn/emergency-contact-card/emergency-contact-card.demo"
import LabResultDemo from "@/registry/medcn/lab-result/lab-result.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PopoverDemo from "@/registry/medcn/popover/popover.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import ProgressDemo from "@/registry/medcn/progress/progress.demo"
import SeparatorDemo from "@/registry/medcn/separator/separator.demo"
import TooltipDemo from "@/registry/medcn/tooltip/tooltip.demo"
import TrendSparklineDemo from "@/registry/medcn/trend-sparkline/trend-sparkline.demo"
import TriageLevelIndicatorDemo from "@/registry/medcn/triage-level-indicator/triage-level-indicator.demo"
import VaccinationRecordRowDemo from "@/registry/medcn/vaccination-record-row/vaccination-record-row.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"

/**
 * name → demo component. Hand-maintained for the proving slice;
 * candidate for generation once the catalog grows.
 */
export const demos: Record<string, React.ComponentType> = {
  "allergy-badge": AllergyBadgeDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  "blood-pressure-badge": BloodPressureBadgeDemo,
  button: ButtonDemo,
  card: CardDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  "dose-checklist": DoseChecklistDemo,
  "drug-interaction-alert": DrugInteractionAlertDemo,
  "emergency-contact-card": EmergencyContactCardDemo,
  "lab-result": LabResultDemo,
  "patient-banner": PatientBannerDemo,
  popover: PopoverDemo,
  "prescription-card": PrescriptionCardDemo,
  progress: ProgressDemo,
  separator: SeparatorDemo,
  tooltip: TooltipDemo,
  "trend-sparkline": TrendSparklineDemo,
  "triage-level-indicator": TriageLevelIndicatorDemo,
  "vaccination-record-row": VaccinationRecordRowDemo,
  "vitals-card": VitalsCardDemo,
}
