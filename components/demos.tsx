import type * as React from "react"

import AdherenceRingDemo from "@/registry/medcn/adherence-ring/adherence-ring.demo"
import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import AllergyInputFieldDemo from "@/registry/medcn/allergy-input-field/allergy-input-field.demo"
import AppointmentCheckInDemo from "@/registry/medcn/appointment-check-in/appointment-check-in.demo"
import AvatarDemo from "@/registry/medcn/avatar/avatar.demo"
import BadgeDemo from "@/registry/medcn/badge/badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import BloodPressureInputDemo from "@/registry/medcn/blood-pressure-input/blood-pressure-input.demo"
import BloodTypeBadgeDemo from "@/registry/medcn/blood-type-badge/blood-type-badge.demo"
import BmiGaugeDemo from "@/registry/medcn/bmi-gauge/bmi-gauge.demo"
import ButtonDemo from "@/registry/medcn/button/button.demo"
import CardDemo from "@/registry/medcn/card/card.demo"
import CareTeamListDemo from "@/registry/medcn/care-team-list/care-team-list.demo"
import CheckboxDemo from "@/registry/medcn/checkbox/checkbox.demo"
import CollapsibleDemo from "@/registry/medcn/collapsible/collapsible.demo"
import DateFieldDemo from "@/registry/medcn/date-field/date-field.demo"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import DrugInteractionAlertDemo from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert.demo"
import EcgStripDemo from "@/registry/medcn/ecg-strip/ecg-strip.demo"
import EmergencyContactCardDemo from "@/registry/medcn/emergency-contact-card/emergency-contact-card.demo"
import EmergencyContactFieldDemo from "@/registry/medcn/emergency-contact-field/emergency-contact-field.demo"
import FallRiskIndicatorDemo from "@/registry/medcn/fall-risk-indicator/fall-risk-indicator.demo"
import FastingStatusBannerDemo from "@/registry/medcn/fasting-status-banner/fasting-status-banner.demo"
import FieldDemo from "@/registry/medcn/field/field.demo"
import GcsScoreInputDemo from "@/registry/medcn/gcs-score-input/gcs-score-input.demo"
import GlucoseBadgeDemo from "@/registry/medcn/glucose-badge/glucose-badge.demo"
import GlucoseLogInputDemo from "@/registry/medcn/glucose-log-input/glucose-log-input.demo"
import HeightWeightFieldDemo from "@/registry/medcn/height-weight-field/height-weight-field.demo"
import ImmunizationScheduleDemo from "@/registry/medcn/immunization-schedule/immunization-schedule.demo"
import InputDemo from "@/registry/medcn/input/input.demo"
import LabOrderStatusDemo from "@/registry/medcn/lab-order-status/lab-order-status.demo"
import LabResultDemo from "@/registry/medcn/lab-result/lab-result.demo"
import LabTrendPanelDemo from "@/registry/medcn/lab-trend-panel/lab-trend-panel.demo"
import LabelDemo from "@/registry/medcn/label/label.demo"
import MedicationTimingStripDemo from "@/registry/medcn/medication-timing-strip/medication-timing-strip.demo"
import PainScaleDemo from "@/registry/medcn/pain-scale/pain-scale.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PopoverDemo from "@/registry/medcn/popover/popover.demo"
import PregnancyWeekTrackerDemo from "@/registry/medcn/pregnancy-week-tracker/pregnancy-week-tracker.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import ProgressDemo from "@/registry/medcn/progress/progress.demo"
import RadioGroupDemo from "@/registry/medcn/radio-group/radio-group.demo"
import RefillCountdownDemo from "@/registry/medcn/refill-countdown/refill-countdown.demo"
import RouteOfAdministrationFieldDemo from "@/registry/medcn/route-of-administration-field/route-of-administration-field.demo"
import SelectDemo from "@/registry/medcn/select/select.demo"
import SeparatorDemo from "@/registry/medcn/separator/separator.demo"
import SliderDemo from "@/registry/medcn/slider/slider.demo"
import Spo2DialDemo from "@/registry/medcn/spo2-dial/spo2-dial.demo"
import SwitchDemo from "@/registry/medcn/switch/switch.demo"
import TelehealthCallCardDemo from "@/registry/medcn/telehealth-call-card/telehealth-call-card.demo"
import TemperatureFieldDemo from "@/registry/medcn/temperature-field/temperature-field.demo"
import TextareaDemo from "@/registry/medcn/textarea/textarea.demo"
import ToggleGroupDemo from "@/registry/medcn/toggle-group/toggle-group.demo"
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
  "allergy-input-field": AllergyInputFieldDemo,
  "appointment-check-in": AppointmentCheckInDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  "blood-pressure-badge": BloodPressureBadgeDemo,
  "blood-pressure-input": BloodPressureInputDemo,
  "blood-type-badge": BloodTypeBadgeDemo,
  "bmi-gauge": BmiGaugeDemo,
  button: ButtonDemo,
  card: CardDemo,
  "care-team-list": CareTeamListDemo,
  checkbox: CheckboxDemo,
  collapsible: CollapsibleDemo,
  "date-field": DateFieldDemo,
  "dose-checklist": DoseChecklistDemo,
  "drug-interaction-alert": DrugInteractionAlertDemo,
  "ecg-strip": EcgStripDemo,
  "emergency-contact-card": EmergencyContactCardDemo,
  "emergency-contact-field": EmergencyContactFieldDemo,
  "fall-risk-indicator": FallRiskIndicatorDemo,
  "fasting-status-banner": FastingStatusBannerDemo,
  field: FieldDemo,
  "gcs-score-input": GcsScoreInputDemo,
  "glucose-badge": GlucoseBadgeDemo,
  "glucose-log-input": GlucoseLogInputDemo,
  "height-weight-field": HeightWeightFieldDemo,
  "immunization-schedule": ImmunizationScheduleDemo,
  input: InputDemo,
  "lab-order-status": LabOrderStatusDemo,
  "lab-result": LabResultDemo,
  "lab-trend-panel": LabTrendPanelDemo,
  label: LabelDemo,
  "medication-timing-strip": MedicationTimingStripDemo,
  "pain-scale": PainScaleDemo,
  "patient-banner": PatientBannerDemo,
  popover: PopoverDemo,
  "pregnancy-week-tracker": PregnancyWeekTrackerDemo,
  "prescription-card": PrescriptionCardDemo,
  progress: ProgressDemo,
  "radio-group": RadioGroupDemo,
  "refill-countdown": RefillCountdownDemo,
  "route-of-administration-field": RouteOfAdministrationFieldDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  slider: SliderDemo,
  "spo2-dial": Spo2DialDemo,
  switch: SwitchDemo,
  "telehealth-call-card": TelehealthCallCardDemo,
  "temperature-field": TemperatureFieldDemo,
  textarea: TextareaDemo,
  "toggle-group": ToggleGroupDemo,
  tooltip: TooltipDemo,
  "trend-sparkline": TrendSparklineDemo,
  "triage-level-indicator": TriageLevelIndicatorDemo,
  "triage-queue-row": TriageQueueRowDemo,
  "vaccination-record-row": VaccinationRecordRowDemo,
  "vitals-card": VitalsCardDemo,
}
