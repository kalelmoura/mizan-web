import { StatusBadge } from "@/components/ui/StatusBadge";
import type { CriterionEvaluation } from "@/lib/types";
import {
  criterionStatusColor,
  criterionStatusLabel,
  formatDateTime,
} from "@/lib/utils";

interface CriteriaListProps {
  criteria: CriterionEvaluation[];
}

function CriteriaGroup({
  title,
  items,
  variant,
}: {
  title: string;
  items: CriterionEvaluation[];
  variant: "inclusion" | "exclusion";
}) {
  if (items.length === 0) return null;

  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
        <span
          className={`rounded px-2 py-0.5 text-xs uppercase tracking-wide ${
            variant === "inclusion"
              ? "bg-teal-100 text-teal-800"
              : "bg-rose-100 text-rose-800"
          }`}
        >
          {title}
        </span>
        <span className="font-normal text-slate-500">
          {items.length} criteria
        </span>
      </h3>
      <ul className="space-y-3">
        {items.map((criterion) => (
          <li
            key={criterion.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900">
                  {criterion.ordinal}. {criterion.text}
                </p>
                {criterion.evidence && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Evidence: </span>
                    {criterion.evidence}
                  </p>
                )}
                {criterion.notes && (
                  <p className="mt-1 text-sm italic text-slate-500">
                    {criterion.notes}
                  </p>
                )}
              </div>
              <StatusBadge
                label={criterionStatusLabel[criterion.status]}
                className={criterionStatusColor[criterion.status]}
              />
            </div>
            {criterion.evaluatedAt && (
              <p className="mt-3 text-xs text-slate-400">
                Evaluated {formatDateTime(criterion.evaluatedAt)}
                {criterion.evaluatedBy ? ` by ${criterion.evaluatedBy}` : ""}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CriteriaList({ criteria }: CriteriaListProps) {
  const inclusions = criteria
    .filter((c) => c.type === "inclusion")
    .sort((a, b) => a.ordinal - b.ordinal);
  const exclusions = criteria
    .filter((c) => c.type === "exclusion")
    .sort((a, b) => a.ordinal - b.ordinal);

  return (
    <div className="space-y-8">
      <CriteriaGroup title="Inclusion" items={inclusions} variant="inclusion" />
      <CriteriaGroup title="Exclusion" items={exclusions} variant="exclusion" />
    </div>
  );
}
