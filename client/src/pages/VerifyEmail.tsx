import { trpc } from "@/lib/trpc";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";

const GOLD = "oklch(68% 0.19 72)";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const token = new URLSearchParams(search).get("token") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  const verify = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => setLocation("/login?verified=1"), 2500);
    },
    onError: (e) => {
      setStatus("error");
      setMessage(e.message);
    },
  });

  useEffect(() => {
    if (token) verify.mutate({ token });
    else { setStatus("error"); setMessage("Token non valido o mancante."); }
  }, []);

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
        <div className="rounded-2xl border p-8 text-center" style={{ background: "oklch(8% 0.006 264)", borderColor: "oklch(20% 0.008 264)", boxShadow: "0 0 60px oklch(68% 0.19 72 / 0.06)" }}>
          {status === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: GOLD }} />
              <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verifica in corso...</h2>
              <p className="text-sm text-muted-foreground">Stiamo verificando il tuo indirizzo email.</p>
            </>
          )}
          {status === "success" && (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(68% 0.19 72 / 0.12)" }}>
                <CheckCircle className="h-7 w-7" style={{ color: GOLD }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Email verificata!</h2>
              <p className="text-sm text-muted-foreground">Il tuo account è attivo. Verrai reindirizzato al login tra pochi secondi...</p>
            </>
          )}
          {status === "error" && (
            <>
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "oklch(55% 0.22 25 / 0.12)" }}>
                <XCircle className="h-7 w-7" style={{ color: "oklch(65% 0.22 25)" }} />
              </div>
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Verifica fallita</h2>
              <p className="text-sm text-muted-foreground mb-6">{message || "Il link di verifica non è valido o è scaduto."}</p>
              <a href="/register" className="text-sm font-medium hover:underline" style={{ color: GOLD }}>← Torna alla registrazione</a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
