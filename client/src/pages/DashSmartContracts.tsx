import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Box, CheckCircle2, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); toast.success("Copiato"); setTimeout(() => setCopied(false), 2000); }}
      className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
      <Copy className="h-3 w-3" style={{ color: copied ? GOLD : "oklch(50% 0.05 264)" }} />
    </button>
  );
}

export default function DashSmartContracts() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.dashboard.smartContracts.useQuery();

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
          <h1 className="text-xl font-semibold">Smart Contracts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {data.contracts.length} contratti su DYNEROS Chain (ID: {data.chain.chainId})
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Contratti Totali", value: data.contracts.length, accent: true },
            { label: "Verificati", value: data.contracts.filter(c => c.verified).length },
            { label: t("status.active"), value: data.contracts.filter(c => c.status === "active").length },
            { label: t("label.network"), value: "DYNEROS Chain" },
          ].map(s => (
            <div key={s.label} className="rounded-xl border p-4"
              style={{ background: CARD_BG, borderColor: s.accent ? "oklch(68% 0.19 72 / 0.3)" : BORDER }}>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">{s.label}</p>
              <p className="text-xl font-semibold" style={s.accent ? { color: GOLD } : {}}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Box className="h-4 w-4" style={{ color: GOLD }} />
            Contratti nel Tuo Workspace
          </h2>
          <div className="space-y-3">
            {data.contracts.map(contract => (
              <div key={contract.id} className="p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.25)]"
                style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: GOLD_DIM }}>
                      <Box className="h-4 w-4" style={{ color: GOLD }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold">{contract.name}</p>
                        {contract.verified && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-green-400">
                            <CheckCircle2 className="h-3 w-3" />
                            Verificato
                          </span>
                        )}
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(18%_0.008_264)] text-muted-foreground">
                          {contract.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{contract.network} · Deploy: {contract.deployDate ? new Date(contract.deployDate).toLocaleDateString("it-IT") : "—"}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">{contract.id}</span>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg"
                  style={{ background: "oklch(9% 0.005 264)", border: `1px solid ${BORDER}` }}>
                  <p className="text-xs font-mono text-muted-foreground flex-1 truncate">{contract.address}</p>
                  <CopyButton value={contract.address} />
                  <a href={`${data.chain.explorerUrl}/address/${contract.address}`} target="_blank" rel="noopener noreferrer"
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </div>


              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
