import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  AlertTriangle, CheckCircle, Crown, Globe, Loader2, LogOut, Mail, Search,
  Server, Shield, Trash2, UserCheck, UserX, Users, Send, CheckCircle2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const GOLD = "oklch(68% 0.19 72)";
const BG = "oklch(8% 0.006 264)";
const BORDER = "oklch(20% 0.008 264)";

const ROLE_COLORS: Record<string, string> = {
  user: "oklch(60% 0.08 264)",
  admin: "oklch(68% 0.19 72)",
  superadmin: "oklch(75% 0.22 30)",
};

type Tab = "users" | "email" | "system";

export default function SuperAdmin() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("users");
  const { data: me } = trpc.auth.me.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.superadmin.stats.useQuery(undefined, { enabled: me?.role === "superadmin" });
  const { data: users, isLoading, refetch } = trpc.superadmin.listUsers.useQuery(undefined, { enabled: me?.role === "superadmin" });
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [testEmailTo, setTestEmailTo] = useState("");
  const [smtpResult, setSmtpResult] = useState<{ ok: boolean; error?: string } | null>(null);
  const { language, setLanguage, t } = useLanguage();

  const updateRole = trpc.superadmin.updateUserRole.useMutation({
    onSuccess: () => { refetch(); refetchStats(); toast.success("Ruolo aggiornato"); },
    onError: (e) => toast.error(e.message),
  });
  const updateStatus = trpc.superadmin.updateUserStatus.useMutation({
    onSuccess: () => { refetch(); refetchStats(); toast.success("Stato aggiornato"); },
    onError: (e) => toast.error(e.message),
  });
  const deleteUser = trpc.superadmin.deleteUser.useMutation({
    onSuccess: () => { refetch(); refetchStats(); setConfirmDelete(null); toast.success("Utente eliminato"); },
    onError: (e) => toast.error(e.message),
  });
  const verifySmtp = trpc.email.verifySmtp.useMutation({
    onSuccess: (res) => setSmtpResult(res),
    onError: (e) => setSmtpResult({ ok: false, error: e.message }),
  });
  const sendTest = trpc.email.sendTest.useMutation({
    onSuccess: () => toast.success("Email di test inviata"),
    onError: (e) => toast.error(e.message),
  });
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });

  useEffect(() => {
    if (me && me.role !== "superadmin") setLocation("/dashboard");
  }, [me]);

  if (!me || me.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#050505" }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const filtered = (users ?? []).filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.company?.toLowerCase().includes(search.toLowerCase())
  );

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "users", label: "Utenti", icon: <Users className="h-3.5 w-3.5" /> },
    { key: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
    { key: "system", label: "Sistema", icon: <Server className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#050505", fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b px-6 h-14 flex items-center justify-between sticky top-0 z-50" style={{ background: BG, borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke={GOLD} strokeWidth="1.5" fill="none" />
            <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill={GOLD} opacity="0.25" />
            <circle cx="16" cy="16" r="3" fill={GOLD} />
          </svg>
          <span className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dyneros</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: "oklch(75% 0.22 30 / 0.15)", color: "oklch(75% 0.22 30)" }}>
            SuperAdmin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground hidden sm:block">{me.email}</span>
          <button
            onClick={() => setLanguage(language === "it" ? "en" : "it")}
            className="flex items-center gap-1 h-8 px-2 rounded-lg border text-xs font-semibold hover:bg-white/5 transition-colors"
            style={{ borderColor: BORDER, color: GOLD }}
          >
            <Globe className="h-3.5 w-3.5" />
            {language.toUpperCase()}
          </button>
          <a href="/dashboard" className="text-sm px-3 h-8 rounded-lg border flex items-center gap-1.5 hover:bg-white/5 transition-colors"
            style={{ borderColor: BORDER }}>
            Dashboard
          </a>
          <button onClick={() => logout.mutate()} className="text-sm px-3 h-8 rounded-lg flex items-center gap-1.5 hover:bg-white/5 transition-colors text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" /> {language === "it" ? "Esci" : "Logout"}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5" style={{ color: "oklch(75% 0.22 30)" }} />
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pannello SuperAdmin</h1>
          </div>
          <p className="text-sm text-muted-foreground">Gestione completa degli utenti, email e configurazione della piattaforma Dyneros.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Utenti totali", value: stats?.total ?? "—", icon: Users, color: GOLD },
            { label: "Attivi", value: stats?.active ?? "—", icon: UserCheck, color: "oklch(65% 0.22 145)" },
            { label: "Sospesi", value: stats?.suspended ?? "—", icon: UserX, color: "oklch(65% 0.22 25)" },
            { label: "Admin/SuperAdmin", value: stats?.admins ?? "—", icon: Shield, color: "oklch(68% 0.19 72)" },
            { label: "Nuovi questo mese", value: stats?.newThisMonth ?? "—", icon: CheckCircle, color: "oklch(65% 0.18 220)" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border p-4" style={{ background: BG, borderColor: BORDER }}>
              <div className="flex items-center gap-2 mb-2">
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
                <span className="text-xs text-muted-foreground">{s.label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: BORDER }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 h-9 text-sm font-medium transition-all border-b-2 -mb-px"
              style={tab === t.key
                ? { borderBottomColor: GOLD, color: GOLD }
                : { borderBottomColor: "transparent", color: "oklch(55% 0.05 264)" }}>
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "users" && (
          <div className="rounded-xl border overflow-hidden" style={{ background: BG, borderColor: BORDER }}>
            <div className="px-5 py-4 border-b flex items-center justify-between gap-4" style={{ borderColor: BORDER }}>
              <h2 className="font-semibold text-sm">Gestione Utenti</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input type="text" placeholder="Cerca per nome, email, azienda..." value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-4 rounded-lg text-sm border focus:outline-none w-64"
                  style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "inherit" }} />
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-xs text-muted-foreground" style={{ borderColor: BORDER }}>
                      <th className="text-left px-5 py-3 font-medium">Utente</th>
                      <th className="text-left px-4 py-3 font-medium">Azienda</th>
                      <th className="text-left px-4 py-3 font-medium">Ruolo</th>
                      <th className="text-left px-4 py-3 font-medium">Stato</th>
                      <th className="text-left px-4 py-3 font-medium">Registrato</th>
                      <th className="text-left px-4 py-3 font-medium">Ultimo accesso</th>
                      <th className="text-right px-5 py-3 font-medium">Azioni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((u) => (
                      <tr key={u.id} className="border-b hover:bg-white/[0.02] transition-colors" style={{ borderColor: BORDER }}>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "oklch(68% 0.19 72 / 0.15)", color: GOLD }}>
                              {(u.name ?? u.email ?? "?")[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium">{u.name ?? "—"}</div>
                              <div className="text-xs text-muted-foreground">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{u.company ?? "—"}</td>
                        <td className="px-4 py-3">
                          <select value={u.role}
                            onChange={e => updateRole.mutate({ userId: u.id, role: e.target.value as "user" | "admin" | "superadmin" })}
                            disabled={u.id === me.id}
                            className="text-xs px-2 py-1 rounded-md border focus:outline-none disabled:opacity-50"
                            style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: ROLE_COLORS[u.role] }}>
                            <option value="user">Utente</option>
                            <option value="admin">Admin</option>
                            <option value="superadmin">SuperAdmin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => updateStatus.mutate({ userId: u.id, status: u.status === "active" ? "suspended" : "active" })}
                            disabled={u.id === me.id}
                            className="text-xs px-2.5 py-1 rounded-full font-medium disabled:opacity-50 transition-opacity"
                            style={{
                              background: u.status === "active" ? "oklch(65% 0.22 145 / 0.15)" : "oklch(65% 0.22 25 / 0.15)",
                              color: u.status === "active" ? "oklch(65% 0.22 145)" : "oklch(65% 0.22 25)",
                            }}>
                            {u.status === "active" ? "Attivo" : "Sospeso"}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString("it-IT") : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString("it-IT") : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          {u.id !== me.id && (
                            <button onClick={() => setConfirmDelete(u.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Nessun utente trovato</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "email" && (
          <div className="space-y-5 max-w-2xl">
            <div className="rounded-xl border p-5" style={{ background: BG, borderColor: BORDER }}>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4" style={{ color: GOLD }} />
                Verifica Configurazione SMTP
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Verifica che il server SMTP sia configurato correttamente e che le email vengano inviate.
              </p>
              <button onClick={() => verifySmtp.mutate()} disabled={verifySmtp.isPending}
                className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium disabled:opacity-50"
                style={{ background: GOLD, color: "#000" }}>
                {verifySmtp.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
                Verifica SMTP
              </button>
              {smtpResult && (
                <div className="mt-3 p-3 rounded-lg flex items-center gap-2"
                  style={{ background: smtpResult.ok ? "oklch(60% 0.18 145 / 0.08)" : "oklch(55% 0.22 25 / 0.08)", border: `1px solid ${smtpResult.ok ? "oklch(60% 0.18 145 / 0.3)" : "oklch(55% 0.22 25 / 0.3)"}` }}>
                  {smtpResult.ok
                    ? <><CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" /><p className="text-sm text-green-400">SMTP configurato correttamente</p></>
                    : <><AlertTriangle className="h-4 w-4 text-red-400 shrink-0" /><p className="text-sm text-red-400">{smtpResult.error || "Errore SMTP"}</p></>
                  }
                </div>
              )}
            </div>

            <div className="rounded-xl border p-5" style={{ background: BG, borderColor: BORDER }}>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Send className="h-4 w-4" style={{ color: GOLD }} />
                Invia Email di Test
              </h2>
              <div className="flex gap-3">
                <input value={testEmailTo} onChange={e => setTestEmailTo(e.target.value)}
                  type="email" placeholder="destinatario@esempio.com"
                  className="flex-1 h-9 px-3 rounded-lg text-sm border focus:outline-none"
                  style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "inherit" }} />
                <button onClick={() => { if (!testEmailTo) return toast.error("Inserisci un destinatario"); sendTest.mutate({ to: testEmailTo }); }}
                  disabled={sendTest.isPending}
                  className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ background: GOLD, color: "#000" }}>
                  {sendTest.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  Invia
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "system" && (
          <div className="space-y-5 max-w-2xl">
            <div className="rounded-xl border p-5" style={{ background: BG, borderColor: BORDER }}>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Server className="h-4 w-4" style={{ color: GOLD }} />
                Informazioni Sistema
              </h2>
              <div className="space-y-2">
                {[
                  { label: "Versione Piattaforma", value: "Dyneros v2.1.0" },
                  { label: "Ambiente", value: "Production" },
                  { label: "Database", value: "TiDB Serverless" },
                  { label: "Runtime", value: "Node.js 22 / Express 4" },
                  { label: "Chain", value: "DYNEROS Mainnet (ChainID: 24589)" },
                  { label: "RPC", value: "https://mainnet.dyneros.com" },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                    <span className="text-xs font-mono font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-5" style={{ background: BG, borderColor: BORDER }}>
              <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: GOLD }} />
                Stato Servizi
              </h2>
              <div className="space-y-2">
                {[
                  { name: "API Server", status: "online" },
                  { name: "Database", status: "online" },
                  { name: "Email SMTP", status: "online" },
                  { name: "Blockchain RPC", status: "online" },
                  { name: "Storage S3", status: "online" },
                ].map(svc => (
                  <div key={svc.name} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
                    <span className="text-sm">{svc.name}</span>
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "oklch(65% 0.22 145)" }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {svc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "oklch(0% 0 0 / 0.7)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: BG, borderColor: BORDER }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "oklch(55% 0.22 25 / 0.15)" }}>
                <AlertTriangle className="h-5 w-5" style={{ color: "oklch(65% 0.22 25)" }} />
              </div>
              <div>
                <h3 className="font-semibold">{t("admin.delete_user")}</h3>
                <p className="text-xs text-muted-foreground">{t("admin.irreversible")}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              {t("admin.delete_confirm_msg")}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 h-9 rounded-lg border text-sm hover:bg-white/5 transition-colors" style={{ borderColor: BORDER }}>
                Annulla
              </button>
              <button onClick={() => deleteUser.mutate({ userId: confirmDelete })} disabled={deleteUser.isPending}
                className="flex-1 h-9 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
                style={{ background: "oklch(55% 0.22 25)", color: "#fff" }}>
                {deleteUser.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
