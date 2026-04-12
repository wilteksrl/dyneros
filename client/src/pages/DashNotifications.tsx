import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useState } from "react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const TYPE_ICONS: Record<string, string> = {
  ticket_update: "🎫", milestone: "📁", invoice: "💳", deployment: "⛓️", system: "⚙️", alert: "🔒",
};
const TYPE_COLORS: Record<string, string> = {
  ticket_update: "oklch(55% 0.18 220)", milestone: GOLD, invoice: "oklch(60% 0.18 145)",
  deployment: "oklch(60% 0.18 300)", system: "oklch(55% 0.05 264)", alert: "oklch(55% 0.22 25)",
};
const TYPE_LABELS: Record<string, string> = {
  ticket_update: "Ticket", milestone: "Progetto", invoice: "Fattura",
  deployment: "Deploy", system: "Sistema", alert: "Alert",
};

const FILTERS = [
  { key: "all", label: "Tutte" },
  { key: "unread", label: "Non lette" },
  { key: "ticket_update", label: "Ticket" },
  { key: "invoice", label: "Fatture" },
  { key: "system", label: "Sistema" },
];

export default function DashNotifications() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.dashboard.notifications.useQuery();
  const [filter, setFilter] = useState("all");

  const markRead = trpc.dashboard.markNotificationRead.useMutation({
    onSuccess: () => {
      utils.dashboard.notifications.invalidate();
      utils.dashboard.notificationCount.invalidate();
    },
  });
  const markAllRead = trpc.dashboard.markAllNotificationsRead.useMutation({
    onSuccess: () => {
      utils.dashboard.notifications.invalidate();
      utils.dashboard.notificationCount.invalidate();
    },
  });

  const unread = data?.filter(n => !n.read).length ?? 0;

  const filtered = data?.filter(n => {
    if (filter === "unread") return !n.read;
    if (filter !== "all") return n.type === filter;
    return true;
  }) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-semibold">Notifiche</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unread > 0 ? `${unread} non lette` : "Tutte lette"}
            </p>
          </div>
          {unread > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {markAllRead.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              Segna tutte come lette
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-5">
          {FILTERS.map(f => (
            <button key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-3 h-7 rounded-full text-xs font-medium transition-all"
              style={filter === f.key
                ? { background: GOLD, color: "#000" }
                : { background: "oklch(15% 0.008 264)", color: "oklch(65% 0.05 264)", border: `1px solid ${BORDER}` }}>
              {f.label}
              {f.key === "unread" && unread > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "oklch(55% 0.22 25 / 0.2)", color: "oklch(55% 0.22 25)" }}>
                  {unread}
                </span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(notif => {
              const tc = TYPE_COLORS[notif.type] || "oklch(55% 0.05 264)";
              return (
                <div key={notif.id}
                  onClick={() => { if (!notif.read) markRead.mutate({ id: notif.id }); }}
                  className="flex items-start gap-4 p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)] cursor-pointer"
                  style={{
                    background: notif.read ? CARD_BG : "oklch(11% 0.007 264)",
                    borderColor: notif.read ? BORDER : "oklch(68% 0.19 72 / 0.2)",
                  }}>
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: `${tc}12` }}>
                    {TYPE_ICONS[notif.type] || "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ background: `${tc}18`, color: tc }}>
                        {TYPE_LABELS[notif.type] || notif.type}
                      </span>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${notif.read ? "" : "font-semibold"}`}>{notif.title}</p>
                    {notif.message && (
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    )}
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {new Date(notif.createdAt).toLocaleString("it-IT")}
                    </p>
                  </div>
                  {!notif.read && (
                    <button
                      onClick={e => { e.stopPropagation(); markRead.mutate({ id: notif.id }); }}
                      className="shrink-0 h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors"
                      title="Segna come letta">
                      <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Nessuna notifica</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
