import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  ExternalLink,
  Globe,
  LogOut,
  Network,
  Search,
  Settings,
  Shield,
  User,
  Wallet,
  Zap,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const networkServices = [
  {
    icon: Search,
    name: "Explorer",
    description: "Browse transactions and blocks",
    href: "https://explorer.dyneros.com",
    status: "live",
  },
  {
    icon: Wallet,
    name: "Wallet",
    description: "Manage assets and accounts",
    href: "https://wallet.dyneros.com",
    status: "live",
  },
  {
    icon: Network,
    name: "Mainnet",
    description: "Primary network endpoint",
    href: "https://mainnet.dyneros.com",
    status: "live",
  },
  {
    icon: BarChart3,
    name: "Analytics",
    description: "Network performance metrics",
    href: "#",
    status: "soon",
  },
];

const networkStats = [
  { label: "Network Status", value: "Operational", color: "oklch(60% 0.18 145)" },
  { label: "Latest Block", value: "1,847,412", color: "oklch(68% 0.19 72)" },
  { label: "TPS", value: "1,247", color: "oklch(68% 0.19 72)" },
  { label: "Validators", value: "12 Active", color: "oklch(68% 0.19 72)" },
];

export default function Dashboard() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      navigate("/");
    },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-[oklch(68%_0.19_72)] border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)]">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2">
                <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
                  <polygon
                    points="16,2 30,10 30,22 16,30 2,22 2,10"
                    stroke="oklch(68% 0.19 72)"
                    strokeWidth="1.5"
                    fill="none"
                  />
                  <circle cx="16" cy="16" r="3" fill="oklch(68% 0.19 72)" />
                </svg>
                <span
                  className="font-semibold text-gold-gradient"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Dyneros
                </span>
              </a>
              <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
                <span>/</span>
                <span className="text-foreground font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[oklch(14%_0.007_264)] border border-[oklch(22%_0.008_264)]">
                <div className="w-1.5 h-1.5 rounded-full bg-[oklch(60%_0.18_145)] animate-pulse" />
                <span className="text-xs text-muted-foreground">Network Operational</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground gap-2"
                onClick={() => logoutMutation.mutate()}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground mb-1"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your Dyneros infrastructure and services from here.
          </p>
        </div>

        {/* Network Status Widget */}
        <div className="mb-8 p-6 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
            <h2
              className="font-semibold text-foreground"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Network Status
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {networkStats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl bg-[oklch(10%_0.006_264)] border border-[oklch(22%_0.008_264)]"
              >
                <p className="text-xs text-muted-foreground mb-1.5 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{
                    color: stat.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Access Panel */}
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
              <div className="flex items-center gap-2 mb-5">
                <Globe className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                <h2
                  className="font-semibold text-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Service Access
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {networkServices.map((service) => (
                  <a
                    key={service.name}
                    href={service.href}
                    target={service.href !== "#" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    onClick={
                      service.href === "#"
                        ? (e) => {
                            e.preventDefault();
                            toast.info("Feature coming soon");
                          }
                        : undefined
                    }
                    className="flex items-start gap-4 p-4 rounded-xl border border-[oklch(22%_0.008_264)] bg-[oklch(10%_0.006_264)] hover:border-[oklch(68%_0.19_72/0.3)] hover:bg-[oklch(68%_0.19_72/0.04)] transition-all group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-[oklch(68%_0.19_72/0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[oklch(68%_0.19_72/0.15)] transition-colors">
                      <service.icon className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium text-foreground text-sm">{service.name}</span>
                        {service.status === "soon" ? (
                          <span className="text-[10px] font-medium text-muted-foreground bg-[oklch(18%_0.008_264)] px-1.5 py-0.5 rounded-full">
                            Soon
                          </span>
                        ) : (
                          <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Account Management */}
          <div className="space-y-4">
            {/* Profile */}
            <div className="p-6 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
              <div className="flex items-center gap-2 mb-5">
                <User className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                <h2
                  className="font-semibold text-foreground"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Account
                </h2>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[oklch(68%_0.19_72/0.15)] flex items-center justify-center flex-shrink-0">
                  <span
                    className="text-sm font-bold text-[oklch(68%_0.19_72)]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">
                    {user?.name ?? "User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email ?? "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-t border-[oklch(22%_0.008_264)]">
                  <span className="text-xs text-muted-foreground">Plan</span>
                  <span className="text-xs font-medium text-[oklch(68%_0.19_72)]">Starter</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-[oklch(22%_0.008_264)]">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[oklch(60%_0.18_145)]" />
                    <span className="text-xs font-medium text-foreground">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security */}
            <div className="p-5 rounded-2xl border border-[oklch(22%_0.008_264)] bg-[oklch(12%_0.006_264)]">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[oklch(68%_0.19_72)]" />
                <h3 className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Security
                </h3>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Your session is secured with end-to-end encryption.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-[oklch(22%_0.008_264)] text-xs hover:border-[oklch(68%_0.19_72/0.4)]"
                onClick={() => toast.info("Settings coming soon")}
              >
                <Settings className="w-3.5 h-3.5 mr-2" />
                Manage Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
