import { useState } from "react";
import { Copy, Check, ExternalLink, Globe, Mail, Phone, MessageSquare } from "lucide-react";
import { toast } from "sonner";

const LANDING_IT = "https://dyneros.com/landing-dyneros";
const LANDING_EN = "https://dyneros.com/en/dyneros-landing";

function CopyBox({ id, label, content }: { id: string; label: string; content: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      toast.success("Copiato negli appunti!");
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <span className="text-sm font-medium text-white/80">{label}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copiato!" : "Copia testo"}
        </button>
      </div>
      <pre id={id} className="p-4 text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-sans">{content}</pre>
    </div>
  );
}

function CodeBox({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      toast.success("Codice copiato!");
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <span className="text-xs font-mono text-white/50">{label}</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copiato!" : "Copia codice"}
        </button>
      </div>
      <pre className="p-4 text-green-400/80 text-xs leading-relaxed overflow-x-auto font-mono">{code}</pre>
    </div>
  );
}

const BANNER_HTML_728 = `<a href="${LANDING_EN}" target="_blank" rel="noopener" style="display:block;text-decoration:none;font-family:Arial,sans-serif;">
  <div style="max-width:728px;background:linear-gradient(135deg,#050816,#102a43);color:#ffffff;border-radius:12px;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,0.12);">
    <div>
      <div style="font-size:20px;font-weight:800;margin-bottom:4px;">Dyneros Digital Ecosystem</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.65);">AI · Blockchain · Web Platforms · Automation · Marketing</div>
    </div>
    <span style="display:inline-block;background:#f59e0b;color:#000;padding:10px 20px;border-radius:999px;font-weight:700;font-size:13px;white-space:nowrap;">Discover Dyneros</span>
  </div>
</a>`;

const BANNER_HTML_300 = `<a href="${LANDING_EN}" target="_blank" rel="noopener" style="display:block;text-decoration:none;font-family:Arial,sans-serif;">
  <div style="width:300px;height:300px;background:linear-gradient(160deg,#050816,#0d1f35);color:#ffffff;border-radius:16px;padding:28px;display:flex;flex-direction:column;justify-content:space-between;border:1px solid rgba(255,255,255,0.12);box-sizing:border-box;">
    <div>
      <div style="width:36px;height:36px;background:#f59e0b;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:18px;color:#000;margin-bottom:16px;">D</div>
      <div style="font-size:22px;font-weight:800;line-height:1.2;margin-bottom:8px;">Dyneros</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.6);line-height:1.5;">AI · Blockchain · Web · Automation · Marketing</div>
    </div>
    <span style="display:inline-block;background:#f59e0b;color:#000;padding:10px 18px;border-radius:999px;font-weight:700;font-size:13px;text-align:center;">Discover Dyneros →</span>
  </div>
</a>`;

const BANNER_HTML_1200 = `<a href="${LANDING_EN}" target="_blank" rel="noopener" style="display:block;text-decoration:none;font-family:Arial,sans-serif;">
  <div style="max-width:1200px;background:linear-gradient(135deg,#050816 0%,#0d1f35 50%,#050816 100%);color:#ffffff;border-radius:16px;padding:48px 56px;display:flex;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,0.1);gap:32px;">
    <div style="flex:1;">
      <div style="font-size:13px;color:#f59e0b;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Digital Ecosystem</div>
      <div style="font-size:36px;font-weight:900;line-height:1.15;margin-bottom:12px;">Dyneros: Innovate, Connect &amp; Grow</div>
      <div style="font-size:16px;color:rgba(255,255,255,0.65);max-width:600px;line-height:1.6;">AI, Blockchain, Web Platforms, Automation and Marketing Tools for forward-thinking companies.</div>
    </div>
    <div style="flex-shrink:0;">
      <span style="display:inline-block;background:#f59e0b;color:#000;padding:16px 36px;border-radius:999px;font-weight:800;font-size:16px;">Get Started →</span>
    </div>
  </div>
</a>`;

const BANNER_HTML_300V = `<a href="${LANDING_EN}" target="_blank" rel="noopener" style="display:block;text-decoration:none;font-family:Arial,sans-serif;">
  <div style="width:300px;height:600px;background:linear-gradient(180deg,#050816,#0d1f35,#050816);color:#ffffff;border-radius:16px;padding:32px 24px;display:flex;flex-direction:column;justify-content:space-between;border:1px solid rgba(255,255,255,0.12);box-sizing:border-box;">
    <div>
      <div style="width:44px;height:44px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:22px;color:#000;margin-bottom:20px;">D</div>
      <div style="font-size:26px;font-weight:900;line-height:1.2;margin-bottom:12px;">Dyneros</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.55);line-height:1.7;margin-bottom:24px;">The complete digital ecosystem for modern businesses.</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${["AI & Automation", "Blockchain & Smart Contracts", "Web Platforms", "Digital Wallets", "Marketing Tools"].map(s => `<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:rgba(255,255,255,0.7);"><span style="width:6px;height:6px;background:#f59e0b;border-radius:50%;flex-shrink:0;"></span>${s}</div>`).join("\n        ")}
      </div>
    </div>
    <span style="display:block;background:#f59e0b;color:#000;padding:14px;border-radius:12px;font-weight:800;font-size:14px;text-align:center;">Discover Dyneros →</span>
  </div>
</a>`;

const BANNERS = [
  {
    id: "banner-horizontal",
    label: "Banner Orizzontale 728×90",
    dims: "728 × 90 px",
    html: BANNER_HTML_728,
    iframe: `<iframe src="https://dyneros.com/embed/banner-horizontal" width="728" height="90" style="border:0;overflow:hidden;" loading="lazy"></iframe>`,
    preview: (
      <a href={LANDING_EN} target="_blank" rel="noopener" className="block text-decoration-none">
        <div className="max-w-full bg-gradient-to-r from-[#050816] to-[#102a43] text-white rounded-xl px-6 py-4 flex items-center justify-between border border-white/10">
          <div>
            <div className="text-lg font-extrabold mb-0.5">Dyneros Digital Ecosystem</div>
            <div className="text-xs text-white/60">AI · Blockchain · Web Platforms · Automation · Marketing</div>
          </div>
          <span className="bg-amber-500 text-black px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap ml-4">Discover Dyneros</span>
        </div>
      </a>
    ),
  },
  {
    id: "banner-square",
    label: "Banner Quadrato 300×300",
    dims: "300 × 300 px",
    html: BANNER_HTML_300,
    iframe: `<iframe src="https://dyneros.com/embed/banner-square" width="300" height="300" style="border:0;overflow:hidden;" loading="lazy"></iframe>`,
    preview: (
      <div className="w-[220px] h-[220px] bg-gradient-to-br from-[#050816] to-[#0d1f35] text-white rounded-2xl p-5 flex flex-col justify-between border border-white/10">
        <div>
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black text-base mb-3">D</div>
          <div className="text-lg font-extrabold mb-1">Dyneros</div>
          <div className="text-xs text-white/55 leading-relaxed">AI · Blockchain · Web · Automation</div>
        </div>
        <span className="bg-amber-500 text-black px-4 py-2 rounded-full font-bold text-xs text-center">Discover Dyneros →</span>
      </div>
    ),
  },
  {
    id: "banner-social",
    label: "Banner Social 1200×628",
    dims: "1200 × 628 px",
    html: BANNER_HTML_1200,
    iframe: `<iframe src="https://dyneros.com/embed/banner-social" width="1200" height="628" style="border:0;overflow:hidden;" loading="lazy"></iframe>`,
    preview: (
      <div className="w-full bg-gradient-to-r from-[#050816] via-[#0d1f35] to-[#050816] text-white rounded-2xl p-8 flex items-center justify-between border border-white/10 gap-6">
        <div className="flex-1">
          <div className="text-xs text-amber-400 font-semibold uppercase tracking-widest mb-2">Digital Ecosystem</div>
          <div className="text-2xl font-black leading-tight mb-2">Dyneros: Innovate, Connect & Grow</div>
          <div className="text-sm text-white/60">AI, Blockchain, Web Platforms, Automation and Marketing Tools.</div>
        </div>
        <span className="bg-amber-500 text-black px-6 py-3 rounded-full font-extrabold text-sm whitespace-nowrap flex-shrink-0">Get Started →</span>
      </div>
    ),
  },
  {
    id: "banner-vertical",
    label: "Banner Verticale 300×600",
    dims: "300 × 600 px",
    html: BANNER_HTML_300V,
    iframe: `<iframe src="https://dyneros.com/embed/banner-vertical" width="300" height="600" style="border:0;overflow:hidden;" loading="lazy"></iframe>`,
    preview: (
      <div className="w-[180px] bg-gradient-to-b from-[#050816] via-[#0d1f35] to-[#050816] text-white rounded-2xl p-5 flex flex-col justify-between border border-white/10" style={{ minHeight: 320 }}>
        <div>
          <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-black text-black text-lg mb-3">D</div>
          <div className="text-base font-extrabold mb-2">Dyneros</div>
          <div className="text-xs text-white/55 leading-relaxed mb-3">The complete digital ecosystem for modern businesses.</div>
          <div className="space-y-1.5">
            {["AI & Automation", "Blockchain", "Web Platforms", "Wallets", "Marketing"].map(s => (
              <div key={s} className="flex items-center gap-1.5 text-xs text-white/65">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />{s}
              </div>
            ))}
          </div>
        </div>
        <span className="bg-amber-500 text-black py-2.5 rounded-xl font-bold text-xs text-center mt-4 block">Discover →</span>
      </div>
    ),
  },
];

const QUICK_TEXTS = [
  {
    icon: MessageSquare,
    label: "WhatsApp breve IT",
    content: `Ciao! 👋 Ti scrivo da Dyneros, l'ecosistema digitale per aziende che vogliono innovare.

Offriamo soluzioni su misura per: sviluppo web, blockchain, AI, automazioni, wallet digitali e marketing.

Scopri come possiamo far crescere la tua azienda: ${LANDING_IT}

Posso inviarti maggiori informazioni?`,
  },
  {
    icon: MessageSquare,
    label: "WhatsApp breve EN",
    content: `Hi! 👋 I'm reaching out from Dyneros, the digital ecosystem for innovative businesses.

We offer tailored solutions for: web development, blockchain, AI, automation, digital wallets and marketing.

Discover how we can grow your company: ${LANDING_EN}

Can I send you more information?`,
  },
  {
    icon: Mail,
    label: "Email breve IT",
    content: `Oggetto: Porta la tua azienda nel futuro digitale con Dyneros

Gentile Azienda,

Dyneros è l'ecosistema digitale che integra web, blockchain, intelligenza artificiale, automazioni e marketing in un'unica piattaforma.

Scopri come possiamo supportare la tua trasformazione digitale: ${LANDING_IT}

Siamo a disposizione per una consulenza gratuita.

Cordiali saluti,
Team Dyneros
info@dyneros.com | dyneros.com`,
  },
  {
    icon: Mail,
    label: "Email breve EN",
    content: `Subject: Bring your business into the digital future with Dyneros

Dear Company,

Dyneros is the digital ecosystem that integrates web, blockchain, artificial intelligence, automation and marketing into a single platform.

Discover how we can support your digital transformation: ${LANDING_EN}

We are available for a free consultation.

Kind regards,
Dyneros Team
info@dyneros.com | dyneros.com`,
  },
  {
    icon: Phone,
    label: "Script telefonico IT",
    content: `[APERTURA]
"Buongiorno, mi chiamo [NOME] e chiamo da Dyneros. Stiamo contattando aziende come la vostra per presentare il nostro ecosistema digitale. Ha 2 minuti?"

[PRESENTAZIONE]
"Dyneros offre soluzioni integrate per sviluppo web, blockchain, intelligenza artificiale, automazioni e marketing. Lavoriamo con PMI, startup e grandi aziende che vogliono digitalizzare i propri processi e crescere nel mercato digitale."

[DOMANDA QUALIFICANTE]
"La vostra azienda ha già avviato un percorso di digitalizzazione, o state valutando come iniziare?"

[CTA]
"Posso inviarle una breve presentazione via email o fissare una call di 20 minuti con un nostro consulente?"

[CHIUSURA]
"Perfetto, le invio il materiale a [EMAIL]. Grazie per il suo tempo, buona giornata!"`,
  },
  {
    icon: Phone,
    label: "Script telefonico EN",
    content: `[OPENING]
"Good morning/afternoon, my name is [NAME] and I'm calling from Dyneros. We're reaching out to companies like yours to introduce our digital ecosystem. Do you have 2 minutes?"

[PITCH]
"Dyneros provides integrated solutions for web development, blockchain, artificial intelligence, automation and marketing. We work with SMEs, startups and large companies looking to digitalise their processes and grow in the digital market."

[QUALIFYING QUESTION]
"Has your company already started a digitalisation journey, or are you exploring how to begin?"

[CTA]
"I can send you a brief overview by email, or we could schedule a 20-minute call with one of our consultants?"

[CLOSE]
"Perfect, I'll send the information to [EMAIL]. Thank you for your time, have a great day!"`,
  },
];

export default function MarketingTools() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans">
      <meta name="robots" content="noindex, nofollow" />

      {/* Header */}
      <div className="bg-[#050816]/95 border-b border-white/10 px-6 py-5 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-white">Strumenti Marketing Dyneros</h1>
            <p className="text-white/40 text-xs mt-0.5">Uso interno — Call Center & Team Commerciale</p>
          </div>
          <div className="flex items-center gap-3">
            <a href={LANDING_IT} target="_blank" rel="noopener" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              Landing IT <ExternalLink size={12} />
            </a>
            <a href={LANDING_EN} target="_blank" rel="noopener" className="text-xs text-amber-400 hover:underline flex items-center gap-1">
              Landing EN <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-16">

        {/* Quick Texts */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Copy size={16} className="text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Testi Rapidi da Copiare</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {QUICK_TEXTS.map((t) => (
              <CopyBox key={t.label} id={t.label} label={t.label} content={t.content} />
            ))}
          </div>
        </section>

        {/* Banners */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Globe size={16} className="text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Banner Promozionali</h2>
          </div>
          <div className="space-y-10">
            {BANNERS.map((b) => (
              <div key={b.id} className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{b.label}</h3>
                    <span className="text-xs text-white/40">{b.dims}</span>
                  </div>
                  <a href={`https://dyneros.com/embed/${b.id}`} target="_blank" rel="noopener"
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1">
                    Embed page <ExternalLink size={12} />
                  </a>
                </div>

                {/* Preview */}
                <div className="bg-[#0a0f1e] rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-white/30 mb-3 uppercase tracking-wider">Anteprima</p>
                  {b.preview}
                </div>

                {/* HTML code */}
                <CodeBox label="Codice HTML" code={b.html} />

                {/* iFrame embed */}
                <CodeBox label="Codice iframe embed" code={b.iframe} />
              </div>
            ))}
          </div>
        </section>

        {/* Useful Links */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <ExternalLink size={16} className="text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Link Utili</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Landing IT", url: LANDING_IT, desc: "Pagina promozionale in italiano" },
              { label: "Landing EN", url: LANDING_EN, desc: "Promotional page in English" },
              { label: "Home Dyneros", url: "https://dyneros.com", desc: "Sito principale" },
              { label: "Email Commerciale", url: "mailto:info@dyneros.com", desc: "info@dyneros.com" },
              { label: "WhatsApp Commerciale", url: "https://wa.me/WHATSAPP_NUMBER_HERE", desc: "WHATSAPP_NUMBER_HERE" },
              { label: "Programma Affiliati", url: "/affiliazione", desc: "Pagina affiliazione" },
            ].map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noopener"
                className="bg-white/[0.04] border border-white/10 rounded-xl p-4 hover:border-amber-500/40 transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">{l.label}</span>
                  <ExternalLink size={14} className="text-white/30 group-hover:text-amber-400 transition-colors" />
                </div>
                <p className="text-white/40 text-xs">{l.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <p className="text-center text-white/20 text-xs pb-6">
          Dyneros — Uso interno. Non condividere questo link all'esterno. <br />
          Sostituire i placeholder: <code className="text-amber-400/60">WHATSAPP_NUMBER_HERE</code>
        </p>
      </div>
    </div>
  );
}
