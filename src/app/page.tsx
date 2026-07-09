import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { AuditTrail } from "@/components/matches/AuditTrail";
import { MatchTable } from "@/components/matches/MatchTable";
import { api } from "@/lib/api";
import { getMatchDetail } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";

export default async function DashboardPage() {
  const [stats, matchesResult, auditResult] = await Promise.all([
    api.getDashboardStats(),
    api.getMatches({ limit: 5 }),
    api.getGlobalAudit(1, 5),
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-600">
          Eligibility screening status across patients and active trials.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Patients"
            value={stats.patientCount}
            hint="In matching pool"
            accent="teal"
          />
          <StatCard
            label="Active trials"
            value={stats.activeTrialCount}
            hint="Recruiting or active"
            accent="slate"
          />
          <StatCard
            label="Open matches"
            value={stats.pendingMatchCount}
            hint="Screening or pending review"
            accent="amber"
          />
          <StatCard
            label="Needs screening"
            value={stats.needsScreeningCount}
            hint="Criteria awaiting coordinator"
            accent="rose"
          />
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Recent matches
            </h2>
            <p className="text-sm text-slate-500">
              Latest patient–trial recommendations
            </p>
          </div>
          <Link
            href="/matches"
            className="text-sm font-medium text-teal-700 hover:underline"
          >
            View all
          </Link>
        </div>
        <MatchTable matches={matchesResult.data} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Recent audit activity
          </h2>
          <AuditTrail events={auditResult.data} />
        </div>
        <div>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Quick links
          </h2>
          <div className="space-y-3">
            {matchesResult.data.slice(0, 3).map((match) => {
              const detail = getMatchDetail(match.id);
              return (
                <Link
                  key={match.id}
                  href={`/matches/${match.id}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-teal-300 hover:shadow"
                >
                  <p className="font-medium text-slate-900">
                    {detail?.patient.displayName}
                  </p>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-600">
                    {detail?.trial.title}
                  </p>
                  <p className="mt-2 text-xs text-slate-400">
                    Updated {formatRelativeTime(match.updatedAt)}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
