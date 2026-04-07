import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Download, ExternalLink, FileText, Loader2 } from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  signed: "oklch(60% 0.18 145)", approved: GOLD, final: "oklch(55% 0.18 220)", draft: "oklch(55% 0.05 264)",
};
const STATUS_LABELS: Record<string, string> = {
  signed: "Firmato", approved: "Approvato", final: "Definitivo", draft: "Bozza",
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
  const { data: docs, isLoading } = trpc.dashboard.documents.useQuery();
  const contracts = docs?.filter(d => ["contract", "sow", "nda"].includes(d.type)) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-xl font-semibold">Preventivi & Contratti</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{contracts.length} documenti contrattuali</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Contratti Attivi", value: contracts.filter(c => c.status === "signed").length, color: "oklch(60% 0.18 145)" },
            { label: "In Approvazione", value: contracts.filter(c => c.status === "approved").length, color: GOLD },
            { label: "In Bozza", value: contracts.filter(c => c.status === "draft").length, color: "oklch(55% 0.05 264)" },
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
                    <Badge color={STATUS_COLORS[doc.status] || "oklch(55% 0.05 264)"} label={STATUS_LABELS[doc.status] || doc.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{doc.category}</span>
                    <span>·</span>
                    <span>{doc.size}</span>
                    <span>·</span>
                    <span>{doc.uploaded}</span>
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
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
