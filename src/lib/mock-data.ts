import type {
  AuditEvent,
  CriterionEvaluation,
  DashboardStats,
  Match,
  MatchDetail,
  Patient,
  Trial,
} from "@/lib/types";

export const patients: Patient[] = [
  {
    id: "pat-001",
    mrn: "MRN-10482",
    firstName: "Elena",
    lastName: "Vasquez",
    dateOfBirth: "1968-03-14",
    sex: "female",
    conditions: ["Type 2 diabetes", "Hypertension", "CKD stage 3"],
    lastScreenedAt: "2026-07-08T14:22:00Z",
  },
  {
    id: "pat-002",
    mrn: "MRN-11037",
    firstName: "James",
    lastName: "Okonkwo",
    dateOfBirth: "1955-11-02",
    sex: "male",
    conditions: ["Non-small cell lung cancer", "Former smoker"],
    lastScreenedAt: "2026-07-07T09:15:00Z",
  },
  {
    id: "pat-003",
    mrn: "MRN-09821",
    firstName: "Maria",
    lastName: "Santos",
    dateOfBirth: "1979-07-22",
    sex: "female",
    conditions: ["Rheumatoid arthritis", "Osteoporosis"],
    lastScreenedAt: "2026-07-06T16:40:00Z",
  },
  {
    id: "pat-004",
    mrn: "MRN-11290",
    firstName: "Robert",
    lastName: "Kim",
    dateOfBirth: "1942-01-30",
    sex: "male",
    conditions: ["Heart failure", "Atrial fibrillation", "Type 2 diabetes"],
    lastScreenedAt: "2026-07-05T11:00:00Z",
  },
  {
    id: "pat-005",
    mrn: "MRN-10555",
    firstName: "Aisha",
    lastName: "Patel",
    dateOfBirth: "1990-12-08",
    sex: "female",
    conditions: ["Ulcerative colitis"],
    lastScreenedAt: "2026-07-04T08:30:00Z",
  },
];

export const trials: Trial[] = [
  {
    id: "trial-001",
    nctId: "NCT05234567",
    title: "Phase III SGLT2 Inhibitor in T2D with CKD",
    phase: "Phase III",
    status: "recruiting",
    condition: "Type 2 Diabetes Mellitus",
    sponsor: "Acme Pharma",
    inclusionCount: 8,
    exclusionCount: 12,
  },
  {
    id: "trial-002",
    nctId: "NCT04891234",
    title: "Immunotherapy Combination for Advanced NSCLC",
    phase: "Phase II",
    status: "recruiting",
    condition: "Non-Small Cell Lung Cancer",
    sponsor: "OncoGenix",
    inclusionCount: 10,
    exclusionCount: 15,
  },
  {
    id: "trial-003",
    nctId: "NCT05110298",
    title: "JAK Inhibitor vs Methotrexate in Early RA",
    phase: "Phase III",
    status: "recruiting",
    condition: "Rheumatoid Arthritis",
    sponsor: "ImmunoCore",
    inclusionCount: 7,
    exclusionCount: 9,
  },
  {
    id: "trial-004",
    nctId: "NCT04988721",
    title: "SGLT2 Inhibitor in Heart Failure with Preserved EF",
    phase: "Phase III",
    status: "active",
    condition: "Heart Failure",
    sponsor: "CardioVance",
    inclusionCount: 9,
    exclusionCount: 11,
  },
];

export const matches: Match[] = [
  {
    id: "match-001",
    patientId: "pat-001",
    trialId: "trial-001",
    status: "pending_review",
    recommendation: "pending",
    confidenceScore: 72,
    criteriaSummary: {
      passed: 5,
      failed: 1,
      needsScreening: 2,
      notEvaluated: 0,
    },
    createdAt: "2026-07-08T10:00:00Z",
    updatedAt: "2026-07-08T14:22:00Z",
    recommendedBy: null,
  },
  {
    id: "match-002",
    patientId: "pat-002",
    trialId: "trial-002",
    status: "recommended",
    recommendation: "enroll",
    confidenceScore: 88,
    criteriaSummary: {
      passed: 9,
      failed: 0,
      needsScreening: 1,
      notEvaluated: 0,
    },
    createdAt: "2026-07-07T08:30:00Z",
    updatedAt: "2026-07-07T09:15:00Z",
    recommendedBy: "Dr. Sarah Chen",
  },
  {
    id: "match-003",
    patientId: "pat-003",
    trialId: "trial-003",
    status: "screening",
    recommendation: "refer_for_screening",
    confidenceScore: 54,
    criteriaSummary: {
      passed: 3,
      failed: 0,
      needsScreening: 4,
      notEvaluated: 0,
    },
    createdAt: "2026-07-06T14:00:00Z",
    updatedAt: "2026-07-06T16:40:00Z",
    recommendedBy: null,
  },
  {
    id: "match-004",
    patientId: "pat-004",
    trialId: "trial-004",
    status: "not_recommended",
    recommendation: "do_not_enroll",
    confidenceScore: 31,
    criteriaSummary: {
      passed: 4,
      failed: 3,
      needsScreening: 1,
      notEvaluated: 0,
    },
    createdAt: "2026-07-05T09:00:00Z",
    updatedAt: "2026-07-05T11:00:00Z",
    recommendedBy: "Dr. Sarah Chen",
  },
  {
    id: "match-005",
    patientId: "pat-001",
    trialId: "trial-004",
    status: "screening",
    recommendation: "pending",
    confidenceScore: 61,
    criteriaSummary: {
      passed: 4,
      failed: 0,
      needsScreening: 3,
      notEvaluated: 2,
    },
    createdAt: "2026-07-08T11:30:00Z",
    updatedAt: "2026-07-08T11:30:00Z",
    recommendedBy: null,
  },
  {
    id: "match-006",
    patientId: "pat-005",
    trialId: "trial-003",
    status: "pending_review",
    recommendation: "pending",
    confidenceScore: 45,
    criteriaSummary: {
      passed: 2,
      failed: 1,
      needsScreening: 3,
      notEvaluated: 1,
    },
    createdAt: "2026-07-04T08:00:00Z",
    updatedAt: "2026-07-04T08:30:00Z",
    recommendedBy: null,
  },
];

export const criteriaByMatch: Record<string, CriterionEvaluation[]> = {
  "match-001": [
    {
      id: "crit-001-1",
      matchId: "match-001",
      type: "inclusion",
      ordinal: 1,
      text: "Age 18 years or older",
      status: "passed",
      evidence: "Patient age 58",
      evaluatedAt: "2026-07-08T10:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-001-2",
      matchId: "match-001",
      type: "inclusion",
      ordinal: 2,
      text: "Diagnosed Type 2 diabetes mellitus",
      status: "passed",
      evidence: "ICD-10 E11.9 in chart",
      evaluatedAt: "2026-07-08T10:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-001-3",
      matchId: "match-001",
      type: "inclusion",
      ordinal: 3,
      text: "HbA1c between 7.0% and 10.5%",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
      notes: "Most recent lab is 6 months old",
    },
    {
      id: "crit-001-4",
      matchId: "match-001",
      type: "inclusion",
      ordinal: 4,
      text: "eGFR ≥ 30 mL/min/1.73m²",
      status: "passed",
      evidence: "eGFR 42 (2026-06-01)",
      evaluatedAt: "2026-07-08T10:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-001-5",
      matchId: "match-001",
      type: "inclusion",
      ordinal: 5,
      text: "On stable metformin dose for ≥ 8 weeks",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
    {
      id: "crit-001-6",
      matchId: "match-001",
      type: "exclusion",
      ordinal: 1,
      text: "Current use of SGLT2 inhibitor",
      status: "passed",
      evidence: "No SGLT2 in medication list",
      evaluatedAt: "2026-07-08T10:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-001-7",
      matchId: "match-001",
      type: "exclusion",
      ordinal: 2,
      text: "History of diabetic ketoacidosis",
      status: "passed",
      evidence: "No DKA events in chart",
      evaluatedAt: "2026-07-08T10:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-001-8",
      matchId: "match-001",
      type: "exclusion",
      ordinal: 3,
      text: "eGFR < 30 mL/min/1.73m²",
      status: "failed",
      evidence: "eGFR borderline — coordinator flagged for review",
      evaluatedAt: "2026-07-08T14:22:00Z",
      evaluatedBy: "Dr. Sarah Chen",
      notes: "CKD stage 3b fluctuation; sponsor consult requested",
    },
  ],
  "match-002": [
    {
      id: "crit-002-1",
      matchId: "match-002",
      type: "inclusion",
      ordinal: 1,
      text: "Histologically confirmed NSCLC, stage IIIB/IV",
      status: "passed",
      evidence: "Biopsy 2026-05-12: adenocarcinoma",
      evaluatedAt: "2026-07-07T08:35:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-002-2",
      matchId: "match-002",
      type: "inclusion",
      ordinal: 2,
      text: "ECOG performance status 0–1",
      status: "passed",
      evidence: "ECOG 1 documented",
      evaluatedAt: "2026-07-07T08:35:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-002-3",
      matchId: "match-002",
      type: "inclusion",
      ordinal: 3,
      text: "No prior PD-1/PD-L1 inhibitor therapy",
      status: "passed",
      evidence: "Treatment history reviewed",
      evaluatedAt: "2026-07-07T08:35:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-002-4",
      matchId: "match-002",
      type: "exclusion",
      ordinal: 1,
      text: "Active autoimmune disease requiring systemic treatment",
      status: "passed",
      evidence: "No active autoimmune condition",
      evaluatedAt: "2026-07-07T08:35:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-002-5",
      matchId: "match-002",
      type: "inclusion",
      ordinal: 4,
      text: "Adequate organ function per protocol",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
      notes: "Pending CBC/chemistry panel from today",
    },
  ],
  "match-003": [
    {
      id: "crit-003-1",
      matchId: "match-003",
      type: "inclusion",
      ordinal: 1,
      text: "RA diagnosis per ACR/EULAR criteria",
      status: "passed",
      evidence: "RA diagnosed 2021",
      evaluatedAt: "2026-07-06T14:05:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-003-2",
      matchId: "match-003",
      type: "inclusion",
      ordinal: 2,
      text: "DAS28-CRP > 3.2",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
    {
      id: "crit-003-3",
      matchId: "match-003",
      type: "inclusion",
      ordinal: 3,
      text: "Inadequate response to methotrexate ≥ 12 weeks",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
    {
      id: "crit-003-4",
      matchId: "match-003",
      type: "exclusion",
      ordinal: 1,
      text: "Prior JAK inhibitor use",
      status: "passed",
      evidence: "No JAK inhibitor in history",
      evaluatedAt: "2026-07-06T14:05:00Z",
      evaluatedBy: "System",
    },
  ],
  "match-004": [
    {
      id: "crit-004-1",
      matchId: "match-004",
      type: "inclusion",
      ordinal: 1,
      text: "HFpEF with LVEF ≥ 50%",
      status: "passed",
      evidence: "Echo 2026-04: LVEF 55%",
      evaluatedAt: "2026-07-05T09:10:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-004-2",
      matchId: "match-004",
      type: "exclusion",
      ordinal: 1,
      text: "Systolic BP > 180 mmHg at screening",
      status: "failed",
      evidence: "BP 184/96 on 2026-07-05",
      evaluatedAt: "2026-07-05T11:00:00Z",
      evaluatedBy: "Dr. Sarah Chen",
    },
    {
      id: "crit-004-3",
      matchId: "match-004",
      type: "exclusion",
      ordinal: 2,
      text: "Recent MI within 3 months",
      status: "failed",
      evidence: "NSTEMI 2026-05-20",
      evaluatedAt: "2026-07-05T09:10:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-004-4",
      matchId: "match-004",
      type: "exclusion",
      ordinal: 3,
      text: "Type 1 diabetes",
      status: "failed",
      evidence: "Patient has T2D, not T1D — criterion N/A",
      evaluatedAt: "2026-07-05T09:10:00Z",
      evaluatedBy: "System",
    },
  ],
  "match-005": [
    {
      id: "crit-005-1",
      matchId: "match-005",
      type: "inclusion",
      ordinal: 1,
      text: "Age 18 years or older",
      status: "passed",
      evidence: "Patient age 58",
      evaluatedAt: "2026-07-08T11:35:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-005-2",
      matchId: "match-005",
      type: "inclusion",
      ordinal: 2,
      text: "Documented heart failure diagnosis",
      status: "not_evaluated",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
    {
      id: "crit-005-3",
      matchId: "match-005",
      type: "inclusion",
      ordinal: 3,
      text: "NT-proBNP above protocol threshold",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
  ],
  "match-006": [
    {
      id: "crit-006-1",
      matchId: "match-006",
      type: "inclusion",
      ordinal: 1,
      text: "Active ulcerative colitis",
      status: "failed",
      evidence: "UC is primary condition, not RA trial",
      evaluatedAt: "2026-07-04T08:30:00Z",
      evaluatedBy: "Dr. Sarah Chen",
      notes: "Condition mismatch — trial targets RA",
    },
    {
      id: "crit-006-2",
      matchId: "match-006",
      type: "inclusion",
      ordinal: 2,
      text: "RA diagnosis per ACR/EULAR criteria",
      status: "failed",
      evidence: "No RA diagnosis in chart",
      evaluatedAt: "2026-07-04T08:30:00Z",
      evaluatedBy: "System",
    },
    {
      id: "crit-006-3",
      matchId: "match-006",
      type: "inclusion",
      ordinal: 3,
      text: "DAS28-CRP > 3.2",
      status: "needs_screening",
      evidence: null,
      evaluatedAt: null,
      evaluatedBy: null,
    },
  ],
};

export const auditEvents: AuditEvent[] = [
  {
    id: "audit-001",
    matchId: "match-001",
    actor: "System",
    action: "match_created",
    entityType: "match",
    entityId: "match-001",
    newValue: "screening",
    timestamp: "2026-07-08T10:00:00Z",
  },
  {
    id: "audit-002",
    matchId: "match-001",
    actor: "System",
    action: "criteria_evaluated",
    entityType: "criterion",
    entityId: "crit-001-1",
    newValue: "passed",
    notes: "Automated chart review",
    timestamp: "2026-07-08T10:05:00Z",
  },
  {
    id: "audit-003",
    matchId: "match-001",
    actor: "Dr. Sarah Chen",
    action: "criterion_updated",
    entityType: "criterion",
    entityId: "crit-001-8",
    previousValue: "passed",
    newValue: "failed",
    notes: "CKD stage 3b fluctuation; sponsor consult requested",
    timestamp: "2026-07-08T14:22:00Z",
  },
  {
    id: "audit-004",
    matchId: "match-001",
    actor: "System",
    action: "status_updated",
    entityType: "match",
    entityId: "match-001",
    previousValue: "screening",
    newValue: "pending_review",
    timestamp: "2026-07-08T14:22:00Z",
  },
  {
    id: "audit-005",
    matchId: "match-002",
    actor: "System",
    action: "match_created",
    entityType: "match",
    entityId: "match-002",
    newValue: "screening",
    timestamp: "2026-07-07T08:30:00Z",
  },
  {
    id: "audit-006",
    matchId: "match-002",
    actor: "Dr. Sarah Chen",
    action: "recommendation_set",
    entityType: "recommendation",
    entityId: "match-002",
    previousValue: "pending",
    newValue: "enroll",
    notes: "Strong match; pending final labs",
    timestamp: "2026-07-07T09:15:00Z",
  },
  {
    id: "audit-007",
    matchId: "match-004",
    actor: "Dr. Sarah Chen",
    action: "recommendation_set",
    entityType: "recommendation",
    entityId: "match-004",
    previousValue: "pending",
    newValue: "do_not_enroll",
    notes: "Recent NSTEMI and uncontrolled BP exclude patient",
    timestamp: "2026-07-05T11:00:00Z",
  },
  {
    id: "audit-008",
    matchId: "match-003",
    actor: "System",
    action: "match_created",
    entityType: "match",
    entityId: "match-003",
    newValue: "screening",
    timestamp: "2026-07-06T14:00:00Z",
  },
  {
    id: "audit-009",
    matchId: "match-006",
    actor: "Dr. Sarah Chen",
    action: "criterion_updated",
    entityType: "criterion",
    entityId: "crit-006-1",
    previousValue: "not_evaluated",
    newValue: "failed",
    notes: "Condition mismatch — trial targets RA",
    timestamp: "2026-07-04T08:30:00Z",
  },
];

function paginate<T>(items: T[], page = 1, limit = 20): { data: T[]; meta: { page: number; limit: number; total: number } } {
  const start = (page - 1) * limit;
  return {
    data: items.slice(start, start + limit),
    meta: { page, limit, total: items.length },
  };
}

export function getPatientById(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

export function getTrialById(id: string): Trial | undefined {
  return trials.find((t) => t.id === id);
}

export function getMatchDetail(matchId: string): MatchDetail | undefined {
  const match = matches.find((m) => m.id === matchId);
  if (!match) return undefined;
  const patient = getPatientById(match.patientId);
  const trial = getTrialById(match.trialId);
  if (!patient || !trial) return undefined;
  return {
    ...match,
    patient: {
      id: patient.id,
      mrn: patient.mrn,
      displayName: `${patient.firstName} ${patient.lastName}`,
    },
    trial: {
      id: trial.id,
      nctId: trial.nctId,
      title: trial.title,
    },
  };
}

export function getDashboardStats(): DashboardStats {
  return {
    patientCount: patients.length,
    activeTrialCount: trials.filter((t) => t.status === "recruiting" || t.status === "active").length,
    pendingMatchCount: matches.filter(
      (m) => m.status === "pending_review" || m.status === "screening"
    ).length,
    needsScreeningCount: Object.values(criteriaByMatch)
      .flat()
      .filter((c) => c.status === "needs_screening").length,
  };
}

export const mockApi = {
  getPatients(params?: { search?: string; page?: number; limit?: number }) {
    let filtered = [...patients];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.mrn.toLowerCase().includes(q) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
      );
    }
    return paginate(filtered, params?.page, params?.limit);
  },

  getPatient(id: string) {
    return getPatientById(id) ?? null;
  },

  getTrials(params?: { search?: string; status?: string; page?: number; limit?: number }) {
    let filtered = [...trials];
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.nctId.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.condition.toLowerCase().includes(q)
      );
    }
    if (params?.status) {
      filtered = filtered.filter((t) => t.status === params.status);
    }
    return paginate(filtered, params?.page, params?.limit);
  },

  getTrial(id: string) {
    return getTrialById(id) ?? null;
  },

  getMatches(params?: {
    patientId?: string;
    trialId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    let filtered = [...matches];
    if (params?.patientId) filtered = filtered.filter((m) => m.patientId === params.patientId);
    if (params?.trialId) filtered = filtered.filter((m) => m.trialId === params.trialId);
    if (params?.status) filtered = filtered.filter((m) => m.status === params.status);
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return paginate(filtered, params?.page, params?.limit);
  },

  getMatch(id: string) {
    return getMatchDetail(id) ?? null;
  },

  getCriteria(matchId: string) {
    return { data: criteriaByMatch[matchId] ?? [] };
  },

  getMatchAudit(matchId: string, page = 1, limit = 50) {
    const events = auditEvents
      .filter((e) => e.matchId === matchId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return paginate(events, page, limit);
  },

  getGlobalAudit(page = 1, limit = 20) {
    const sorted = [...auditEvents].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    return paginate(sorted, page, limit);
  },

  getDashboardStats,
};
