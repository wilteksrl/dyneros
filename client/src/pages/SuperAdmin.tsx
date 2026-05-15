import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Users, Mail, Server, Award, BarChart3, Loader2,
  LogOut, Search, ChevronLeft, ChevronRight, Check, X,
  Trash2, ShieldCheck, ShieldOff, RefreshCw, Send, Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const BG = "#050505";
const CARD = "#0d0d14";
const BORDER = "oklch(20% 0.008 264)";
const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.15)";
const TEXT = "#f9fafb";
const MUTED = "oklch(55% 0.01 264)";

type Tab = "overview" | "users" | "email" | "system" | "affiliates";

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px" }}>
      <div style={{ color: MUTED, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
      <div style={{ color: GOLD, fontSize: 26, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{value}</div>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    active: { bg: "oklch(30% 0.08 145)", color: "oklch(70% 0.18 145)" },
    pending: { bg: "oklch(30% 0.08 72)", color: GOLD },
    suspended: { bg: "oklch(25% 0.06 25)", color: "oklch(65% 0.18 25)" },
    rejected: { bg: "oklch(25% 0.06 25)", color: "oklch(65% 0.18 25)" },
    superadmin: { bg: GOLD_DIM, color: GOLD },
    admin: { bg: "oklch(25% 0.06 264)", color: "oklch(65% 0.12 264)" },
    user: { bg: "oklch(18% 0.005 264)", color: MUTED },
    sent: { bg: "oklch(30% 0.08 145)", color: "oklch(70% 0.18 145)" },
    failed: { bg: "oklch(25% 0.06 25)", color: "oklch(65% 0.18 25)" },
    bulk: { bg: "oklch(25% 0.06 264)", color: "oklch(65% 0.12 264)" },
    single: { bg: "oklch(18% 0.005 264)", color: MUTED },
    affiliate: { bg: GOLD_DIM, color: GOLD },
    sub_affiliate: { bg: "oklch(25% 0.06 264)", color: "oklch(65% 0.12 264)" },
  };
  const s = map[status] ?? { bg: "oklch(18% 0.005 264)", color: MUTED };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>
      {status}
    </span>
  );
}

function TabOverview() {
  const { data: stats, isLoading } = trpc.superadmin.stats.useQuery();
  if (isLoading) return <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} /></div>;
  if (!stats) return null;
  const kpis = [
    { label: "Utenti Totali", value: stats.total },
    { label: "Utenti Attivi", value: stats.active },
    { label: "Nuovi (questo mese)", value: stats.newThisMonth },
    { label: "Attivi (30gg)", value: stats.activeUsers30d },
    { label: "Fatturato Pagato", value: `€${Number(stats.totalRevenue ?? 0).toLocaleString("it-IT", { minimumFractionDigits: 2 })}` },
    { label: "Affiliati Attivi", value: stats.activeAffiliates },
    { label: "Ticket Aperti", value: stats.openTickets },
    { label: "Progetti Attivi", value: stats.activeProjects },
  ];
  return (
    <div className="space-y-6">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14 }}>
        {kpis.map(k => <KpiCard key={k.label} label={k.label} value={k.value} />)}
      </div>
      <div>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>Ultimi 10 utenti registrati</div>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["Nome", "Email", "Ruolo", "Stato", "Registrato"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(stats.recentUsers ?? []).map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < (stats.recentUsers?.length ?? 0) - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: TEXT }}>{u.name ?? "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUTED }}>{u.email}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={u.role} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge status={u.status} /></td>
                  <td style={{ padding: "10px 14px", color: MUTED }}>{new Date(u.createdAt).toLocaleDateString("it-IT")}</td>
                </tr>
              ))}
              {(stats.recentUsers ?? []).length === 0 && (
                <tr><td colSpan={5} style={{ padding: "24px", textAlign: "center" as const, color: MUTED }}>Nessun utente</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabUsers() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin" | "superadmin">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending">("all");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data, isLoading, refetch } = trpc.superadmin.listUsersPaged.useQuery({ page, limit: 25, search: search || undefined, role: roleFilter, status: statusFilter });
  const updateRole = trpc.superadmin.updateUserRole.useMutation({ onSuccess: () => { refetch(); toast.success("Ruolo aggiornato"); }, onError: e => toast.error(e.message) });
  const updateStatus = trpc.superadmin.updateUserStatus.useMutation({ onSuccess: () => { refetch(); toast.success("Stato aggiornato"); }, onError: e => toast.error(e.message) });
  const deleteUser = trpc.superadmin.deleteUser.useMutation({ onSuccess: () => { refetch(); setConfirmDelete(null); toast.success("Utente eliminato"); }, onError: e => toast.error(e.message) });

  const rows = data?.rows ?? [];
  const total = data?.total ?? 0;
  const pages = data?.pages ?? 1;

  const selStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", color: TEXT, fontSize: 13 };

  return (
    <div className="space-y-4">
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, alignItems: "center" }}>
        <div style={{ position: "relative" as const, flex: "1 1 220px" }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: MUTED }} />
          <input value={searchInput} onChange={e => setSearchInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { setSearch(searchInput); setPage(1); } }} placeholder="Cerca nome, email, azienda… (Invio)" style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px 8px 32px", color: TEXT, fontSize: 13, width: "100%" }} />
        </div>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value as typeof roleFilter); setPage(1); }} style={selStyle}>
          <option value="all">Tutti i ruoli</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Superadmin</option>
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }} style={selStyle}>
          <option value="all">Tutti gli stati</option>
          <option value="active">Attivi</option>
          <option value="pending">In attesa</option>
          <option value="suspended">Sospesi</option>
        </select>
        <button onClick={() => { setSearch(searchInput); setPage(1); refetch(); }} style={{ background: GOLD_DIM, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "8px 14px", color: GOLD, fontSize: 13, cursor: "pointer" }}>
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        {[{ label: "Totale DB", value: total }, { label: "In pagina", value: rows.length }].map(c => (
          <div key={c.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 16px", fontSize: 12 }}>
            <span style={{ color: MUTED }}>{c.label}: </span><span style={{ color: GOLD, fontWeight: 700 }}>{c.value}</span>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} /></div>
      ) : (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["Nome", "Email", "Azienda", "Ruolo", "Stato", "Verificato", "Registrato", "Ultimo accesso", "Azioni"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em", whiteSpace: "nowrap" as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: TEXT, whiteSpace: "nowrap" as const }}>{u.name ?? "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12 }}>{u.email}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12 }}>{u.company ?? "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <select value={u.role} onChange={e => updateRole.mutate({ userId: u.id, role: e.target.value as "user" | "admin" | "superadmin" })} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "3px 8px", color: TEXT, fontSize: 12 }}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                  <td style={{ padding: "10px 14px" }}><Badge status={u.status} /></td>
                  <td style={{ padding: "10px 14px" }}>
                    {u.emailVerified ? <Check className="h-4 w-4" style={{ color: "oklch(70% 0.18 145)" }} /> : <X className="h-4 w-4" style={{ color: "oklch(65% 0.18 25)" }} />}
                  </td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{new Date(u.createdAt).toLocaleDateString("it-IT")}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString("it-IT") : "—"}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button title={u.status === "active" ? "Sospendi" : "Attiva"} onClick={() => updateStatus.mutate({ userId: u.id, status: u.status === "active" ? "suspended" : "active" })} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: MUTED }}>
                        {u.status === "active" ? <ShieldOff className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                      </button>
                      {confirmDelete === u.id ? (
                        <>
                          <button onClick={() => deleteUser.mutate({ userId: u.id })} style={{ background: "oklch(25% 0.06 25)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "oklch(65% 0.18 25)", fontSize: 11 }}>Conferma</button>
                          <button onClick={() => setConfirmDelete(null)} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: MUTED, fontSize: 11 }}>Annulla</button>
                        </>
                      ) : (
                        <button onClick={() => setConfirmDelete(u.id)} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 8px", cursor: "pointer", color: "oklch(65% 0.18 25)" }}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={9} style={{ padding: "32px", textAlign: "center" as const, color: MUTED }}>Nessun utente trovato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 10px", cursor: page === 1 ? "not-allowed" : "pointer", color: page === 1 ? MUTED : TEXT }}>
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: Math.min(7, pages) }, (_, i) => {
            const p = pages <= 7 ? i + 1 : page <= 4 ? i + 1 : page >= pages - 3 ? pages - 6 + i : page - 3 + i;
            return <button key={p} onClick={() => setPage(p)} style={{ background: p === page ? GOLD_DIM : CARD, border: `1px solid ${p === page ? GOLD : BORDER}`, borderRadius: 6, padding: "6px 12px", cursor: "pointer", color: p === page ? GOLD : TEXT, fontSize: 13, fontWeight: p === page ? 700 : 400 }}>{p}</button>;
          })}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "6px 10px", cursor: page === pages ? "not-allowed" : "pointer", color: page === pages ? MUTED : TEXT }}>
            <ChevronRight className="h-4 w-4" />
          </button>
          <span style={{ color: MUTED, fontSize: 12 }}>Pagina {page} di {pages} ({total} totali)</span>
        </div>
      )}
    </div>
  );
}

function TabEmail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [bulkFilter, setBulkFilter] = useState<"all" | "user" | "admin" | "active" | "pending">("all");
  const [bulkSubject, setBulkSubject] = useState("");
  const [bulkBody, setBulkBody] = useState("");
  const [activeForm, setActiveForm] = useState<"single" | "bulk">("single");

  const { data: history, refetch: refetchHistory } = trpc.superadmin.emailHistory.useQuery();
  const sendSingle = trpc.superadmin.sendEmail.useMutation({
    onSuccess: (r) => { toast.success(r.ok ? "Email inviata" : `Errore: ${r.error}`); refetchHistory(); setTo(""); setSubject(""); setBody(""); },
    onError: e => toast.error(e.message),
  });
  const sendBulk = trpc.superadmin.sendBulkEmail.useMutation({
    onSuccess: (r) => { toast.success(`Inviate: ${r.sent} / Fallite: ${r.failed}`); refetchHistory(); setBulkSubject(""); setBulkBody(""); },
    onError: e => toast.error(e.message),
  });

  const inputStyle = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", color: TEXT, fontSize: 13, width: "100%" };

  return (
    <div className="space-y-6">
      <div style={{ display: "flex", gap: 8 }}>
        {(["single", "bulk"] as const).map(f => (
          <button key={f} onClick={() => setActiveForm(f)} style={{ background: activeForm === f ? GOLD_DIM : CARD, border: `1px solid ${activeForm === f ? GOLD : BORDER}`, borderRadius: 8, padding: "8px 18px", color: activeForm === f ? GOLD : MUTED, fontSize: 13, cursor: "pointer", fontWeight: activeForm === f ? 700 : 400 }}>
            {f === "single" ? "Email Singola" : "Email di Massa"}
          </button>
        ))}
      </div>

      {activeForm === "single" ? (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }} className="space-y-3">
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Invia Email Singola</div>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Destinatario (email)" style={inputStyle} />
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Oggetto" style={inputStyle} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Corpo del messaggio" rows={6} style={{ ...inputStyle, resize: "vertical" as const }} />
          <button onClick={() => sendSingle.mutate({ to, subject, body })} disabled={sendSingle.isPending || !to || !subject || !body} style={{ background: GOLD_DIM, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "9px 20px", color: GOLD, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {sendSingle.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Invia
          </button>
        </div>
      ) : (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 20 }} className="space-y-3">
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Invia Email di Massa</div>
          <select value={bulkFilter} onChange={e => setBulkFilter(e.target.value as typeof bulkFilter)} style={inputStyle}>
            <option value="all">Tutti gli utenti</option>
            <option value="user">Solo utenti (ruolo user)</option>
            <option value="admin">Solo admin</option>
            <option value="active">Solo utenti attivi</option>
            <option value="pending">Solo utenti in attesa</option>
          </select>
          <input value={bulkSubject} onChange={e => setBulkSubject(e.target.value)} placeholder="Oggetto" style={inputStyle} />
          <textarea value={bulkBody} onChange={e => setBulkBody(e.target.value)} placeholder="Corpo del messaggio" rows={6} style={{ ...inputStyle, resize: "vertical" as const }} />
          <button onClick={() => sendBulk.mutate({ filter: bulkFilter, subject: bulkSubject, body: bulkBody })} disabled={sendBulk.isPending || !bulkSubject || !bulkBody} style={{ background: GOLD_DIM, border: `1px solid ${GOLD}`, borderRadius: 8, padding: "9px 20px", color: GOLD, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            {sendBulk.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />} Invia a tutti
          </button>
        </div>
      )}

      <div>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Storico invii (ultimi 50)</div>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["Data", "Destinatario", "Oggetto", "Tipo", "Stato"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(history ?? []).map((h, i) => (
                <tr key={h.id} style={{ borderBottom: i < (history?.length ?? 0) - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{new Date(h.createdAt).toLocaleString("it-IT")}</td>
                  <td style={{ padding: "10px 14px", color: TEXT, fontSize: 12 }}>{h.toEmail}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, maxWidth: 240, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{h.subject}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={h.isBulk ? "bulk" : "single"} /></td>
                  <td style={{ padding: "10px 14px" }}><Badge status={h.status} /></td>
                </tr>
              ))}
              {(history ?? []).length === 0 && (
                <tr><td colSpan={5} style={{ padding: "24px", textAlign: "center" as const, color: MUTED }}>Nessun invio registrato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabSystem() {
  const { data: envStatus } = trpc.superadmin.envStatus.useQuery();
  const { data: auditLogs } = trpc.superadmin.auditLogList.useQuery();
  const { data: dbStats } = trpc.superadmin.dbStats.useQuery();
  const { data: smtpConf } = trpc.email.smtpConfig.useQuery();

  return (
    <div className="space-y-6">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Variabili d'ambiente</div>
          <div className="space-y-2">
            {(envStatus ?? []).map(e => (
              <div key={e.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: MUTED, fontFamily: "monospace" }}>{e.key}</span>
                {e.configured
                  ? <span style={{ color: "oklch(70% 0.18 145)", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><Check className="h-3.5 w-3.5" /> Configurato</span>
                  : <span style={{ color: "oklch(65% 0.18 25)", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}><X className="h-3.5 w-3.5" /> Mancante</span>}
              </div>
            ))}
          </div>
          {smtpConf && (
            <div style={{ marginTop: 14, padding: "10px 12px", background: smtpConf.configured ? "oklch(20% 0.05 145)" : "oklch(20% 0.05 25)", borderRadius: 8, fontSize: 12 }}>
              <span style={{ color: smtpConf.configured ? "oklch(70% 0.18 145)" : "oklch(65% 0.18 25)", fontWeight: 600 }}>
                SMTP: {smtpConf.configured ? `✅ Configurato (host: ${smtpConf.host})` : "❌ Non configurato"}
              </span>
            </div>
          )}
        </div>
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 18 }}>
          <div style={{ color: TEXT, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Statistiche Database</div>
          <div className="space-y-1.5">
            {(dbStats ?? []).map(d => (
              <div key={d.table} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: MUTED, fontFamily: "monospace", fontSize: 12 }}>{d.table}</span>
                <span style={{ color: GOLD, fontWeight: 700 }}>{d.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Audit Log (ultimi 50 eventi)</div>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, minWidth: 600 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["Data", "Utente ID", "Azione", "Risorsa", "IP"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(auditLogs ?? []).map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < (auditLogs?.length ?? 0) - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{new Date(a.createdAt).toLocaleString("it-IT")}</td>
                  <td style={{ padding: "10px 14px", color: MUTED }}>{a.userId ?? "—"}</td>
                  <td style={{ padding: "10px 14px", color: TEXT }}>{a.action}</td>
                  <td style={{ padding: "10px 14px", color: MUTED }}>{a.resource ?? "—"}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12 }}>{a.ipAddress ?? "—"}</td>
                </tr>
              ))}
              {(auditLogs ?? []).length === 0 && (
                <tr><td colSpan={5} style={{ padding: "24px", textAlign: "center" as const, color: MUTED }}>Nessun evento registrato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function TabAffiliates() {
  const { data, isLoading, refetch } = trpc.superadmin.affiliateList.useQuery();
  const { data: conversions } = trpc.superadmin.recentConversions.useQuery();
  const action = trpc.superadmin.affiliateAction.useMutation({
    onSuccess: () => { refetch(); toast.success("Azione completata"); },
    onError: e => toast.error(e.message),
  });
  const profiles = data?.profiles ?? [];
  const stats = data?.stats;

  return (
    <div className="space-y-6">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        <KpiCard label="Profili Totali" value={profiles.length} />
        <KpiCard label="Conversioni Totali" value={stats?.totalConversions ?? 0} />
        <KpiCard label="Payout in Sospeso" value={`€${Number(stats?.pendingPayouts ?? 0).toLocaleString("it-IT", { minimumFractionDigits: 2 })}`} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin" style={{ color: GOLD }} /></div>
      ) : (
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["Nome", "Email", "Tipo", "Codice", "Stato", "Registrato", "Azioni"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {profiles.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < profiles.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: TEXT }}>{p.fullName}</td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12 }}>{p.email}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={p.type} /></td>
                  <td style={{ padding: "10px 14px", color: GOLD, fontFamily: "monospace", fontSize: 12 }}>{p.affiliateCode}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={p.status} /></td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{new Date(p.createdAt).toLocaleDateString("it-IT")}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {p.status === "pending" && (
                        <>
                          <button onClick={() => action.mutate({ affiliateId: p.id, action: "approve" })} style={{ background: "oklch(20% 0.05 145)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "oklch(70% 0.18 145)", fontSize: 11 }}>Approva</button>
                          <button onClick={() => action.mutate({ affiliateId: p.id, action: "reject" })} style={{ background: "oklch(20% 0.05 25)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "oklch(65% 0.18 25)", fontSize: 11 }}>Rifiuta</button>
                        </>
                      )}
                      {p.status === "active" && (
                        <button onClick={() => action.mutate({ affiliateId: p.id, action: "suspend" })} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: MUTED, fontSize: 11 }}>Sospendi</button>
                      )}
                      {p.status === "suspended" && (
                        <button onClick={() => action.mutate({ affiliateId: p.id, action: "approve" })} style={{ background: "oklch(20% 0.05 145)", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", color: "oklch(70% 0.18 145)", fontSize: 11 }}>Riattiva</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr><td colSpan={7} style={{ padding: "32px", textAlign: "center" as const, color: MUTED }}>Nessun profilo affiliato</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div>
        <div style={{ color: MUTED, fontSize: 12, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Conversioni Recenti</div>
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, overflowX: "auto" as const }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, background: CARD }}>
                {["ID", "Categoria", "Valore Netto", "Commissione", "Stato", "Data"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left" as const, color: MUTED, fontWeight: 600, fontSize: 11, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(conversions ?? []).map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < (conversions?.length ?? 0) - 1 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12 }}>#{c.id}</td>
                  <td style={{ padding: "10px 14px", color: TEXT }}>{c.serviceCategory}</td>
                  <td style={{ padding: "10px 14px", color: GOLD, fontWeight: 600 }}>€{Number(c.contractValueNet).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px 14px", color: "oklch(70% 0.18 145)" }}>€{Number(c.commissionAmount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "10px 14px" }}><Badge status={c.status} /></td>
                  <td style={{ padding: "10px 14px", color: MUTED, fontSize: 12, whiteSpace: "nowrap" as const }}>{new Date(c.createdAt).toLocaleDateString("it-IT")}</td>
                </tr>
              ))}
              {(conversions ?? []).length === 0 && (
                <tr><td colSpan={6} style={{ padding: "24px", textAlign: "center" as const, color: MUTED }}>Nessuna conversione</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function SuperAdmin() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<Tab>("overview");
  const { language, setLanguage } = useLanguage();
  const { data: me, isLoading: meLoading } = trpc.auth.me.useQuery();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });

  useEffect(() => {
    if (me && me.role !== "superadmin") setLocation("/dashboard");
  }, [me]);

  if (meLoading || !me || me.role !== "superadmin") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: GOLD }} />
      </div>
    );
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <BarChart3 className="h-3.5 w-3.5" /> },
    { key: "users", label: "Utenti", icon: <Users className="h-3.5 w-3.5" /> },
    { key: "email", label: "Email", icon: <Mail className="h-3.5 w-3.5" /> },
    { key: "system", label: "Sistema", icon: <Server className="h-3.5 w-3.5" /> },
    { key: "affiliates", label: "Affiliati", icon: <Award className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: BG, fontFamily: "'Inter', sans-serif", color: TEXT }}>
      <header className="sticky top-0 z-50 border-b px-6 h-14 flex items-center justify-between" style={{ background: BG, borderColor: BORDER }}>
        <div className="flex items-center gap-3">
          <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
            <polygon points="16,2 30,10 30,22 16,30 2,22 2,10" stroke={GOLD} strokeWidth="1.5" fill="none" />
            <polygon points="16,8 24,13 24,19 16,24 8,19 8,13" fill={GOLD} opacity="0.25" />
            <circle cx="16" cy="16" r="3" fill={GOLD} />
          </svg>
          <span className="font-bold text-base" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Dyneros</span>
          <span style={{ background: GOLD_DIM, color: GOLD, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>SuperAdmin</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setLanguage(language === "it" ? "en" : "it")} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 10px", color: MUTED, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <Globe className="h-3.5 w-3.5" />{language.toUpperCase()}
          </button>
          <span style={{ color: MUTED, fontSize: 13 }}>{me.email}</span>
          <button onClick={() => logout.mutate()} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 6, padding: "5px 10px", color: MUTED, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
            <LogOut className="h-3.5 w-3.5" /> Esci
          </button>
        </div>
      </header>

      <div className="flex" style={{ minHeight: "calc(100vh - 56px)" }}>
        <aside style={{ width: 200, borderRight: `1px solid ${BORDER}`, padding: "20px 12px", flexShrink: 0 }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 8, border: "none", background: tab === t.key ? GOLD_DIM : "transparent", color: tab === t.key ? GOLD : MUTED, fontSize: 13, fontWeight: tab === t.key ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" as const }}>
              {t.icon}{t.label}
            </button>
          ))}
        </aside>
        <main style={{ flex: 1, padding: 28, overflowX: "auto" as const }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: TEXT, fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
              {TABS.find(t => t.key === tab)?.label}
            </div>
          </div>
          {tab === "overview" && <TabOverview />}
          {tab === "users" && <TabUsers />}
          {tab === "email" && <TabEmail />}
          {tab === "system" && <TabSystem />}
          {tab === "affiliates" && <TabAffiliates />}
        </main>
      </div>
    </div>
  );
}
