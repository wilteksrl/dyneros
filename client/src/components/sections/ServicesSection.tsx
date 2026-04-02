import { Code2, Globe, Link2, Settings2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Code2,
    title: "Software Development",
    description:
      "Production-grade software engineered for reliability, performance, and long-term maintainability.",
    number: "01",
  },
  {
    icon: Globe,
    title: "Web Platforms",
    description:
      "Scalable web applications built for enterprise traffic, complex workflows, and seamless user experience.",
    number: "02",
  },
  {
    icon: Link2,
    title: "Blockchain Solutions",
    description:
      "End-to-end blockchain integration — from architecture to deployment on Dyneros Chain or custom networks.",
    number: "03",
  },
  {
    icon: Settings2,
    title: "Custom Systems",
    description:
      "Bespoke infrastructure and tooling designed around your operational requirements, not the other way around.",
    number: "04",
  },
];

export default function ServicesSection() {
  const scrollToContact = () => {
    document.querySelector("#company")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="services" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: header */}
          <div className="lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                Services
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              What We Build
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              From custom software to enterprise blockchain infrastructure — we build systems
              that work at scale, from day one.
            </p>
            <Button
              variant="outline"
              className="border-[oklch(68%_0.19_72/0.4)] text-[oklch(68%_0.19_72)] hover:bg-[oklch(68%_0.19_72/0.08)] group"
              onClick={scrollToContact}
            >
              Talk to us
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right: service tiles */}
          <div className="grid grid-cols-1 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="card-hover flex items-start gap-5 p-6 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] group"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-[oklch(68%_0.19_72/0.08)] flex items-center justify-center group-hover:bg-[oklch(68%_0.19_72/0.14)] transition-colors">
                    <service.icon className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="font-semibold text-foreground"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {service.title}
                    </h3>
                    <span className="text-xs font-mono text-muted-foreground opacity-40">
                      {service.number}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
