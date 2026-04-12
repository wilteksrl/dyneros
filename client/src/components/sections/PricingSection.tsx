import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const planKeys = [
  { name: "Starter", prefix: "pricing.p1", highlighted: false, ctaVariant: "outline" as const },
  { name: "Business", prefix: "pricing.p2", highlighted: true, ctaVariant: "default" as const },
  { name: "Enterprise", prefix: "pricing.p3", highlighted: false, ctaVariant: "outline" as const },
];

export default function PricingSection() {
  const { t } = useLanguage();

  return (
    <section id="pricing" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              {t("pricing.badge")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("pricing.headline")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("pricing.sub")}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {planKeys.map((plan) => (
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
                    {t("pricing.popular")}
                  </span>
                </div>
              )}
              {/* Plan header */}
              <div className="mb-6">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-2">
                  {t(`${plan.prefix}.target`)}
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
                    {t("pricing.contact")}
                  </span>
                  <span className="text-sm text-muted-foreground">{t("pricing.for_pricing")}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`${plan.prefix}.desc`)}
                </p>
              </div>
              {/* Features */}
              <div className="flex-1 mb-8">
                <ul className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <li key={i} className="flex items-center gap-3">
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
                      <span className="text-sm text-muted-foreground">{t(`${plan.prefix}.f${i}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* CTA */}
              {plan.highlighted ? (
                <a href="/register">
                  <Button
                    className="w-full bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold group"
                    size="lg"
                  >
                    {t(`${plan.prefix}.cta`)}
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
                  {t(`${plan.prefix}.cta`)}
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Enterprise note */}
        <p className="text-center text-sm text-muted-foreground mt-10">
          {t("pricing.note")}
        </p>
      </div>
    </section>
  );
}
