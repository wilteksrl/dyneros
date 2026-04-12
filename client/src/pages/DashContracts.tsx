import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Download, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  signed: "oklch(60% 0.18 145)", approved: GOLD, final: "oklch(55% 0.18 220)", draft: "oklch(55% 0.05 264)",
};

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      {label}
    </span>
  );
}

export default function DashContracts() {
  const { t } = useLanguage();
  const { data: docs, isLoading } = trpc.dashboard.documents.useQuery();
  const contracts = docs?.filter(d => d.type !== null && ["contract", "sow", "nda"].includes(d.type)) ?? [];

  const statusLabels: Record<string, string> = {
    signed: t("contract.signed"), approved: t("contract.approved"),
    final: t("contract.final"), draft: t("status.draft"),
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">{t("dash.contracts")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contracts.length} {t("contract.count")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: t("contract.active"), value: contracts.filter(c => c.status === "signed").length, color: "oklch(60% 0.18 145)" },
            { label: t("contract.pending_approval"), value: contracts.filter(c => c.status === "approved").length, color: GOLD },
            { label: t("contract.in_draft"), value: contracts.filter(c => c.status === "draft").length, color: "oklch(55% 0.05 264)" },
          ].map(item => (
            <div key={item.label} className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">{item.label}</p>
              <p className="text-2xl font-semibold" style={{ color: item.color }}>{item.value}</p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-2">
            {contracts.map(doc => (
              <div key={doc.id}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
                style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(15%_0.008_264)]">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <Badge color={STATUS_COLORS[doc.status] || "oklch(55% 0.05 264)"} label={statusLabels[doc.status] || doc.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{doc.category}</span>
                    <span>·</span>
                    <span>{doc.fileSize ? `${Math.round(doc.fileSize / 1024)} KB` : "—"}</span>
                    <span>·</span>
                    <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                    <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
            {contracts.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p className="text-sm">{t("contract.empty")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
