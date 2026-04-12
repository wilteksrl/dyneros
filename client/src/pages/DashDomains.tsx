import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ExternalLink, Globe, Loader2, Server } from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const ENV_COLORS: Record<string, string> = {
  production: "oklch(60% 0.18 145)", staging: GOLD, development: "oklch(55% 0.18 220)",
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

export default function DashDomains() {
  const { data, isLoading } = trpc.dashboard.domains.useQuery();

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
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Domini / Hosting</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{data.domains.length} ambienti gestiti da Dyneros</p>
        </div>

        <div className="space-y-3">
          {data.domains.map(domain => (
            <div key={domain.domain} className="p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
              style={{ background: CARD_BG, borderColor: BORDER }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(15%_0.008_264)]">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold font-mono">{domain.domain}</p>
                      <Badge color={ENV_COLORS[domain.environment] || GOLD} label={domain.environment} />
                      {domain.ssl === "valid" && (
                        <span className="flex items-center gap-1 text-[10px] text-green-400">
                          <CheckCircle2 className="h-3 w-3" />
                          SSL Valido
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span>Hosting: {domain.hosting}</span>
                      <span>·</span>
                      <span>Uptime: {domain.uptime}%</span>
                      <span>·</span>
                      <span>Ultimo deploy: {domain.lastDeploy}</span>
                    </div>
                  </div>
                </div>
                <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer"
                  className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors shrink-0">
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Server className="h-4 w-4" style={{ color: GOLD }} />
            Storico Deploy
          </h2>
          {data.deployHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Nessun deploy registrato</p>
          ) : (
            <div className="space-y-2">
              {(data.deployHistory as Array<{ id: string; domain: string; version: string; status: string; time: string; duration: string }>).map(dep => (
                <div key={dep.id} className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ background: dep.status === "success" ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-mono">{dep.domain}</p>
                      <span className="text-xs text-muted-foreground">{dep.version}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(dep.time).toLocaleString("it-IT")} · Durata: {dep.duration}</p>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{dep.id}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
