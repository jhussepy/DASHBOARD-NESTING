"use client";
import { ThemeSelector } from "@/components/theme/ThemeSelector";

const nav = ["Control", "Copiloto IA", "Asesores", "Accesos", "Inducción", "Tarifas", "Rebate", "Formación", "Calidad", "Incidencias", "Modo TV"];

export function Shell({ children, updatedAt, onSync, syncing }: { children: React.ReactNode; updatedAt?: string; onSync: () => void; syncing: boolean }) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_0_0,rgba(230,0,0,.24),transparent_32rem),radial-gradient(circle_at_90%_5%,rgba(255,255,255,.10),transparent_25rem)]" />
      <div className="relative mx-auto grid max-w-[1900px] gap-5 px-4 py-4 lg:grid-cols-[292px_minmax(0,1fr)] xl:px-6">
        <aside className="sticky top-4 z-30 h-fit rounded-[2rem] border border-[var(--border)] bg-[var(--shell)] p-5 shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--brand)] text-3xl font-black text-white shadow-[0_0_45px_rgba(230,0,0,.40)]">V</div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[.32em] text-[var(--muted)]">Vodafone</p>
              <h1 className="text-lg font-black leading-tight">Onboarding Command Center</h1>
            </div>
          </div>
          <div className="mt-5"><ThemeSelector /></div>
          <button onClick={onSync} className="mt-4 w-full rounded-2xl bg-[var(--brand)] px-4 py-3 text-sm font-black text-white shadow-[0_18px_45px_rgba(230,0,0,.28)] transition hover:-translate-y-0.5 hover:bg-red-700">
            {syncing ? "Sincronizando..." : "Sincronizar Excel"}
          </button>
          <p className="mt-3 text-xs leading-5 text-[var(--muted)]">Fuente: <span className="font-semibold">data/vodafone_onboarding_base_dinamica.xlsx</span></p>
          {updatedAt && <p className="mt-1 text-xs text-[var(--muted)]">Última lectura: {new Date(updatedAt).toLocaleString("es-ES")}</p>}
          <nav className="mt-6 grid gap-1.5">
            {nav.map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--muted)] transition hover:bg-[var(--brand)] hover:text-white">{item}</a>)}
          </nav>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
