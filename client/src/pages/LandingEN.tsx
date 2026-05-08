import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Globe, Cpu, Wallet, Bot, Megaphone, Users, Code, Share2, LayoutDashboard, Cloud, CheckCircle, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

const SERVICES = [
  { icon: Globe, title: "Web Development & Digital Platforms", desc: "Custom websites, portals and digital platforms, responsive and SEO-optimised." },
  { icon: Code, title: "Blockchain & Smart Contracts", desc: "Development on public and private chains, smart contract deployment, tokens and NFTs." },
  { icon: Wallet, title: "Digital Wallets & Crypto", desc: "Custodial and non-custodial wallets, blockchain network integration, crypto payment systems." },
  { icon: Bot, title: "Artificial Intelligence & Automation", desc: "Chatbots, AI agents, process automation and LLM integration for enterprises." },
  { icon: Megaphone, title: "CRM, Funnels & Marketing Automation", desc: "Custom CRM systems, sales funnels, email marketing and campaign automation." },
  { icon: Users, title: "Digital Consulting for Businesses", desc: "Analysis, strategy and digital roadmap for SMEs, startups and large organisations." },
  { icon: Share2, title: "Affiliate & Referral Systems", desc: "Multi-level affiliate platforms, referral tracking and commission management." },
  { icon: Megaphone, title: "Landing Pages, Newsletters & Campaigns", desc: "High-conversion landing pages, email templates and promotional campaigns." },
  { icon: LayoutDashboard, title: "Dashboards, Management Software", desc: "Custom management software, analytics dashboards and enterprise web applications." },
  { icon: Cloud, title: "API, Payments & Cloud", desc: "Third-party API integration, payment gateways, scalable cloud infrastructure." },
];

const WHY = [
  { title: "Complete Ecosystem", desc: "A single partner for all digital needs: web, blockchain, AI, marketing and much more." },
  { title: "Tailored Approach", desc: "Every solution is designed around the client's specific needs, not a generic product." },
  { title: "Scalable Technology", desc: "Modern architectures that grow with your business, without technical limits." },
  { title: "Technical & Strategic Support", desc: "Dedicated team for operational support, strategic consulting and training." },
  { title: "International Vision", desc: "Solutions designed for global markets, multilingual and compliant with international standards." },
  { title: "Growth Tools", desc: "Ready-to-use tools for marketing, lead generation and commercial growth." },
];

const WHO = [
  "Companies", "Startups", "Professionals", "Call Centres", "Marketing Agencies",
  "E-commerce", "Digital Communities", "Blockchain Projects", "Organisations digitalising processes",
];

const STEPS = [
  { n: "01", title: "Needs Analysis", desc: "We listen to your needs and analyse the business context." },
  { n: "02", title: "Strategic Design", desc: "We define the technical roadmap and implementation strategy." },
  { n: "03", title: "Technical Development", desc: "Our team builds the solution with cutting-edge technologies." },
  { n: "04", title: "Operational Launch", desc: "Deployment, testing and go-live with full support in the initial phases." },
  { n: "05", title: "Support & Growth", desc: "Continuous monitoring, optimisation and support for growth." },
];

const FAQS = [
  { q: "How long does a project take?", a: "Timelines vary by complexity. A landing page takes 3–5 days; a full platform 4–12 weeks." },
  { q: "Do you work with international companies?", a: "Yes, we operate globally with clients in Europe, the Americas and Asia. All communications are available in Italian and English." },
  { q: "Do you offer post-launch support?", a: "Yes, we offer monthly support plans with guaranteed SLAs, updates and continuous optimisations." },
  { q: "Can you integrate existing systems?", a: "Absolutely. We specialise in integrating CRMs, ERPs, payment gateways and any third-party API." },
];

export default function LandingEN() {
  const [form, setForm] = useState({ company: "", name: "", email: "", phone: "", country: "", service: "", message: "", privacy: false });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const contactMutation = trpc.system.notifyOwner.useMutation({
    onSuccess: () => { setSubmitted(true); toast.success("Message sent! We will contact you shortly."); },
    onError: () => toast.error("Error sending message. Please try again or email info@dyneros.com"),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacy) { toast.error("You must accept the privacy policy to proceed."); return; }
    contactMutation.mutate({
      title: `[Landing EN] New enquiry from ${form.company}`,
      content: `Company: ${form.company}\nContact: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCountry: ${form.country}\nService: ${form.service}\nMessage: ${form.message}`,
    });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white font-sans">
      <head>
        <title>Dyneros — Digital Ecosystem to Grow Your Business</title>
        <meta name="description" content="Digital solutions, blockchain, AI, automation, wallets, payment systems, marketing and advanced tools for companies ready to enter the new digital economy." />
        <meta property="og:title" content="Dyneros — Digital Ecosystem to Grow Your Business" />
        <meta property="og:description" content="Digital solutions, blockchain, AI, automation, wallets, payment systems, marketing and advanced tools for companies." />
        <meta property="og:url" content="https://dyneros.com/en/dyneros-landing" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://dyneros.com/en/dyneros-landing" />
      </head>

      {/* Navbar minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050816]/90 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-sm">D</div>
          <span className="font-bold text-white text-lg">Dyneros</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/landing-dyneros" className="text-sm text-white/60 hover:text-white transition-colors">IT</Link>
          <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-semibold px-4 py-2 rounded-lg text-sm transition-colors">Contact us</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 text-amber-400 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Complete Digital Ecosystem
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Dyneros: the digital ecosystem to <span className="text-amber-400">innovate, connect</span> and grow your business
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto mb-10">
            Digital solutions, blockchain, artificial intelligence, automation, wallets, payment systems, marketing and advanced tools for companies ready to enter the new digital economy.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl text-base transition-colors flex items-center gap-2">
              Request a consultation <ArrowRight size={18} />
            </a>
            <a href="#services" className="border border-white/20 hover:border-amber-500/50 text-white font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Discover Dyneros services
            </a>
            <a href="#contact" className="border border-amber-500/40 hover:bg-amber-500/10 text-amber-400 font-semibold px-8 py-4 rounded-xl text-base transition-colors">
              Contact us now
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-6 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-amber-400">Dyneros</span></h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto leading-relaxed">
            Dyneros is a digital ecosystem that integrates technologies, services and tools to support companies, professionals and organisations in their digital transformation. From blockchain to artificial intelligence, from web development to payment systems, we offer a single access point to everything your business needs to compete in the new digital economy.
          </p>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our <span className="text-amber-400">Services</span></h2>
            <p className="text-white/60 text-lg">Everything you need for your company's digital transformation</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why choose <span className="text-amber-400">Dyneros</span></h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Who we <span className="text-amber-400">serve</span></h2>
          <p className="text-white/60 mb-10">Dyneros serves organisations of every type and sector</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How we <span className="text-amber-400">Work</span></h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked <span className="text-amber-400">Questions</span></h2>
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Bring your company into the <span className="text-amber-400">digital future</span> with Dyneros.</h2>
          <p className="text-white/60 mb-8">Book a free consultation with our team of experts.</p>
          <a href="#contact" className="bg-amber-500 hover:bg-amber-400 text-black font-bold px-10 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2">
            Book a consultation <ArrowRight size={20} />
          </a>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact us <span className="text-amber-400">Now</span></h2>
            <p className="text-white/60">Fill in the form and we will reply within 24 business hours.</p>
          </div>
          {submitted ? (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-10 text-center">
              <CheckCircle size={48} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
              <p className="text-white/60">Our team will contact you within 24 business hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Company Name *</label>
                  <input required value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="Acme Ltd" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Contact Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="John Smith" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="john@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Phone / WhatsApp</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="+44 7700 900000" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Country</label>
                  <input value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm"
                    placeholder="United Kingdom" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">Service of Interest</label>
                  <select value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                    className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 text-sm">
                    <option value="" className="bg-[#050816]">Select...</option>
                    <option value="web" className="bg-[#050816]">Web Development</option>
                    <option value="blockchain" className="bg-[#050816]">Blockchain / Smart Contracts</option>
                    <option value="wallet" className="bg-[#050816]">Wallet / Crypto</option>
                    <option value="ai" className="bg-[#050816]">AI / Automation</option>
                    <option value="marketing" className="bg-[#050816]">Marketing / CRM</option>
                    <option value="consulting" className="bg-[#050816]">Digital Consulting</option>
                    <option value="affiliate" className="bg-[#050816]">Affiliate / Referral</option>
                    <option value="other" className="bg-[#050816]">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Message</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4} className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 text-sm resize-none"
                  placeholder="Briefly describe your project or requirements..." />
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.privacy} onChange={e => setForm(f => ({ ...f, privacy: e.target.checked }))}
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/10 accent-amber-500" />
                <span className="text-white/50 text-xs leading-relaxed">
                  I have read and accept the{" "}
                  <Link href="/privacy-policy" className="text-amber-400 hover:underline">Privacy Policy</Link>
                  {" "}of Dyneros. I consent to the processing of my data to receive a response to my enquiry.
                </span>
              </label>
              <button type="submit" disabled={contactMutation.isPending}
                className="w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black font-bold py-4 rounded-xl text-base transition-colors flex items-center justify-center gap-2">
                {contactMutation.isPending ? "Sending..." : (<>Send Enquiry <ArrowRight size={18} /></>)}
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
          <Link href="/terms" className="hover:text-amber-400 transition-colors">Terms</Link>
        </p>
        <p className="text-white/25 text-xs">© {new Date().getFullYear()} Dyneros Ltd. All rights reserved.</p>
      </footer>
    </div>
  );
}
