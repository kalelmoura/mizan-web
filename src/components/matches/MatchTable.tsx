import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Match } from "@/lib/types";
import { getMatchDetail } from "@/lib/mock-data";
import {
  confidenceColor,
  formatRelativeTime,
  matchStatusColor,
  matchStatusLabel,
  recommendationLabel,
} from "@/lib/utils";

interface MatchTableProps {
  matches: Match[];
  showPatient?: boolean;
  showTrial?: boolean;
}

export function MatchTable({
  matches,
  showPatient = true,
  showTrial = true,
}: MatchTableProps) {
  if (matches.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm text-slate-500">
        No matches found.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {showPatient && (
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Patient
              </th>
            )}
            {showTrial && (
              <th className="px-4 py-3 text-left font-medium text-slate-600">
                Trial
              </th>
            )}
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Status
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Criteria
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Confidence
            </th>
            <th className="px-4 py-3 text-left font-medium text-slate-600">
              Updated
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {matches.map((match) => {
            const detail = getMatchDetail(match.id);
            const summary = match.criteriaSummary;
            return (
              <tr key={match.id} className="hover:bg-slate-50">
                {showPatient && (
                  <td className="px-4 py-3">
                    <Link
                      href={`/matches/${match.id}`}
                      className="font-medium text-teal-700 hover:underline"
                    >
                      {detail?.patient.displayName ?? match.patientId}
                    </Link>
                    {detail && (
                      <p className="text-xs text-slate-500">{detail.patient.mrn}</p>
                    )}
                  </td>
                )}
                {showTrial && (
                  <td className="px-4 py-3">
                    <p className="line-clamp-1 font-medium text-slate-800">
                      {detail?.trial.title ?? match.trialId}
                    </p>
                    {detail && (
                      <p className="text-xs text-slate-500">{detail.trial.nctId}</p>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    <StatusBadge
                      label={matchStatusLabel[match.status]}
                      className={matchStatusColor[match.status]}
                    />
                    <span className="text-xs text-slate-500">
                      {recommendationLabel[match.recommendation]}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                      {summary.passed} pass
                    </span>
                    <span className="rounded bg-rose-100 px-1.5 py-0.5 text-rose-700">
                      {summary.failed} fail
                    </span>
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-700">
                      {summary.needsScreening} screen
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-semibold ${confidenceColor(match.confidenceScore)}`}>
                    {match.confidenceScore ?? "—"}%
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {formatRelativeTime(match.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
