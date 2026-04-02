import { Factory, Truck, Landmark, ShoppingBag, Gamepad2, Rocket } from "lucide-react";

const industries = [
  {
    icon: Factory,
    industry: "Manifattura",
    problem: "Lacune nella tracciabilità lungo le supply chain creano dispute e fallimenti di conformità.",
    solution: "Supply chain on-chain con registrazioni immutabili in ogni fase produttiva.",
    outcome: "Audit trail completo, zero dispute, conformità normativa by default.",
  },
  {
    icon: Truck,
    industry: "Logistica",
    problem: "Frodi documentali e certificazioni manuali rallentano le operazioni transfrontaliere.",
    solution: "Certificazione digitale con verifica crittografica di ogni spedizione.",
    outcome: "Registrazioni di spedizione immutabili, sdoganamento più rapido, eliminazione delle frodi.",
  },
  {
    icon: Landmark,
    industry: "Finanza",
    problem: "Cicli di regolamento lenti e alti costi di transazione erodono i margini.",
    solution: "Canali di pagamento interni costruiti su Dyneros Chain per regolamento istantaneo.",
    outcome: "Trasferimenti istantanei e a basso costo con piena auditabilità e conformità.",
  },
  {
    icon: ShoppingBag,
    industry: "Retail",
    problem: "I programmi fedeltà frammentati non riescono a fidelizzare i clienti né a generare dati.",
    solution: "Infrastruttura fedeltà tokenizzata — programmabile, portabile, interoperabile.",
    outcome: "Premi unificati, maggiore fidelizzazione e customer intelligence azionabile.",
  },
  {
    icon: Gamepad2,
    industry: "Gaming",
    problem: "Le economie di gioco vengono sfruttate, minando la fiducia dei giocatori e la monetizzazione.",
    solution: "Economia di asset digitali verificabile con proprietà e provenienza on-chain.",
    outcome: "Proprietà verificabile, valore reale degli asset, economia di gioco sostenibile.",
  },
  {
    icon: Rocket,
    industry: "Startup",
    problem: "I costi e la complessità dell'infrastruttura rallentano i cicli di sviluppo del prodotto.",
    solution: "Fondamenta blockchain scalabili con infrastruttura gestita fin dal primo giorno.",
    outcome: "Lancia più velocemente, scala a costi inferiori, concentrati sul prodotto non sull'infrastruttura.",
  },
];

export default function SolutionsSection() {
  return (
    <section id="solutions" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              Soluzioni
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Costruito per il Tuo Settore
          </h2>
          <p className="text-muted-foreground text-lg">
            Problemi reali. Soluzioni concrete. Risultati misurabili.
          </p>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industries.map((item) => (
            <div
              key={item.industry}
              className="card-hover p-6 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] group flex flex-col"
            >
              {/* Icon + industry */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center group-hover:bg-[oklch(68%_0.19_72/0.15)] transition-colors flex-shrink-0">
                  <item.icon className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
                </div>
                <h3
                  className="font-semibold text-foreground text-lg"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {item.industry}
                </h3>
              </div>

              {/* Problema → Soluzione → Risultato */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-[oklch(55%_0.22_25/0.8)] uppercase tracking-widest mb-1">
                    Problema
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.problem}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(68%_0.19_72/0.7)] uppercase tracking-widest mb-1">
                    Soluzione
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.solution}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(60%_0.18_145/0.8)] uppercase tracking-widest mb-1">
                    Risultato
                  </p>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {item.outcome}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
