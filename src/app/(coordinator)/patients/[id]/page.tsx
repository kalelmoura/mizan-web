import Link from "next/link";
import { notFound } from "next/navigation";
import { PatientTrialEligibility } from "@/components/patients/PatientTrialEligibility";
import { FactMatchBar } from "@/components/patients/FactMatchBar";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { api } from "@/lib/api";
import { buildPatientTrialEligibility } from "@/lib/eligibility";
import { patientLabel } from "@/lib/utils";

interface PatientDetailPageProps {
  params: Promise<{ id: string }>;
}

function factDisplayValue(
  fact: { num_value: number | string | null; str_value: string; unit: string }
): string {
  if (fact.num_value !== "" && fact.num_value !== null) {
    const unit = fact.unit || fact.str_value;
    return unit ? `${fact.num_value} ${unit}`.trim() : String(fact.num_value);
  }
  return fact.str_value || "—";
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

  const trialEligibility = await Promise.all(
    matches.map(async (match) => {
      const audit = await api.getAuditTrail(match.patient_id, match.trial_id);
      return buildPatientTrialEligibility(patient, facts, match, audit);
    })
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/patients"
            className="text-sm text-blue-700 hover:underline"
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

      {matches.length > 0 ? (
        <PatientTrialEligibility trials={trialEligibility} />
      ) : (
        <section className="rounded-xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
          <p className="text-sm text-slate-600">
            No trial connections for this patient.
          </p>
        </section>
      )}

      {matches.length === 0 && facts.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Clinical facts
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            No trial matches yet — facts are not linked to eligibility criteria.
          </p>
          <div className="mt-4 space-y-3">
            {facts.map((fact) => (
              <FactMatchBar
                key={fact.fact_id}
                label={fact.field_name}
                fieldName={fact.field_name}
                value={factDisplayValue(fact)}
                source={fact.source}
                confidence={fact.confidence}
                matchScore={0}
                overallResult="UNKNOWN"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
