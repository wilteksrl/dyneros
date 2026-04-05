import { useState } from "react";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";

interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalPageProps {
  titleIT: string;
  titleEN: string;
  lastUpdated: string;
  sectionsIT: LegalSection[];
  sectionsEN: LegalSection[];
}

export default function LegalPage({ titleIT, titleEN, lastUpdated, sectionsIT, sectionsEN }: LegalPageProps) {
  const [lang, setLang] = useState<"it" | "en">("it");
  const sections = lang === "it" ? sectionsIT : sectionsEN;
  const title = lang === "it" ? titleIT : titleEN;

  return (
    <div className="min-h-screen bg-background">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(68% 0.19 72 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <header className="border-b border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)] sticky top-0 z-40">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 group">
              <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke="oklch(68% 0.19 72)" strokeWidth="1.5" fill="none" />
                <circle cx="16" cy="16" r="3" fill="oklch(68% 0.19 72)" />
              </svg>
              <span className="font-semibold text-gold-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Dyneros
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang("it")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "it" ? "bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)]" : "text-muted-foreground hover:text-foreground border border-[oklch(22%_0.008_264)]"}`}
              >
                IT
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${lang === "en" ? "bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)]" : "text-muted-foreground hover:text-foreground border border-[oklch(22%_0.008_264)]"}`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container relative z-10 py-12 max-w-4xl">
        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-[oklch(68%_0.19_72)] transition-colors">
            {lang === "it" ? "Home" : "Home"}
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">{title}</span>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {lang === "it" ? "Ultimo aggiornamento" : "Last updated"}: {lastUpdated}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="sticky top-24 space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-2 text-sm text-muted-foreground hover:text-[oklch(68%_0.19_72)] hover:bg-[oklch(68%_0.19_72/0.05)] rounded-lg transition-all"
                >
                  {s.title}
                </a>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="space-y-10">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-[oklch(22%_0.008_264)]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {s.title}
                  </h2>
                  <div className="prose-legal">{s.content}</div>
                </section>
              ))}
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-[oklch(22%_0.008_264)] mt-16 py-8">
        <div className="container text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Dyneros Ltd. {lang === "it" ? "Tutti i diritti riservati." : "All rights reserved."}
          {" · "}
          <Link href="/privacy-policy" className="hover:text-[oklch(68%_0.19_72)] transition-colors">Privacy Policy</Link>
          {" · "}
          <Link href="/cookie-policy" className="hover:text-[oklch(68%_0.19_72)] transition-colors">Cookie Policy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-[oklch(68%_0.19_72)] transition-colors">{lang === "it" ? "Termini" : "Terms"}</Link>
          {" · "}
          <Link href="/disclaimer" className="hover:text-[oklch(68%_0.19_72)] transition-colors">Disclaimer</Link>
          {" · "}
          <Link href="/aml-kyc" className="hover:text-[oklch(68%_0.19_72)] transition-colors">AML/KYC</Link>
        </div>
      </footer>
    </div>
  );
}
