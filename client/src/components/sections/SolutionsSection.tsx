import { Factory, Truck, Landmark, ShoppingBag, Gamepad2, Rocket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const industryKeys = [
  { icon: Factory, prefix: "solutions.ind1" },
  { icon: Truck, prefix: "solutions.ind2" },
  { icon: Landmark, prefix: "solutions.ind3" },
  { icon: ShoppingBag, prefix: "solutions.ind4" },
  { icon: Gamepad2, prefix: "solutions.ind5" },
  { icon: Rocket, prefix: "solutions.ind6" },
];

export default function SolutionsSection() {
  const { t } = useLanguage();

  return (
    <section id="solutions" className="section-padding bg-background">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              {t("solutions.badge")}
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {t("solutions.headline")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("solutions.sub")}
          </p>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {industryKeys.map((item) => (
            <div
              key={item.prefix}
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
                  {t(`${item.prefix}.name`)}
                </h3>
              </div>

              {/* Problem → Solution → Outcome */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-[oklch(55%_0.22_25/0.8)] uppercase tracking-widest mb-1">
                    {t("solutions.problem")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${item.prefix}.problem`)}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(68%_0.19_72/0.7)] uppercase tracking-widest mb-1">
                    {t("solutions.solution")}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`${item.prefix}.solution`)}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(60%_0.18_145/0.8)] uppercase tracking-widest mb-1">
                    {t("solutions.outcome")}
                  </p>
                  <p className="text-sm text-foreground font-medium leading-relaxed">
                    {t(`${item.prefix}.outcome`)}
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
