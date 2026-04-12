import { MessageSquare, AlertCircle, BookOpen, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const channelKeys = [
  { icon: MessageSquare, prefix: "support.chat", href: "#" },
  { icon: AlertCircle, prefix: "support.status", href: "https://mainnet.dyneros.com" },
  { icon: BookOpen, prefix: "support.docs", href: "#" },
];

export default function SupportSection() {
  const { t } = useLanguage();
  return (
    <section id="support" className="section-padding bg-[oklch(9%_0.005_264)]">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[oklch(68%_0.19_72/0.25)] bg-[oklch(68%_0.19_72/0.05)] mb-6">
              <span className="text-xs font-medium text-[oklch(68%_0.19_72)] tracking-widest uppercase">
                {t("support.badge")}
              </span>
            </div>
            <h2
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {t("support.headline")}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {t("support.sub")}
            </p>
          </div>

          {/* Right: support channels */}
          <div className="space-y-4">
            {channelKeys.map((channel) => (
              <div
                key={channel.prefix}
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
                    {t(`${channel.prefix}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    {t(`${channel.prefix}.desc`)}
                  </p>
                  <a
                    href={channel.href}
                    target={channel.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[oklch(68%_0.19_72)] hover:text-[oklch(73%_0.17_74)] transition-colors group/link"
                  >
                    {t(`${channel.prefix}.cta`)}
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
