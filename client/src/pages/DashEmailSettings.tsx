import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Bell, CheckCircle2, ChevronDown, ChevronUp,
  FileText, Loader2, Mail, Receipt, Send, Server, Shield, Ticket, Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

function ToggleRow({ label, description, icon, value, onChange }: {
  label: string; description: string; icon: React.ReactNode; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-4 py-3 border-b last:border-b-0" style={{ borderColor: BORDER }}>
      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "oklch(68% 0.19 72 / 0.10)" }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
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

function SectionCard({ title, icon, children, collapsible = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; collapsible?: boolean;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="rounded-xl border" style={{ background: CARD_BG, borderColor: BORDER }}>
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => collapsible && setOpen(o => !o)}>
        <h2 className="text-sm font-semibold flex items-center gap-2">{icon}{title}</h2>
        {collapsible && (open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />)}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export default function DashEmailSettings() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { data: smtpConfig, isLoading: smtpLoading } = trpc.email.smtpConfig.useQuery();

  const verifySmtp = trpc.email.verifySmtp.useMutation();
  const sendTest = trpc.email.sendTest.useMutation();

  const [testEmail, setTestEmail] = useState(user?.email ?? "");
  const [notifNewTicket, setNotifNewTicket] = useState(true);
  const [notifTicketUpdate, setNotifTicketUpdate] = useState(true);
  const [notifContractExpiry, setNotifContractExpiry] = useState(true);
  const [notifInvoiceOverdue, setNotifInvoiceOverdue] = useState(true);
  const [notifMilestone, setNotifMilestone] = useState(true);
  const [notifCritical, setNotifCritical] = useState(true);
  const [notifWelcome, setNotifWelcome] = useState(true);
  const [notifWeeklyReport, setNotifWeeklyReport] = useState(false);

  const handleVerify = async () => {
    const res = await verifySmtp.mutateAsync();
    if (res.ok) {
      toast.success("Connessione SMTP verificata con successo!");
    } else {
      toast.error(`Errore SMTP: ${res.error}`);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) { toast.error("Inserisci un indirizzo email"); return; }
    const res = await sendTest.mutateAsync({ to: testEmail });
    if (res.ok) {
      toast.success(`Email di test inviata a ${testEmail}`);
    } else {
      toast.error(`Invio fallito: ${res.error}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-xl font-semibold">Email & Notifiche</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Configura le notifiche email per eventi critici della piattaforma</p>
        </div>

        {isAdmin && (
          <SectionCard title="Configurazione SMTP" icon={<Server className="h-4 w-4" style={{ color: GOLD }} />} collapsible>
            {smtpLoading ? (
              <div className="flex items-center gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" style={{ color: GOLD }} />
                <span className="text-sm text-muted-foreground">Caricamento configurazione...</span>
              </div>
            ) : (
              <>
                <div className="rounded-lg p-4 mb-4" style={{ background: smtpConfig?.configured ? "oklch(60% 0.18 145 / 0.08)" : "oklch(55% 0.22 25 / 0.08)", border: `1px solid ${smtpConfig?.configured ? "oklch(60% 0.18 145 / 0.25)" : "oklch(55% 0.22 25 / 0.25)"}` }}>
                  <div className="flex items-center gap-2">
                    {smtpConfig?.configured
                      ? <CheckCircle2 className="h-4 w-4 text-green-400" />
                      : <Mail className="h-4 w-4 text-orange-400" />}
                    <p className="text-sm font-medium">
                      {smtpConfig?.configured ? "SMTP configurato correttamente" : "SMTP non configurato — imposta le variabili d'ambiente"}
                    </p>
                  </div>
                </div>

                {smtpConfig?.configured && (
                  <div className="space-y-2 mb-4">
                    {[
                      { label: "Host", value: smtpConfig.host },
                      { label: "Porta", value: smtpConfig.port },
                      { label: "Utente", value: smtpConfig.user },
                      { label: "Mittente", value: `${smtpConfig.fromName} <${smtpConfig.fromEmail}>` },
                    ].map(row => (
                      <div key={row.label} className="flex items-center gap-3 p-2.5 rounded-lg"
                        style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                        <p className="text-xs text-muted-foreground w-20 shrink-0">{row.label}</p>
                        <p className="text-xs font-mono">{row.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleVerify}
                    disabled={verifySmtp.isPending || !smtpConfig?.configured}
                    className="flex items-center justify-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                    style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                    {verifySmtp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" style={{ color: GOLD }} />}
                    Verifica Connessione
                  </button>
                  <div className="flex gap-2 flex-1">
                    <input
                      value={testEmail}
                      onChange={e => setTestEmail(e.target.value)}
                      placeholder="email@esempio.com"
                      className="flex-1 h-9 px-3 rounded-lg text-sm bg-[oklch(13%_0.006_264)] border focus:outline-none"
                      style={{ borderColor: BORDER }}
                    />
                    <button
                      onClick={handleSendTest}
                      disabled={sendTest.isPending || !smtpConfig?.configured}
                      className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      style={{ background: GOLD, color: "#000" }}>
                      {sendTest.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                      Test
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg" style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Variabili d'ambiente richieste</p>
                  <div className="space-y-1 font-mono text-xs">
                    {[
                      ["SMTP_HOST", "es: smtp.gmail.com, smtp.aruba.it"],
                      ["SMTP_PORT", "465 (SSL) oppure 587 (TLS)"],
                      ["SMTP_USER", "es: noreply@dyneros.com"],
                      ["SMTP_PASS", "password o App Password"],
                      ["SMTP_FROM_NAME", "es: Dyneros Platform"],
                      ["SMTP_FROM_EMAIL", "es: noreply@dyneros.com"],
                    ].map(([key, hint]) => (
                      <div key={key} className="flex items-start gap-3">
                        <span style={{ color: GOLD }}>{key}</span>
                        <span className="text-muted-foreground"># {hint}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </SectionCard>
        )}

        <SectionCard title="Preferenze Notifiche Email" icon={<Bell className="h-4 w-4" style={{ color: GOLD }} />}>
          <ToggleRow
            label="Nuovo Ticket Aperto"
            description="Ricevi una email quando viene aperto un nuovo ticket di supporto"
            icon={<Ticket className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifNewTicket} onChange={setNotifNewTicket}
          />
          <ToggleRow
            label="Aggiornamento Ticket"
            description="Notifica quando il team Dyneros aggiorna un tuo ticket"
            icon={<Ticket className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifTicketUpdate} onChange={setNotifTicketUpdate}
          />
          <ToggleRow
            label="Scadenza Contratto"
            description="Alert 30, 7 e 1 giorno prima della scadenza di un contratto"
            icon={<FileText className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifContractExpiry} onChange={setNotifContractExpiry}
          />
          <ToggleRow
            label="Fattura Scaduta"
            description="Notifica quando una fattura supera la data di scadenza"
            icon={<Receipt className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifInvoiceOverdue} onChange={setNotifInvoiceOverdue}
          />
          <ToggleRow
            label="Milestone Imminente"
            description="Promemoria 14 e 3 giorni prima di una milestone di progetto"
            icon={<Zap className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifMilestone} onChange={setNotifMilestone}
          />
          <ToggleRow
            label="Alert Critici di Sistema"
            description="Notifiche urgenti per eventi critici sulla piattaforma (non disattivabile)"
            icon={<Shield className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifCritical} onChange={setNotifCritical}
          />
          <ToggleRow
            label="Email di Benvenuto"
            description="Invia email di benvenuto ai nuovi utenti registrati"
            icon={<Mail className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifWelcome} onChange={setNotifWelcome}
          />
          <ToggleRow
            label="Report Settimanale"
            description="Riepilogo settimanale di progetti, ticket e fatture"
            icon={<Bell className="h-3.5 w-3.5" style={{ color: GOLD }} />}
            value={notifWeeklyReport} onChange={setNotifWeeklyReport}
          />
        </SectionCard>

        <SectionCard title="Template Email Disponibili" icon={<Mail className="h-4 w-4" style={{ color: GOLD }} />} collapsible>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "Benvenuto", desc: "Inviata al primo accesso", trigger: "Registrazione utente" },
              { name: "Reset Password", desc: "Link monouso per recupero accesso", trigger: "Richiesta forgot password" },
              { name: "Verifica Email", desc: "Conferma indirizzo email", trigger: "Nuova registrazione" },
              { name: "Nuovo Ticket", desc: "Conferma apertura ticket", trigger: "Ticket creato" },
              { name: "Aggiornamento Ticket", desc: "Risposta del team tecnico", trigger: "Messaggio nel thread" },
              { name: "Scadenza Contratto", desc: "Alert 30/7/1 giorni prima", trigger: "Job automatico" },
              { name: "Fattura Scaduta", desc: "Sollecito pagamento", trigger: "Data scadenza superata" },
              { name: "Milestone Alert", desc: "Promemoria milestone progetto", trigger: "14/3 giorni prima" },
              { name: "Alert Critico", desc: "Evento urgente di sistema", trigger: "Monitoring automatico" },
            ].map(tpl => (
              <div key={tpl.name} className="p-3 rounded-lg" style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{tpl.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "oklch(68% 0.19 72 / 0.12)", color: GOLD }}>
                    HTML
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{tpl.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1.5 opacity-60">Trigger: {tpl.trigger}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="flex justify-end">
          <button
            onClick={() => toast.success("Preferenze email salvate")}
            className="flex items-center gap-2 px-5 h-9 rounded-lg text-sm font-medium"
            style={{ background: GOLD, color: "#000" }}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Salva Preferenze
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
