import { trpc } from "@/lib/trpc";
import { ArrowLeft, CheckCircle, Globe, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const { language, setLanguage } = useLanguage();

  const forgot = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => setSent(true),
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    forgot.mutate({ email, origin: window.location.origin });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "#050505" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(oklch(68% 0.19 72 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
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
        </div>

        <div className="rounded-2xl border p-8" style={{ background: "oklch(8% 0.006 264)", borderColor: "oklch(20% 0.008 264)", boxShadow: "0 0 60px oklch(68% 0.19 72 / 0.06)" }}>
          {sent ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(68% 0.19 72 / 0.12)" }}>
                <CheckCircle className="h-7 w-7" style={{ color: GOLD }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {language === "it" ? "Email inviata!" : "Email sent!"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "it"
                  ? <>Se l'indirizzo <strong>{email}</strong> è registrato, riceverai un link per reimpostare la password entro pochi minuti.</>
                  : <>If <strong>{email}</strong> is registered, you will receive a reset link within a few minutes.</>
                }
              </p>
              <a href="/login" className="text-sm font-medium hover:underline" style={{ color: GOLD }}>
                ← {language === "it" ? "Torna al login" : "Back to login"}
              </a>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-1">
                <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {language === "it" ? "Password dimenticata?" : "Forgot password?"}
                </h1>
                <button
                  onClick={() => setLanguage(language === "it" ? "en" : "it")}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium border rounded-md transition-all hover:border-[oklch(68%_0.19_72)] text-muted-foreground hover:text-foreground"
                  style={{ borderColor: "oklch(22% 0.008 264)" }}
                >
                  <Globe className="w-3 h-3" />
                  {language.toUpperCase()}
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "it"
                  ? "Inserisci la tua email e ti invieremo un link per reimpostare la password."
                  : "Enter your email and we will send you a password reset link."
                }
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="nome@azienda.com" required
                      className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none"
                      style={{ background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" }} />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "oklch(55% 0.22 25 / 0.12)", border: "1px solid oklch(55% 0.22 25 / 0.3)", color: "oklch(75% 0.18 25)" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={forgot.isPending}
                  className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: GOLD, color: "#000" }}>
                  {forgot.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {language === "it" ? "Invia link di reset" : "Send reset link"}
                </button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                <a href="/login" className="inline-flex items-center gap-1 hover:underline" style={{ color: GOLD }}>
                  <ArrowLeft className="h-3 w-3" /> {language === "it" ? "Torna al login" : "Back to login"}
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
