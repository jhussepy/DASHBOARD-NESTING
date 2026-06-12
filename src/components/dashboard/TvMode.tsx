import { OnboardingData } from "@/lib/types/onboarding";
import { aiAnswer, buildAlerts } from "@/lib/utils/analytics";
import { isActive, isBlocked, lower } from "@/lib/utils/format";

export function TvMode({ data }: { data: OnboardingData }) {
  const alerts = buildAlerts(data);
  const retailPending = data.accesosContrato.filter((item) => !isActive(item.retail)).length;
  const contractPending = data.accesosContrato.filter((item) => !isActive(item.firmaContrato)).length;
  const blocked = data.asesores.filter((advisor) => isBlocked(advisor.estadoGeneral)).length;
  return (
    <section id="modo-tv" className="rounded-[2.4rem] border border-red-500/25 bg-black p-5 text-white shadow-[0_0_70px_rgba(230,0,0,.24)] lg:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[.30em] text-red-300">Modo TV full screen</p><h2 className="mt-2 text-4xl font-black">Sala de coordinación</h2></div><div className="h-3 w-3 animate-pulse rounded-full bg-red-500 shadow-[0_0_22px_rgba(230,0,0,.9)]" /></div>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        <Metric label="Nuevos" value={data.asesores.length} hot />
        <Metric label="Listos" value={data.asesores.filter((a) => lower(a.estadoGeneral).includes("listo")).length} />
        <Metric label="Bloqueados" value={blocked} />
        <Metric label="Retail pendiente" value={retailPending} />
        <Metric label="Contrato pendiente" value={contractPending} />
        <Metric label="Alertas" value={alerts.length} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_1fr_1.1fr]">
        <div className="rounded-3xl bg-white/8 p-5"><h3 className="text-xl font-black">Ranking</h3>{[...data.asesores].sort((a, b) => b.avance - a.avance).map((advisor) => <p key={advisor.id} className="mt-3 text-sm text-white/75">• {advisor.nombreCompleto} — {advisor.avance}%</p>)}</div>
        <div className="rounded-3xl bg-white/8 p-5"><h3 className="text-xl font-black">Alertas críticas</h3>{alerts.slice(0, 6).map((alert) => <p key={`${alert.advisorId}-${alert.title}`} className="mt-3 text-sm text-white/75">• {alert.advisorName}: {alert.title}</p>)}</div>
        <pre className="whitespace-pre-wrap rounded-3xl bg-white/8 p-5 text-sm leading-7 text-white/80">{aiAnswer("resumen", data)}</pre>
      </div>
    </section>
  );
}

function Metric({ label, value, hot }: { label: string; value: number; hot?: boolean }) {
  return <div className={`rounded-3xl p-5 ${hot ? "bg-red-600" : "bg-white/8"}`}><p className="text-5xl font-black">{value}</p><p className="mt-2 text-sm font-bold text-white/75">{label}</p></div>;
}
