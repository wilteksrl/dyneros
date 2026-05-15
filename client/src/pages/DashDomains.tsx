import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, ExternalLink, Globe, Loader2, Plus, Server, Trash2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

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
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.dashboard.domains.useQuery();
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ domainName: "", registrar: "", expiryDate: "", notes: "" });
  const addDomain = trpc.dashboard.addDomain.useMutation({
    onSuccess: () => { utils.dashboard.domains.invalidate(); setShowAdd(false); setAddForm({ domainName: "", registrar: "", expiryDate: "", notes: "" }); },
  });
  const removeDomain = trpc.dashboard.removeDomain.useMutation({
    onSuccess: () => utils.dashboard.domains.invalidate(),
  });

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{t("dash.domains")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{data.domains.length} {t("domain.managed_by_dyneros")}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium"
            style={{ background: GOLD, color: "#000" }}>
            <Plus className="h-4 w-4" /> Aggiungi Dominio
          </button>
        </div>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="w-full max-w-md rounded-xl p-6 space-y-4" style={{ background: "oklch(10% 0.006 264)", border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Aggiungi Dominio</h2>
                <button onClick={() => setShowAdd(false)}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              {addDomain.error && (
                <div className="rounded-lg px-3 py-2 text-sm" style={{ background: "oklch(15% 0.12 25)", color: "oklch(70% 0.22 25)" }}>
                  {addDomain.error.message}
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Nome dominio *</label>
                  <input value={addForm.domainName} onChange={e => setAddForm(f => ({ ...f, domainName: e.target.value }))}
                    className="w-full rounded-lg px-3 h-9 text-sm font-mono bg-transparent border outline-none"
                    style={{ borderColor: BORDER }} placeholder="es. miosito.com" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Registrar</label>
                    <input value={addForm.registrar} onChange={e => setAddForm(f => ({ ...f, registrar: e.target.value }))}
                      className="w-full rounded-lg px-3 h-9 text-sm bg-transparent border outline-none"
                      style={{ borderColor: BORDER }} placeholder="Es. GoDaddy" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Scadenza</label>
                    <input type="date" value={addForm.expiryDate} onChange={e => setAddForm(f => ({ ...f, expiryDate: e.target.value }))}
                      className="w-full rounded-lg px-3 h-9 text-sm border outline-none"
                      style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER }} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAdd(false)} className="px-4 h-8 rounded-lg text-sm border" style={{ borderColor: BORDER }}>Annulla</button>
                <button disabled={addDomain.isPending || !addForm.domainName.trim()}
                  onClick={() => addDomain.mutate({ domainName: addForm.domainName, registrar: addForm.registrar || undefined, expiryDate: addForm.expiryDate || undefined })}
                  className="flex items-center gap-2 px-4 h-8 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: GOLD, color: "#000" }}>
                  {addDomain.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Salva
                </button>
              </div>
            </div>
          </div>
        )}

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
                          {t("domain.ssl_valid")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span>Hosting: {domain.hosting}</span>
                      <span>·</span>
                      <span>Uptime: {domain.uptime}%</span>
                      <span>·</span>
                      <span>{t("domain.last_deploy")}: {domain.lastDeploy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={`https://${domain.domain}`} target="_blank" rel="noopener noreferrer"
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                  {'id' in domain && (
                    <button onClick={() => removeDomain.mutate({ domainId: (domain as { id: number }).id })}
                      className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Server className="h-4 w-4" style={{ color: GOLD }} />
            {t("domain.deploy_history")}
          </h2>
          {data.deployHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("domain.no_deploys")}</p>
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
                    <p className="text-xs text-muted-foreground">{new Date(dep.time).toLocaleString()} · {t("label.duration")}: {dep.duration}</p>
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
