import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { formatDate, patientAge } from "@/lib/utils";

export default async function PatientsPage() {
  const { data: patients } = await api.getPatients();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Patients</h2>
        <p className="mt-1 text-sm text-slate-600">
          Patients available for trial eligibility screening.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <Link
            key={patient.id}
            href={`/patients/${patient.id}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-sm text-slate-500">{patient.mrn}</p>
              </div>
              <StatusBadge
                label={`${patientAge(patient.dateOfBirth)}y`}
                className="border-slate-200 bg-slate-100 text-slate-700"
              />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {patient.conditions.map((condition) => (
                <span
                  key={condition}
                  className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs text-teal-800"
                >
                  {condition}
                </span>
              ))}
            </div>
            {patient.lastScreenedAt && (
              <p className="mt-4 text-xs text-slate-400">
                Last screened {formatDate(patient.lastScreenedAt)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
