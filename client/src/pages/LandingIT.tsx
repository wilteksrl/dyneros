import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Cpu, Wallet, Bot, Megaphone, Users, Code, Share2, LayoutDashboard, Cloud, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const SERVICES = [
  { icon: Globe, title: "Siti Web e Piattaforme Digitali", desc: "Sviluppo di siti web, portali e piattaforme digitali su misura, responsive e ottimizzati SEO." },
  { icon: Code, title: "Blockchain e Smart Contract", desc: "Sviluppo su chain pubblica e privata, deploy di smart contract, token e NFT." },
  { icon: Wallet, title: "Wallet Digitali e Crypto", desc: "Wallet custodial e non-custodial, integrazione con reti blockchain, sistemi di pagamento crypto." },
  { icon: Bot, title: "Intelligenza Artificiale e Automazioni", desc: "Chatbot, agenti AI, automazioni di processo e integrazione LLM per aziende." },
  { icon: Megaphone, title: "CRM, Funnel e Marketing Automation", desc: "Sistemi CRM personalizzati, funnel di vendita, email marketing e automazione campagne." },
  { icon: Users, title: "Consulenza Digitale per Aziende", desc: "Analisi, strategia e roadmap digitale per PMI, startup e grandi organizzazioni." },
  { icon: Share2, title: "Sistemi di Affiliazione e Referral", desc: "Piattaforme di affiliazione multi-livello, tracking referral e gestione commissioni." },
  { icon: Megaphone, title: "Landing Page, Newsletter e Campagne", desc: "Creazione di landing page ad alta conversione, template email e campagne promozionali." },
  { icon: LayoutDashboard, title: "Dashboard, Gestionali e Software", desc: "Software gestionali personalizzati, dashboard analitiche e applicazioni web enterprise." },
  { icon: Cloud, title: "API, Pagamenti e Cloud", desc: "Integrazione API di terze parti, gateway di pagamento, infrastruttura cloud scalabile." },
];

const WHY = [
  { title: "Ecosistema Completo", desc: "Un unico partner per tutte le esigenze digitali: web, blockchain, AI, marketing e molto altro." },
  { title: "Approccio su Misura", desc: "Ogni soluzione è progettata intorno alle specifiche esigenze del cliente, non un prodotto generico." },
  { title: "Tecnologia Scalabile", desc: "Architetture moderne che crescono con il tuo business, senza limiti tecnici." },
  { title: "Supporto Tecnico e Strategico", desc: "Team dedicato per supporto operativo, consulenza strategica e formazione." },
  { title: "Visione Internazionale", desc: "Soluzioni progettate per mercati globali, multilingua e conformi agli standard internazionali." },
  { title: "Strumenti per la Crescita", desc: "Strumenti pronti per il marketing, la lead generation e la crescita commerciale." },
];

const WHO = [
  "Aziende", "Startup", "Professionisti", "Call Center", "Agenzie Marketing",
  "E-commerce", "Community Digitali", "Progetti Blockchain", "Organizzazioni in digitalizzazione",
];

const STEPS = [
  { n: "01", title: "Analisi Esigenza", desc: "Ascoltiamo le tue necessità e analizziamo il contesto aziendale." },
  { n: "02", title: "Progettazione Strategica", desc: "Definiamo la roadmap tecnica e la strategia di implementazione." },
  { n: "03", title: "Sviluppo Tecnico", desc: "Il nostro team sviluppa la soluzione con tecnologie all'avanguardia." },
  { n: "04", title: "Lancio Operativo", desc: "Deploy, test e go-live con supporto completo nelle fasi iniziali." },
  { n: "05", title: "Supporto e Crescita", desc: "Monitoraggio continuo, ottimizzazione e supporto per la crescita." },
];

const FAQS = [
  { q: "Quanto tempo richiede un progetto?", a: "I tempi variano in base alla complessità. Una landing page richiede 3-5 giorni, una piattaforma completa 4-12 settimane." },
  { q: "Lavorate con aziende estere?", a: "Sì, operiamo a livello internazionale con clienti in Europa, America e Asia. Tutte le comunicazioni sono disponibili in italiano e inglese." },
  { q: "Offrite supporto post-lancio?", a: "Sì, offriamo piani di supporto mensili con SLA garantiti, aggiornamenti e ottimizzazioni continue." },
  { q: "È possibile integrare sistemi esistenti?", a: "Assolutamente. Siamo specializzati nell'integrazione con CRM, ERP, gateway di pagamento e qualsiasi API di terze parti." },
];

export default function LandingIT() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", country: "", service: "", message: "", privacy: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("Messaggio inviato! Ti contatteremo presto."); },
    onError: () => toast.error("Errore nell'invio. Riprova o scrivi a info@dyneros.com"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacy) { toast.error("Devi accettare la privacy policy per procedere."); return; }
    contactMutation.mutate({
      title: `[Landing IT] Nuova richiesta da ${form.company}`,
      content: `Azienda: ${form.company}\nReferente: ${form.name}\nEmail: ${form.email}\nTelefono: ${form.phone}\nPaese: ${form.country}\nServizio: ${form.service}\nMessaggio: ${form.message}`,
    });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans">
      <head>
        <title>Dyneros — Ecosistema Digitale per la Tua Impresa</title>
        <meta name="description" content="Soluzioni digitali, blockchain, AI, automazione, wallet, sistemi di pagamento, marketing e strumenti evoluti per aziende che vogliono entrare nella nuova economia digitale." />
        <meta property="og:title" content="Dyneros — Ecosistema Digitale per la Tua Impresa" />
        <meta property="og:description" content="Soluzioni digitali, blockchain, AI, automazione, wallet, sistemi di pagamento, marketing e strumenti evoluti per aziende." />
        <meta property="og:url" content="https://dyneros.com/landing-dyneros" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dyneros.com/landing-dyneros" />
      </head>

      {/* Navbar minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">D</div>
          <span className="font-bold text-white text-lg">Dyneros</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/en/dyneros-landing" className="text-sm text-white/60 hover:text-white transition-colors">EN</Link>
          <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">Contattaci</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Ecosistema Digitale Completo
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Dyneros: l'ecosistema digitale per <span className="text-amber-400">innovare, connettere</span> e far crescere la tua impresa
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10">
            Soluzioni digitali, blockchain, intelligenza artificiale, automazione, wallet, sistemi di pagamento, marketing e strumenti evoluti per aziende che vogliono entrare nella nuova economia digitale.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors flex items-center gap-2">
              Richiedi una consulenza <ArrowRight size={18} />
            </a>
            <a href="#services" className="border border-white/20 hover:border-amber-500/50 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Scopri i servizi Dyneros
            </a>
            <a href="#contact" className="border border-amber-500/40 hover:bg-amber-500/10 text-amber-400 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Contattaci ora
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Chi è <span className="text-amber-400">Dyneros</span></h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Dyneros è un ecosistema digitale che integra tecnologie, servizi e strumenti per supportare aziende, professionisti e organizzazioni nella trasformazione digitale. Dalla blockchain all'intelligenza artificiale, dallo sviluppo web ai sistemi di pagamento, offriamo un unico punto di accesso a tutto ciò di cui la tua impresa ha bisogno per competere nella nuova economia digitale.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Servizi <span className="text-amber-400">Principali</span></h2>
            <p className="text-white/60 text-lg">Tutto ciò di cui hai bisogno per la trasformazione digitale della tua azienda</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((s) => (
              <div key={s.title} className="bg-white/[0.04] border border-white/10 rounded-2xl p-6 hover:border-amber-500/40 transition-colors group">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                  <s.icon size={22} className="text-amber-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Perché scegliere <span className="text-amber-400">Dyneros</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY.map((w) => (
              <div key={w.title} className="flex gap-4">
                <CheckCircle size={22} className="text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-white mb-1">{w.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">A chi ci <span className="text-amber-400">rivolgiamo</span></h2>
          <p className="text-white/60 mb-10">Dyneros serve organizzazioni di ogni tipo e settore</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {WHO.map((w) => (
              <span key={w} className="bg-white/[0.06] border border-white/10 rounded-full px-5 py-2 text-white/80 text-sm font-medium">{w}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Come <span className="text-amber-400">Lavoriamo</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {STEPS.map((s, i) => (
              <div key={s.n} className="text-center relative">
                <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-amber-400 font-bold text-lg">{s.n}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+28px)] right-0 h-px bg-amber-500/20" />
                )}
                <h3 className="font-semibold text-white mb-2 text-sm">{s.title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Domande <span className="text-amber-400">Frequenti</span></h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                >
                  <span className="font-medium text-white">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} className="text-amber-400 flex-shrink-0" /> : <ChevronDown size={18} className="text-white/40 flex-shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-white/60 text-sm leading-relaxed">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6 bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-y border-amber-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Porta la tua azienda nel <span className="text-amber-400">futuro digitale</span> con Dyneros.</h2>
          <p className="text-white/60 mb-8">Prenota una consulenza gratuita con il nostro team di esperti.</p>
          <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2">
            Prenota una consulenza <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contattaci <span className="text-amber-400">Ora</span></h2>
            <p className="text-white/60">Compila il form e ti risponderemo entro 24 ore lavorative.</p>
          </div>
          {submitted ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-10 text-center">
              <CheckCircle size={48} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Messaggio inviato!</h3>
              <p className="text-white/60">Il nostro team ti contatterà entro 24 ore lavorative.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Nome Azienda *</label>
                  <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="Acme S.r.l." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Nome Referente *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="Mario Rossi" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="mario@azienda.it" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Telefono / WhatsApp</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="+39 333 1234567" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Paese</label>
                  <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="Italia" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Servizio di Interesse</label>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm">
                    <option value="" className="bg-[#050816]">Seleziona...</option>
                    <option value="web" className="bg-[#050816]">Sviluppo Web</option>
                    <option value="blockchain" className="bg-[#050816]">Blockchain / Smart Contract</option>
                    <option value="wallet" className="bg-[#050816]">Wallet / Crypto</option>
                    <option value="ai" className="bg-[#050816]">AI / Automazioni</option>
                    <option value="marketing" className="bg-[#050816]">Marketing / CRM</option>
                    <option value="consulting" className="bg-[#050816]">Consulenza Digitale</option>
                    <option value="affiliate" className="bg-[#050816]">Affiliazione / Referral</option>
                    <option value="other" className="bg-[#050816]">Altro</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Messaggio</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4} className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm resize-none"
                  placeholder="Descrivi brevemente il tuo progetto o le tue esigenze..." />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.privacy} onChange={e => setForm(f => ({ ...f, privacy: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 accent-amber-500" />
                <span className="text-white/50 text-xs leading-relaxed">
                  Ho letto e accetto la{" "}
                  <Link href="/privacy-policy" className="text-amber-400 hover:underline">Privacy Policy</Link>
                  {" "}di Dyneros. Acconsento al trattamento dei miei dati per ricevere una risposta alla mia richiesta.
                </span>
              </label>
              <button type="submit" disabled={contactMutation.isPending}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2">
                {contactMutation.isPending ? "Invio in corso..." : (<>Invia Richiesta <ArrowRight size={18} /></>)}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="py-10 px-6 border-t border-white/10 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-xs">D</div>
          <span className="font-bold text-white">Dyneros</span>
        </div>
        <p className="text-white/40 text-sm mb-3">
          <a href="https://dyneros.com" className="hover:text-amber-400 transition-colors">dyneros.com</a>
          {" · "}
          <Link href="/privacy-policy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
          {" · "}
          <Link href="/terms" className="hover:text-amber-400 transition-colors">Termini</Link>
        </p>
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} Dyneros Ltd. Tutti i diritti riservati.</p>
      </footer>
    </div>
  );
}
