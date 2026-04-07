import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Loader2,
  MessageSquare,
  Plus,
  X,
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_LABELS: Record<string, string> = {
  open: "Aperto", in_progress: "In Lavorazione", waiting_for_client: "In Attesa Cliente",
  resolved: "Risolto", closed: "Chiuso", triage: "Triage",
};
const STATUS_COLORS: Record<string, string> = {
  open: "oklch(55% 0.18 220)", in_progress: GOLD, waiting_for_client: "oklch(65% 0.18 55)",
  resolved: "oklch(60% 0.18 145)", closed: "oklch(45% 0.05 264)", triage: "oklch(60% 0.18 300)",
};
const PRIORITY_COLORS: Record<string, string> = {
  critical: "oklch(55% 0.22 25)", high: "oklch(60% 0.2 35)", medium: GOLD, low: "oklch(60% 0.18 145)",
};
const PRIORITY_LABELS: Record<string, string> = { critical: "Critico", high: "Alta", medium: "Media", low: "Bassa" };
const CATEGORY_LABELS: Record<string, string> = {
  blockchain_integration: "Integrazione Blockchain", smart_contract_issue: "Smart Contract",
  deployment: "Deploy", richiesta_sviluppo: "Sviluppo", general: "Generale",
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

type Ticket = {
  id: string; subject: string; category: string; priority: string; status: string;
  project: string; created: string; sla: string; assignee: string;
};

function TicketRow({ ticket, onClick }: { ticket: Ticket; onClick: () => void }) {
  const sc = STATUS_COLORS[ticket.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[ticket.priority] || GOLD;
  return (
    <div
      onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:border-[oklch(68%_0.19_72/0.3)] hover:bg-[oklch(11%_0.006_264)]"
      style={{ background: CARD_BG, borderColor: BORDER }}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
          <Badge color={sc} label={STATUS_LABELS[ticket.status] || ticket.status} />
          <Badge color={pc} label={PRIORITY_LABELS[ticket.priority] || ticket.priority} />
        </div>
        <p className="text-sm font-medium truncate">{ticket.subject}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span>{CATEGORY_LABELS[ticket.category] || ticket.category}</span>
          <span>·</span>
          <span>{ticket.project}</span>
          <span>·</span>
          <span>Assegnato a: {ticket.assignee}</span>
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
          <Clock className="h-3 w-3" />
          <span>SLA: {ticket.sla}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(ticket.created).toLocaleDateString("it-IT")}
        </p>
      </div>
    </div>
  );
}

function TicketDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = trpc.dashboard.ticketDetail.useQuery({ id });
  if (isLoading) return <div className="flex items-center justify-center h-48"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data) return null;
  const sc = STATUS_COLORS[data.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[data.priority] || GOLD;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-muted-foreground">{data.id}</span>
            <Badge color={sc} label={STATUS_LABELS[data.status] || data.status} />
            <Badge color={pc} label={PRIORITY_LABELS[data.priority] || data.priority} />
          </div>
          <h2 className="text-lg font-semibold">{data.subject}</h2>
          <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[data.category] || data.category} · {data.project}</p>
        </div>
        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Assegnato a", value: data.assignee },
          { label: "SLA", value: data.sla },
          { label: "Aperto il", value: new Date(data.created).toLocaleDateString("it-IT") },
          { label: "Progetto", value: data.project },
        ].map(item => (
          <div key={item.label} className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg p-4" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Descrizione</h3>
        <p className="text-sm leading-relaxed">{data.description}</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" />
          Thread ({data.thread.length} messaggi)
        </h3>
        <div className="space-y-3">
          {data.thread.map((msg, i) => {
            const isDyneros = msg.role === "dyneros";
            const isAuto = msg.role === "auto";
            return (
              <div key={i} className={`flex gap-3 ${isDyneros ? "" : "flex-row-reverse"}`}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    background: isAuto ? "oklch(18% 0.008 264)" : isDyneros ? GOLD_DIM : "oklch(55% 0.18 220 / 0.15)",
                    color: isAuto ? "oklch(55% 0.05 264)" : isDyneros ? GOLD : "oklch(55% 0.18 220)",
                  }}>
                  {isAuto ? "⚙" : msg.author.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className={`flex-1 max-w-[80%] ${isDyneros || isAuto ? "" : "text-right"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{msg.author}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(msg.time).toLocaleString("it-IT")}</span>
                  </div>
                  <div className="rounded-lg p-3 text-sm"
                    style={{ background: isAuto ? "oklch(13% 0.006 264)" : isDyneros ? "oklch(13% 0.006 264)" : "oklch(55% 0.18 220 / 0.08)", border: `1px solid ${BORDER}` }}>
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DashTickets() {
  const { data: tickets, isLoading } = trpc.dashboard.tickets.useQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "Tutti" },
    { key: "open", label: "Aperti" },
    { key: "in_progress", label: "In Lavorazione" },
    { key: "waiting_for_client", label: "In Attesa" },
    { key: "resolved", label: "Risolti" },
  ];

  const filtered = tickets?.filter(t => filter === "all" || t.status === filter) ?? [];
  const criticalCount = tickets?.filter(t => t.priority === "critical" && t.status !== "resolved").length ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {selectedId ? (
          <div>
            <button onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Torna ai Ticket
            </button>
            <div className="rounded-xl border p-6" style={{ background: CARD_BG, borderColor: BORDER }}>
              <TicketDetail id={selectedId} onClose={() => setSelectedId(null)} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">Ticket & Supporto</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tickets?.length ?? 0} ticket nel tuo workspace
                </p>
              </div>
              <button
                className="flex items-center gap-2 text-sm font-medium px-4 h-9 rounded-lg transition-colors"
                style={{ background: GOLD, color: "#000" }}>
                <Plus className="h-4 w-4" />
                Nuovo Ticket
              </button>
            </div>

            {criticalCount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl mb-5 border"
                style={{ background: "oklch(55% 0.22 25 / 0.08)", borderColor: "oklch(55% 0.22 25 / 0.3)" }}>
                <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
                <p className="text-sm text-orange-300">
                  {criticalCount} ticket critico/i richiedono attenzione immediata
                </p>
              </div>
            )}

            <div className="flex gap-2 mb-5 flex-wrap">
              {filters.map(f => (
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
                {filtered.map(t => (
                  <TicketRow key={t.id} ticket={t} onClick={() => setSelectedId(t.id)} />
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-sm">Nessun ticket in questa categoria</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
