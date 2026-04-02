import { Factory, Truck, Landmark, ShoppingBag, Gamepad2, Rocket } from "lucide-react";

const industries = [
  {
    icon: Factory,
    industry: "Manufacturing",
    problem: "Traceability gaps across supply chains create disputes and compliance failures.",
    solution: "Supply chain on-chain with immutable records at every production stage.",
    outcome: "Full audit trail, zero disputes, regulatory compliance by default.",
  },
  {
    icon: Truck,
    industry: "Logistics",
    problem: "Document fraud and manual certification slow down cross-border operations.",
    solution: "Digital certification with cryptographic verification of every shipment.",
    outcome: "Immutable shipping records, faster customs clearance, fraud elimination.",
  },
  {
    icon: Landmark,
    industry: "Finance",
    problem: "Slow settlement cycles and high transaction costs erode margins.",
    solution: "Internal payment rails built on Dyneros Chain for instant settlement.",
    outcome: "Instant, low-cost transfers with full auditability and compliance.",
  },
  {
    icon: ShoppingBag,
    industry: "Retail",
    problem: "Fragmented loyalty programs fail to retain customers and generate data.",
    solution: "Tokenized loyalty infrastructure — programmable, portable, interoperable.",
    outcome: "Unified rewards, higher retention, and actionable customer intelligence.",
  },
  {
    icon: Gamepad2,
    industry: "Gaming",
    problem: "In-game economies are exploited, undermining player trust and monetization.",
    solution: "Verifiable digital asset economy with on-chain ownership and provenance.",
    outcome: "Verifiable ownership, real asset value, sustainable game economy.",
  },
  {
    icon: Rocket,
    industry: "Startups",
    problem: "Infrastructure costs and complexity slow down product development cycles.",
    solution: "Scalable blockchain foundation with managed infrastructure from day one.",
    outcome: "Ship faster, scale cheaper, focus on product not infrastructure.",
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
              Solutions
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Built for Your Industry
          </h2>
          <p className="text-muted-foreground text-lg">
            Real problems. Concrete solutions. Measurable outcomes.
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

              {/* Problem → Solution → Outcome */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <p className="text-[10px] font-bold text-[oklch(55%_0.22_25/0.8)] uppercase tracking-widest mb-1">
                    Problem
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.problem}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(68%_0.19_72/0.7)] uppercase tracking-widest mb-1">
                    Solution
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.solution}
                  </p>
                </div>
                <div className="w-full h-px bg-[oklch(22%_0.008_264)]" />
                <div>
                  <p className="text-[10px] font-bold text-[oklch(60%_0.18_145/0.8)] uppercase tracking-widest mb-1">
                    Outcome
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
