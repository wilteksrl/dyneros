import { Link } from "wouter";

const links = {
  Prodotto: [
    { label: "Dyneros Chain", href: "#chain" },
    { label: "Piattaforma", href: "#platform" },
    { label: "Sviluppatori", href: "#developers" },
    { label: "Prezzi", href: "#pricing" },
  ],
  Soluzioni: [
    { label: "Manifattura", href: "#solutions" },
    { label: "Logistica", href: "#solutions" },
    { label: "Finanza", href: "#solutions" },
    { label: "Gaming", href: "#solutions" },
  ],
  Rete: [
    { label: "Mainnet", href: "https://mainnet.dyneros.com", external: true },
    { label: "Explorer", href: "https://explorer.dyneros.com", external: true },
    { label: "Wallet", href: "https://wallet.dyneros.com", external: true },
    { label: "Stato Rete", href: "https://mainnet.dyneros.com", external: true },
  ],
  Azienda: [
    { label: "Chi Siamo", href: "#company" },
    { label: "Servizi", href: "#services" },
    { label: "Supporto", href: "#support" },
    { label: "Contatti", href: "#company" },
  ],
};

export default function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith("http")) return;
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[oklch(22%_0.008_264)] bg-[oklch(8%_0.005_264)]">
      <div className="container py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
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
              Infrastruttura digitale per la prossima generazione di imprese.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                {category}
              </p>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {'external' in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollTo(item.href)}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[oklch(22%_0.008_264)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dyneros Ltd. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted-foreground">Privacy Policy</span>
            <span className="text-xs text-muted-foreground">Termini di Servizio</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[oklch(60%_0.18_145)] animate-pulse" />
              <span className="text-xs text-muted-foreground">Tutti i sistemi operativi</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
