import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { BookOpen, ExternalLink, Loader2, Search } from "lucide-react";
import { useState } from "react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const CAT_COLORS: Record<string, string> = {
  Blockchain: "oklch(60% 0.18 300)", Sviluppo: "oklch(55% 0.18 220)", Supporto: GOLD,
  Billing: "oklch(60% 0.18 145)", Sicurezza: "oklch(55% 0.22 25)", Generale: "oklch(55% 0.05 264)",
};

export default function DashKnowledgeBase() {
  const { data, isLoading } = trpc.dashboard.knowledgeBase.useQuery();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const categories = ["all", ...Array.from(new Set(data?.articles.map(a => a.category) ?? []))];
  const filtered = data?.articles.filter(a =>
    (catFilter === "all" || a.category === catFilter) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()))
  ) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Guide, tutorial e documentazione tecnica Dyneros</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cerca articoli..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(article => {
              const cc = CAT_COLORS[article.category] || "oklch(55% 0.05 264)";
              return (
                <div key={article.id}
                  className="p-4 rounded-xl border cursor-pointer transition-all hover:border-[oklch(68%_0.19_72/0.3)] group"
                  style={{ background: CARD_BG, borderColor: BORDER }}>
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${cc}12` }}>
                      <BookOpen className="h-4 w-4" style={{ color: cc }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug group-hover:text-foreground transition-colors">{article.title}</p>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{ background: `${cc}12`, color: cc }}>
                          {article.category}
                        </span>
                        <span>{article.views.toLocaleString("it-IT")} visualizzazioni</span>
                        <span>·</span>
                        <span>{article.updated}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-2 text-center py-16 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nessun articolo trovato</p>
              </div>
            )}
          </div>
        )}

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.15)" }}>
          <h2 className="text-sm font-semibold mb-2">Non hai trovato quello che cercavi?</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Apri un ticket di supporto e il nostro team tecnico risponderà entro le SLA contrattuali.
          </p>
          <a href="/dashboard/tickets"
            className="inline-flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            Apri Ticket
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
