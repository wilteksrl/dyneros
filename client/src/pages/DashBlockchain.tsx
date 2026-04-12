import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { CircuitBoard, Copy, ExternalLink, Loader2, Server, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    toast.success("Copiato negli appunti");
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy}
      className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors shrink-0">
      <Copy className="h-3 w-3" style={{ color: copied ? GOLD : "oklch(50% 0.05 264)" }} />
    </button>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: accent ? "oklch(68% 0.19 72 / 0.3)" : BORDER }}>
      <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-2">{label}</p>
      <p className="text-xl font-semibold" style={accent ? { color: GOLD } : {}}>{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

export default function DashBlockchain() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.dashboard.blockchainInfo.useQuery();
  const { data: netStatus } = trpc.network.status.useQuery();

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
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Blockchain / Web3</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Console DYNEROS Chain — Chain ID {data.chain.chainId}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full animate-pulse" style={{ background: "oklch(60% 0.18 145)" }} />
            <span className="text-xs text-muted-foreground">Rete Operativa</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Chain ID" value={data.chain.chainId} accent />
          <StatCard label="Transazioni Totali" value={data.stats.totalTransactions.toLocaleString("it-IT")} />
          <StatCard label="Blocchi Totali" value={data.stats.totalBlocks.toLocaleString("it-IT")} />
          <StatCard label="Validatori Attivi" value={`${data.stats.activeValidators}/12`} />
          <StatCard label="Holder Totali" value={data.stats.totalHolders.toLocaleString("it-IT")} />
        </div>

        {netStatus && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label={t("blockchain.block_height")} value={netStatus.blockHeight.toLocaleString()} accent />
            <StatCard label="TPS" value={`${netStatus.tps} tx/s`} />
            <StatCard label="Uptime" value={`${netStatus.uptime}%`} />
            <StatCard label="Finalità" value="Immediata" />
          </div>
        )}

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Server className="h-4 w-4" style={{ color: GOLD }} />
            Endpoint di Rete
          </h2>
          <div className="space-y-3">
            {[
              { label: "RPC Mainnet", value: data.chain.rpcUrl, href: data.chain.rpcUrl },
              { label: t("blockchain.explorer"), value: data.chain.explorerUrl, href: data.chain.explorerUrl },
              { label: "Wallet", value: data.chain.walletUrl, href: data.chain.walletUrl },
            ].map(ep => (
              <div key={ep.label} className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{ep.label}</p>
                  <p className="text-sm font-mono truncate">{ep.value}</p>
                </div>
                <CopyButton value={ep.value} />
                <a href={ep.href} target="_blank" rel="noopener noreferrer"
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: GOLD }} />
            Token Ufficiali DYNEROS Chain
          </h2>
          <div className="space-y-2">
            {data.tokens.map(token => (
              <div key={token.symbol} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: GOLD_DIM, color: GOLD }}>
                  {token.symbol.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{token.symbol}</p>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground truncate">{token.contract}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <CopyButton value={token.contract} />
                  <a href={`${data.chain.explorerUrl}/token/${token.contract}`} target="_blank" rel="noopener noreferrer"
                    className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <CircuitBoard className="h-4 w-4" style={{ color: GOLD }} />
            Contratti Core del Protocollo
          </h2>
          <div className="space-y-2">
            {[
              { label: "DEX Factory", address: data.contracts.factory },
              { label: "DEX Router", address: data.contracts.router },
              { label: "WETH9 / WDYN", address: data.contracts.weth9 },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-4 p-3 rounded-lg"
                style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">{c.label}</p>
                  <p className="text-sm font-mono truncate">{c.address}</p>
                </div>
                <CopyButton value={c.address} />
                <a href={`${data.chain.explorerUrl}/address/${c.address}`} target="_blank" rel="noopener noreferrer"
                  className="h-6 w-6 flex items-center justify-center rounded hover:bg-[oklch(18%_0.008_264)] transition-colors">
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {[
            { label: t("blockchain.open_explorer"), href: data.chain.explorerUrl },
            { label: "Apri Wallet", href: data.chain.walletUrl },
            { label: "Connetti Mainnet RPC", href: data.chain.rpcUrl },
          ].map(btn => (
            <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium border transition-all hover:border-[oklch(68%_0.19_72/0.5)]"
              style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER }}>
              <ExternalLink className="h-3.5 w-3.5" style={{ color: GOLD }} />
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
