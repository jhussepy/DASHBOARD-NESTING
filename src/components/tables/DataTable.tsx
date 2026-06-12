"use client";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { lower } from "@/lib/utils/format";

export interface Column<T> { key: string; header: string; value: (row: T) => React.ReactNode; sortValue?: (row: T) => string | number; badge?: boolean; compact?: boolean; }

export function DataTable<T extends Record<string, unknown>>({ title, subtitle, rows, columns, onOpen }: { title: string; subtitle: string; rows: T[]; columns: Column<T>[]; onOpen?: (row: T) => void }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState(columns[0]?.key ?? "");
  const [view, setView] = useState<"compact" | "detail">("compact");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const visibleColumns = view === "compact" ? columns.filter((column) => !column.compact || columns.filter((c) => !c.compact).length < 5).slice(0, 6) : columns;

  const filtered = useMemo(() => {
    const text = lower(query);
    const source = rows.filter((row) => !text || JSON.stringify(row).toLowerCase().includes(text));
    const column = columns.find((item) => item.key === sortKey);
    return [...source].sort((a, b) => {
      const av = column?.sortValue?.(a) ?? String(column?.value(a) ?? "");
      const bv = column?.sortValue?.(b) ?? String(column?.value(b) ?? "");
      return direction === "asc" ? String(av).localeCompare(String(bv), "es", { numeric: true }) : String(bv).localeCompare(String(av), "es", { numeric: true });
    });
  }, [rows, query, sortKey, direction, columns]);

  const toggleSort = (key: string) => { setDirection((current) => sortKey === key && current === "asc" ? "desc" : "asc"); setSortKey(key); };

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><h3 className="text-2xl font-black">{title}</h3><p className="mt-1 text-sm text-[var(--muted)]">{subtitle}</p></div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar en tabla..." className="min-w-64 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none ring-[var(--brand)]/30 transition focus:ring-4" />
          <select value={view} onChange={(event) => setView(event.target.value as "compact" | "detail")} className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm font-bold outline-none"><option value="compact">Vista compacta</option><option value="detail">Vista detallada</option></select>
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-3xl border border-[var(--border)]">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead className="bg-[var(--surface-strong)] text-xs uppercase tracking-[.14em] text-[var(--muted)]">
            <tr>{visibleColumns.map((column) => <th key={column.key} className="px-4 py-3"><button onClick={() => toggleSort(column.key)} className="font-black hover:text-[var(--brand)]">{column.header} {sortKey === column.key ? (direction === "asc" ? "↑" : "↓") : ""}</button></th>)}{onOpen && <th className="px-4 py-3">Ficha</th>}</tr>
          </thead>
          <tbody>
            {filtered.map((row, index) => <tr key={index} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-soft)]">{visibleColumns.map((column) => <td key={column.key} className="px-4 py-4 align-top">{column.badge ? <StatusBadge value={String(column.value(row))} /> : column.value(row)}</td>)}{onOpen && <td className="px-4 py-4"><button onClick={() => onOpen(row)} className="rounded-xl bg-[var(--brand)] px-3 py-2 text-xs font-black text-white">Abrir ficha</button></td>}</tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
