import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";

const plans = [
  {
    name: "Starter",
    target: "Piccoli team",
    price: "Contattaci",
    priceNote: "per i prezzi",
    description: "Tutto il necessario per iniziare su Dyneros Chain.",
    features: [
      "Accesso rete condivisa",
      "Fino a 10.000 tx/mese",
      "Accesso Explorer e Wallet",
    ],
    cta: "Inizia Ora",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Business",
    target: "Aziende in crescita",
    price: "Contattaci",
    priceNote: "per i prezzi",
    description: "Risorse dedicate e supporto prioritario per team in espansione.",
    features: [
      "Istanza nodo dedicata",
      "Fino a 500.000 tx/mese",
      "Deploy di smart contract",
    ],
    cta: "Contatta le Vendite",
    ctaVariant: "default" as const,
    highlighted: true,
  },
  {
    name: "Enterprise",
    target: "Grandi Aziende",
    price: "Su misura",
    priceNote: "prezzi personalizzati",
    description: "Piena proprietà dell'infrastruttura, strumenti di conformità e garanzie SLA.",
    features: [
      "Deploy chain privata",
      "Transazioni illimitate",
      "SLA dedicato e conformità",
    ],
    cta: "Richiedi Demo",
    ctaVariant: "outline" as const,
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              Prezzi
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Piani Semplici e Trasparenti
          </h2>
          <p className="text-muted-foreground text-lg">
            Nessun costo nascosto. Nessun lock-in. Scala quando sei pronto.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                plan.highlighted
                  ? "border-[oklch(68%_0.19_72/0.5)] bg-[oklch(12%_0.006_264)]"
                  : "border-[oklch(22%_0.008_264)] bg-[oklch(11%_0.006_264)]"
              }`}
              style={
                plan.highlighted
                  ? { boxShadow: "0 0 40px oklch(68% 0.19 72 / 0.12)" }
                  : undefined
              }
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="text-xs font-bold text-[oklch(10%_0.005_264)] bg-[oklch(68%_0.19_72)] px-4 py-1 rounded-full">
                    Più Popolare
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                  {plan.target}
                </p>
                <h3
                  className="text-2xl font-bold text-foreground mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-3">
                  <span
                    className={`text-3xl font-bold ${plan.highlighted ? "text-gold-gradient" : "text-foreground"}`}
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">{plan.priceNote}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                          plan.highlighted
                            ? "bg-[oklch(68%_0.19_72/0.2)]"
                            : "bg-[oklch(22%_0.008_264)]"
                        }`}
                      >
                        <Check
                          className={`w-2.5 h-2.5 ${
                            plan.highlighted
                              ? "text-[oklch(68%_0.19_72)]"
                              : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              {plan.highlighted ? (
                <a href={getLoginUrl()}>
                  <Button
                    className="w-full bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold group"
                    size="lg"
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              ) : (
                <Button
                  variant="outline"
                  className="w-full border-[oklch(22%_0.008_264)] hover:border-[oklch(68%_0.19_72/0.4)] hover:bg-[oklch(68%_0.19_72/0.05)]"
                  size="lg"
                  onClick={() =>
                    document.querySelector("#company")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {plan.cta}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          Tutti i piani includono monitoraggio della rete, documentazione tecnica e supporto all'onboarding.
          I clienti Enterprise ricevono un account manager dedicato.
        </p>
      </div>
    </section>
  );
}
