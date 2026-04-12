import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const legalLinks = [
  { labelKey: "Privacy Policy", href: "/privacy-policy" },
  { labelKey: "Cookie Policy", href: "/cookie-policy" },
  { labelKey: "footer.legal.terms", href: "/terms" },
  { labelKey: "footer.legal.disclaimer", href: "/disclaimer" },
  { labelKey: "AML/KYC", href: "/aml-kyc" },
];

export default function Footer() {
  const { t } = useLanguage();

  const links = [
    {
      colKey: "footer.col.product",
      items: [
        { labelKey: "footer.link.chain", href: "#chain" },
        { labelKey: "footer.link.platform", href: "#platform" },
        { labelKey: "footer.link.developers", href: "#developers" },
        { labelKey: "footer.link.pricing", href: "#pricing" },
      ],
    },
    {
      colKey: "footer.col.solutions",
      items: [
        { labelKey: "footer.link.manufacturing", href: "#solutions" },
        { labelKey: "footer.link.logistics", href: "#solutions" },
        { labelKey: "footer.link.finance", href: "#solutions" },
        { labelKey: "footer.link.gaming", href: "#solutions" },
      ],
    },
    {
      colKey: "footer.col.network",
      items: [
        { labelKey: "Mainnet", href: "https://mainnet.dyneros.com", external: true },
        { labelKey: "Explorer", href: "https://explorer.dyneros.com", external: true },
        { labelKey: "Wallet", href: "https://wallet.dyneros.com", external: true },
        { labelKey: "footer.link.support", href: "https://mainnet.dyneros.com", external: true },
      ],
    },
    {
      colKey: "footer.col.company",
      items: [
        { labelKey: "footer.link.about", href: "#company" },
        { labelKey: "footer.link.services", href: "#services" },
        { labelKey: "footer.link.support", href: "#support" },
        { labelKey: "footer.link.contact", href: "#company" },
      ],
    },
  ];

  const scrollTo = (href: string) => {
    if (href.startsWith("http") || href.startsWith("/")) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const resetCookies = () => {
    localStorage.removeItem("dyneros_cookie_consent");
    window.location.reload();
  };

  return (
    <footer className="border-t border-[oklch(22%_0.008_264)] bg-[oklch(8%_0.005_264)]">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <polygon
                  points="16,2 30,10 30,22 16,30 2,22 2,10"
                  stroke="oklch(68% 0.19 72)"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="16" cy="16" r="3" fill="oklch(68% 0.19 72)" />
              </svg>
              <span
                className="font-semibold text-gold-gradient"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Dyneros
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {links.map((col) => (
            <div key={col.colKey}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                {t(col.colKey)}
              </p>
              <ul className="space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.labelKey + item.href}>
                    {"external" in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t(item.labelKey)}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollTo(item.href)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {t(item.labelKey)}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[oklch(22%_0.008_264)] mb-6">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-3">
            {t("footer.legal.section")}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {legalLinks.map((item) => (
              <Link
                key={item.labelKey + item.href}
                href={item.href}
                className="text-xs text-muted-foreground hover:text-[oklch(68%_0.19_72)] transition-colors"
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <button
              onClick={resetCookies}
              className="text-xs text-muted-foreground hover:text-[oklch(68%_0.19_72)] transition-colors"
            >
              {t("footer.legal.manage_cookies")}
            </button>
          </div>
        </div>

        <div className="pt-6 border-t border-[oklch(22%_0.008_264)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t("footer.disclaimer")}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[oklch(60%_0.18_145)] animate-pulse" />
            <span className="text-xs text-muted-foreground">{t("footer.systems_ok")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
