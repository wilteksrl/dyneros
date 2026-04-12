import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Bell, Globe, Loader2, Moon, Save, User, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
      <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: BORDER }}>
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="relative h-5 w-9 rounded-full transition-colors shrink-0"
        style={{ background: value ? GOLD : "oklch(20% 0.008 264)" }}>
        <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform"
          style={{ transform: value ? "translateX(16px)" : "translateX(0)" }} />
      </button>
    </div>
  );
}

export default function DashSettings() {
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.dashboard.settings.useQuery();
  const { data: plan } = trpc.dashboard.stats.useQuery();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifTickets, setNotifTickets] = useState(true);
  const [notifInvoices, setNotifInvoices] = useState(true);
  const [notifMilestones, setNotifMilestones] = useState(true);
  const [lang, setLang] = useState<"it" | "en">("it");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (settings) {
      setNotifEmail(settings.notificationsEmail);
      setNotifTickets(settings.notificationsTickets);
      setNotifInvoices(settings.notificationsInvoices);
      setNotifMilestones(settings.notificationsMilestones);
      setLang(settings.language as "it" | "en");
      setTheme(settings.theme as "dark" | "light");
    }
  }, [settings]);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setCompany((user as any).company ?? "");
      setPhone((user as any).phone ?? "");
    }
  }, [user]);

  const updateSettings = trpc.dashboard.updateSettings.useMutation({
    onSuccess: () => {
      utils.dashboard.settings.invalidate();
      toast.success("Impostazioni salvate");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateProfile = trpc.dashboard.updateProfile.useMutation({
    onSuccess: () => toast.success("Profilo aggiornato"),
    onError: (e) => toast.error(e.message),
  });

  const changePassword = trpc.dashboard.changePassword.useMutation({
    onSuccess: () => {
      toast.success("Password aggiornata");
      setCurrentPw("");
      setNewPw("");
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSaveSettings = () => {
    updateSettings.mutate({ language: lang, theme, notificationsEmail: notifEmail, notificationsTickets: notifTickets, notificationsInvoices: notifInvoices, notificationsMilestones: notifMilestones });
  };

  const handleSaveProfile = () => {
    updateProfile.mutate({ name: name || undefined, company: company || undefined, phone: phone || undefined });
  };

  const handleChangePassword = () => {
    if (!currentPw || !newPw) return toast.error("Compila entrambi i campi");
    changePassword.mutate({ currentPassword: currentPw, newPassword: newPw });
  };

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Impostazioni</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Gestisci il tuo account e le preferenze workspace</p>
        </div>

        <SectionCard title="Profilo Account" icon={<User className="h-4 w-4" style={{ color: GOLD }} />}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: "oklch(68% 0.19 72 / 0.12)", color: GOLD }}>
                {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || "Utente"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "—"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Piano: <span style={{ color: GOLD }}>{plan?.tier || "Business"}</span></p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Nome Completo</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                  style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Azienda</label>
                <input value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                  style={{ borderColor: BORDER }} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Telefono</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                  style={{ borderColor: BORDER }} />
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={handleSaveProfile} disabled={updateProfile.isPending}
                className="flex items-center gap-2 px-4 h-8 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                style={{ background: GOLD, color: "#000" }}>
                {updateProfile.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                Salva Profilo
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Sicurezza Password" icon={<Lock className="h-4 w-4" style={{ color: GOLD }} />}>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Password Attuale</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                  className="w-full h-9 px-3 pr-10 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                  style={{ borderColor: BORDER }} />
                <button onClick={() => setShowPw(v => !v)} className="absolute right-3 top-2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Nuova Password</label>
              <input type={showPw ? "text" : "password"} value={newPw} onChange={e => setNewPw(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                style={{ borderColor: BORDER }} />
            </div>
            <div className="flex justify-end">
              <button onClick={handleChangePassword} disabled={changePassword.isPending}
                className="flex items-center gap-2 px-4 h-8 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                style={{ background: GOLD, color: "#000" }}>
                {changePassword.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Lock className="h-3 w-3" />}
                Cambia Password
              </button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notifiche" icon={<Bell className="h-4 w-4" style={{ color: GOLD }} />}>
          <ToggleRow label="Notifiche Email" description="Ricevi aggiornamenti via email" value={notifEmail} onChange={setNotifEmail} />
          <ToggleRow label="Aggiornamenti Ticket" description="Nuovi messaggi e cambi di stato" value={notifTickets} onChange={setNotifTickets} />
          <ToggleRow label="Fatture e Pagamenti" description="Scadenze e conferme di pagamento" value={notifInvoices} onChange={setNotifInvoices} />
          <ToggleRow label="Milestone Progetto" description="Avvisi di scadenza milestone" value={notifMilestones} onChange={setNotifMilestones} />
        </SectionCard>

        <SectionCard title="Lingua & Regione" icon={<Globe className="h-4 w-4" style={{ color: GOLD }} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Lingua</label>
              <select value={lang} onChange={e => setLang(e.target.value as "it" | "en")}
                className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                style={{ borderColor: BORDER }}>
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Fuso Orario</label>
              <select className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none" style={{ borderColor: BORDER }}>
                <option value="Europe/Rome">Europa/Roma (UTC+1)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York</option>
              </select>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Aspetto" icon={<Moon className="h-4 w-4" style={{ color: GOLD }} />}>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "dark" as const, label: "Scuro", desc: "Tema predefinito Dyneros" },
              { key: "light" as const, label: "Chiaro", desc: "In arrivo" },
            ].map(t => (
              <div key={t.key}
                onClick={() => t.key === "dark" && setTheme(t.key)}
                className="p-3 rounded-lg border cursor-pointer transition-all"
                style={{
                  borderColor: theme === t.key ? "oklch(68% 0.19 72 / 0.4)" : BORDER,
                  background: theme === t.key ? "oklch(68% 0.19 72 / 0.05)" : "oklch(13% 0.006 264)",
                  opacity: t.key === "light" ? 0.5 : 1,
                }}>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button onClick={handleSaveSettings} disabled={updateSettings.isPending}
            className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ background: GOLD, color: "#000" }}>
            {updateSettings.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
            Salva Impostazioni
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
