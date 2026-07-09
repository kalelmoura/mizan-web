import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTable } from "@/components/matches/MatchTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { trialStatusColor } from "@/lib/utils";

interface TrialDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TrialDetailPage({ params }: TrialDetailPageProps) {
  const { id } = await params;
  const [trial, matchesResult] = await Promise.all([
    api.getTrial(id),
    api.getMatches({ trialId: id }),
  ]);

  if (!trial) notFound();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/trials" className="text-sm text-teal-700 hover:underline">
          ← Trials
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-sm font-medium text-teal-700">
            {trial.nctId} · {trial.phase}
          </p>
          <StatusBadge
            label={trial.status}
            className={`${trialStatusColor[trial.status]} capitalize`}
          />
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">
          {trial.title}
        </h2>
        <p className="mt-2 text-slate-600">{trial.condition}</p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Protocol summary
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-slate-500">Sponsor</dt>
            <dd className="text-sm font-medium text-slate-900">{trial.sponsor}</dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Inclusion criteria</dt>
            <dd className="text-sm font-medium text-slate-900">
              {trial.inclusionCount}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Exclusion criteria</dt>
            <dd className="text-sm font-medium text-slate-900">
              {trial.exclusionCount}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Patient matches ({matchesResult.data.length})
        </h3>
        <MatchTable matches={matchesResult.data} showPatient showTrial={false} />
      </section>
    </div>
  );
}
