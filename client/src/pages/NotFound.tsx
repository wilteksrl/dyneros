import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(oklch(68% 0.19 72 / 0.04) 1px, transparent 1px), linear-gradient(90deg, oklch(68% 0.19 72 / 0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(68% 0.19 72 / 0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <a href="/" className="inline-flex items-center gap-3 mb-12 group">
          <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
            <polygon
              points="16,2 30,10 30,22 16,30 2,22 2,10"
              stroke="oklch(68% 0.19 72)"
              strokeWidth="1.5"
              fill="none"
            />
            <circle cx="16" cy="16" r="3" fill="oklch(68% 0.19 72)" />
          </svg>
          <span
            className="text-xl font-semibold text-gold-gradient"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Dyneros
          </span>
        </a>

        <div
          className="text-8xl md:text-9xl font-bold text-gold-gradient mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          404
        </div>

        <h1
          className="text-2xl md:text-3xl font-bold text-foreground mb-4"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Pagina Non Trovata
        </h1>

        <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <Button
          onClick={() => setLocation("/")}
          className="bg-[oklch(68%_0.19_72)] text-[oklch(10%_0.005_264)] hover:bg-[oklch(73%_0.17_74)] font-semibold px-8 h-12 text-base"
          style={{ boxShadow: "0 0 20px oklch(68% 0.19 72 / 0.2)" }}
        >
          <Home className="w-4 h-4 mr-2" />
          Torna alla Home
        </Button>
      </div>
    </div>
  );
}
