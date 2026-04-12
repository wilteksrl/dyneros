import { trpc } from "@/lib/trpc";
import { Building2, Eye, EyeOff, Globe, Loader2, Lock, Mail, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const INPUT_STYLE = { background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" };

export default function Register() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const [form, setForm] = useState({ name: "", email: "", company: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const { language, setLanguage } = useLanguage();

  const register = trpc.auth.register.useMutation({
    onSuccess: () => setLocation("/dashboard"),
    onError: (e) => setError(e.message),
  });

  useEffect(() => { if (user) setLocation("/dashboard"); }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) { setError(language === "it" ? "Le password non coincidono" : "Passwords do not match"); return; }
    if (form.password.length < 8) { setError(language === "it" ? "La password deve essere di almeno 8 caratteri" : "Password must be at least 8 characters"); return; }
    register.mutate({ name: form.name, email: form.email, password: form.password, company: form.company || undefined });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden" style={{ background: "#050505" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(oklch(68% 0.19 72 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 20%, oklch(68% 0.19 72 / 0.06) 0%, transparent 70%)",
      }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-4">
            <svg viewBox="0 0 32 32" fill="none" className="w-9 h-9">
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke={GOLD} strokeWidth="1.5" fill="none" />
              <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill={GOLD} opacity="0.25" />
              <circle cx="16" cy="16" r="3" fill={GOLD} />
            </svg>
            <span className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dyneros</span>
          </a>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {language === "it" ? "Crea il tuo account" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {language === "it" ? "Registrati per accedere alla piattaforma enterprise" : "Sign up to access the enterprise platform"}
          </p>
          <button
            onClick={() => setLanguage(language === "it" ? "en" : "it")}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-all hover:border-[oklch(68%_0.19_72)] text-muted-foreground hover:text-foreground"
            style={{ borderColor: "oklch(22% 0.008 264)" }}
          >
            <Globe className="w-3.5 h-3.5" />
            {language === "it" ? "Switch to English" : "Passa all'Italiano"}
          </button>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: "oklch(8% 0.006 264)", borderColor: "oklch(20% 0.008 264)", boxShadow: "0 0 60px oklch(68% 0.19 72 / 0.06)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-1.5">{language === "it" ? "Nome completo" : "Full name"}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={form.name} onChange={set("name")} placeholder="Mario Rossi" required
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none" style={INPUT_STYLE} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">{language === "it" ? "Azienda" : "Company"} <span className="text-muted-foreground font-normal">({language === "it" ? "opzionale" : "optional"})</span></label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" value={form.company} onChange={set("company")} placeholder="Acme S.r.l."
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none" style={INPUT_STYLE} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" value={form.email} onChange={set("email")} placeholder="nome@azienda.com" required
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none" style={INPUT_STYLE} />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Minimo 8 caratteri" required minLength={8}
                  className="w-full h-11 pl-10 pr-10 rounded-lg text-sm border focus:outline-none" style={INPUT_STYLE} />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1.5">{language === "it" ? "Conferma password" : "Confirm password"}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type={showPw ? "text" : "password"} value={form.confirm} onChange={set("confirm")}
                  placeholder="Ripeti la password" required
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none" style={INPUT_STYLE} />
              </div>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "oklch(55% 0.22 25 / 0.12)", border: "1px solid oklch(55% 0.22 25 / 0.3)", color: "oklch(75% 0.18 25)" }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={register.isPending}
              className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              style={{ background: GOLD, color: "#000" }}>
              {register.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {language === "it" ? "Crea account" : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {language === "it" ? "Hai già un account?" : "Already have an account?"}{" "}
            <a href="/login" className="font-medium hover:underline" style={{ color: GOLD }}>
              {language === "it" ? "Accedi" : "Sign In"}
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Registrandoti accetti i{" "}
          <a href="/terms" className="underline">Termini</a> e la{" "}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
