import Link from "next/link";
import { CoordinatorDashboardTable } from "@/components/dashboard/CoordinatorDashboardTable";
import { StatCard } from "@/components/dashboard/StatCard";
import { MatchTable } from "@/components/matches/MatchTable";
import { api } from "@/lib/api";
import { matchPath } from "@/lib/types";
import { tierLabel } from "@/lib/utils";

export default async function DashboardPage() {
  const [
    patients,
    trials,
    matches,
    coordinatorDashboard,
    diagnosisSummary,
  ] = await Promise.all([
    api.getPatients(),
    api.getTrials(),
    api.getMatches(),
    api.getCoordinatorDashboard(),
    api.getDiagnosisSummary(),
  ]);

  const eligibleCount = matches.filter((m) => m.tier === "ELIGIBLE").length;
  const needsScreeningCount = matches.filter(
    (m) => m.tier === "NEEDS_SCREENING"
  ).length;
  const recruitingTrials = trials.filter((t) => t.status === "recruiting");

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Coordinator view of enrollment risk and patient–trial match tiers.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Patients"
            value={patients.length}
            hint="In matching pool"
            accent="teal"
          />
          <StatCard
            label="Recruiting trials"
            value={recruitingTrials.length}
            hint="Active recruitment"
            accent="slate"
          />
          <StatCard
            label="Eligible matches"
            value={eligibleCount}
            hint="Ready for coordinator review"
            accent="teal"
          />
          <StatCard
            label="Needs screening"
            value={needsScreeningCount}
            hint="Unknown criteria remain"
            accent="amber"
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              At-risk trials
            </h2>
            <p className="text-sm text-slate-500">
              Trials below enrollment target with match pipeline counts
            </p>
          </div>
        </div>
        <CoordinatorDashboardTable rows={coordinatorDashboard} />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent matches
            </h2>
            <p className="text-sm text-slate-500">
              Patient–trial pairs from the matching pipeline
            </p>
          </div>
          <Link
            href="/matches"
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            View all
          </Link>
        </div>
        <MatchTable matches={matches.slice(0, 6)} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Eligible patients by diagnosis
          </h2>
          <div className="space-y-2">
            {diagnosisSummary.map((row) => (
              <div
                key={row.diagnosis}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="text-sm text-slate-800">{row.diagnosis}</span>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                  {row.eligible_patient_count} eligible
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Quick links
          </h2>
          <div className="space-y-3">
            {matches.slice(0, 4).map((match) => (
              <Link
                key={`${match.patient_id}-${match.trial_id}`}
                href={matchPath(match.patient_id, match.trial_id)}
                className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow"
              >
                <p className="font-medium text-slate-900">
                  {match.patient_id} → {match.trial_id}
                </p>
                <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                  {match.trial_title}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {tierLabel[match.tier]} · score {match.score}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
