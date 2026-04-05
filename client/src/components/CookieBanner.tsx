import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Cookie, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const CONSENT_KEY = "dyneros_cookie_consent";
const CONSENT_VERSION = "1.0";

function getStoredConsent(): (ConsentState & { version: string }) | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(consent: ConsentState) {
  localStorage.setItem(
    CONSENT_KEY,
    JSON.stringify({ ...consent, version: CONSENT_VERSION, timestamp: Date.now() })
  );
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentState | null>(null);

  useEffect(() => {
    const stored = getStoredConsent();
    if (stored) setConsent(stored);
  }, []);

  return consent;
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [lang, setLang] = useState<"it" | "en">("it");

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    storeConsent({ necessary: true, analytics: true, marketing: false });
    setVisible(false);
  };

  const rejectAll = () => {
    storeConsent({ necessary: true, analytics: false, marketing: false });
    setVisible(false);
  };

  const saveCustom = () => {
    storeConsent({ necessary: true, analytics, marketing: false });
    setVisible(false);
  };

  if (!visible) return null;

  const t = {
    it: {
      title: "Utilizziamo i Cookie",
      desc: "Utilizziamo cookie tecnici necessari per il funzionamento del sito e, con il tuo consenso, cookie analitici per migliorare la tua esperienza. Non utilizziamo cookie pubblicitari o di profilazione.",
      necessary: "Cookie Necessari",
      necessaryDesc: "Sempre attivi. Necessari per il funzionamento del sito.",
      analytics: "Cookie Analitici",
      analyticsDesc: "Ci aiutano a capire come viene utilizzato il sito (dati aggregati, nessun dato personale trasmesso a terzi).",
      acceptAll: "Accetta Tutti",
      rejectAll: "Rifiuta Tutti",
      customize: "Personalizza",
      save: "Salva Preferenze",
      policy: "Cookie Policy",
      privacy: "Privacy Policy",
      manage: "Gestisci preferenze",
    },
    en: {
      title: "We Use Cookies",
      desc: "We use strictly necessary technical cookies for site operation and, with your consent, analytical cookies to improve your experience. We do not use advertising or profiling cookies.",
      necessary: "Necessary Cookies",
      necessaryDesc: "Always active. Required for site operation.",
      analytics: "Analytical Cookies",
      analyticsDesc: "Help us understand how the site is used (aggregate data, no personal data transmitted to third parties).",
      acceptAll: "Accept All",
      rejectAll: "Reject All",
      customize: "Customise",
      save: "Save Preferences",
      policy: "Cookie Policy",
      privacy: "Privacy Policy",
      manage: "Manage preferences",
    },
  }[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6">
      <div className="max-w-3xl mx-auto bg-[oklch(12%_0.006_264)] border border-[oklch(68%_0.19_72/0.3)] rounded-2xl shadow-2xl overflow-hidden"
        style={{ boxShadow: "0 0 40px oklch(68% 0.19 72 / 0.1), 0 20px 60px oklch(0% 0 0 / 0.5)" }}>
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-2">
              <Cookie className="w-5 h-5 text-[oklch(68%_0.19_72)] flex-shrink-0" />
              <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.title}
              </h3>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setLang("it")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${lang === "it" ? "bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)]" : "text-muted-foreground hover:text-foreground"}`}
              >IT</button>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-all ${lang === "en" ? "bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)]" : "text-muted-foreground hover:text-foreground"}`}
              >EN</button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {t.desc}{" "}
            <Link href="/cookie-policy" className="text-[oklch(68%_0.19_72)] hover:underline">{t.policy}</Link>
            {" · "}
            <Link href="/privacy-policy" className="text-[oklch(68%_0.19_72)] hover:underline">{t.privacy}</Link>
          </p>

          {expanded && (
            <div className="mb-4 space-y-3 border border-[oklch(22%_0.008_264)] rounded-xl p-4 bg-[oklch(10%_0.006_264)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.necessary}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.necessaryDesc}</p>
                </div>
                <div className="w-10 h-5 rounded-full bg-[oklch(68%_0.19_72)] flex-shrink-0 mt-0.5 relative">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-[oklch(10%_0.005_264)]" />
                </div>
              </div>
              <div className="border-t border-[oklch(22%_0.008_264)]" />
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{t.analytics}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.analyticsDesc}</p>
                </div>
                <button
                  onClick={() => setAnalytics(!analytics)}
                  className={`w-10 h-5 rounded-full flex-shrink-0 mt-0.5 relative transition-colors ${analytics ? "bg-[oklch(68%_0.19_72)]" : "bg-[oklch(25%_0.008_264)]"}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-[oklch(10%_0.005_264)] transition-all ${analytics ? "right-0.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Button
              onClick={acceptAll}
              className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold text-sm h-9"
            >
              {t.acceptAll}
            </Button>
            <Button
              variant="outline"
              onClick={rejectAll}
              className="border-[oklch(22%_0.008_264)] text-sm h-9 hover:border-[oklch(68%_0.19_72/0.4)]"
            >
              {t.rejectAll}
            </Button>
            {!expanded ? (
              <button
                onClick={() => setExpanded(true)}
                className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 h-9"
              >
                {t.customize}
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  onClick={saveCustom}
                  variant="outline"
                  className="border-[oklch(68%_0.19_72/0.4)] text-[oklch(68%_0.19_72)] text-sm h-9 hover:bg-[oklch(68%_0.19_72/0.05)]"
                >
                  {t.save}
                </Button>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
