import { MatchTable } from "@/components/matches/MatchTable";
import { api } from "@/lib/api";

export default async function MatchesPage() {
  const { data: matches } = await api.getMatches();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Matches</h2>
        <p className="mt-1 text-sm text-slate-600">
          All patient–trial recommendations with eligibility breakdowns and audit
          history.
        </p>
      </div>
      <MatchTable matches={matches} />
    </div>
  );
}
