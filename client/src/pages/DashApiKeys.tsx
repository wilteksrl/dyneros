import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Code2, Copy, Key, Loader2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const PERM_COLORS: Record<string, string> = {
  read: "oklch(55% 0.18 220)", write: GOLD, blockchain: "oklch(60% 0.18 300)", admin: "oklch(55% 0.22 25)",
};

const AVAILABLE_SCOPES = ["read", "write", "blockchain"];

export default function DashApiKeys() {
  const { t } = useLanguage();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.dashboard.apiKeys.useQuery();
  const [showModal, setShowModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read"]);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const generateKey = trpc.dashboard.generateApiKey.useMutation({
    onSuccess: (res) => {
      utils.dashboard.apiKeys.invalidate();
      setGeneratedKey(res.key);
      setNewKeyName("");
      setSelectedScopes(["read"]);
    },
    onError: (e) => toast.error(e.message),
  });

  const revokeKey = trpc.dashboard.revokeApiKey.useMutation({
    onSuccess: () => {
      utils.dashboard.apiKeys.invalidate();
      toast.success(t("apikey.revoked"));
    },
    onError: (e) => toast.error(e.message),
  });

  const handleGenerate = () => {
    if (!newKeyName.trim()) return toast.error("Inserisci un nome per la chiave");
    if (selectedScopes.length === 0) return toast.error("Seleziona almeno un permesso");
    generateKey.mutate({ name: newKeyName.trim(), scopes: selectedScopes });
  };

  const toggleScope = (scope: string) => {
    setSelectedScopes(prev =>
      prev.includes(scope) ? prev.filter(s => s !== scope) : [...prev, scope]
    );
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Chiavi API</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Gestisci le credenziali di accesso alle API Dyneros</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setGeneratedKey(null); }}
            className="flex items-center gap-2 text-sm font-medium px-4 h-9 rounded-lg transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            <Plus className="h-4 w-4" />
            Nuova Chiave
          </button>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "oklch(55% 0.22 25 / 0.06)", borderColor: "oklch(55% 0.22 25 / 0.3)" }}>
          <p className="text-sm text-orange-300">
            <strong>Attenzione:</strong> Non condividere mai le tue chiavi API. Trattale come password. In caso di compromissione, revoca immediatamente la chiave.
          </p>
        </div>

        <div className="space-y-4">
          {data?.keys.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Key className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Nessuna chiave API attiva</p>
              <p className="text-xs mt-1">Clicca "Nuova Chiave" per generarne una</p>
            </div>
          )}
          {data?.keys.map(key => (
            <div key={key.id} className="p-5 rounded-xl border" style={{ background: CARD_BG, borderColor: BORDER }}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: GOLD_DIM }}>
                    <Key className="h-4 w-4" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{key.name}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                      <span>Creata: {key.created}</span>
                      <span>·</span>
                      <span>Ultimo uso: {key.lastUsed}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => revokeKey.mutate({ id: Number(key.id) })}
                  disabled={revokeKey.isPending}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 transition-colors disabled:opacity-50">
                  <Trash2 className="h-3.5 w-3.5" />
                  Revoca
                </button>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg mb-3"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <Code2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <p className="text-sm font-mono flex-1 truncate">{key.prefix}{"•".repeat(32)}</p>
                <button onClick={() => { navigator.clipboard.writeText(key.prefix); toast.success("Prefisso copiato"); }}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors shrink-0">
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Permessi:</span>
                {key.permissions.map(p => (
                  <span key={p} className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                    style={{ color: PERM_COLORS[p] || "oklch(55% 0.05 264)", borderColor: `${PERM_COLORS[p] || "oklch(55% 0.05 264)"}40`, background: `${PERM_COLORS[p] || "oklch(55% 0.05 264)"}12` }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-3">Endpoint Base</h2>
          <div className="space-y-2">
            {[
              { label: "REST API", value: "https://api.dyneros.com/v2" },
              { label: "RPC Mainnet", value: "https://mainnet.dyneros.com" },
              { label: "WebSocket", value: "wss://mainnet.dyneros.com" },
            ].map(ep => (
              <div key={ep.label} className="flex items-center gap-3 p-2.5 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <p className="text-xs text-muted-foreground w-24 shrink-0">{ep.label}</p>
                <p className="text-xs font-mono flex-1 truncate">{ep.value}</p>
                <button onClick={() => { navigator.clipboard.writeText(ep.value); toast.success("Copiato"); }}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors shrink-0">
                  <Copy className="h-3 w-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "oklch(0% 0 0 / 0.7)" }}>
          <div className="w-full max-w-md rounded-2xl border p-6" style={{ background: "oklch(10% 0.006 264)", borderColor: BORDER }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold">Nuova Chiave API</h2>
              <button onClick={() => { setShowModal(false); setGeneratedKey(null); }}
                className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {generatedKey ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg" style={{ background: "oklch(60% 0.18 145 / 0.08)", border: "1px solid oklch(60% 0.18 145 / 0.3)" }}>
                  <p className="text-xs text-green-400 mb-2 font-semibold">Chiave generata — salvala ora, non verrà mostrata di nuovo!</p>
                  <p className="text-xs font-mono break-all" style={{ color: GOLD }}>{generatedKey}</p>
                </div>
                <button onClick={() => { navigator.clipboard.writeText(generatedKey); toast.success("Chiave copiata"); }}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium"
                  style={{ background: GOLD, color: "#000" }}>
                  <Copy className="h-3.5 w-3.5" />
                  Copia Chiave
                </button>
                <button onClick={() => { setShowModal(false); setGeneratedKey(null); }}
                  className="w-full h-9 rounded-lg text-sm text-muted-foreground border transition-colors hover:text-foreground"
                  style={{ borderColor: BORDER }}>
                  Chiudi
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Nome Chiave</label>
                  <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                    placeholder="es. Integrazione ERP"
                    className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                    style={{ borderColor: BORDER }} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-2">Permessi</label>
                  <div className="flex gap-2 flex-wrap">
                    {AVAILABLE_SCOPES.map(scope => (
                      <button key={scope} onClick={() => toggleScope(scope)}
                        className="px-3 h-7 rounded-full text-xs font-medium transition-all border"
                        style={selectedScopes.includes(scope)
                          ? { background: GOLD, color: "#000", borderColor: GOLD }
                          : { background: "oklch(15% 0.008 264)", color: "oklch(65% 0.05 264)", borderColor: BORDER }}>
                        {scope}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleGenerate} disabled={generateKey.isPending}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: GOLD, color: "#000" }}>
                  {generateKey.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
                  Genera Chiave
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
