import Link from "next/link";
import { notFound } from "next/navigation";
import { AuditTrail } from "@/components/matches/AuditTrail";
import { CriteriaList } from "@/components/matches/CriteriaList";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import {
  confidenceColor,
  formatDateTime,
  matchStatusColor,
  matchStatusLabel,
  recommendationLabel,
} from "@/lib/utils";

interface MatchDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchDetailPage({ params }: MatchDetailPageProps) {
  const { id } = await params;
  const [match, criteriaResult, auditResult] = await Promise.all([
    api.getMatch(id),
    api.getCriteria(id),
    api.getMatchAudit(id),
  ]);

  if (!match) notFound();

  const summary = match.criteriaSummary;

  return (
    <div className="space-y-8">
      <div>
        <Link href="/matches" className="text-sm text-teal-700 hover:underline">
          ← Matches
        </Link>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {match.patient.displayName}
        </h2>
        <p className="mt-1 text-sm text-slate-500">{match.patient.mrn}</p>
        <p className="mt-3 text-lg text-slate-800">{match.trial.title}</p>
        <p className="text-sm text-teal-700">{match.trial.nctId}</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Status</p>
          <div className="mt-2">
            <StatusBadge
              label={matchStatusLabel[match.status]}
              className={matchStatusColor[match.status]}
            />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Recommendation</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {recommendationLabel[match.recommendation]}
          </p>
          {match.recommendedBy && (
            <p className="mt-1 text-xs text-slate-500">by {match.recommendedBy}</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Confidence</p>
          <p className={`mt-2 text-2xl font-semibold ${confidenceColor(match.confidenceScore)}`}>
            {match.confidenceScore ?? "—"}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs text-slate-500">Criteria summary</p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
              {summary.passed} passed
            </span>
            <span className="rounded bg-rose-100 px-1.5 py-0.5 text-rose-700">
              {summary.failed} failed
            </span>
            <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
              {summary.needsScreening} screening
            </span>
            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600">
              {summary.notEvaluated} unevaluated
            </span>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link
          href={`/patients/${match.patientId}`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:border-teal-300"
        >
          View patient
        </Link>
        <Link
          href={`/trials/${match.trialId}`}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 hover:border-teal-300"
        >
          View trial
        </Link>
      </div>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Eligibility criteria
        </h3>
        <CriteriaList criteria={criteriaResult.data} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Audit trail</h3>
            <p className="text-sm text-slate-500">
              Immutable log of every change to this recommendation
            </p>
          </div>
          <p className="text-xs text-slate-400">
            Last updated {formatDateTime(match.updatedAt)}
          </p>
        </div>
        <AuditTrail events={auditResult.data} />
      </section>
    </div>
  );
}
