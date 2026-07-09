import Link from "next/link";
import { notFound } from "next/navigation";
import { MatchTable } from "@/components/matches/MatchTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, patientAge } from "@/lib/utils";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function PatientDetailPage({
  params,
}: PatientDetailPageProps) {
  const { id } = await params;
  const [patient, matchesResult] = await Promise.all([
    api.getPatient(id),
    api.getMatches({ patientId: id }),
  ]);

  if (!patient) notFound();

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
            {patient.firstName} {patient.lastName}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{patient.mrn}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge
            label={`Age ${patientAge(patient.dateOfBirth)}`}
            className="border-slate-200 bg-slate-100 text-slate-700"
          />
          <StatusBadge
            label={patient.sex}
            className="border-slate-200 bg-slate-100 text-slate-700 capitalize"
          />
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Clinical profile
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Date of birth</dt>
            <dd className="text-sm font-medium text-slate-900">
              {formatDate(patient.dateOfBirth)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Last screened</dt>
            <dd className="text-sm font-medium text-slate-900">
              {patient.lastScreenedAt
                ? formatDate(patient.lastScreenedAt)
                : "Never"}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-slate-500">Conditions</dt>
            <dd className="mt-1 flex flex-wrap gap-2">
              {patient.conditions.map((c) => (
                <span
                  key={c}
                  className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs text-teal-800"
                >
                  {c}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold text-slate-900">
          Trial matches ({matchesResult.data.length})
        </h3>
        <MatchTable
          matches={matchesResult.data}
          showPatient={false}
          showTrial
        />
      </section>
    </div>
  );
}
