import { trpc } from "@/lib/trpc";
import { CheckCircle, Eye, EyeOff, Globe, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { useLocation, useSearch } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const { language, setLanguage } = useLanguage();

  const reset = trpc.auth.resetPassword.useMutation({
    onSuccess: () => setDone(true),
    onError: (e) => setError(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError(language === "it" ? "Le password non coincidono" : "Passwords do not match"); return; }
    if (!token) { setError(language === "it" ? "Token non valido" : "Invalid token"); return; }
    reset.mutate({ token, password });
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
          {done ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(68% 0.19 72 / 0.12)" }}>
                <CheckCircle className="h-7 w-7" style={{ color: GOLD }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {language === "it" ? "Password aggiornata!" : "Password updated!"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "it" ? "La tua password è stata reimpostata con successo." : "Your password has been reset successfully."}
              </p>
              <button onClick={() => setLocation("/login")}
                className="px-6 h-10 rounded-lg font-semibold text-sm" style={{ background: GOLD, color: "#000" }}>
                {language === "it" ? "Vai al login" : "Go to login"}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-1">
                <h1 className="text-xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {language === "it" ? "Nuova password" : "New password"}
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
                {language === "it" ? "Scegli una nuova password sicura per il tuo account." : "Choose a new secure password for your account."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1.5">{language === "it" ? "Nuova password" : "New password"}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Minimo 8 caratteri" required minLength={8}
                      className="w-full h-11 pl-10 pr-10 rounded-lg text-sm border focus:outline-none"
                      style={{ background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" }} />
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
                    <input type={showPw ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
                      placeholder="Ripeti la password" required
                      className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none"
                      style={{ background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" }} />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "oklch(55% 0.22 25 / 0.12)", border: "1px solid oklch(55% 0.22 25 / 0.3)", color: "oklch(75% 0.18 25)" }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={reset.isPending}
                  className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ background: GOLD, color: "#000" }}>
                  {reset.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {language === "it" ? "Reimposta password" : "Reset password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
