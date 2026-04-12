import { Users, Globe2, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const metricKeys = [
  { icon: Users, value: "15+", prefix: "company.m1" },
  { icon: Globe2, value: "Global", prefix: "company.m2" },
  { icon: TrendingUp, value: "Series A", prefix: "company.m3" },
];

export default function CompanySection() {
  const { t } = useLanguage();
  return (
    <section id="company" className="section-padding bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                {t("company.badge")}
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("company.headline1")}
              <br />
              <span className="text-gold-gradient">{t("company.headline2")}</span>
            </h2>

            {/* Vision statement */}
            <div className="border-l-2 border-[oklch(68%_0.19_72/0.4)] pl-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t("company.vision")} {t("company.mission")}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {metricKeys.map((metric) => (
              <div
                key={metric.prefix}
                className="p-6 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center">
                    <metric.icon className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                  </div>
                </div>
                <div
                  className="text-3xl font-bold text-gold-gradient mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {metric.value}
                </div>
                <p className="font-semibold text-foreground text-sm mb-1">{t(`${metric.prefix}.label`)}</p>
                <p className="text-xs text-muted-foreground">{t(`${metric.prefix}.detail`)}</p>
              </div>
            ))}
          </div>

          {/* CTA block */}
          <div className="p-8 md:p-10 rounded-2xl border border-[oklch(68%_0.19_72/0.2)] bg-[oklch(10%_0.006_264)] relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(68% 0.19 72 / 0.05) 0%, transparent 70%)",
              }}
            />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h3
                  className="text-2xl font-bold text-foreground mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {t("company.cta.headline")}
                </h3>
                <p className="text-muted-foreground">
                  {t("company.cta.sub")}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button
                  className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold group"
                  size="lg"
                >
                  {t("company.cta.contact")}
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[oklch(22%_0.008_264)] hover:border-[oklch(68%_0.19_72/0.4)]"
                  onClick={() =>
                    document.querySelector("#chain")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  {t("company.cta.demo")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
