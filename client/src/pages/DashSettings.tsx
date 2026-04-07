import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Bell, Globe, Loader2, Moon, Save, User } from "lucide-react";
import { useState } from "react";
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
  const { data: plan, isLoading } = trpc.dashboard.stats.useQuery();

  const [notifEmail, setNotifEmail] = useState(true);
  const [notifTicket, setNotifTicket] = useState(true);
  const [notifBilling, setNotifBilling] = useState(true);
  const [notifBlockchain, setNotifBlockchain] = useState(false);
  const [lang, setLang] = useState("it");
  const [timezone, setTimezone] = useState("Europe/Rome");

  const handleSave = () => {
    toast.success("Impostazioni salvate con successo");
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
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: "oklch(68% 0.19 72 / 0.12)", color: GOLD }}>
                {user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name || "Utente"}</p>
                <p className="text-xs text-muted-foreground">{user?.email || "—"}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { label: "Piano Attivo", value: plan?.tier || "Starter" },
                { label: "Ruolo", value: user?.role === "admin" ? "Amministratore" : "Utente" },
                { label: "Membro dal", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("it-IT") : "—" },
                { label: "Ultimo accesso", value: user?.lastSignedIn ? new Date(user.lastSignedIn).toLocaleDateString("it-IT") : "—" },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg" style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Notifiche" icon={<Bell className="h-4 w-4" style={{ color: GOLD }} />}>
          <ToggleRow label="Notifiche Email" description="Ricevi aggiornamenti via email" value={notifEmail} onChange={setNotifEmail} />
          <ToggleRow label="Aggiornamenti Ticket" description="Nuovi messaggi e cambi di stato" value={notifTicket} onChange={setNotifTicket} />
          <ToggleRow label="Fatture e Pagamenti" description="Scadenze e conferme di pagamento" value={notifBilling} onChange={setNotifBilling} />
          <ToggleRow label="Alerting Blockchain" description="Transazioni e eventi on-chain" value={notifBlockchain} onChange={setNotifBlockchain} />
        </SectionCard>

        <SectionCard title="Lingua & Regione" icon={<Globe className="h-4 w-4" style={{ color: GOLD }} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Lingua</label>
              <select value={lang} onChange={e => setLang(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                style={{ borderColor: BORDER }}>
                <option value="it">Italiano</option>
                <option value="en">English</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Fuso Orario</label>
              <select value={timezone} onChange={e => setTimezone(e.target.value)}
                className="w-full h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                style={{ borderColor: BORDER }}>
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
              { key: "dark", label: "Scuro", desc: "Tema predefinito Dyneros" },
              { key: "light", label: "Chiaro", desc: "In arrivo" },
            ].map(t => (
              <div key={t.key}
                className="p-3 rounded-lg border cursor-pointer transition-all"
                style={{
                  borderColor: t.key === "dark" ? "oklch(68% 0.19 72 / 0.4)" : BORDER,
                  background: t.key === "dark" ? "oklch(68% 0.19 72 / 0.05)" : "oklch(13% 0.006 264)",
                  opacity: t.key === "light" ? 0.5 : 1,
                }}>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button onClick={handleSave}
            className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            <Save className="h-3.5 w-3.5" />
            Salva Impostazioni
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
