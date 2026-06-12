import { Advisor } from "@/lib/types/onboarding";

export function ProgressBars({ advisors }: { advisors: Advisor[] }) {
  return (
    <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <div className="flex items-center justify-between"><h3 className="text-xl font-black">Ranking de avance</h3><span className="text-xs font-bold text-[var(--muted)]">Top onboarding</span></div>
      <div className="mt-5 space-y-4">
        {[...advisors].sort((a, b) => b.avance - a.avance).map((advisor, index) => (
          <div key={advisor.id}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm"><span className="font-bold"><span className="text-[var(--brand)]">#{index + 1}</span> {advisor.nombreCompleto}</span><span className="font-black">{advisor.avance}%</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-strong)]"><div className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] via-red-400 to-rose-200 shadow-[0_0_22px_rgba(230,0,0,.42)]" style={{ width: `${advisor.avance}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
