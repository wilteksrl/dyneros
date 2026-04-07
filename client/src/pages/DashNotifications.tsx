import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const TYPE_ICONS: Record<string, string> = {
  ticket: "🎫", project: "📁", invoice: "💳", blockchain: "⛓️", system: "⚙️", security: "🔒",
};
const TYPE_COLORS: Record<string, string> = {
  ticket: "oklch(55% 0.18 220)", project: GOLD, invoice: "oklch(60% 0.18 145)",
  blockchain: "oklch(60% 0.18 300)", system: "oklch(55% 0.05 264)", security: "oklch(55% 0.22 25)",
};

export default function DashNotifications() {
  const { data, isLoading } = trpc.dashboard.notifications.useQuery();
  const unread = data?.filter(n => !n.read).length ?? 0;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Notifiche</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {unread > 0 ? `${unread} non lette` : "Tutte lette"}
            </p>
          </div>
          {unread > 0 && (
            <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <CheckCheck className="h-3.5 w-3.5" />
              Segna tutte come lette
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
          </div>
        ) : (
          <div className="space-y-2">
            {data?.map(notif => {
              const tc = TYPE_COLORS[notif.type] || "oklch(55% 0.05 264)";
              return (
                <div key={notif.id}
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
                      <p className={`text-sm ${notif.read ? "" : "font-semibold"}`}>{notif.title}</p>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: GOLD }} />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-1.5">
                      {new Date(notif.createdAt).toLocaleString("it-IT")}
                    </p>
                  </div>
                </div>
              );
            })}
            {data?.length === 0 && (
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
