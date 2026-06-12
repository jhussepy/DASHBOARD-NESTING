"use client";

import { FormEvent, useMemo, useState } from "react";
import { advisorsSeed, dynamicConfigSeed, objectionsSeed, tariffsSeed } from "@/lib/demo-data";
import { generateAiResponse, getAlerts, getKpis } from "@/lib/analytics";
import { Advisor, AdvisorStatus, DynamicConfig, Tariff } from "@/lib/types";

const navItems = ["Control", "Asesores", "Accesos", "Inducción", "Tarifas", "Rebate", "Formación", "Calidad", "Reportes", "Modo TV", "Configuración"];
const statusOptions: AdvisorStatus[] = ["Nuevo ingreso", "En documentación", "Pendiente de contrato", "Contrato enviado", "Contrato firmado", "Credenciales pendientes", "Retail pendiente", "En formación", "Listo para producción", "Bloqueado", "Baja / No continúa"];

function toneClass(tone: string) {
  return {
    danger: "border-red-500/40 bg-red-500/10 text-red-100",
    warning: "border-amber-400/40 bg-amber-400/10 text-amber-100",
    success: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100",
    neutral: "border-white/10 bg-white/[0.055] text-white",
  }[tone] ?? "border-white/10 bg-white/[0.055] text-white";
}

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${toneClass(tone)}`}>{children}</span>;
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 rounded-full bg-white/10">
      <div className="h-2 rounded-full bg-gradient-to-r from-vodafone-red to-red-300 shadow-glow transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

function Section({ id, title, subtitle, children }: { id: string; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 space-y-5">
      <div>
        <h2 className="section-title">{title}</h2>
        <p className="muted mt-1">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

function AiPanel({ advisors }: { advisors: Advisor[] }) {
  const [prompt, setPrompt] = useState("Dame el resumen de ingresos de hoy");
  const [response, setResponse] = useState(() => generateAiResponse("resumen", advisors));
  const examples = ["Qué asesores están bloqueados y por qué", "Qué asesores no tienen retail activo", "Crea un mensaje para recordar la firma del contrato", "Quién no ha recibido explicación de cancelación de movilidad", "Genera un reporte para mi superior"];

  const ask = (value = prompt) => {
    setPrompt(value);
    setResponse(generateAiResponse(value, advisors));
  };

  return (
    <aside className="glass-card sticky top-4 z-20 h-fit p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-vodafone-red">IA principal</p>
          <h2 className="mt-1 text-2xl font-bold">Copiloto de coordinación</h2>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-vodafone-red text-xl font-black shadow-glow">AI</div>
      </div>
      <p className="muted mt-3">Resume, prioriza, genera mensajes, reportes, constancias internas y recomendaciones operativas.</p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask();
        }}
      >
        <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} className="focus-ring min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white placeholder:text-white/30" />
        <button className="focus-ring w-full rounded-2xl bg-vodafone-red px-4 py-3 font-semibold text-white shadow-glow transition hover:bg-red-700">Analizar con IA</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((item) => (
          <button key={item} onClick={() => ask(item)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition hover:border-vodafone-red hover:text-white">{item}</button>
        ))}
      </div>
      <pre className="mt-4 whitespace-pre-wrap rounded-2xl border border-white/10 bg-black/35 p-4 text-sm leading-6 text-white/85">{response}</pre>
    </aside>
  );
}

function AdvisorForm({ onCreate }: { onCreate: (advisor: Advisor) => void }) {
  const [name, setName] = useState("");
  const [supervisor, setSupervisor] = useState("Laura Campos");
  const [status, setStatus] = useState<AdvisorStatus>("Nuevo ingreso");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const template = advisorsSeed[0];
    onCreate({
      ...template,
      id: `adv-${Date.now()}`,
      fullName: name,
      identifier: `INT-${Math.floor(Math.random() * 9000 + 1000)}`,
      entryDate: new Date().toISOString().slice(0, 10),
      supervisor,
      status,
      phone: "+34 600 000 000",
      email: `${name.toLowerCase().replaceAll(" ", ".")}@example.com`,
      observations: "Registro demo creado desde el panel. Completar documentación y evidencias.",
      progress: 12,
      nextAction: "Completar ficha, solicitar accesos y agendar inducción operativa.",
      tags: ["nuevo"],
      access: { ...template.access, vodafoneUser: "no solicitado", corporateAccess: "no solicitado", learningPlatform: "pendiente", retail: "pendiente", contractDelivery: "pendiente", contractSignature: "pendiente", requestDate: undefined, activationDate: undefined, owner: supervisor, notes: "Pendiente de inicio operativo.", incidents: [], internalEvidence: [] },
      changes: [{ date: new Date().toLocaleString("es-ES"), author: supervisor, action: "Alta de asesor", note: "Registro creado sin credenciales sensibles." }],
    });
    setName("");
  };

  return (
    <form onSubmit={submit} className="glass-card grid gap-3 p-5 md:grid-cols-4">
      <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre completo" className="focus-ring rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
      <input value={supervisor} onChange={(event) => setSupervisor(event.target.value)} placeholder="Supervisor" className="focus-ring rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" />
      <select value={status} onChange={(event) => setStatus(event.target.value as AdvisorStatus)} className="focus-ring rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm">
        {statusOptions.map((option) => <option key={option}>{option}</option>)}
      </select>
      <button className="focus-ring rounded-2xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-red-100">Crear asesor</button>
    </form>
  );
}

export default function Home() {
  const [advisors, setAdvisors] = useState(advisorsSeed);
  const [tariffs, setTariffs] = useState(tariffsSeed);
  const [objections, setObjections] = useState(objectionsSeed);
  const [config, setConfig] = useState(dynamicConfigSeed);
  const kpis = useMemo(() => getKpis(advisors), [advisors]);
  const alerts = useMemo(() => getAlerts(advisors), [advisors]);
  const ranking = [...advisors].sort((a, b) => b.progress - a.progress);

  const updateAdvisor = (id: string, patch: Partial<Advisor>) => setAdvisors((current) => current.map((advisor) => advisor.id === id ? { ...advisor, ...patch, changes: [...advisor.changes, { date: new Date().toLocaleString("es-ES"), author: "Sistema demo", action: "Edición rápida", note: "Cambio registrado en historial." }] } : advisor));
  const addConfigValue = (key: keyof DynamicConfig, value: string) => value.trim() && setConfig((current) => ({ ...current, [key]: [...(current[key] as string[]), value.trim()] }));

  return (
    <main className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1800px] gap-6 xl:grid-cols-[280px_1fr_420px]">
        <nav className="glass-card sticky top-4 z-20 h-fit p-5">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-vodafone-red text-2xl font-black shadow-glow">V</div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">Vodafone</p>
              <h1 className="text-lg font-bold leading-tight">Onboarding Command Center</h1>
            </div>
          </div>
          <div className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-vodafone-red hover:text-white">{item}</a>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-vodafone-red/30 bg-vodafone-red/10 p-4">
            <p className="text-sm font-semibold">Arquitectura preparada</p>
            <p className="muted mt-1">Estado operativo, evidencias e historial listos para conectar a una base de datos real.</p>
          </div>
        </nav>

        <div className="space-y-10">
          <header className="glass-card overflow-hidden p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <Badge tone="danger">Control center premium</Badge>
                <h2 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">Vodafone Onboarding Command Center</h2>
                <p className="mt-4 max-w-3xl text-lg text-white/70">Gestión integral de ingresos, accesos operativos, retail, contrato, formación, calidad, evidencias y producción inicial con IA visible en todo el flujo.</p>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-bold">{advisors.length}</p><p className="muted">asesores</p></div>
                <div className="rounded-2xl bg-white/10 p-4"><p className="text-3xl font-bold">{alerts.length}</p><p className="muted">alertas</p></div>
                <div className="rounded-2xl bg-vodafone-red p-4"><p className="text-3xl font-bold">IA</p><p className="text-sm text-white/80">principal</p></div>
              </div>
            </div>
          </header>

          <Section id="control" title="Dashboard general" subtitle="KPIs, semáforos, ranking, alertas automáticas y visión ejecutiva para coordinación.">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {kpis.map((kpi) => <div key={kpi.label} className={`rounded-3xl border p-5 ${toneClass(kpi.tone)}`}><p className="text-3xl font-black">{kpi.value}</p><p className="mt-2 text-sm opacity-75">{kpi.label}</p></div>)}
            </div>
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="glass-card p-5">
                <h3 className="font-semibold">Ranking de avance</h3>
                <div className="mt-4 space-y-4">{ranking.map((advisor) => <div key={advisor.id}><div className="mb-2 flex justify-between text-sm"><span>{advisor.fullName}</span><span>{advisor.progress}%</span></div><ProgressBar value={advisor.progress} /></div>)}</div>
              </div>
              <div className="glass-card p-5">
                <h3 className="font-semibold">Alertas críticas y semáforos</h3>
                <div className="mt-4 space-y-3">{alerts.slice(0, 6).map((alert, index) => <div key={`${alert.advisor}-${index}`} className="rounded-2xl border border-white/10 bg-black/20 p-4"><div className="flex flex-wrap items-center gap-2"><Badge tone={alert.severity === "crítica" ? "danger" : alert.severity === "alta" ? "warning" : "neutral"}>{alert.severity}</Badge><strong>{alert.advisor}</strong></div><p className="mt-2 text-sm text-white/70">{alert.message}</p><p className="mt-1 text-sm text-red-100">Acción: {alert.action}</p></div>)}</div>
              </div>
            </div>
          </Section>

          <Section id="asesores" title="Gestión de asesores" subtitle="Crear, editar, eliminar, consultar y auditar asesores con historial de cambios.">
            <AdvisorForm onCreate={(advisor) => setAdvisors((current) => [advisor, ...current])} />
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] text-left text-sm">
                  <thead className="bg-white/10 text-xs uppercase tracking-wider text-white/60"><tr>{["Asesor", "Identificador", "Ingreso", "Supervisor", "Turno", "Campaña", "Estado", "Avance", "Próxima acción", "Acciones"].map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
                  <tbody>{advisors.map((advisor) => <tr key={advisor.id} className="border-t border-white/10"><td className="px-4 py-4"><strong>{advisor.fullName}</strong><div className="text-white/45">{advisor.email} · {advisor.phone}</div><div className="mt-2 flex gap-1">{advisor.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div></td><td className="px-4 py-4">{advisor.identifier}</td><td className="px-4 py-4">{advisor.entryDate}</td><td className="px-4 py-4">{advisor.supervisor}</td><td className="px-4 py-4">{advisor.shift}</td><td className="px-4 py-4">{advisor.campaign}</td><td className="px-4 py-4"><select value={advisor.status} onChange={(event) => updateAdvisor(advisor.id, { status: event.target.value as AdvisorStatus })} className="rounded-xl border border-white/10 bg-black/40 p-2">{statusOptions.map((s) => <option key={s}>{s}</option>)}</select></td><td className="px-4 py-4"><div className="w-28"><ProgressBar value={advisor.progress} /></div><span>{advisor.progress}%</span></td><td className="px-4 py-4 text-white/70">{advisor.nextAction}</td><td className="px-4 py-4"><button onClick={() => setAdvisors((current) => current.filter((item) => item.id !== advisor.id))} className="rounded-xl border border-red-400/40 px-3 py-2 text-red-100">Eliminar</button></td></tr>)}</tbody>
                </table>
              </div>
            </div>
          </Section>

          <Section id="accesos" title="Credenciales, contrato y accesos" subtitle="Control operativo sin almacenar contraseñas ni datos sensibles; solo estados de gestión.">
            <div className="grid gap-4 lg:grid-cols-2">{advisors.map((advisor) => <div key={advisor.id} className="glass-card p-5"><div className="flex items-start justify-between gap-3"><div><h3 className="font-semibold">{advisor.fullName}</h3><p className="muted">Responsable: {advisor.access.owner ?? "Sin asignar"}</p></div><Badge tone={advisor.status === "Bloqueado" ? "danger" : "neutral"}>{advisor.status}</Badge></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm">{[["Usuario Vodafone", advisor.access.vodafoneUser], ["Correo/acceso interno", advisor.access.corporateAccess], ["Plataforma formación", advisor.access.learningPlatform], ["Retail", advisor.access.retail], ["Envío contrato", advisor.access.contractDelivery], ["Firma contrato", advisor.access.contractSignature]].map(([label, value]) => <div key={label} className="rounded-2xl bg-black/25 p-3"><p className="text-white/45">{label}</p><p className="font-semibold capitalize">{value}</p></div>)}</div><p className="mt-4 text-sm text-white/70">{advisor.access.notes}</p><div className="mt-3 flex flex-wrap gap-2">{advisor.access.incidents.map((item) => <Badge key={item} tone="warning">{item}</Badge>)}</div></div>)}</div>
          </Section>

          <Section id="inducción" title="Inducción operativa y evidencias" subtitle="Checklist de respaldo interno con constancias, confirmación del asesor y evidencias por punto.">
            <div className="grid gap-4 xl:grid-cols-2">{advisors.map((advisor) => <div key={advisor.id} className="glass-card p-5"><h3 className="font-semibold">{advisor.fullName}</h3><div className="mt-4 max-h-80 space-y-2 overflow-auto pr-2">{advisor.induction.map((item) => <div key={item.id} className="rounded-2xl border border-white/10 bg-black/20 p-3"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-medium">{item.title}</p><Badge tone={item.status === "pendiente" || item.status.includes("requiere") ? "warning" : "success"}>{item.status}</Badge></div><p className="mt-2 text-xs text-white/55">Fecha: {item.explainedAt ?? "pendiente"} · Responsable: {item.owner ?? "pendiente"} · Confirmación: {item.advisorConfirmation ? "sí" : "no"}</p><p className="mt-2 text-xs text-white/70">{item.internalNote}</p></div>)}</div><div className="mt-4 rounded-2xl bg-vodafone-red/10 p-4 text-sm text-red-50">Constancia interna: El asesor recibió inducción sobre cancelación correcta de movilidad el día {advisor.induction[0].explainedAt ?? "____"}, explicada por {advisor.induction[0].owner ?? "____"}. Se deja constancia en el sistema.</div></div>)}</div>
          </Section>

          <Section id="tarifas" title="Biblioteca dinámica de tarifas Vodafone" subtitle="Crear, buscar, filtrar, comparar y generar argumentarios comerciales asistidos por IA.">
            <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-5"><p className="muted">Filtros disponibles: residencial, autónomo, empresa, low cost, valor, fibra, móvil y streaming.</p><button onClick={() => setTariffs((current) => [{ ...tariffsSeed[0], id: `tar-${Date.now()}`, name: "Nueva tarifa demo", price: 29.99, status: "pausada" }, ...current])} className="rounded-2xl bg-vodafone-red px-4 py-3 font-semibold">Crear tarifa</button></div>
            <div className="grid gap-4 lg:grid-cols-3">{tariffs.map((tariff) => <div key={tariff.id} className="glass-card p-5"><div className="flex items-start justify-between gap-3"><input value={tariff.name} onChange={(event) => setTariffs((current) => current.map((item) => item.id === tariff.id ? { ...item, name: event.target.value } : item))} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 p-2 text-lg font-bold" /><select value={tariff.status} onChange={(event) => setTariffs((current) => current.map((item) => item.id === tariff.id ? { ...item, status: event.target.value as Tariff["status"] } : item))} className="rounded-xl border border-white/10 bg-black/40 p-2 text-sm"><option>activa</option><option>pausada</option><option>antigua</option></select></div><p className="mt-3 text-4xl font-black">{tariff.price.toFixed(2)}€</p><p className="muted">{tariff.fiber} · {tariff.mobileLines} líneas · {tariff.gb}</p><div className="mt-4 flex flex-wrap gap-2">{tariff.segments.map((segment) => <Badge key={segment}>{segment}</Badge>)}</div><p className="mt-4 text-sm text-white/70">{tariff.commercialArgument}</p><p className="mt-3 text-sm"><strong>Rebate:</strong> {tariff.recommendedRebate}</p><button onClick={() => setTariffs((current) => current.filter((item) => item.id !== tariff.id))} className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-sm">Eliminar demo</button></div>)}</div>
          </Section>

          <Section id="rebate" title="Rebate y objeciones" subtitle="Biblioteca profesional para simular clientes, evaluar respuestas y crear ejercicios de práctica.">
            <div className="glass-card flex flex-wrap items-center justify-between gap-3 p-5"><p className="muted">La IA puede generar rebate, simular cliente difícil, evaluar respuestas y sugerir mejoras.</p><button onClick={() => setObjections((current) => [{ ...objectionsSeed[0], id: `obj-${Date.now()}`, objection: "Nueva objeción demo", customerType: "personalizado" }, ...current])} className="rounded-2xl bg-vodafone-red px-4 py-3 font-semibold">Crear objeción</button></div>
            <div className="grid gap-4 md:grid-cols-2">{objections.map((item) => <div key={item.id} className="glass-card p-5"><div className="flex justify-between gap-2"><input value={item.objection} onChange={(event) => setObjections((current) => current.map((obj) => obj.id === item.id ? { ...obj, objection: event.target.value } : obj))} className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/30 p-2 text-lg font-bold" /><Badge>{item.customerType}</Badge></div><p className="mt-3 text-sm text-white/70">{item.professionalAnswer}</p><div className="mt-4 grid gap-2 text-sm"><p><strong>Pregunta:</strong> {item.diagnosticQuestion}</p><p><strong>Cierre:</strong> {item.closingTechnique}</p><p><strong>Riesgo calidad:</strong> {item.qualityRisk}</p><p><strong>Ejemplo:</strong> {item.callExample}</p></div><button onClick={() => setObjections((current) => current.filter((obj) => obj.id !== item.id))} className="mt-4 rounded-xl border border-white/10 px-3 py-2 text-sm">Eliminar demo</button></div>)}</div>
          </Section>

          <Section id="formación" title="Formación comercial" subtitle="Módulos, exámenes rápidos, prácticas, simulaciones, evaluación de tarifas y resultado final.">
            <div className="grid gap-4 lg:grid-cols-2">{advisors.map((advisor) => <div key={advisor.id} className="glass-card p-5"><h3 className="font-semibold">{advisor.fullName}</h3><div className="mt-4 space-y-3">{advisor.training.slice(0, 5).map((module) => <div key={module.module} className="rounded-2xl bg-black/25 p-3"><div className="flex justify-between gap-3 text-sm"><span>{module.module}</span><span>{module.progress}% · nota {module.examScore}</span></div><ProgressBar value={module.progress} /><Badge tone={module.result === "apto" ? "success" : module.result === "bloqueado" ? "danger" : "warning"}>{module.result}</Badge></div>)}</div></div>)}</div>
          </Section>

          <Section id="calidad" title="Calidad comercial" subtitle="Control inicial de saludo, oferta, condiciones, tratamiento de datos, cierre, errores y refuerzos.">
            <div className="grid gap-4 lg:grid-cols-2">{advisors.flatMap((advisor) => advisor.quality.map((quality, index) => <div key={`${advisor.id}-${index}`} className="glass-card p-5"><div className="flex items-start justify-between"><div><h3 className="font-semibold">{advisor.fullName}</h3><p className="muted">{quality.date} · llamada {quality.callType}</p></div><Badge tone={quality.needsReinforcement ? "warning" : "success"}>{quality.score}/100</Badge></div><div className="mt-4 grid grid-cols-2 gap-2 text-sm">{[["Saludo", quality.greeting], ["Oferta", quality.offerExplanation], ["Condiciones", quality.conditions], ["Datos", quality.dataProcessing], ["Cierre", quality.correctClose]].map(([label, ok]) => <div key={String(label)} className="rounded-xl bg-black/25 p-3">{label}: {ok ? "cumple" : "no cumple"}</div>)}</div><p className="mt-3 text-sm text-white/70">Errores: {quality.errors.join(", ") || "sin errores críticos"}</p><p className="mt-2 text-sm">{quality.notes}</p></div>))}</div>
          </Section>

          <Section id="reportes" title="Reportes" subtitle="Reportes diario, semanal, por asesor, supervisor, bloqueos, retail, contratos, inducción y exportación simulada.">
            <div className="glass-card grid gap-4 p-5 md:grid-cols-3"><button className="rounded-2xl bg-white px-4 py-3 font-semibold text-black">Exportar Excel</button><button className="rounded-2xl bg-white px-4 py-3 font-semibold text-black">Exportar PDF</button><button className="rounded-2xl bg-vodafone-red px-4 py-3 font-semibold text-white">Generar reporte con IA</button></div>
            <div className="grid gap-4 md:grid-cols-2">{["Reporte diario", "Reporte semanal", "Reporte por asesor", "Reporte por supervisor", "Reporte de bloqueos", "Reporte de retail pendiente", "Reporte de contratos pendientes", "Reporte de inducción operativa", "Reporte de cancelación de movilidad explicada"].map((report) => <div key={report} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5"><h3 className="font-semibold">{report}</h3><p className="muted mt-2">Plantilla preparada para consulta real, filtros avanzados y exportación.</p></div>)}</div>
          </Section>

          <Section id="modo-tv" title="Modo TV" subtitle="Vista full screen para sala de coordinación con métricas y resumen IA del día.">
            <div className="rounded-[2rem] border border-red-500/30 bg-black p-6 shadow-glow"><div className="grid gap-4 md:grid-cols-3"><div className="rounded-3xl bg-vodafone-red p-6"><p className="text-5xl font-black">{advisors.length}</p><p>Total asesores nuevos</p></div><div className="rounded-3xl bg-emerald-500/20 p-6"><p className="text-5xl font-black">{advisors.filter((a) => a.status === "Listo para producción").length}</p><p>Listos para producción</p></div><div className="rounded-3xl bg-amber-400/20 p-6"><p className="text-5xl font-black">{alerts.length}</p><p>Alertas críticas y altas</p></div></div><div className="mt-5 grid gap-5 lg:grid-cols-2"><div className="rounded-3xl bg-white/5 p-5"><h3 className="font-semibold">Próximas acciones</h3>{advisors.map((a) => <p key={a.id} className="mt-2 text-sm text-white/70">• {a.fullName}: {a.nextAction}</p>)}</div><pre className="whitespace-pre-wrap rounded-3xl bg-white/5 p-5 text-sm text-white/80">{generateAiResponse("resumen", advisors)}</pre></div></div>
          </Section>

          <Section id="configuración" title="Configuración dinámica" subtitle="Añade campos, estados, módulos, objeciones, tarifas, checklists, incidencias y textos base de IA.">
            <div className="grid gap-4 md:grid-cols-2">{(Object.keys(config) as (keyof DynamicConfig)[]).map((key) => <ConfigCard key={key} title={key} values={config[key] as string[]} onAdd={(value) => addConfigValue(key, value)} />)}</div>
          </Section>
        </div>

        <AiPanel advisors={advisors} />
      </div>
    </main>
  );
}

function ConfigCard({ title, values, onAdd }: { title: string; values: string[]; onAdd: (value: string) => void }) {
  const [value, setValue] = useState("");
  return <div className="glass-card p-5"><h3 className="font-semibold capitalize">{title}</h3><div className="mt-3 flex flex-wrap gap-2">{values.map((item) => <Badge key={item}>{item}</Badge>)}</div><form onSubmit={(event) => { event.preventDefault(); onAdd(value); setValue(""); }} className="mt-4 flex gap-2"><input value={value} onChange={(event) => setValue(event.target.value)} placeholder="Añadir nuevo" className="focus-ring min-w-0 flex-1 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm" /><button className="rounded-2xl bg-vodafone-red px-4 py-3 font-semibold">Añadir</button></form></div>;
}
