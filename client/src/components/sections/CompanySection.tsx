import { Users, Globe2, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    icon: Users,
    value: "15+",
    label: "Core Engineers",
    detail: "100+ global contributors",
  },
  {
    icon: Globe2,
    value: "Global",
    label: "Infrastructure Scope",
    detail: "Multi-region deployment",
  },
  {
    icon: TrendingUp,
    value: "Series A",
    label: "Growth Stage",
    detail: "Scaling enterprise adoption",
  },
];

export default function CompanySection() {
  return (
    <section id="company" className="section-padding bg-background">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                Company
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-8"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              The Infrastructure Layer
              <br />
              <span className="text-gold-gradient">for the Digital Economy</span>
            </h2>

            {/* Vision statement */}
            <div className="border-l-2 border-[oklch(68%_0.19_72/0.4)] pl-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Dyneros was founded on the premise that enterprise-grade digital infrastructure
                should not require a team of specialists to operate. We build the systems that
                power the next generation of companies — reliable, scalable, and built to last.
                Our mission is to make blockchain infrastructure as accessible and dependable as
                cloud computing, without the complexity that has historically limited enterprise adoption.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {metrics.map((metric) => (
              <div
                key={metric.label}
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
                <p className="font-semibold text-foreground text-sm mb-1">{metric.label}</p>
                <p className="text-xs text-muted-foreground">{metric.detail}</p>
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
                  Ready to build on Dyneros?
                </h3>
                <p className="text-muted-foreground">
                  Talk to our team about your infrastructure requirements.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Button
                  className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold group"
                  size="lg"
                >
                  Contact Us
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
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
