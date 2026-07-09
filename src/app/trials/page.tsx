import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { trialStatusColor } from "@/lib/utils";

export default async function TrialsPage() {
  const { data: trials } = await api.getTrials();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Trials</h2>
        <p className="mt-1 text-sm text-slate-600">
          Active and recruiting clinical trials in the matching pool.
        </p>
      </div>

      <div className="space-y-4">
        {trials.map((trial) => (
          <Link
            key={trial.id}
            href={`/trials/${trial.id}`}
            className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-teal-700">
                  {trial.nctId} · {trial.phase}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {trial.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">{trial.condition}</p>
              </div>
              <StatusBadge
                label={trial.status}
                className={`${trialStatusColor[trial.status]} capitalize`}
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span>Sponsor: {trial.sponsor}</span>
              <span>{trial.inclusionCount} inclusion criteria</span>
              <span>{trial.exclusionCount} exclusion criteria</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
