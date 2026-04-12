import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, Copy, ExternalLink, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(value); setCopied(true); toast.success(label); setTimeout(() => setCopied(false), 2000); }}
      className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
      <Copy className="h-3 w-3" style={{ color: copied ? GOLD : "oklch(50% 0.05 264)" }} />
    </button>
  );
}

export default function DashWallet() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.dashboard.walletInfo.useQuery();

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
          <h1 className="text-xl font-semibold">{t("dash.wallet")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("wallet.self_custody_desc")}</p>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.2)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-semibold">{t("wallet.linked_addresses")}</h2>
          </div>
          <div className="space-y-3">
            {data.addresses.map(addr => (
              <div key={addr.address} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: GOLD_DIM }}>
                  <Wallet className="h-3.5 w-3.5" style={{ color: GOLD }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{addr.label}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(18%_0.008_264)] text-muted-foreground uppercase">
                      {addr.type}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground truncate">{addr.address}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <CopyButton value={addr.address} label={t("action.copied")} />
                  <a href={`${data.chain.explorerUrl}/address/${addr.address}`} target="_blank" rel="noopener noreferrer"
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4">{t("wallet.token_portfolio")}</h2>
          <div className="space-y-2">
            {data.portfolio.map(token => (
              <div key={token.symbol} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: GOLD_DIM, color: GOLD }}>
                  {token.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: GOLD }}>
                  {parseFloat(token.balance).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            {t("blockchain.recent_tx")}
          </h2>
          {data.recentTx.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">{t("blockchain.no_tx")}</p>
          ) : (
            <div className="space-y-2">
              {(data.recentTx as Array<{ hash: string; type: string; amount: string; to: string; time: string; status: string }>).map(tx => (
                <div key={tx.hash} className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-[oklch(18%_0.008_264)]">
                    <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-mono text-muted-foreground truncate">{tx.hash}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(18%_0.008_264)] text-muted-foreground">{tx.type}</span>
                    </div>
                    <p className="text-sm font-medium mt-0.5">{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">→ {tx.to} · {new Date(tx.time).toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: "oklch(60% 0.18 145 / 0.12)", color: "oklch(60% 0.18 145)" }}>
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 flex-wrap">
          <a href={data.chain.walletUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            <ExternalLink className="h-3.5 w-3.5" />
            {t("wallet.open_dyneros")}
          </a>
          <a href={data.chain.explorerUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium border transition-all hover:border-[oklch(68%_0.19_72/0.5)]"
            style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER }}>
            <ExternalLink className="h-3.5 w-3.5" style={{ color: GOLD }} />
            {t("blockchain.open_explorer")}
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
