import type {
  CriterionStatus,
  MatchRecommendation,
  MatchStatus,
  TrialStatus,
} from "@/lib/types";

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function patientAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export const criterionStatusLabel: Record<CriterionStatus, string> = {
  passed: "Passed",
  failed: "Failed",
  needs_screening: "Needs screening",
  not_evaluated: "Not evaluated",
};

export const criterionStatusColor: Record<CriterionStatus, string> = {
  passed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  failed: "bg-rose-100 text-rose-800 border-rose-200",
  needs_screening: "bg-amber-100 text-amber-800 border-amber-200",
  not_evaluated: "bg-slate-100 text-slate-600 border-slate-200",
};

export const matchStatusLabel: Record<MatchStatus, string> = {
  screening: "Screening",
  pending_review: "Pending review",
  recommended: "Recommended",
  not_recommended: "Not recommended",
};

export const matchStatusColor: Record<MatchStatus, string> = {
  screening: "bg-sky-100 text-sky-800 border-sky-200",
  pending_review: "bg-amber-100 text-amber-800 border-amber-200",
  recommended: "bg-emerald-100 text-emerald-800 border-emerald-200",
  not_recommended: "bg-rose-100 text-rose-800 border-rose-200",
};

export const recommendationLabel: Record<MatchRecommendation, string> = {
  pending: "Pending",
  refer_for_screening: "Refer for screening",
  enroll: "Enroll",
  do_not_enroll: "Do not enroll",
};

export const trialStatusColor: Record<TrialStatus, string> = {
  recruiting: "bg-emerald-100 text-emerald-800 border-emerald-200",
  active: "bg-sky-100 text-sky-800 border-sky-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  suspended: "bg-rose-100 text-rose-800 border-rose-200",
};

export function confidenceColor(score?: number): string {
  if (score === undefined) return "text-slate-500";
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
}
