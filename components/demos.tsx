import type * as React from "react"

import AiAnswerCardDemo from "@/registry/medcn/ai-answer-card/ai-answer-card.demo"
import AiAssistantButtonDemo from "@/registry/medcn/ai-assistant-button/ai-assistant-button.demo"
import AiAssistantSheetDemo from "@/registry/medcn/ai-assistant-sheet/ai-assistant-sheet.demo"
import AiAttachmentCardDemo from "@/registry/medcn/ai-attachment-card/ai-attachment-card.demo"
import AiAttachmentPickerDemo from "@/registry/medcn/ai-attachment-picker/ai-attachment-picker.demo"
import AiChatDemo from "@/registry/medcn/ai-chat/ai-chat.demo"
import AiChatHeaderDemo from "@/registry/medcn/ai-chat-header/ai-chat-header.demo"
import AiChatMessagesDemo from "@/registry/medcn/ai-chat-messages/ai-chat-messages.demo"
import AiCitationDemo from "@/registry/medcn/ai-citation/ai-citation.demo"
import AiClinicalDisclaimerDemo from "@/registry/medcn/ai-clinical-disclaimer/ai-clinical-disclaimer.demo"
import AiConsentNoticeDemo from "@/registry/medcn/ai-consent-notice/ai-consent-notice.demo"
import AiContextBarDemo from "@/registry/medcn/ai-context-bar/ai-context-bar.demo"
import AiContextChipDemo from "@/registry/medcn/ai-context-chip/ai-context-chip.demo"
import AiContextPickerDemo from "@/registry/medcn/ai-context-picker/ai-context-picker.demo"
import AiDifferentialListDemo from "@/registry/medcn/ai-differential-list/ai-differential-list.demo"
import AiEscalationAlertDemo from "@/registry/medcn/ai-escalation-alert/ai-escalation-alert.demo"
import AiEmptyStateDemo from "@/registry/medcn/ai-empty-state/ai-empty-state.demo"
import AiErrorStateDemo from "@/registry/medcn/ai-error-state/ai-error-state.demo"
import AiEvidencePanelDemo from "@/registry/medcn/ai-evidence-panel/ai-evidence-panel.demo"
import AiMedicationCheckDemo from "@/registry/medcn/ai-medication-check/ai-medication-check.demo"
import AiMessageDemo from "@/registry/medcn/ai-message/ai-message.demo"
import AiMessageActionsDemo from "@/registry/medcn/ai-message-actions/ai-message-actions.demo"
import AiNoteDraftDemo from "@/registry/medcn/ai-note-draft/ai-note-draft.demo"
import AiOrderSuggestionDemo from "@/registry/medcn/ai-order-suggestion/ai-order-suggestion.demo"
import AiPatientContextCardDemo from "@/registry/medcn/ai-patient-context-card/ai-patient-context-card.demo"
import AiPrivacyNoticeDemo from "@/registry/medcn/ai-privacy-notice/ai-privacy-notice.demo"
import AiPromptChipDemo from "@/registry/medcn/ai-prompt-chip/ai-prompt-chip.demo"
import AiPromptInputDemo from "@/registry/medcn/ai-prompt-input/ai-prompt-input.demo"
import AiStreamingTextDemo from "@/registry/medcn/ai-streaming-text/ai-streaming-text.demo"
import AiSuggestionCardDemo from "@/registry/medcn/ai-suggestion-card/ai-suggestion-card.demo"
import AiSuggestionListDemo from "@/registry/medcn/ai-suggestion-list/ai-suggestion-list.demo"
import AiSummaryDemo from "@/registry/medcn/ai-summary/ai-summary.demo"
import AiThinkingDemo from "@/registry/medcn/ai-thinking/ai-thinking.demo"
import AiTypingIndicatorDemo from "@/registry/medcn/ai-typing-indicator/ai-typing-indicator.demo"
import AiVoiceInputDemo from "@/registry/medcn/ai-voice-input/ai-voice-input.demo"
import ClinicalAiAssistantDemo from "@/registry/medcn/clinical-ai-assistant/clinical-ai-assistant.demo"
import SheetDemo from "@/registry/medcn/sheet/sheet.demo"

// M4 clinical data & trends
import BloodPressureChartDemo from "@/registry/medcn/blood-pressure-chart/blood-pressure-chart.demo"
import ChartDemo from "@/registry/medcn/chart/chart.demo"
import ChartInsufficientDataDemo from "@/registry/medcn/chart-insufficient-data/chart-insufficient-data.demo"
import DataFreshnessStampDemo from "@/registry/medcn/data-freshness-stamp/data-freshness-stamp.demo"
import EarlyWarningScoreDemo from "@/registry/medcn/early-warning-score/early-warning-score.demo"
import GlucoseTrendChartDemo from "@/registry/medcn/glucose-trend-chart/glucose-trend-chart.demo"
import GrowthChartDemo from "@/registry/medcn/growth-chart/growth-chart.demo"
import IntakeOutputChartDemo from "@/registry/medcn/intake-output-chart/intake-output-chart.demo"
import LabDeltaIndicatorDemo from "@/registry/medcn/lab-delta-indicator/lab-delta-indicator.demo"
import LabPanelTableDemo from "@/registry/medcn/lab-panel-table/lab-panel-table.demo"
import LabResultChartDemo from "@/registry/medcn/lab-result-chart/lab-result-chart.demo"
import LabsReviewBlockDemo from "@/registry/medcn/labs-review-block/labs-review-block.demo"
import MedicationTimelineDemo from "@/registry/medcn/medication-timeline/medication-timeline.demo"
import ObservationTimelineDemo from "@/registry/medcn/observation-timeline/observation-timeline.demo"
import PainTrendChartDemo from "@/registry/medcn/pain-trend-chart/pain-trend-chart.demo"
import PatientMonitoringBlockDemo from "@/registry/medcn/patient-monitoring-block/patient-monitoring-block.demo"
import ReferenceRangeBandDemo from "@/registry/medcn/reference-range-band/reference-range-band.demo"
import SparklineCellDemo from "@/registry/medcn/sparkline-cell/sparkline-cell.demo"
import TemperatureCurveDemo from "@/registry/medcn/temperature-curve/temperature-curve.demo"
import TimeInRangeBarDemo from "@/registry/medcn/time-in-range-bar/time-in-range-bar.demo"
import UnitToggleDemo from "@/registry/medcn/unit-toggle/unit-toggle.demo"
import VitalsFlowsheetDemo from "@/registry/medcn/vitals-flowsheet/vitals-flowsheet.demo"
import VitalsTrendChartDemo from "@/registry/medcn/vitals-trend-chart/vitals-trend-chart.demo"
import WeightTrendChartDemo from "@/registry/medcn/weight-trend-chart/weight-trend-chart.demo"

import AdherenceRingDemo from "@/registry/medcn/adherence-ring/adherence-ring.demo"
import AlertDemo from "@/registry/medcn/alert/alert.demo"
import AllergyBadgeDemo from "@/registry/medcn/allergy-badge/allergy-badge.demo"
import AllergyInputFieldDemo from "@/registry/medcn/allergy-input-field/allergy-input-field.demo"
import AppointmentCheckInDemo from "@/registry/medcn/appointment-check-in/appointment-check-in.demo"
import AppointmentRowDemo from "@/registry/medcn/appointment-row/appointment-row.demo"
import AvatarDemo from "@/registry/medcn/avatar/avatar.demo"
import BadgeDemo from "@/registry/medcn/badge/badge.demo"
import BloodPressureBadgeDemo from "@/registry/medcn/blood-pressure-badge/blood-pressure-badge.demo"
import BloodPressureInputDemo from "@/registry/medcn/blood-pressure-input/blood-pressure-input.demo"
import BloodTypeBadgeDemo from "@/registry/medcn/blood-type-badge/blood-type-badge.demo"
import BmiGaugeDemo from "@/registry/medcn/bmi-gauge/bmi-gauge.demo"
import BodyMapSelectorDemo from "@/registry/medcn/body-map-selector/body-map-selector.demo"
import ButtonDemo from "@/registry/medcn/button/button.demo"
import CardDemo from "@/registry/medcn/card/card.demo"
import CareGapItemDemo from "@/registry/medcn/care-gap-item/care-gap-item.demo"
import CareTeamListDemo from "@/registry/medcn/care-team-list/care-team-list.demo"
import CheckboxDemo from "@/registry/medcn/checkbox/checkbox.demo"
import ClinicalAlertItemDemo from "@/registry/medcn/clinical-alert-item/clinical-alert-item.demo"
import ClinicalNoteCardDemo from "@/registry/medcn/clinical-note-card/clinical-note-card.demo"
import ClinicalTaskRowDemo from "@/registry/medcn/clinical-task-row/clinical-task-row.demo"
import CollapsibleDemo from "@/registry/medcn/collapsible/collapsible.demo"
import ConsentChecklistDemo from "@/registry/medcn/consent-checklist/consent-checklist.demo"
import DashboardGridDemo from "@/registry/medcn/dashboard-grid/dashboard-grid.demo"
import DashboardShellDemo from "@/registry/medcn/dashboard-shell/dashboard-shell.demo"
import DateFieldDemo from "@/registry/medcn/date-field/date-field.demo"
import DateOfBirthFieldDemo from "@/registry/medcn/date-of-birth-field/date-of-birth-field.demo"
import DosageBuilderDemo from "@/registry/medcn/dosage-builder/dosage-builder.demo"
import DoseChecklistDemo from "@/registry/medcn/dose-checklist/dose-checklist.demo"
import DrugInteractionAlertDemo from "@/registry/medcn/drug-interaction-alert/drug-interaction-alert.demo"
import EcgStripDemo from "@/registry/medcn/ecg-strip/ecg-strip.demo"
import EmergencyContactCardDemo from "@/registry/medcn/emergency-contact-card/emergency-contact-card.demo"
import EmergencyContactFieldDemo from "@/registry/medcn/emergency-contact-field/emergency-contact-field.demo"
import EmptyStateDemo from "@/registry/medcn/empty-state/empty-state.demo"
import EncounterItemDemo from "@/registry/medcn/encounter-item/encounter-item.demo"
import FallRiskIndicatorDemo from "@/registry/medcn/fall-risk-indicator/fall-risk-indicator.demo"
import FastingStatusBannerDemo from "@/registry/medcn/fasting-status-banner/fasting-status-banner.demo"
import FieldDemo from "@/registry/medcn/field/field.demo"
import FrequencyScheduleFieldDemo from "@/registry/medcn/frequency-schedule-field/frequency-schedule-field.demo"
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
import MedicationSearchFieldDemo from "@/registry/medcn/medication-search-field/medication-search-field.demo"
import MedicationTimingStripDemo from "@/registry/medcn/medication-timing-strip/medication-timing-strip.demo"
import MessageInboxRowDemo from "@/registry/medcn/message-inbox-row/message-inbox-row.demo"
import PainScaleDemo from "@/registry/medcn/pain-scale/pain-scale.demo"
import PatientBannerDemo from "@/registry/medcn/patient-banner/patient-banner.demo"
import PopoverDemo from "@/registry/medcn/popover/popover.demo"
import PregnancyWeekTrackerDemo from "@/registry/medcn/pregnancy-week-tracker/pregnancy-week-tracker.demo"
import PrescriptionCardDemo from "@/registry/medcn/prescription-card/prescription-card.demo"
import ProblemListItemDemo from "@/registry/medcn/problem-list-item/problem-list-item.demo"
import ProgressDemo from "@/registry/medcn/progress/progress.demo"
import QuestionnaireScaleDemo from "@/registry/medcn/questionnaire-scale/questionnaire-scale.demo"
import RadioGroupDemo from "@/registry/medcn/radio-group/radio-group.demo"
import RefillCountdownDemo from "@/registry/medcn/refill-countdown/refill-countdown.demo"
import ReviewOfSystemsFormDemo from "@/registry/medcn/review-of-systems-form/review-of-systems-form.demo"
import RiskScoreGaugeDemo from "@/registry/medcn/risk-score-gauge/risk-score-gauge.demo"
import RouteOfAdministrationFieldDemo from "@/registry/medcn/route-of-administration-field/route-of-administration-field.demo"
import SectionHeaderDemo from "@/registry/medcn/section-header/section-header.demo"
import SelectDemo from "@/registry/medcn/select/select.demo"
import SeparatorDemo from "@/registry/medcn/separator/separator.demo"
import SignaturePadDemo from "@/registry/medcn/signature-pad/signature-pad.demo"
import SliderDemo from "@/registry/medcn/slider/slider.demo"
import SmokingStatusFieldDemo from "@/registry/medcn/smoking-status-field/smoking-status-field.demo"
import Spo2DialDemo from "@/registry/medcn/spo2-dial/spo2-dial.demo"
import StatTileDemo from "@/registry/medcn/stat-tile/stat-tile.demo"
import SwitchDemo from "@/registry/medcn/switch/switch.demo"
import SymptomMultiSelectDemo from "@/registry/medcn/symptom-multi-select/symptom-multi-select.demo"
import TelehealthCallCardDemo from "@/registry/medcn/telehealth-call-card/telehealth-call-card.demo"
import TemperatureFieldDemo from "@/registry/medcn/temperature-field/temperature-field.demo"
import TextareaDemo from "@/registry/medcn/textarea/textarea.demo"
import TimelineDemo from "@/registry/medcn/timeline/timeline.demo"
import ToggleGroupDemo from "@/registry/medcn/toggle-group/toggle-group.demo"
import TooltipDemo from "@/registry/medcn/tooltip/tooltip.demo"
import TrendSparklineDemo from "@/registry/medcn/trend-sparkline/trend-sparkline.demo"
import TriageLevelIndicatorDemo from "@/registry/medcn/triage-level-indicator/triage-level-indicator.demo"
import TriageQueueRowDemo from "@/registry/medcn/triage-queue-row/triage-queue-row.demo"
import VaccinationRecordRowDemo from "@/registry/medcn/vaccination-record-row/vaccination-record-row.demo"
import VitalsCardDemo from "@/registry/medcn/vitals-card/vitals-card.demo"
import VitalsEntryFormDemo from "@/registry/medcn/vitals-entry-form/vitals-entry-form.demo"
import WeightBasedDoseFieldDemo from "@/registry/medcn/weight-based-dose-field/weight-based-dose-field.demo"
import WidgetPanelDemo from "@/registry/medcn/widget-panel/widget-panel.demo"
// M2 dashboard panels
import AllergyPanelDemo from "@/registry/medcn/allergy-panel/allergy-panel.demo"
import AppointmentsPanelDemo from "@/registry/medcn/appointments-panel/appointments-panel.demo"
import CareGapsPanelDemo from "@/registry/medcn/care-gaps-panel/care-gaps-panel.demo"
import CareTeamPanelDemo from "@/registry/medcn/care-team-panel/care-team-panel.demo"
import ClinicalAlertsFeedDemo from "@/registry/medcn/clinical-alerts-feed/clinical-alerts-feed.demo"
import EncounterTimelinePanelDemo from "@/registry/medcn/encounter-timeline-panel/encounter-timeline-panel.demo"
import ImmunizationPanelDemo from "@/registry/medcn/immunization-panel/immunization-panel.demo"
import LabResultsPanelDemo from "@/registry/medcn/lab-results-panel/lab-results-panel.demo"
import MedicationListPanelDemo from "@/registry/medcn/medication-list-panel/medication-list-panel.demo"
import MessagesInboxPanelDemo from "@/registry/medcn/messages-inbox-panel/messages-inbox-panel.demo"
import PatientRosterTableDemo from "@/registry/medcn/patient-roster-table/patient-roster-table.demo"
import PatientSummaryPanelDemo from "@/registry/medcn/patient-summary-panel/patient-summary-panel.demo"
import ProblemListPanelDemo from "@/registry/medcn/problem-list-panel/problem-list-panel.demo"
import RiskScoresPanelDemo from "@/registry/medcn/risk-scores-panel/risk-scores-panel.demo"
import TaskWorklistPanelDemo from "@/registry/medcn/task-worklist-panel/task-worklist-panel.demo"
import VitalsOverviewPanelDemo from "@/registry/medcn/vitals-overview-panel/vitals-overview-panel.demo"
// M3 dashboard blocks
import ConsumerHealthBlockDemo from "@/registry/medcn/consumer-health-block/consumer-health-block.demo"
import MedicationManagementBlockDemo from "@/registry/medcn/medication-management-block/medication-management-block.demo"
import PatientChartBlockDemo from "@/registry/medcn/patient-chart-block/patient-chart-block.demo"
import ProviderDashboardBlockDemo from "@/registry/medcn/provider-dashboard-block/provider-dashboard-block.demo"
import TelehealthConsoleBlockDemo from "@/registry/medcn/telehealth-console-block/telehealth-console-block.demo"
import TriageBoardBlockDemo from "@/registry/medcn/triage-board-block/triage-board-block.demo"

/**
 * name → demo component. Hand-maintained for the proving slice;
 * candidate for generation once the catalog grows.
 */
export const demos: Record<string, React.ComponentType> = {
  "ai-answer-card": AiAnswerCardDemo,
  "ai-assistant-button": AiAssistantButtonDemo,
  "ai-assistant-sheet": AiAssistantSheetDemo,
  "ai-attachment-card": AiAttachmentCardDemo,
  "ai-attachment-picker": AiAttachmentPickerDemo,
  "ai-chat": AiChatDemo,
  "ai-chat-header": AiChatHeaderDemo,
  "ai-chat-messages": AiChatMessagesDemo,
  "ai-citation": AiCitationDemo,
  "ai-clinical-disclaimer": AiClinicalDisclaimerDemo,
  "ai-consent-notice": AiConsentNoticeDemo,
  "ai-context-bar": AiContextBarDemo,
  "ai-context-chip": AiContextChipDemo,
  "ai-context-picker": AiContextPickerDemo,
  "ai-differential-list": AiDifferentialListDemo,
  "ai-escalation-alert": AiEscalationAlertDemo,
  "ai-empty-state": AiEmptyStateDemo,
  "ai-error-state": AiErrorStateDemo,
  "ai-evidence-panel": AiEvidencePanelDemo,
  "ai-medication-check": AiMedicationCheckDemo,
  "ai-message": AiMessageDemo,
  "ai-message-actions": AiMessageActionsDemo,
  "ai-note-draft": AiNoteDraftDemo,
  "ai-order-suggestion": AiOrderSuggestionDemo,
  "ai-patient-context-card": AiPatientContextCardDemo,
  "ai-privacy-notice": AiPrivacyNoticeDemo,
  "ai-prompt-chip": AiPromptChipDemo,
  "ai-prompt-input": AiPromptInputDemo,
  "ai-streaming-text": AiStreamingTextDemo,
  "ai-suggestion-card": AiSuggestionCardDemo,
  "ai-suggestion-list": AiSuggestionListDemo,
  "ai-summary": AiSummaryDemo,
  "ai-thinking": AiThinkingDemo,
  "ai-typing-indicator": AiTypingIndicatorDemo,
  "ai-voice-input": AiVoiceInputDemo,
  "clinical-ai-assistant": ClinicalAiAssistantDemo,
  sheet: SheetDemo,
  "allergy-panel": AllergyPanelDemo,
  "appointments-panel": AppointmentsPanelDemo,
  "care-gaps-panel": CareGapsPanelDemo,
  "care-team-panel": CareTeamPanelDemo,
  "clinical-alerts-feed": ClinicalAlertsFeedDemo,
  "encounter-timeline-panel": EncounterTimelinePanelDemo,
  "immunization-panel": ImmunizationPanelDemo,
  "lab-results-panel": LabResultsPanelDemo,
  "medication-list-panel": MedicationListPanelDemo,
  "messages-inbox-panel": MessagesInboxPanelDemo,
  "patient-roster-table": PatientRosterTableDemo,
  "patient-summary-panel": PatientSummaryPanelDemo,
  "problem-list-panel": ProblemListPanelDemo,
  "risk-scores-panel": RiskScoresPanelDemo,
  "task-worklist-panel": TaskWorklistPanelDemo,
  "vitals-overview-panel": VitalsOverviewPanelDemo,
  "consumer-health-block": ConsumerHealthBlockDemo,
  "medication-management-block": MedicationManagementBlockDemo,
  "patient-chart-block": PatientChartBlockDemo,
  "provider-dashboard-block": ProviderDashboardBlockDemo,
  "telehealth-console-block": TelehealthConsoleBlockDemo,
  "triage-board-block": TriageBoardBlockDemo,
  chart: ChartDemo,
  "chart-insufficient-data": ChartInsufficientDataDemo,
  "data-freshness-stamp": DataFreshnessStampDemo,
  "reference-range-band": ReferenceRangeBandDemo,
  "unit-toggle": UnitToggleDemo,
  "vitals-trend-chart": VitalsTrendChartDemo,
  "blood-pressure-chart": BloodPressureChartDemo,
  "glucose-trend-chart": GlucoseTrendChartDemo,
  "time-in-range-bar": TimeInRangeBarDemo,
  "temperature-curve": TemperatureCurveDemo,
  "weight-trend-chart": WeightTrendChartDemo,
  "growth-chart": GrowthChartDemo,
  "lab-result-chart": LabResultChartDemo,
  "lab-delta-indicator": LabDeltaIndicatorDemo,
  "pain-trend-chart": PainTrendChartDemo,
  "vitals-flowsheet": VitalsFlowsheetDemo,
  "lab-panel-table": LabPanelTableDemo,
  "sparkline-cell": SparklineCellDemo,
  "intake-output-chart": IntakeOutputChartDemo,
  "medication-timeline": MedicationTimelineDemo,
  "early-warning-score": EarlyWarningScoreDemo,
  "observation-timeline": ObservationTimelineDemo,
  "patient-monitoring-block": PatientMonitoringBlockDemo,
  "labs-review-block": LabsReviewBlockDemo,
  "adherence-ring": AdherenceRingDemo,
  alert: AlertDemo,
  "allergy-badge": AllergyBadgeDemo,
  "allergy-input-field": AllergyInputFieldDemo,
  "appointment-check-in": AppointmentCheckInDemo,
  "appointment-row": AppointmentRowDemo,
  avatar: AvatarDemo,
  badge: BadgeDemo,
  "blood-pressure-badge": BloodPressureBadgeDemo,
  "blood-pressure-input": BloodPressureInputDemo,
  "blood-type-badge": BloodTypeBadgeDemo,
  "bmi-gauge": BmiGaugeDemo,
  "body-map-selector": BodyMapSelectorDemo,
  button: ButtonDemo,
  card: CardDemo,
  "care-gap-item": CareGapItemDemo,
  "care-team-list": CareTeamListDemo,
  checkbox: CheckboxDemo,
  "clinical-alert-item": ClinicalAlertItemDemo,
  "clinical-note-card": ClinicalNoteCardDemo,
  "clinical-task-row": ClinicalTaskRowDemo,
  collapsible: CollapsibleDemo,
  "consent-checklist": ConsentChecklistDemo,
  "dashboard-grid": DashboardGridDemo,
  "dashboard-shell": DashboardShellDemo,
  "date-field": DateFieldDemo,
  "date-of-birth-field": DateOfBirthFieldDemo,
  "dosage-builder": DosageBuilderDemo,
  "dose-checklist": DoseChecklistDemo,
  "drug-interaction-alert": DrugInteractionAlertDemo,
  "ecg-strip": EcgStripDemo,
  "emergency-contact-card": EmergencyContactCardDemo,
  "emergency-contact-field": EmergencyContactFieldDemo,
  "empty-state": EmptyStateDemo,
  "encounter-item": EncounterItemDemo,
  "fall-risk-indicator": FallRiskIndicatorDemo,
  "fasting-status-banner": FastingStatusBannerDemo,
  field: FieldDemo,
  "frequency-schedule-field": FrequencyScheduleFieldDemo,
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
  "medication-search-field": MedicationSearchFieldDemo,
  "medication-timing-strip": MedicationTimingStripDemo,
  "message-inbox-row": MessageInboxRowDemo,
  "pain-scale": PainScaleDemo,
  "patient-banner": PatientBannerDemo,
  popover: PopoverDemo,
  "pregnancy-week-tracker": PregnancyWeekTrackerDemo,
  "prescription-card": PrescriptionCardDemo,
  "problem-list-item": ProblemListItemDemo,
  progress: ProgressDemo,
  "questionnaire-scale": QuestionnaireScaleDemo,
  "radio-group": RadioGroupDemo,
  "refill-countdown": RefillCountdownDemo,
  "review-of-systems-form": ReviewOfSystemsFormDemo,
  "risk-score-gauge": RiskScoreGaugeDemo,
  "route-of-administration-field": RouteOfAdministrationFieldDemo,
  "section-header": SectionHeaderDemo,
  select: SelectDemo,
  separator: SeparatorDemo,
  "signature-pad": SignaturePadDemo,
  slider: SliderDemo,
  "smoking-status-field": SmokingStatusFieldDemo,
  "spo2-dial": Spo2DialDemo,
  "stat-tile": StatTileDemo,
  switch: SwitchDemo,
  "symptom-multi-select": SymptomMultiSelectDemo,
  "telehealth-call-card": TelehealthCallCardDemo,
  "temperature-field": TemperatureFieldDemo,
  textarea: TextareaDemo,
  timeline: TimelineDemo,
  "toggle-group": ToggleGroupDemo,
  tooltip: TooltipDemo,
  "trend-sparkline": TrendSparklineDemo,
  "triage-level-indicator": TriageLevelIndicatorDemo,
  "triage-queue-row": TriageQueueRowDemo,
  "vaccination-record-row": VaccinationRecordRowDemo,
  "vitals-card": VitalsCardDemo,
  "vitals-entry-form": VitalsEntryFormDemo,
  "weight-based-dose-field": WeightBasedDoseFieldDemo,
  "widget-panel": WidgetPanelDemo,
}
