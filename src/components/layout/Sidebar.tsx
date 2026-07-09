"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/patients", label: "Patients", icon: "◎" },
  { href: "/trials", label: "Trials", icon: "⬡" },
  { href: "/matches", label: "Matches", icon: "⇄" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-slate-800 bg-[#0a101c] text-slate-100">
      <div className="border-b border-slate-800 px-5 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-lg font-bold text-white">
            M
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide">Mizan</p>
            <p className="text-xs text-slate-400">Trial matching</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-blue-600/20 text-blue-300"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="text-base opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-4">
        <Link
          href="/control"
          className="block rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-3 transition hover:border-blue-500/50"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Behind the scenes
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            Control panel
          </p>
          <p className="mt-0.5 text-xs text-slate-500">Read-only observability</p>
        </Link>
      </div>

      <div className="border-t border-slate-800 px-5 py-4">
        <p className="text-xs text-slate-500">Coordinator</p>
        <p className="text-sm font-medium text-slate-200">Dr. Sarah Chen</p>
        <p className="mt-1 text-xs text-slate-500">Site 104 · Oncology</p>
      </div>
    </aside>
  );
}
