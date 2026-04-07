import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Code2, Copy, Eye, EyeOff, Key, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const PERM_COLORS: Record<string, string> = {
  read: "oklch(55% 0.18 220)", write: GOLD, blockchain: "oklch(60% 0.18 300)", admin: "oklch(55% 0.22 25)",
};

export default function DashApiKeys() {
  const { data, isLoading } = trpc.dashboard.apiKeys.useQuery();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

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
            onClick={() => toast.info("Contatta il tuo account manager per generare nuove chiavi API")}
            className="flex items-center gap-2 text-sm font-medium px-4 h-9 rounded-lg transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            <Plus className="h-4 w-4" />
            Nuova Chiave
          </button>
        </div>

        <div className="rounded-xl border p-4" style={{ background: "oklch(55% 0.22 25 / 0.06)", borderColor: "oklch(55% 0.22 25 / 0.3)" }}>
          <p className="text-sm text-orange-300">
            <strong>Attenzione:</strong> Non condividere mai le tue chiavi API. Trattale come password. In caso di compromissione, contatta immediatamente il supporto Dyneros.
          </p>
        </div>

        <div className="space-y-4">
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
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(60% 0.18 145 / 0.12)", color: "oklch(60% 0.18 145)" }}>
                  {key.status}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg mb-3"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <Code2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <p className="text-sm font-mono flex-1 truncate">
                  {revealed[key.id] ? `${key.prefix}••••••••••••••••••••••••••••••••` : `${key.prefix}${"•".repeat(32)}`}
                </p>
                <button onClick={() => setRevealed(r => ({ ...r, [key.id]: !r[key.id] }))}
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors shrink-0">
                  {revealed[key.id] ? <EyeOff className="h-3 w-3 text-muted-foreground" /> : <Eye className="h-3 w-3 text-muted-foreground" />}
                </button>
                <button onClick={() => { navigator.clipboard.writeText(`${key.prefix}[REDACTED]`); toast.success("Prefisso copiato"); }}
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
    </DashboardLayout>
  );
}
