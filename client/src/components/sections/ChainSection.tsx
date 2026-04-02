import { ExternalLink, Lock, Zap, Shield, Code2, Server, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Lock,
    title: "Privata e Permissionata",
    description: "Solo i partecipanti autorizzati accedono alla rete. Piena sovranità sui dati.",
  },
  {
    icon: Code2,
    title: "Compatibile con Smart Contract",
    description: "Distribuisci ed esegui smart contract con strumenti e standard familiari.",
  },
  {
    icon: Zap,
    title: "Alta Capacità di Elaborazione",
    description: "Progettata per volumi di transazioni enterprise senza degradazione delle prestazioni.",
  },
  {
    icon: Shield,
    title: "Sicurezza Enterprise",
    description: "Sicurezza crittografica multi-livello con audit trail e strumenti di conformità.",
  },
  {
    icon: Server,
    title: "Deployment Personalizzato",
    description: "Distribuisci sulla tua infrastruttura o sulla nostra. Controllo completo della configurazione.",
  },
  {
    icon: Globe,
    title: "Disponibilità Globale",
    description: "L'architettura a nodi distribuiti garantisce resilienza e accesso a bassa latenza.",
  },
];

const endpoints = [
  { label: "Mainnet", url: "https://mainnet.dyneros.com", badge: "LIVE" },
  { label: "Explorer", url: "https://explorer.dyneros.com", badge: null },
  { label: "Wallet", url: "https://wallet.dyneros.com", badge: null },
];

export default function ChainSection() {
  return (
    <section id="chain" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              Prodotto Core
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold mb-6 text-foreground"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dyneros Chain
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-4">
            Un layer blockchain dedicato e ad alte prestazioni per le aziende che necessitano
            di controllo, prevedibilità e conformità — senza il rumore delle reti pubbliche.
          </p>

          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="p-4 rounded-lg border border-[oklch(55%_0.22_25/0.3)] bg-[oklch(55%_0.22_25/0.05)]">
              <p className="text-sm font-semibold text-[oklch(70%_0.18_25)] mb-2">Blockchain pubbliche</p>
              <p className="text-sm text-muted-foreground">
                Costi imprevedibili, dati pubblici, nessun controllo sull'infrastruttura.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-[oklch(68%_0.19_72/0.3)] bg-[oklch(68%_0.19_72/0.05)]">
              <p className="text-sm font-semibold text-[oklch(68%_0.19_72)] mb-2">Dyneros Chain</p>
              <p className="text-sm text-muted-foreground">
                Costi fissi, dati privati, piena proprietà del tuo ambiente blockchain.
              </p>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card-hover p-6 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] group"
            >
              <div className="w-10 h-10 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center mb-4 group-hover:bg-[oklch(68%_0.19_72/0.15)] transition-colors">
                <feature.icon className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
              </div>
              <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Network endpoints */}
        <div className="border border-[oklch(22%_0.008_264)] rounded-2xl bg-[oklch(10%_0.006_264)] p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3
                className="text-xl font-semibold text-foreground mb-2"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Accesso alla Rete
              </h3>
              <p className="text-sm text-muted-foreground">
                Connettiti direttamente all'infrastruttura Dyneros Chain.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {endpoints.map((ep) => (
                <a
                  key={ep.label}
                  href={ep.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[oklch(22%_0.008_264)] bg-[oklch(14%_0.007_264)] hover:border-[oklch(68%_0.19_72/0.4)] hover:bg-[oklch(68%_0.19_72/0.05)] transition-all group"
                >
                  {ep.badge && (
                    <span className="text-[10px] font-bold text-[oklch(68%_0.19_72)] bg-[oklch(68%_0.19_72/0.15)] px-1.5 py-0.5 rounded-full">
                      {ep.badge}
                    </span>
                  )}
                  <span className="text-sm font-medium text-foreground">{ep.label}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-[oklch(68%_0.19_72)] transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[oklch(22%_0.008_264)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground italic">
              "Non una criptovaluta. Un'infrastruttura."
            </p>
            <div className="flex gap-3">
              <a href="https://explorer.dyneros.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="border-[oklch(22%_0.008_264)] hover:border-[oklch(68%_0.19_72/0.4)]">
                  Apri Explorer
                </Button>
              </a>
              <a href="https://wallet.dyneros.com" target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold"
                >
                  Accedi al Wallet
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
