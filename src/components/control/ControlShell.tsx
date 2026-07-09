import Link from "next/link";
import type { ReactNode } from "react";

export function ControlShell({ children }: { children: ReactNode }) {
  return (
    <div className="control-shell min-h-screen bg-[#0b1220] text-slate-100">
      <header className="border-b border-[#1e2d4a] bg-[#0a101c]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-start justify-between gap-4 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-blue-400">
              Mizan · behind the scenes
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white">
              TrialMatch — Clinical Trial Recruitment Intelligence
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Urgency-ranked at-risk trials · Patient eligibility · GCP audit
              trail
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Tag label="Oncology" live />
            <Tag label="NSCLC" />
            <Tag label="Recruitment" />
            <Link
              href="/"
              className="ml-2 rounded-lg border border-[#243552] px-3 py-1.5 text-xs text-slate-400 transition hover:border-blue-500 hover:text-white"
            >
              ← Coordinator app
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
    </div>
  );
}

function Tag({ label, live }: { label: string; live?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#243552] bg-[#111a2e] px-3 py-1 text-xs text-slate-300">
      {live && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      )}
      {label}
    </span>
  );
}
