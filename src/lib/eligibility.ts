import type {
  AuditRecord,
  CriterionResult,
  Patient,
  PatientFact,
  PatientTrialMatch,
} from "@/lib/types";

export interface FactCriterionLink {
  criterion_id: string;
  criterion_text: string;
  result: CriterionResult;
  reason: string;
  rule_type: AuditRecord["rule_type"];
  hard_gate: boolean;
}

export interface FactEligibilityItem {
  id: string;
  field_name: string;
  label: string;
  value: string;
  source?: string;
  confidence?: string;
  criteria: FactCriterionLink[];
  overallResult: CriterionResult;
  matchScore: number;
}

export interface PatientTrialEligibilityData {
  match: PatientTrialMatch;
  facts: FactEligibilityItem[];
  summary: string;
  highlights: string[];
}

const fieldLabels: Record<string, string> = {
  diagnosis: "Diagnosis",
  ecog: "ECOG status",
  cancer_stage: "Cancer stage",
  biomarker_egfr: "EGFR biomarker",
  prior_treatments: "Prior treatments",
  lab_hemoglobin: "Hemoglobin",
  age: "Age",
  sex: "Sex",
};

function factDisplayValue(fact: PatientFact): string {
  if (fact.num_value !== "" && fact.num_value !== null) {
    const unit = fact.unit || fact.str_value;
    return unit ? `${fact.num_value} ${unit}`.trim() : String(fact.num_value);
  }
  return fact.str_value || "—";
}

function worstResult(results: CriterionResult[]): CriterionResult {
  if (results.includes("NOT_MET")) return "NOT_MET";
  if (results.includes("UNKNOWN")) return "UNKNOWN";
  if (results.every((r) => r === "NOT_APPLICABLE")) return "NOT_APPLICABLE";
  return "MET";
}

export function resultToMatchScore(result: CriterionResult): number {
  switch (result) {
    case "MET":
      return 100;
    case "NOT_MET":
      return 0;
    case "UNKNOWN":
      return 45;
    case "NOT_APPLICABLE":
      return 0;
  }
}

export function buildFactEligibility(
  patient: Patient,
  facts: PatientFact[],
  auditRecords: AuditRecord[]
): FactEligibilityItem[] {
  const byField = new Map<string, FactCriterionLink[]>();

  for (const record of auditRecords) {
    const list = byField.get(record.field_checked) ?? [];
    list.push({
      criterion_id: record.criterion_id,
      criterion_text: record.criterion_text,
      result: record.result,
      reason: record.reason,
      rule_type: record.rule_type,
      hard_gate: record.hard_gate,
    });
    byField.set(record.field_checked, list);
  }

  const items: FactEligibilityItem[] = [];
  const seenFields = new Set<string>();

  if (byField.has("age")) {
    const criteria = byField.get("age")!;
    const overall = worstResult(criteria.map((c) => c.result));
    items.push({
      id: "demographic-age",
      field_name: "age",
      label: fieldLabels.age,
      value: `${patient.age} years`,
      source: "demographics",
      confidence: "high",
      criteria,
      overallResult: overall,
      matchScore: resultToMatchScore(overall),
    });
    seenFields.add("age");
  }

  for (const fact of facts) {
    seenFields.add(fact.field_name);
    const criteria = byField.get(fact.field_name) ?? [];
    const overall =
      criteria.length > 0
        ? worstResult(criteria.map((c) => c.result))
        : "UNKNOWN";

    items.push({
      id: fact.fact_id,
      field_name: fact.field_name,
      label: fieldLabels[fact.field_name] ?? fact.field_name,
      value: factDisplayValue(fact),
      source: fact.source,
      confidence: fact.confidence,
      criteria,
      overallResult: overall,
      matchScore:
        criteria.length > 0 ? resultToMatchScore(overall) : 0,
    });
  }

  for (const [field, criteria] of byField) {
    if (seenFields.has(field)) continue;
    const overall = worstResult(criteria.map((c) => c.result));
    items.push({
      id: `audit-${field}`,
      field_name: field,
      label: fieldLabels[field] ?? field,
      value: criteria[0]?.reason.split("'")[1] ?? "See audit",
      criteria,
      overallResult: overall,
      matchScore: resultToMatchScore(overall),
    });
  }

  return items;
}

export function buildMatchSummary(
  match: PatientTrialMatch,
  auditRecords: AuditRecord[],
  patient: Patient
): { summary: string; highlights: string[] } {
  const met = auditRecords.filter((r) => r.result === "MET");
  const failed = auditRecords.filter((r) => r.result === "NOT_MET");
  const unknown = auditRecords.filter((r) => r.result === "UNKNOWN");
  const hardGates = auditRecords.filter((r) => r.hard_gate);
  const hardMet = hardGates.filter((r) => r.result === "MET").length;

  const highlights: string[] = [];

  if (match.tier === "ELIGIBLE") {
    highlights.push(
      `All ${hardGates.length} hard gates passed`,
      `${match.soft_rules_met}/${match.soft_rules_total} soft rules met`
    );
    if (match.location_bonus > 0) {
      highlights.push(
        `+${match.location_bonus} location bonus (${patient.city})`
      );
    }
    const keyFacts = met
      .filter((r) => r.rule_type === "inclusion")
      .slice(0, 3)
      .map((r) => r.criterion_text);
    if (keyFacts.length) {
      highlights.push(...keyFacts);
    }
  } else if (match.tier === "NEEDS_SCREENING") {
    highlights.push(
      `${unknown.length} criterion(s) need coordinator screening`,
      `${match.soft_rules_unknown} soft rule(s) still unknown`
    );
  } else if (match.tier === "NOT_ELIGIBLE") {
    const failure = failed[0];
    if (failure) {
      highlights.push(`Failed: ${failure.criterion_text}`, failure.reason);
    }
    highlights.push(`${match.hard_failures} hard gate failure(s)`);
  }

  let summary = "";

  switch (match.tier) {
    case "ELIGIBLE":
      summary = `${patient.patient_id} is eligible for ${match.trial_title} (${match.trial_id}). All ${hardMet} hard gates are met and ${match.soft_rules_met} of ${match.soft_rules_total} soft rules passed, yielding a composite score of ${match.score}.`;
      break;
    case "NEEDS_SCREENING":
      summary = `${patient.patient_id} may qualify for ${match.trial_title}, but ${unknown.length || match.soft_rules_unknown} screening item(s) remain before enrollment. Hard gates are clear; confirm missing data before recommending.`;
      break;
    case "NOT_ELIGIBLE":
      summary = `${patient.patient_id} is not eligible for ${match.trial_title}. ${failed.length ? failed[0].reason : "One or more hard gates failed."} Match score is ${match.score}.`;
      break;
    case "REVIEW":
      summary = `${patient.patient_id} is borderline for ${match.trial_title} and needs coordinator review before a recommendation.`;
      break;
  }

  return { summary, highlights };
}

export function buildPatientTrialEligibility(
  patient: Patient,
  facts: PatientFact[],
  match: PatientTrialMatch,
  auditRecords: AuditRecord[]
): PatientTrialEligibilityData {
  const factItems = buildFactEligibility(patient, facts, auditRecords);
  const { summary, highlights } = buildMatchSummary(
    match,
    auditRecords,
    patient
  );

  return { match, facts: factItems, summary, highlights };
}
