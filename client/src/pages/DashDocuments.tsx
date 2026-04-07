import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Download, ExternalLink, FileText, Loader2, Search } from "lucide-react";
import { useState } from "react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  signed: "oklch(60% 0.18 145)", approved: GOLD, final: "oklch(55% 0.18 220)", draft: "oklch(55% 0.05 264)",
};
const STATUS_LABELS: Record<string, string> = {
  signed: "Firmato", approved: "Approvato", final: "Definitivo", draft: "Bozza",
};
const TYPE_ICONS: Record<string, string> = {
  contract: "📄", sow: "📋", nda: "🔒", technical: "⚙️", report: "📊",
};

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      {label}
    </span>
  );
}

export default function DashDocuments() {
  const { data: docs, isLoading } = trpc.dashboard.documents.useQuery();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(docs?.map(d => d.category) ?? []))];
  const filtered = docs?.filter(d =>
    (catFilter === "all" || d.category === catFilter) &&
    (search === "" || d.name.toLowerCase().includes(search.toLowerCase()))
  ) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Documenti</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{docs?.length ?? 0} documenti condivisi</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca documenti..."
              className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-[oklch(12%_0.006_264)] border focus:outline-none focus:border-[oklch(68%_0.19_72/0.5)]"
              style={{ borderColor: BORDER }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(c => (
              <button key={c} onClick={() => setCatFilter(c)}
                className="px-3 h-9 rounded-lg text-xs font-medium transition-colors"
                style={catFilter === c
                  ? { background: GOLD, color: "#000" }
                  : { background: "oklch(12% 0.006 264)", color: "oklch(60% 0.05 264)", border: `1px solid ${BORDER}` }}>
                {c === "all" ? "Tutti" : c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(doc => (
              <div key={doc.id}
                className="flex items-center gap-4 p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
                style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ background: "oklch(15% 0.008 264)" }}>
                  {TYPE_ICONS[doc.type] || "📄"}
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
                    <span>{doc.author}</span>
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
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nessun documento trovato</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
