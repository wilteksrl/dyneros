import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

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

export default function DashNotifications() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.dashboard.notifications.useQuery();
  const [filter, setFilter] = useState("all");

  const typeLabels: Record<string, string> = {
    ticket_update: t("label.ticket"), milestone: t("label.project"), invoice: t("label.invoice"),
    deployment: "Deploy", system: t("notif.system"), alert: "Alert",
  };

  const filters = [
    { key: "all", label: t("common.all") },
    { key: "unread", label: t("notif.unread") },
    { key: "ticket_update", label: t("label.ticket") },
    { key: "invoice", label: t("label.invoice") },
    { key: "system", label: t("notif.system") },
  ];

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
            <h1 className="text-xl font-semibold">{t("dash.notifications")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unread > 0 ? `${unread} ${t("notif.unread").toLowerCase()}` : t("notif.all_read")}
            </p>
          </div>
          {unread > 0 && (
            <button
              onClick={() => markAllRead.mutate()}
              disabled={markAllRead.isPending}
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50">
              {markAllRead.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCheck className="h-3.5 w-3.5" />}
              {t("action.markallread")}
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap mb-5">
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
          <div className="space-y-2">
            {filtered.map(n => {
              const color = TYPE_COLORS[n.type] || "oklch(55% 0.05 264)";
              return (
                <div key={n.id}
                  className="flex items-start gap-4 p-4 rounded-xl border transition-all"
                  style={{
                    background: n.read ? CARD_BG : "oklch(11% 0.008 264)",
                    borderColor: n.read ? BORDER : `${color}30`,
                  }}>
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: `${color}15` }}>
                    {TYPE_ICONS[n.type] || "🔔"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ color, background: `${color}15` }}>
                        {typeLabels[n.type] || n.type}
                      </span>
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                      )}
                    </div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead.mutate({ id: n.id })}
                      disabled={markRead.isPending}
                      className="shrink-0 h-7 w-7 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors disabled:opacity-50"
                      title={t("action.markread")}>
                      <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-3 opacity-30" />
                <p className="text-sm">{t("msg.no_notifications")}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
