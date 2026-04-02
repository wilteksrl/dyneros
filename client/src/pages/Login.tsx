import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

export default function Login() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(68% 0.19 72 / 0.05) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(68% 0.19 72 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-3 group">
            <svg viewBox="0 0 32 32" fill="none" className="w-10 h-10">
              <polygon
                points="16,2 30,10 30,22 16,30 2,22 2,10"
                stroke="oklch(68% 0.19 72)"
                strokeWidth="1.5"
                fill="none"
              />
              <polygon
                points="16,8 24,13 24,19 16,24 8,19 8,13"
                fill="oklch(68% 0.19 72)"
                opacity="0.3"
              />
              <circle cx="16" cy="16" r="3" fill="oklch(68% 0.19 72)" />
            </svg>
            <span
              className="text-2xl font-bold text-gold-gradient"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Dyneros
            </span>
          </a>
        </div>

        {/* Card */}
        <div
          className="p-8 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(11%_0.006_264)]"
          style={{ boxShadow: "0 0 60px oklch(68% 0.19 72 / 0.06)" }}
        >
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-[oklch(68%_0.19_72)]" />
            </div>
            <h1
              className="text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Accedi al Tuo Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Accedi per gestire la tua infrastruttura e i tuoi servizi Dyneros.
            </p>
          </div>

          <a href={getLoginUrl()} className="block">
            <Button
              className="w-full bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold h-12 text-base group"
              style={{ boxShadow: "0 0 20px oklch(68% 0.19 72 / 0.2)" }}
            >
              Continua con Manus
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </a>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Continuando, accetti i Termini di Servizio e la Privacy Policy di Dyneros.
          </p>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          <a href="/" className="hover:text-foreground transition-colors">
            ← Torna a dyneros.com
          </a>
        </p>
      </div>
    </div>
  );
}
