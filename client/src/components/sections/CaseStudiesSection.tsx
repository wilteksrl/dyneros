import { TrendingDown, Activity, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const caseKeys = [
  { icon: TrendingDown, prefix: "cases.c1", metric: "34%" },
  { icon: Activity, prefix: "cases.c2", metric: "2.1M" },
  { icon: Cpu, prefix: "cases.c3", metric: "60%" },
];

export default function CaseStudiesSection() {
  const { t } = useLanguage();

  return (
    <section id="cases" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              {t("cases.badge")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("cases.headline")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("cases.sub")}
          </p>
        </div>

        {/* Case cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseKeys.map((c) => (
            <div
              key={c.prefix}
              className="card-hover relative p-8 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] overflow-hidden group"
            >
              {/* Background glow */}
              <div
                className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, oklch(68% 0.19 72 / 0.08) 0%, transparent 70%)",
                }}
              />

              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center mb-6">
                <c.icon className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
              </div>

              {/* Metric */}
              <div className="mb-4">
                <div
                  className="text-5xl font-bold text-gold-gradient mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {c.metric}
                </div>
                <p className="text-sm font-medium text-foreground">{t(`${c.prefix}.metric`)}</p>
              </div>

              {/* Industry badge */}
              <div className="mb-4">
                <span className="text-xs font-medium text-muted-foreground bg-[oklch(18%_0.008_264)] px-2.5 py-1 rounded-full">
                  {t(`${c.prefix}.industry`)}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {t(`${c.prefix}.desc`)}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[t(`${c.prefix}.tag1`), t(`${c.prefix}.tag2`)].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-[oklch(68%_0.19_72/0.7)] border border-[oklch(68%_0.19_72/0.2)] px-2 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
