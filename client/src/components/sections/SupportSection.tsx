import { MessageSquare, AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const channels = [
  {
    icon: MessageSquare,
    title: "Live Support",
    description: "Connect with our technical team in real time for urgent issues and onboarding assistance.",
    action: "Start Chat",
    href: "#",
  },
  {
    icon: AlertCircle,
    title: "Network Status",
    description: "Monitor Dyneros Chain uptime, incident reports, and maintenance windows in real time.",
    action: "View Status",
    href: "https://mainnet.dyneros.com",
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Comprehensive technical documentation, API references, and integration guides.",
    action: "Read Docs",
    href: "#",
  },
];

export default function SupportSection() {
  return (
    <section id="support" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                Support
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              We're Here When You Need Us
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Enterprise infrastructure requires enterprise-grade support. Our technical team is
              available across all time zones with structured escalation paths for critical issues.
            </p>
          </div>

          {/* Right: support channels */}
          <div className="space-y-4">
            {channels.map((channel) => (
              <div
                key={channel.title}
                className="card-hover flex items-start gap-5 p-5 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)] group"
              >
                <div className="w-10 h-10 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[oklch(68%_0.19_72/0.15)] transition-colors">
                  <channel.icon className="w-5 h-5 text-[oklch(68%_0.19_72)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-semibold text-foreground mb-1"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {channel.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {channel.description}
                  </p>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[oklch(68%_0.19_72)] hover:text-[oklch(73%_0.17_74)] transition-colors group/link"
                  >
                    {channel.action}
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
