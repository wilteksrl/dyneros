import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { AlertTriangle, CheckCircle2, Clock, Download, Loader2, Receipt } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  paid: "oklch(60% 0.18 145)", unpaid: GOLD, overdue: "oklch(55% 0.22 25)",
};

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export default function DashInvoices() {
  const { t } = useLanguage();
  const { data: invoices, isLoading } = trpc.dashboard.invoices.useQuery();
  const [filter, setFilter] = useState("all");

  const statusLabels: Record<string, string> = {
    paid: t("status.paid"), unpaid: t("invoice.unpaid"), overdue: t("status.overdue"),
  };

  const totalDue = invoices?.filter(i => i.status === "unpaid" || i.status === "overdue")
    .reduce((s, i) => s + parseFloat(i.amount), 0) ?? 0;
  const totalPaid = invoices?.filter(i => i.status === "paid")
    .reduce((s, i) => s + parseFloat(i.amount), 0) ?? 0;
  const overdueCount = invoices?.filter(i => i.status === "overdue").length ?? 0;

  const filtered = invoices?.filter(i => filter === "all" || i.status === filter) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">{t("dash.invoices")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{invoices?.length ?? 0} {t("invoice.total_count")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.25)" }}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" style={{ color: GOLD }} />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("invoice.to_pay")}</p>
            </div>
            <p className="text-2xl font-semibold" style={{ color: GOLD }}>
              €{totalDue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("invoice.paid_ytd")}</p>
            </div>
            <p className="text-2xl font-semibold text-green-400">€{totalPaid.toLocaleString()}</p>
          </div>
          <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: overdueCount > 0 ? "oklch(55% 0.22 25 / 0.3)" : BORDER }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide">{t("status.overdue")}</p>
            </div>
            <p className="text-2xl font-semibold text-red-400">{overdueCount}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {[
            { key: "all", label: t("common.all") },
            { key: "unpaid", label: t("invoice.to_pay") },
            { key: "paid", label: t("status.paid") },
            { key: "overdue", label: t("status.overdue") },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="px-3 h-8 rounded-lg text-xs font-medium transition-colors"
              style={filter === f.key
                ? { background: GOLD, color: "#000" }
                : { background: "oklch(12% 0.006 264)", color: "oklch(60% 0.05 264)", border: `1px solid ${BORDER}` }}>
              {f.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(inv => (
              <div key={inv.id}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
                style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: GOLD_DIM }}>
                  <Receipt className="h-4 w-4" style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{inv.invoiceNumber}</span>
                    <Badge color={STATUS_COLORS[inv.status] || "oklch(55% 0.05 264)"} label={statusLabels[inv.status] || inv.status} />
                  </div>
                  <p className="text-sm font-medium truncate">{inv.description ?? inv.invoiceNumber}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{t("invoice.issued")}: {new Date(inv.issued).toLocaleDateString()}</span>
                    <span>·</span>
                    <span>{t("invoice.due")}: {new Date(inv.due).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-base font-semibold" style={inv.status === "paid" ? { color: "oklch(60% 0.18 145)" } : inv.status === "overdue" ? { color: "oklch(55% 0.22 25)" } : { color: GOLD }}>
                    €{parseFloat(inv.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <button className="mt-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <Download className="h-3 w-3" />
                    PDF
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("invoice.empty")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
