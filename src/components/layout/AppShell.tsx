"use client";

import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-slate-200 bg-white px-8 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-teal-600">
            Clinical trial coordination
          </p>
          <h1 className="text-lg font-semibold text-slate-900">
            Patient–trial matching with full audit trail
          </h1>
        </header>
        <main className="flex-1 overflow-auto px-8 py-6">{children}</main>
      </div>
    </div>
  );
}
