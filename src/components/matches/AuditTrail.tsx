import type { AuditEvent } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

interface AuditTrailProps {
  events: AuditEvent[];
}

function describeEvent(event: AuditEvent): string {
  switch (event.action) {
    case "match_created":
      return "Match screening started";
    case "criteria_evaluated":
      return "Criterion auto-evaluated";
    case "criterion_updated":
      return "Criterion updated by coordinator";
    case "status_updated":
      return "Match status changed";
    case "recommendation_set":
      return "Recommendation recorded";
    default:
      return event.action.replace(/_/g, " ");
  }
}

export function AuditTrail({ events }: AuditTrailProps) {
  if (events.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-8 text-center text-sm text-slate-500">
        No audit events yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-0 border-l border-slate-200 pl-6">
      {events.map((event, index) => (
        <li key={event.id} className="relative pb-8 last:pb-0">
          <span className="absolute -left-[1.625rem] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-white bg-teal-500 ring-2 ring-teal-100" />
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {describeEvent(event)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {event.actor} · {formatDateTime(event.timestamp)}
                </p>
              </div>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                {event.entityType}
              </span>
            </div>
            {(event.previousValue || event.newValue) && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {event.previousValue && (
                  <span className="rounded bg-rose-50 px-2 py-1 text-rose-700 line-through">
                    {event.previousValue}
                  </span>
                )}
                {event.previousValue && event.newValue && (
                  <span className="text-slate-400">→</span>
                )}
                {event.newValue && (
                  <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">
                    {event.newValue}
                  </span>
                )}
              </div>
            )}
            {event.notes && (
              <p className="mt-2 text-sm text-slate-600">{event.notes}</p>
            )}
          </div>
          {index < events.length - 1 && (
            <span className="absolute -left-px top-4 h-full w-px bg-slate-200" />
          )}
        </li>
      ))}
    </ol>
  );
}
