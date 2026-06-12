export const normalize = (value: unknown) => String(value ?? "").trim();
export const lower = (value: unknown) => normalize(value).toLowerCase();
export const isActive = (value: unknown) => ["activo", "activa", "firmado", "confirmado", "sí", "si", "explicado", "completo"].includes(lower(value));
export const isPending = (value: unknown) => ["pendiente", "solicitado", "en proceso", "no solicitado", "requiere soporte"].includes(lower(value));
export const isBlocked = (value: unknown) => ["bloqueado", "bloqueada", "incidencia"].includes(lower(value));
export const splitTags = (value: unknown) => normalize(value).split(/[;,]/).map((item) => item.trim()).filter(Boolean);
export const toNumber = (value: unknown) => Number(String(value ?? 0).replace("%", "").replace(",", ".")) || 0;
export const toneForStatus = (value: unknown) => {
  if (isBlocked(value)) return "danger";
  if (isActive(value)) return "success";
  if (isPending(value)) return "warning";
  return "neutral";
};
