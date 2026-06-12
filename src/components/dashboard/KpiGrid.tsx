import { KpiItem } from "@/lib/types/onboarding";

const tone = {
  neutral: "from-[var(--surface)] to-[var(--surface-soft)]",
  success: "from-emerald-500/18 to-[var(--surface)]",
  warning: "from-amber-500/18 to-[var(--surface)]",
  danger: "from-red-500/20 to-[var(--surface)]",
  info: "from-sky-500/16 to-[var(--surface)]",
};

export function KpiGrid({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <article key={item.label} className={`group rounded-[1.65rem] border border-[var(--border)] bg-gradient-to-br ${tone[item.tone]} p-4 shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1 hover:border-[var(--brand)]/45`}>
          <div className="flex items-start justify-between gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[var(--surface-strong)] text-xl shadow-inner">{item.icon}</span>
            <span className="h-2 w-2 rounded-full bg-[var(--brand)] shadow-[0_0_18px_rgba(230,0,0,.55)]" />
          </div>
          <p className="mt-4 text-3xl font-black tracking-tight">{item.value}</p>
          <h3 className="mt-1 text-sm font-black text-[var(--text)]">{item.label}</h3>
          <p className="mt-1 text-xs text-[var(--muted)]">{item.helper}</p>
        </article>
      ))}
    </div>
  );
}
