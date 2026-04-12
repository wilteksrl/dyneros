export function formatCurrency(amount: number | string, currency = "EUR"): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("it-IT", { style: "currency", currency }).format(num);
}

export function formatDate(date: Date | string | null | undefined, locale = "it-IT"): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function formatDateTime(date: Date | string | null | undefined, locale = "it-IT"): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString(locale, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatRelativeTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Adesso";
  if (diffMins < 60) return `${diffMins} min fa`;
  if (diffHours < 24) return `${diffHours} ore fa`;
  if (diffDays < 7) return `${diffDays} giorni fa`;
  return formatDate(d);
}

export function formatWalletAddress(address: string, chars = 6): string {
  if (!address || address.length < chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type SLAStatus = "ok" | "warning" | "critical" | "breached";

export function calculateSLAStatus(
  createdAt: Date | string,
  slaHours: number,
  resolvedAt?: Date | string | null
): { status: SLAStatus; label: string; percent: number } {
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const resolved = resolvedAt ? (typeof resolvedAt === "string" ? new Date(resolvedAt) : resolvedAt) : null;
  const deadline = new Date(created.getTime() + slaHours * 3600000);
  const now = resolved || new Date();
  const elapsed = now.getTime() - created.getTime();
  const total = deadline.getTime() - created.getTime();
  const percent = Math.min(100, Math.round((elapsed / total) * 100));

  if (resolved) return { status: "ok", label: "Risolto", percent: 100 };
  if (percent >= 100) return { status: "breached", label: "SLA Violato", percent: 100 };
  if (percent >= 80) return { status: "critical", label: "SLA Critico", percent };
  if (percent >= 60) return { status: "warning", label: "SLA a Rischio", percent };
  return { status: "ok", label: "SLA OK", percent };
}

export function getDaysUntil(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  return Math.ceil((d.getTime() - now.getTime()) / 86400000);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function generateTicketNumber(): string {
  const prefix = "TKT";
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 90000) + 10000;
  return `${prefix}-${year}-${rand}`;
}

export function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${year}-${rand}`;
}

export function generateApiKeyPrefix(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "dyn_";
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}
