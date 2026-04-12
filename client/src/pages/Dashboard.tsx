import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Box,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Clock,
  FileText,
  FolderOpen,
  Loader2,
  Mail,
  Plus,
  Receipt,
  Server,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const activityIcons: Record<string, React.ElementType> = {
  ticket: Ticket,
  invoice: Receipt,
  milestone: CheckCircle2,
  deploy: Server,
  contract: FileText,
  project: FolderOpen,
};

function KpiCard({ icon: Icon, label, value, sub, accent }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4 flex flex-col gap-3"
      style={{ background: CARD_BG, borderColor: accent ? "oklch(68% 0.19 72 / 0.3)" : BORDER }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
        <div className="h-7 w-7 rounded-lg flex items-center justify-center"
          style={{ background: accent ? GOLD_DIM : "oklch(15% 0.008 264)" }}>
          <Icon className="h-3.5 w-3.5" style={{ color: accent ? GOLD : "oklch(55% 0.05 264)" }} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight" style={accent ? { color: GOLD } : {}}>{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: (k: string) => string }) {
  const labels: Record<string, string> = {
    active: t("status.active"), in_progress: t("status.in_progress"), open: t("status.open"),
    critical: t("status.critical"), high: t("status.high"), medium: t("status.medium"), low: t("status.low"),
  };
  const colors: Record<string, string> = {
    active: "oklch(60% 0.18 145)", in_progress: GOLD, open: "oklch(55% 0.18 220)",
    critical: "oklch(55% 0.22 25)", high: "oklch(60% 0.2 35)", medium: GOLD, low: "oklch(60% 0.18 145)",
  };
  const c = colors[status] || "oklch(55% 0.05 264)";
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color: c, borderColor: `${c}40`, background: `${c}12` }}>
      <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: c }} />
      {labels[status] || status}
    </span>
  );
}

export default function Dashboard() {
  const { data, isLoading } = trpc.dashboard.stats.useQuery();
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  const kpiItems = [
    { icon: Activity, label: t("kpi.active_projects"), value: data.kpi.activeProjects, sub: t("kpi.active_projects_sub"), accent: true },
    { icon: Ticket, label: t("kpi.open_tickets"), value: data.kpi.openTickets, sub: t("kpi.open_tickets_sub") },
    { icon: Receipt, label: t("kpi.pending_invoices"), value: data.kpi.pendingInvoices, sub: t("kpi.pending_invoices_sub") },
    { icon: Server, label: t("kpi.online_envs"), value: data.kpi.onlineEnvironments, sub: t("kpi.online_envs_sub") },
    { icon: Box, label: t("kpi.smart_contracts"), value: data.kpi.deployedContracts, sub: t("kpi.smart_contracts_sub") },
    { icon: Wallet, label: t("kpi.wallets"), value: data.kpi.connectedWallets, sub: t("kpi.wallets_sub") },
    { icon: Zap, label: t("kpi.active_services"), value: data.kpi.activeServices, sub: t("kpi.active_services_sub") },
    { icon: CheckCircle2, label: t("kpi.completed_tasks"), value: data.kpi.completedTasksMonth, sub: t("kpi.completed_tasks_sub") },
    { icon: FileText, label: t("kpi.documents"), value: data.kpi.documentsShared, sub: t("kpi.documents_sub") },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="rounded-xl border p-5"
          style={{ background: "oklch(9% 0.006 264)", borderColor: "oklch(68% 0.19 72 / 0.2)" }}>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: GOLD_DIM, border: `1px solid oklch(68% 0.19 72 / 0.3)` }}>
                <span className="text-base font-bold" style={{ color: GOLD }}>
                  {data.customerId.slice(-2)}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-semibold">{t("dash.workspace")}</h1>
                  <StatusBadge status={data.accountStatus} t={t} />
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">{data.customerId}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs font-semibold" style={{ color: GOLD }}>{data.tier}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{t("dash.last_access")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[oklch(15%_0.008_264)]">
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{data.accountManager.name}</p>
                  <p>{data.accountManager.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center bg-[oklch(15%_0.008_264)]">
                  <CircuitBoard className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{data.techLead.name}</p>
                  <p>{data.techLead.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setLocation("/dashboard/tickets")}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 h-8 rounded-lg border transition-colors hover:bg-[oklch(15%_0.008_264)]"
                  style={{ borderColor: BORDER }}>
                  <Plus className="h-3 w-3" />
                  {t("dash.new_request")}
                </button>
                <button
                  onClick={() => setLocation("/dashboard/team")}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 h-8 rounded-lg transition-colors"
                  style={{ background: GOLD, color: "#000" }}>
                  <Mail className="h-3 w-3" />
                  {t("dash.contact_dyneros")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {kpiItems.map((k) => (
            <KpiCard key={k.label} {...k} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">{t("dash.recent_activity")}</h2>
              <button className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                {t("dash.view_all")} <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {data.recentActivity.map((item) => {
                const Icon = activityIcons[item.icon] || Activity;
                return (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "oklch(15% 0.008 264)" }}>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug">{item.text}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            {data.nextMilestone && (
              <div className="rounded-xl border p-4"
                style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.2)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4" style={{ color: GOLD }} />
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: GOLD }}>{t("dash.next_milestone")}</p>
                </div>
                <p className="text-sm font-semibold">{data.nextMilestone.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{data.nextMilestone.project}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{data.nextMilestone.date}</span>
                  <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: GOLD_DIM, color: GOLD }}>
                    {data.nextMilestone.daysLeft}{t("dash.days_abbr")}
                  </span>
                </div>
              </div>
            )}

            {data.criticalTickets.length > 0 && (
              <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-4 w-4 text-orange-400" />
                  <p className="text-xs font-semibold uppercase tracking-wide text-orange-400">{t("dash.priority_tickets")}</p>
                </div>
                <div className="space-y-2.5">
                  {data.criticalTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{ticket.subject}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-muted-foreground">{ticket.id}</span>
                          <StatusBadge status={ticket.priority} t={t} />
                        </div>
                      </div>
                      <button
                        onClick={() => setLocation("/dashboard/tickets")}
                        className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("dash.quick_access")}</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { label: t("dash.projects"), icon: Activity, path: "/dashboard/projects" },
                  { label: t("dash.tickets"), icon: Ticket, path: "/dashboard/tickets" },
                  { label: t("dash.invoices"), icon: Receipt, path: "/dashboard/invoices" },
                  { label: t("dash.blockchain"), icon: CircuitBoard, path: "/dashboard/blockchain" },
                  { label: t("dash.wallet"), icon: Wallet, path: "/dashboard/wallet" },
                  { label: t("dash.documents"), icon: FolderOpen, path: "/dashboard/documents" },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => setLocation(item.path)}
                    className="flex items-center gap-2 p-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-[oklch(15%_0.008_264)] transition-colors text-left">
                    <item.icon className="h-3.5 w-3.5 shrink-0" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
