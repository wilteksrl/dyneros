import { Search, Wallet, BarChart3 } from "lucide-react";

function MockWindow({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)] overflow-hidden shadow-2xl">
      {/* Title bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[oklch(55%_0.22_25/0.7)]" />
          <div className="w-3 h-3 rounded-full bg-[oklch(65%_0.18_85/0.7)]" />
          <div className="w-3 h-3 rounded-full bg-[oklch(60%_0.18_145/0.7)]" />
        </div>
        <div className="flex items-center gap-2 flex-1 justify-center">
          <Icon className="w-3.5 h-3.5 text-[oklch(68%_0.19_72)]" />
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}

function ExplorerMock() {
  const txs = [
    { hash: "0x4f3a...8b2c", block: "1,847,291", time: "2s fa", status: "Confermata" },
    { hash: "0x9e1d...3f7a", block: "1,847,290", time: "14s fa", status: "Confermata" },
    { hash: "0x2c8b...6d4e", block: "1,847,289", time: "28s fa", status: "Confermata" },
    { hash: "0x7a5f...1c9b", block: "1,847,288", time: "42s fa", status: "Confermata" },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-[oklch(14%_0.007_264)] border border-[oklch(22%_0.008_264)]">
        <Search className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Cerca transazioni, blocchi, indirizzi...</span>
      </div>
      <div className="space-y-1">
        {txs.map((tx) => (
          <div
            key={tx.hash}
            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[oklch(14%_0.007_264)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(68%_0.19_72)]" />
              <span className="text-xs font-mono text-[oklch(68%_0.19_72)]">{tx.hash}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden sm:block">Blocco {tx.block}</span>
              <span className="text-xs text-muted-foreground">{tx.time}</span>
              <span className="text-[10px] font-medium text-[oklch(60%_0.18_145)] bg-[oklch(60%_0.18_145/0.1)] px-2 py-0.5 rounded-full">
                {tx.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WalletMock() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Saldo Totale</p>
          <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            48,291.00
            <span className="text-sm font-normal text-[oklch(68%_0.19_72)] ml-1">DYN</span>
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[oklch(68%_0.19_72/0.15)] flex items-center justify-center">
          <Wallet className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
        </div>
      </div>
      <div className="space-y-2">
        {[
          { label: "Invia", color: "oklch(68% 0.19 72)" },
          { label: "Ricevi", color: "oklch(60% 0.18 145)" },
          { label: "Cronologia", color: "oklch(65% 0.010 264)" },
        ].map((action) => (
          <div
            key={action.label}
            className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[oklch(22%_0.008_264)] hover:border-[oklch(68%_0.19_72/0.3)] transition-colors cursor-pointer"
          >
            <span className="text-sm font-medium text-foreground">{action.label}</span>
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: action.color }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMock() {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "TPS", value: "1,247" },
          { label: "Validatori", value: "12" },
          { label: "Blocchi", value: "1.8M" },
          { label: "Uptime", value: "99.9%" },
        ].map((metric) => (
          <div
            key={metric.label}
            className="p-3 rounded-lg bg-[oklch(14%_0.007_264)] border border-[oklch(22%_0.008_264)]"
          >
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              {metric.label}
            </p>
            <p
              className="text-lg font-bold text-[oklch(68%_0.19_72)]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      {/* Mini chart bars */}
      <div className="flex items-end gap-1 h-12 px-1">
        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              backgroundColor: `oklch(68% 0.19 72 / ${0.2 + (h / 100) * 0.6})`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PlatformSection() {
  const panels = [
    {
      title: "Explorer — explorer.dyneros.com",
      icon: Search,
      label: "Explorer",
      description: "Visibilità completa su transazioni e blocchi della Dyneros Chain.",
      content: <ExplorerMock />,
    },
    {
      title: "Wallet — wallet.dyneros.com",
      icon: Wallet,
      label: "Wallet",
      description: "Gestione sicura degli asset e degli account per utenti enterprise.",
      content: <WalletMock />,
    },
    {
      title: "Network Dashboard",
      icon: BarChart3,
      label: "Dashboard",
      description: "Panoramica in tempo reale della chain con metriche di performance e indicatori di salute.",
      content: <DashboardMock />,
    },
  ];

  return (
    <section id="platform" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              Piattaforma
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            L'Esperienza Completa della Piattaforma
          </h2>
          <p className="text-muted-foreground text-lg">
            Tutti gli strumenti di cui il tuo team ha bisogno per operare, monitorare e gestire la tua infrastruttura blockchain.
          </p>
        </div>

        {/* Three panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {panels.map((panel) => (
            <div key={panel.label} className="flex flex-col gap-4">
              <MockWindow title={panel.title} icon={panel.icon}>
                {panel.content}
              </MockWindow>
              <div>
                <h3
                  className="font-semibold text-foreground mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {panel.label}
                </h3>
                <p className="text-sm text-muted-foreground">{panel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
