import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/useMobile";
import {
  Activity,
  Bell,
  BookOpen,
  Bot,
  Box,
  ChevronRight,
  CircuitBoard,
  CreditCard,
  FileText,
  FolderOpen,
  Globe,
  Key,
  LayoutDashboard,
  LogOut,
  Mail,
  PanelLeft,
  Receipt,
  Search,
  Settings,
  Shield,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";

const menuGroups = [
  {
    label: "Principale",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
      { icon: Activity, label: "Progetti", path: "/dashboard/projects" },
      { icon: Ticket, label: "Ticket & Supporto", path: "/dashboard/tickets" },
      { icon: FolderOpen, label: "Documenti", path: "/dashboard/documents" },
    ],
  },
  {
    label: "Commerciale",
    items: [
      { icon: FileText, label: "Preventivi & Contratti", path: "/dashboard/contracts" },
      { icon: Receipt, label: "Fatture & Pagamenti", path: "/dashboard/invoices" },
    ],
  },
  {
    label: "Blockchain",
    items: [
      { icon: CircuitBoard, label: "Blockchain / Web3", path: "/dashboard/blockchain" },
      { icon: Wallet, label: "Wallet & Assets", path: "/dashboard/wallet" },
      { icon: Box, label: "Smart Contracts", path: "/dashboard/smart-contracts" },
    ],
  },
  {
    label: "Servizi Digitali",
    items: [
      { icon: Globe, label: "Domini / Hosting", path: "/dashboard/domains" },
      { icon: Bot, label: "AI & Automazioni", path: "/dashboard/ai" },
      { icon: Users, label: "Team / Referenti", path: "/dashboard/team" },
    ],
  },
  {
    label: "Account",
    items: [
      { icon: Bell, label: "Notifiche", path: "/dashboard/notifications" },
      { icon: BookOpen, label: "Knowledge Base", path: "/dashboard/knowledge-base" },
      { icon: Settings, label: "Impostazioni", path: "/dashboard/settings" },
      { icon: Shield, label: "Sicurezza", path: "/dashboard/security" },
      { icon: Key, label: "API / Accessi", path: "/dashboard/api-keys" },
      { icon: Mail, label: "Email & Notifiche", path: "/dashboard/email-settings" },
    ],
  },
];

const SIDEBAR_WIDTH_KEY = "dyneros-sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 220;
const MAX_WIDTH = 340;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) return <DashboardLayoutSkeleton />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[oklch(6%_0.005_264)]">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex items-center gap-2 mb-2">
            <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
              <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke={GOLD} strokeWidth="1.5" fill="none" />
              <circle cx="16" cy="16" r="3" fill={GOLD} />
            </svg>
            <span className="text-xl font-semibold text-gold-gradient" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Dyneros
            </span>
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Accesso al Portale Clienti</h1>
            <p className="text-sm text-muted-foreground max-w-sm">
              Accedi con il tuo account Dyneros per entrare nel tuo workspace operativo.
            </p>
          </div>
          <Button
            onClick={() => { window.location.href = "/login"; }}
            size="lg"
            className="w-full"
            style={{ background: GOLD, color: "#000", fontWeight: 600 }}
          >
            Accedi al Portale
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider style={{ "--sidebar-width": `${sidebarWidth}px` } as CSSProperties}>
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: {
  children: React.ReactNode;
  setSidebarWidth: (w: number) => void;
}) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const { data: notifData } = trpc.dashboard.notificationCount.useQuery();
  const unreadCount: number = (notifData as { count?: number })?.count ?? 0;
  const { language, setLanguage } = useLanguage();

  const customerId = user
    ? `DYN-CLI-2026-${String(user.id).padStart(4, "0")}`
    : "—";

  useEffect(() => {
    if (isCollapsed) setIsResizing(false);
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const left = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const w = e.clientX - left;
      if (w >= MIN_WIDTH && w <= MAX_WIDTH) setSidebarWidth(w);
    };
    const handleMouseUp = () => setIsResizing(false);
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "DY";

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r border-[oklch(20%_0.008_264)] bg-[oklch(7%_0.005_264)]"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-16 border-b border-[oklch(20%_0.008_264)] justify-center px-3">
            <div className="flex items-center gap-2.5 w-full">
              <button
                onClick={toggleSidebar}
                className="h-8 w-8 flex items-center justify-center hover:bg-[oklch(15%_0.008_264)] rounded-lg transition-colors shrink-0"
                aria-label="Toggle sidebar"
              >
                <PanelLeft className="h-4 w-4 text-muted-foreground" />
              </button>
              {!isCollapsed && (
                <div className="flex items-center gap-2 min-w-0">
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 shrink-0">
                    <polygon points="12,1 22,7 22,17 12,23 2,17 2,7" stroke={GOLD} strokeWidth="1.5" fill="none" />
                    <circle cx="12" cy="12" r="2.5" fill={GOLD} />
                  </svg>
                  <span className="font-semibold text-sm text-gold-gradient truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Dyneros Portal
                  </span>
                </div>
              )}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-0 py-2">
            {menuGroups.map((group) => (
              <div key={group.label} className="mb-1">
                {!isCollapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-4 py-2">
                    {group.label}
                  </p>
                )}
                <SidebarMenu className="px-2">
                  {group.items.map((item) => {
                    const isActive = location === item.path || (item.path !== "/dashboard" && location.startsWith(item.path));
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => setLocation(item.path)}
                          tooltip={item.label}
                          className="h-9 font-normal text-sm"
                          style={isActive ? { color: GOLD, background: "oklch(68% 0.19 72 / 0.08)" } : {}}
                        >
                          <item.icon className="h-4 w-4 shrink-0" style={isActive ? { color: GOLD } : {}} />
                          <span>{item.label}</span>
                          {isActive && !isCollapsed && (
                            <ChevronRight className="ml-auto h-3 w-3 opacity-50" style={{ color: GOLD }} />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </div>
            ))}
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-[oklch(20%_0.008_264)]">
            {!isCollapsed && (
              <div className="mb-2 px-1 py-1.5 rounded-lg bg-[oklch(12%_0.008_264)] border border-[oklch(20%_0.008_264)]">
                <p className="text-[10px] text-muted-foreground/60 px-2 mb-0.5">ID Cliente</p>
                <p className="text-xs font-mono font-medium px-2" style={{ color: GOLD }}>{customerId}</p>
              </div>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-[oklch(15%_0.008_264)] transition-colors w-full text-left focus:outline-none">
                  <Avatar className="h-8 w-8 shrink-0 border border-[oklch(68%_0.19_72/0.3)]">
                    <AvatarFallback className="text-xs font-semibold bg-[oklch(68%_0.19_72/0.15)]" style={{ color: GOLD }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate leading-none">{user?.name || "—"}</p>
                      <p className="text-[11px] text-muted-foreground truncate mt-1">{user?.email || "—"}</p>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-[oklch(10%_0.005_264)] border-[oklch(22%_0.008_264)]">
                <div className="px-3 py-2 border-b border-[oklch(22%_0.008_264)]">
                  <p className="text-xs font-medium">{user?.name}</p>
                  <p className="text-[11px] text-muted-foreground">{customerId}</p>
                </div>
                <DropdownMenuItem onClick={() => setLocation("/dashboard/settings")} className="cursor-pointer text-sm mt-1">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Impostazioni
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocation("/dashboard/security")} className="cursor-pointer text-sm">
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  Sicurezza
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[oklch(22%_0.008_264)]" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-sm text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Disconnetti
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-[oklch(68%_0.19_72/0.2)] transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => { if (!isCollapsed) setIsResizing(true); }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset className="bg-[oklch(8%_0.005_264)]">
        <div className="sticky top-0 z-40 flex h-14 items-center border-b border-[oklch(20%_0.008_264)] bg-[oklch(8%_0.005_264)]/95 backdrop-blur px-4 gap-3">
          {isMobile && <SidebarTrigger className="h-8 w-8 rounded-lg" />}

          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors bg-[oklch(12%_0.008_264)] border border-[oklch(22%_0.008_264)] rounded-lg px-3 h-8 min-w-[200px] max-w-xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="text-xs">Cerca progetti, ticket, documenti...</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation("/dashboard/notifications")}
              className="relative h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full" style={{ background: GOLD }} />
              )}
            </button>

            <button
              onClick={() => setLocation("/dashboard/settings")}
              className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
            </button>

            <button
              onClick={() => setLanguage(language === "it" ? "en" : "it")}
              className="flex items-center gap-1 h-8 px-2 rounded-lg border text-xs font-semibold hover:bg-[oklch(15%_0.008_264)] transition-colors"
              style={{ borderColor: "oklch(22% 0.008 264)", color: GOLD }}
              title={language === "it" ? "Switch to English" : "Passa all'Italiano"}
            >
              <Globe className="h-3.5 w-3.5" />
              {language.toUpperCase()}
            </button>

            <div className="h-6 w-px bg-[oklch(22%_0.008_264)]" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-[oklch(15%_0.008_264)] transition-colors focus:outline-none">
                  <Avatar className="h-7 w-7 border border-[oklch(68%_0.19_72/0.3)]">
                    <AvatarFallback className="text-[10px] font-semibold bg-[oklch(68%_0.19_72/0.15)]" style={{ color: GOLD }}>
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-medium leading-none">{user?.name?.split(" ")[0]}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5" style={{ color: GOLD }}>{customerId}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 bg-[oklch(10%_0.005_264)] border-[oklch(22%_0.008_264)]">
                <DropdownMenuItem onClick={() => setLocation("/dashboard/settings")} className="cursor-pointer text-sm">
                  <Settings className="mr-2 h-3.5 w-3.5" />
                  Impostazioni
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[oklch(22%_0.008_264)]" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-sm text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-3.5 w-3.5" />
                  Disconnetti
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </>
  );
}
