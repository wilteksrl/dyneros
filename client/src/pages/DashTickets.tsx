import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import {
  AlertTriangle, ArrowLeft, Clock, Loader2, MessageSquare, Plus, Send, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  open: "oklch(55% 0.18 220)", in_progress: GOLD, waiting_for_client: "oklch(65% 0.18 55)",
  resolved: "oklch(60% 0.18 145)", closed: "oklch(45% 0.05 264)",
};
const PRIORITY_COLORS: Record<string, string> = {
  critical: "oklch(55% 0.22 25)", high: "oklch(60% 0.2 35)", medium: GOLD, low: "oklch(60% 0.18 145)",
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

type TicketRow = {
  id: number; ticketNumber: string; subject: string; category: string; priority: string;
  status: string; projectId: number | null; createdAt: Date; slaHours: number | null;
};

function TicketRowItem({ ticket, onClick, statusLabels, priorityLabels }: {
  ticket: TicketRow; onClick: () => void;
  statusLabels: Record<string, string>; priorityLabels: Record<string, string>;
}) {
  const sc = STATUS_COLORS[ticket.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[ticket.priority] || GOLD;
  return (
    <div onClick={onClick}
      className="flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:border-[oklch(68%_0.19_72/0.3)] hover:bg-[oklch(11%_0.006_264)]"
      style={{ background: CARD_BG, borderColor: BORDER }}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1.5">
          <span className="text-[10px] font-mono text-muted-foreground">{ticket.ticketNumber}</span>
          <Badge color={sc} label={statusLabels[ticket.status] || ticket.status} />
          <Badge color={pc} label={priorityLabels[ticket.priority] || ticket.priority} />
        </div>
        <p className="text-sm font-medium truncate">{ticket.subject}</p>
        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground flex-wrap">
          <span>{ticket.category}</span>
          {ticket.projectId && <span>· #{ticket.projectId}</span>}
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
          <Clock className="h-3 w-3" />
          <span>SLA: {ticket.slaHours ?? 24}h</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(ticket.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function TicketDetail({ id, onClose, statusLabels, priorityLabels, t }: {
  id: number; onClose: () => void;
  statusLabels: Record<string, string>; priorityLabels: Record<string, string>;
  t: (k: string) => string;
}) {
  const { data, isLoading } = trpc.dashboard.ticketDetail.useQuery({ id });
  const [replyText, setReplyText] = useState("");
  const utils = trpc.useUtils();
  const replyMutation = trpc.dashboard.replyTicket.useMutation({
    onSuccess: () => {
      setReplyText("");
      utils.dashboard.ticketDetail.invalidate({ id });
      toast.success(t("ticket.reply_sent"));
    },
    onError: (e) => toast.error(e.message),
  });
  if (isLoading) return <div className="flex items-center justify-center h-48"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data) return null;
  const sc = STATUS_COLORS[data.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[data.priority] || GOLD;
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-muted-foreground">{data.ticketNumber}</span>
            <Badge color={sc} label={statusLabels[data.status] || data.status} />
            <Badge color={pc} label={priorityLabels[data.priority] || data.priority} />
          </div>
          <h2 className="text-lg font-semibold">{data.subject}</h2>
          <p className="text-sm text-muted-foreground">{data.category}</p>
        </div>
        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "SLA", value: `${data.slaHours ?? 24}h` },
          { label: t("ticket.opened_on"), value: new Date(data.createdAt).toLocaleDateString() },
          { label: t("ticket.updated"), value: new Date(data.updatedAt).toLocaleDateString() },
          { label: t("ticket.project"), value: data.projectId ? `#${data.projectId}` : "—" },
        ].map(item => (
          <div key={item.label} className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-sm font-medium">{item.value}</p>
          </div>
        ))}
      </div>
      {data.description && (
        <div className="rounded-lg p-4" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("proj.description")}</h3>
          <p className="text-sm leading-relaxed">{data.description}</p>
        </div>
      )}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="h-3.5 w-3.5" />
          {t("ticket.thread")} ({data.replies.length} {t("ticket.messages")})
        </h3>
        <div className="space-y-3">
          {data.replies.map((reply) => {
            const isStaff = reply.isStaff;
            return (
              <div key={reply.id} className={`flex gap-3 ${isStaff ? "" : "flex-row-reverse"}`}>
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{
                    background: isStaff ? GOLD_DIM : "oklch(55% 0.18 220 / 0.15)",
                    color: isStaff ? GOLD : "oklch(55% 0.18 220)",
                  }}>
                  {(reply.userName ?? "U").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className={`flex-1 max-w-[80%] ${isStaff ? "" : "text-right"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{reply.userName ?? t("ticket.user")}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(reply.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="rounded-lg p-3 text-sm"
                    style={{ background: isStaff ? "oklch(13% 0.006 264)" : "oklch(55% 0.18 220 / 0.08)", border: `1px solid ${BORDER}` }}>
                    {reply.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {data.status !== "resolved" && data.status !== "closed" && (
        <div className="flex gap-2">
          <Input
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={t("ticket.write_reply")}
            className="bg-[oklch(12%_0.006_264)] border-border text-white"
            onKeyDown={e => { if (e.key === "Enter" && replyText.trim()) replyMutation.mutate({ ticketId: id, message: replyText }); }}
          />
          <Button
            onClick={() => replyMutation.mutate({ ticketId: id, message: replyText })}
            disabled={!replyText.trim() || replyMutation.isPending}
            className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)]"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function DashTickets() {
  const { t } = useLanguage();
  const { data: tickets, isLoading } = trpc.dashboard.tickets.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [newDesc, setNewDesc] = useState("");
  const utils = trpc.useUtils();

  const statusLabels: Record<string, string> = {
    open: t("status.open"), in_progress: t("ticket.in_progress"),
    waiting_for_client: t("ticket.waiting_client"), resolved: t("status.resolved"), closed: t("status.closed"),
  };
  const priorityLabels: Record<string, string> = {
    critical: t("status.critical"), high: t("status.high"), medium: t("status.medium"), low: t("status.low"),
  };

  const createMutation = trpc.dashboard.createTicket.useMutation({
    onSuccess: (data) => {
      toast.success(`${t("ticket.opened_success")} ${data.ticketNumber}`);
      setShowCreate(false);
      setNewSubject(""); setNewDesc(""); setNewCategory("general"); setNewPriority("medium");
      utils.dashboard.tickets.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const filters = [
    { key: "all", label: t("common.all") },
    { key: "open", label: t("status.open") },
    { key: "in_progress", label: t("ticket.in_progress") },
    { key: "waiting_for_client", label: t("ticket.waiting_client") },
    { key: "resolved", label: t("status.resolved") },
  ];

  const filtered = tickets?.filter(tk => filter === "all" || tk.status === filter) ?? [];
  const criticalCount = tickets?.filter(tk => tk.priority === "critical" && tk.status !== "resolved").length ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {selectedId ? (
          <div>
            <button onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              {t("ticket.back")}
            </button>
            <div className="rounded-xl border p-6" style={{ background: CARD_BG, borderColor: BORDER }}>
              <TicketDetail id={selectedId} onClose={() => setSelectedId(null)}
                statusLabels={statusLabels} priorityLabels={priorityLabels} t={t} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">{t("dash.tickets")}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {tickets?.length ?? 0} {t("ticket.in_workspace")}
                </p>
              </div>
              <button
                onClick={() => setShowCreate(!showCreate)}
                className="flex items-center gap-2 text-sm font-medium px-4 h-9 rounded-lg transition-colors"
                style={{ background: GOLD, color: "#000" }}>
                <Plus className="h-4 w-4" />
                {t("ticket.new")}
              </button>
            </div>

            {showCreate && (
              <div className="rounded-xl border p-5 mb-6" style={{ background: CARD_BG, borderColor: BORDER }}>
                <h3 className="text-white font-semibold mb-4">{t("ticket.open_new")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">{t("ticket.subject")} *</label>
                    <Input value={newSubject} onChange={e => setNewSubject(e.target.value)}
                      placeholder={t("ticket.subject_placeholder")}
                      className="bg-[oklch(18%_0.008_264)] border-border text-white" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t("ticket.category")}</label>
                    <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                      className="w-full bg-[oklch(18%_0.008_264)] border border-border text-white rounded-md px-3 py-2 text-sm">
                      <option value="general">{t("ticket.cat.general")}</option>
                      <option value="blockchain_integration">{t("ticket.cat.blockchain")}</option>
                      <option value="smart_contract_issue">{t("ticket.cat.smart_contract")}</option>
                      <option value="deployment">{t("ticket.cat.deploy")}</option>
                      <option value="billing">{t("ticket.cat.billing")}</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t("common.priority")}</label>
                    <select value={newPriority} onChange={e => setNewPriority(e.target.value as typeof newPriority)}
                      className="w-full bg-[oklch(18%_0.008_264)] border border-border text-white rounded-md px-3 py-2 text-sm">
                      <option value="low">{t("status.low")}</option>
                      <option value="medium">{t("status.medium")}</option>
                      <option value="high">{t("status.high")}</option>
                      <option value="critical">{t("status.critical")}</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">{t("ticket.detail_desc")}</label>
                    <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={3}
                      placeholder={t("ticket.desc_placeholder")}
                      className="w-full bg-[oklch(18%_0.008_264)] border border-border text-white rounded-md px-3 py-2 text-sm resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={() => createMutation.mutate({ subject: newSubject, description: newDesc, category: newCategory, priority: newPriority })}
                    disabled={!newSubject.trim() || createMutation.isPending}
                    className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold">
                    {createMutation.isPending ? t("ticket.sending") : t("ticket.open_btn")}
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreate(false)} className="border-border text-muted-foreground">
                    {t("common.cancel")}
                  </Button>
                </div>
              </div>
            )}

            {criticalCount > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-xl mb-5 border"
                style={{ background: "oklch(55% 0.22 25 / 0.08)", borderColor: "oklch(55% 0.22 25 / 0.3)" }}>
                <AlertTriangle className="h-4 w-4 text-orange-400 shrink-0" />
                <p className="text-sm text-orange-300">
                  {criticalCount} {t("ticket.critical_alert")}
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
                {filtered.map(tk => (
                  <TicketRowItem key={tk.id} ticket={tk as TicketRow} onClick={() => setSelectedId(tk.id)}
                    statusLabels={statusLabels} priorityLabels={priorityLabels} />
                ))}
                {filtered.length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <p className="text-sm">{t("ticket.empty")}</p>
                    <p className="text-xs mt-1 opacity-60">{t("ticket.empty_hint")}</p>
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
