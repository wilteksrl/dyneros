import { trpc } from "@/lib/trpc";
import { Eye, EyeOff, Loader2, Lock, Mail, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const GOLD = "oklch(68% 0.19 72)";

export default function Login() {
  const [, setLocation] = useLocation();
  const { data: user } = trpc.auth.me.useQuery();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  const login = trpc.auth.login.useMutation({
    onSuccess: () => setLocation("/dashboard"),
    onError: (e) => setError(e.message),
  });

  useEffect(() => {
    if (user) setLocation("/dashboard");
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: "#050505" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(oklch(68% 0.19 72 / 0.03) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.03) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 30%, oklch(68% 0.19 72 / 0.06) 0%, transparent 70%)",
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
          <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Accedi alla piattaforma</h1>
          <p className="text-sm text-muted-foreground mt-1">Inserisci le tue credenziali per continuare</p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: "oklch(8% 0.006 264)", borderColor: "oklch(20% 0.008 264)", boxShadow: "0 0 60px oklch(68% 0.19 72 / 0.06)" }}>
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "oklch(68% 0.19 72 / 0.12)" }}>
              <Shield className="h-6 w-6" style={{ color: GOLD }} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium block mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="nome@azienda.com"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg text-sm border focus:outline-none"
                  style={{ background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium">Password</label>
                <a href="/forgot-password" className="text-xs hover:underline" style={{ color: GOLD }}>
                  Password dimenticata?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-lg text-sm border focus:outline-none"
                  style={{ background: "oklch(12% 0.006 264)", borderColor: "oklch(22% 0.008 264)", color: "inherit" }}
                />
                <button type="button" onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg px-4 py-3 text-sm" style={{ background: "oklch(55% 0.22 25 / 0.12)", border: "1px solid oklch(55% 0.22 25 / 0.3)", color: "oklch(75% 0.18 25)" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={login.isPending}
              className="w-full h-11 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-60"
              style={{ background: GOLD, color: "#000" }}>
              {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Accedi
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Non hai un account?{" "}
            <a href="/register" className="font-medium hover:underline" style={{ color: GOLD }}>
              Registrati
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-5">
          Accedendo accetti i{" "}
          <a href="/terms" className="underline">Termini</a> e la{" "}
          <a href="/privacy-policy" className="underline">Privacy Policy</a>
        </p>
        <p className="text-center text-sm text-muted-foreground mt-3">
          <a href="/" className="hover:text-foreground transition-colors">← Torna a dyneros.com</a>
        </p>
      </div>
    </div>
  );
}
