import { TrendingDown, Activity, Cpu } from "lucide-react";

const cases = [
  {
    icon: TrendingDown,
    metric: "34%",
    metricLabel: "Reduction in operational costs",
    industry: "Logistics",
    description:
      "A global logistics operator migrated document certification to Dyneros Chain, eliminating manual verification workflows and cross-border disputes.",
    tags: ["Document Management", "Supply Chain"],
  },
  {
    icon: Activity,
    metric: "2.1M",
    metricLabel: "Digital asset transactions in Q1",
    industry: "Gaming",
    description:
      "A major gaming platform deployed a digital asset economy on Dyneros Chain, enabling verifiable ownership and real-value trading for in-game items.",
    tags: ["Digital Assets", "Gaming Economy"],
  },
  {
    icon: Cpu,
    metric: "60%",
    metricLabel: "Manual workload eliminated",
    industry: "Enterprise",
    description:
      "A multinational enterprise automated core operational processes using Dyneros Chain smart contracts, replacing manual approval chains and reconciliation.",
    tags: ["Process Automation", "Enterprise"],
  },
];

export default function CaseStudiesSection() {
  return (
    <section id="cases" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
            <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
              Proof
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Results That Speak
          </h2>
          <p className="text-muted-foreground text-lg">
            Real deployments. Measurable impact. No marketing fluff.
          </p>
        </div>

        {/* Case cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cases.map((c) => (
            <div
              key={c.industry}
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
                <p className="text-sm font-medium text-foreground">{c.metricLabel}</p>
              </div>

              {/* Industry badge */}
              <div className="mb-4">
                <span className="text-xs font-medium text-muted-foreground bg-[oklch(18%_0.008_264)] px-2.5 py-1 rounded-full">
                  {c.industry}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {c.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {c.tags.map((tag) => (
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
