export type CriterionStatus =
  | "passed"
  | "failed"
  | "needs_screening"
  | "not_evaluated";

export type CriterionType = "inclusion" | "exclusion";

export type MatchStatus =
  | "screening"
  | "pending_review"
  | "recommended"
  | "not_recommended";

export type MatchRecommendation =
  | "pending"
  | "refer_for_screening"
  | "enroll"
  | "do_not_enroll";

export type TrialStatus = "recruiting" | "active" | "completed" | "suspended";

export type AuditEntityType = "match" | "criterion" | "recommendation";

export interface CriteriaSummary {
  passed: number;
  failed: number;
  needsScreening: number;
  notEvaluated: number;
}

export interface Patient {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  sex: "male" | "female" | "other";
  conditions: string[];
  lastScreenedAt?: string;
}

export interface Trial {
  id: string;
  nctId: string;
  title: string;
  phase: string;
  status: TrialStatus;
  condition: string;
  sponsor: string;
  inclusionCount: number;
  exclusionCount: number;
}

export interface Match {
  id: string;
  patientId: string;
  trialId: string;
  status: MatchStatus;
  recommendation: MatchRecommendation;
  confidenceScore?: number;
  criteriaSummary: CriteriaSummary;
  createdAt: string;
  updatedAt: string;
  recommendedBy?: string | null;
}

export interface MatchDetail extends Match {
  patient: { id: string; mrn: string; displayName: string };
  trial: { id: string; nctId: string; title: string };
}

export interface CriterionEvaluation {
  id: string;
  matchId: string;
  type: CriterionType;
  ordinal: number;
  text: string;
  status: CriterionStatus;
  evidence?: string | null;
  evaluatedAt?: string | null;
  evaluatedBy?: string | null;
  notes?: string | null;
}

export interface AuditEvent {
  id: string;
  matchId: string;
  actor: string;
  action: string;
  entityType: AuditEntityType;
  entityId: string;
  previousValue?: string | null;
  newValue?: string | null;
  notes?: string | null;
  timestamp: string;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface DashboardStats {
  patientCount: number;
  activeTrialCount: number;
  pendingMatchCount: number;
  needsScreeningCount: number;
}
