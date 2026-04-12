import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Key, Loader2, LogOut, Monitor, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

export default function DashSecurity() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.dashboard.securityInfo.useQuery();

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
      </div>
    </DashboardLayout>
  );
  if (!data) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Sicurezza</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestione accessi, sessioni e log di sicurezza</p>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.2)" }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: GOLD }} />
            Stato Sicurezza Account
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Autenticazione", value: data.authMethod, icon: <Key className="h-3.5 w-3.5" />, ok: true },
              { label: "2FA", value: data.twoFa ? t("status.active") : "Non attivo", icon: <Smartphone className="h-3.5 w-3.5" />, ok: data.twoFa },
              { label: t("label.active_sessions"), value: `${data.activeSessions.length}`, icon: <Monitor className="h-3.5 w-3.5" />, ok: true },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg" style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-1.5 mb-1" style={{ color: item.ok ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)" }}>
                  {item.icon}
                  <p className="text-[10px] uppercase tracking-wide">{item.label}</p>
                </div>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Monitor className="h-4 w-4" style={{ color: GOLD }} />
            Sessioni Attive
          </h2>
          <div className="space-y-2">
            {data.activeSessions.map((session, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <Monitor className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">{session.device}</p>
                    {session.current && (
                      <span className="flex items-center gap-1 text-[10px] text-green-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Sessione corrente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{session.location} · {session.ip} · {new Date(session.lastActive).toLocaleString("it-IT")}</p>
                </div>
                {!session.current && (
                  <button onClick={() => toast.success("Sessione terminata — la sessione verrà invalidata al prossimo accesso")}
                    className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[oklch(18%_0.008_264)] transition-colors shrink-0"
                    title="Termina sessione">
                    <LogOut className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: GOLD }} />
            Log di Sicurezza
          </h2>
          <div className="space-y-2">
            {data.securityLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="h-2 w-2 rounded-full mt-1.5 shrink-0"
                  style={{ background: entry.severity === "high" ? "oklch(55% 0.22 25)" : entry.severity === "medium" ? GOLD : "oklch(60% 0.18 145)" }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{entry.event}</p>
                  <p className="text-xs text-muted-foreground">{entry.ip} · {new Date(entry.time).toLocaleString("it-IT")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
