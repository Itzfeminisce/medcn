import type * as React from "react"

import AdherenceRingDemo from "@/registry/medcn/adherence-ring/adherence-ring.demo"
import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import AvatarDemo from "@/registry/medcn/avatar/avatar.demo"
import BadgeDemo from "@/registry/medcn/badge/badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import BloodTypeBadgeDemo from "@/registry/medcn/blood-type-badge/blood-type-badge.demo"
import BmiGaugeDemo from "@/registry/medcn/bmi-gauge/bmi-gauge.demo"
import ButtonDemo from "@/registry/medcn/button/button.demo"
import CardDemo from "@/registry/medcn/card/card.demo"
import CareTeamListDemo from "@/registry/medcn/care-team-list/care-team-list.demo"
import CheckboxDemo from "@/registry/medcn/checkbox/checkbox.demo"
import CollapsibleDemo from "@/registry/medcn/collapsible/collapsible.demo"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import DrugInteractionAlertDemo from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert.demo"
import EmergencyContactCardDemo from "@/registry/medcn/emergency-contact-card/emergency-contact-card.demo"
import FallRiskIndicatorDemo from "@/registry/medcn/fall-risk-indicator/fall-risk-indicator.demo"
import FastingStatusBannerDemo from "@/registry/medcn/fasting-status-banner/fasting-status-banner.demo"
import GlucoseBadgeDemo from "@/registry/medcn/glucose-badge/glucose-badge.demo"
import ImmunizationScheduleDemo from "@/registry/medcn/immunization-schedule/immunization-schedule.demo"
import LabOrderStatusDemo from "@/registry/medcn/lab-order-status/lab-order-status.demo"
import LabResultDemo from "@/registry/medcn/lab-result/lab-result.demo"
import LabTrendPanelDemo from "@/registry/medcn/lab-trend-panel/lab-trend-panel.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PopoverDemo from "@/registry/medcn/popover/popover.demo"
import PregnancyWeekTrackerDemo from "@/registry/medcn/pregnancy-week-tracker/pregnancy-week-tracker.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import ProgressDemo from "@/registry/medcn/progress/progress.demo"
import RefillCountdownDemo from "@/registry/medcn/refill-countdown/refill-countdown.demo"
import SeparatorDemo from "@/registry/medcn/separator/separator.demo"
import TelehealthCallCardDemo from "@/registry/medcn/telehealth-call-card/telehealth-call-card.demo"
import TooltipDemo from "@/registry/medcn/tooltip/tooltip.demo"
import TrendSparklineDemo from "@/registry/medcn/trend-sparkline/trend-sparkline.demo"
import TriageLevelIndicatorDemo from "@/registry/medcn/triage-level-indicator/triage-level-indicator.demo"
import TriageQueueRowDemo from "@/registry/medcn/triage-queue-row/triage-queue-row.demo"
import VaccinationRecordRowDemo from "@/registry/medcn/vaccination-record-row/vaccination-record-row.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"

/**
 * name → demo component. Hand-maintained for the proving slice;
 * candidate for generation once the catalog grows.
 */
export const demos: Record<string, React.ComponentType> = {
  "adherence-ring": AdherenceRingDemo,
  "allergy-badge": AllergyBadgeDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  "blood-pressure-badge": BloodPressureBadgeDemo,
  "blood-type-badge": BloodTypeBadgeDemo,
  "bmi-gauge": BmiGaugeDemo,
  button: ButtonDemo,
  card: CardDemo,
  "care-team-list": CareTeamListDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  "dose-checklist": DoseChecklistDemo,
  "drug-interaction-alert": DrugInteractionAlertDemo,
  "emergency-contact-card": EmergencyContactCardDemo,
  "fall-risk-indicator": FallRiskIndicatorDemo,
  "fasting-status-banner": FastingStatusBannerDemo,
  "glucose-badge": GlucoseBadgeDemo,
  "immunization-schedule": ImmunizationScheduleDemo,
  "lab-order-status": LabOrderStatusDemo,
  "lab-result": LabResultDemo,
  "lab-trend-panel": LabTrendPanelDemo,
  "patient-banner": PatientBannerDemo,
  popover: PopoverDemo,
  "pregnancy-week-tracker": PregnancyWeekTrackerDemo,
  "prescription-card": PrescriptionCardDemo,
  progress: ProgressDemo,
  "refill-countdown": RefillCountdownDemo,
  separator: SeparatorDemo,
  "telehealth-call-card": TelehealthCallCardDemo,
  tooltip: TooltipDemo,
  "trend-sparkline": TrendSparklineDemo,
  "triage-level-indicator": TriageLevelIndicatorDemo,
  "triage-queue-row": TriageQueueRowDemo,
  "vaccination-record-row": VaccinationRecordRowDemo,
  "vitals-card": VitalsCardDemo,
}
