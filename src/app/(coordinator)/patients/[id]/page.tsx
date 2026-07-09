import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTable } from "@/components/matches/MatchTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { patientLabel } from "@/lib/utils";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;
  const [detail, matches] = await Promise.all([
    api.getPatient(id),
    api.getMatches({ patient_id: id }),
  ]);

  if (!detail) notFound();

  const { patient, facts } = detail;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/patients"
            className="text-sm text-teal-700 hover:underline"
          >
            ← Patients
          </Link>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {patient.patient_id}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {patientLabel(patient.patient_id, patient.age, patient.sex)}
          </p>
        </div>
        <StatusBadge
          label={`${patient.city}, ${patient.country}`}
          className="border-slate-200 bg-slate-100 text-slate-700"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Clinical facts
        </h3>
        {facts.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            No structured facts available for this patient in mock data.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    Field
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    Source
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-slate-600">
                    Confidence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facts.map((fact) => (
                  <tr key={fact.fact_id}>
                    <td className="px-4 py-2 font-medium text-slate-800">
                      {fact.field_name}
                    </td>
                    <td className="px-4 py-2 text-slate-700">
                      {fact.num_value !== "" && fact.num_value !== null
                        ? String(fact.num_value)
                        : fact.str_value}
                      {fact.unit ? ` ${fact.unit}` : ""}
                      {fact.negated ? " (negated)" : ""}
                    </td>
                    <td className="px-4 py-2 text-slate-500">{fact.source}</td>
                    <td className="px-4 py-2 text-slate-500">
                      {fact.confidence}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Trial matches ({matches.length})
        </h3>
        <MatchTable matches={matches} showPatient={false} showTrial />
      </section>
    </div>
  );
}
