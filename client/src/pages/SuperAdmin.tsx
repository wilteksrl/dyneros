import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Activity, AlertTriangle, BarChart2, Box, ChevronLeft, ChevronRight,
  CircuitBoard, CreditCard, Database, FileText, Globe, Key, Layers, Loader2,
  LogOut, Mail, Menu, Plus, Receipt, Server, Settings, Shield, Ticket,
  Trash2, TrendingUp, Users, Wallet, X, Zap, FolderOpen, Bot, Bell, Link2
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";
const SIDEBAR_BG = "oklch(8% 0.005 264)";

type Section =
  | "overview" | "users" | "projects" | "tickets" | "invoices" | "contracts"
  | "documents" | "affiliates" | "email" | "system" | "payments"
  | "blockchain" | "wallets" | "smart-contracts"
  | "domains" | "ai"
  | "notifications" | "settings" | "security" | "api-keys" | "email-settings";

interface NavItem { id: Section; label: string; icon: React.ElementType; group: string; }

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: BarChart2, group: "GESTIONE PIATTAFORMA" },
  { id: "users", label: "Tutti gli Utenti", icon: Users, group: "GESTIONE PIATTAFORMA" },
  { id: "projects", label: "Tutti i Progetti", icon: FolderOpen, group: "GESTIONE PIATTAFORMA" },
  { id: "tickets", label: "Tutti i Ticket", icon: Ticket, group: "GESTIONE PIATTAFORMA" },
  { id: "invoices", label: "Tutte le Fatture", icon: Receipt, group: "GESTIONE PIATTAFORMA" },
  { id: "contracts", label: "Tutti i Contratti", icon: FileText, group: "GESTIONE PIATTAFORMA" },
  { id: "documents", label: "Tutti i Documenti", icon: Layers, group: "GESTIONE PIATTAFORMA" },
  { id: "affiliates", label: "Affiliati", icon: Link2, group: "GESTIONE PIATTAFORMA" },
  { id: "email", label: "Email", icon: Mail, group: "GESTIONE PIATTAFORMA" },
  { id: "system", label: "Sistema", icon: Server, group: "GESTIONE PIATTAFORMA" },
  { id: "payments", label: "Pagamenti", icon: CreditCard, group: "GESTIONE PIATTAFORMA" },
  { id: "blockchain", label: "Blockchain / Web3", icon: CircuitBoard, group: "BLOCKCHAIN GLOBALE" },
  { id: "wallets", label: "Wallet & Assets", icon: Wallet, group: "BLOCKCHAIN GLOBALE" },
  { id: "smart-contracts", label: "Smart Contracts", icon: Box, group: "BLOCKCHAIN GLOBALE" },
  { id: "domains", label: "Domini / Hosting", icon: Globe, group: "SERVIZI DIGITALI" },
  { id: "ai", label: "AI & Automazioni", icon: Bot, group: "SERVIZI DIGITALI" },
  { id: "notifications", label: "Notifiche", icon: Bell, group: "ACCOUNT ADMIN" },
  { id: "settings", label: "Impostazioni", icon: Settings, group: "ACCOUNT ADMIN" },
  { id: "security", label: "Sicurezza", icon: Shield, group: "ACCOUNT ADMIN" },
  { id: "api-keys", label: "API / Accessi", icon: Key, group: "ACCOUNT ADMIN" },
  { id: "email-settings", label: "Email & Notifiche", icon: Zap, group: "ACCOUNT ADMIN" },
];

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      <span className="h-1.5 w-1.5 rounded-full inline-block" style={{ background: color }} />{label}
    </span>
  );
}

function EmptyState({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Icon className="h-10 w-10 mb-3 opacity-20" />
      <p className="text-sm">{text}</p>
    </div>
  );
}

function Pagination({ page, pages, total, limit, onPage }: { page: number; pages: number; total: number; limit: number; onPage: (p: number) => void }) {
  if (pages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);
  return (
    <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: BORDER }}>
      <span className="text-xs text-muted-foreground">{from}–{to} di {total}</span>
      <div className="flex items-center gap-1">
        <button disabled={page === 1} onClick={() => onPage(page - 1)}
          className="h-7 w-7 flex items-center justify-center rounded-lg border text-xs disabled:opacity-30 transition-colors hover:bg-[oklch(15%_0.008_264)]"
          style={{ borderColor: BORDER }}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          const p = pages <= 7 ? i + 1 : i + 1;
          return (
            <button key={p} onClick={() => onPage(p)}
              className="h-7 w-7 flex items-center justify-center rounded-lg border text-xs transition-colors"
              style={{ borderColor: page === p ? GOLD : BORDER, background: page === p ? GOLD : "transparent", color: page === p ? "#000" : undefined }}>
              {p}
            </button>
          );
        })}
        <button disabled={page === pages} onClick={() => onPage(page + 1)}
          className="h-7 w-7 flex items-center justify-center rounded-lg border text-xs disabled:opacity-30 transition-colors hover:bg-[oklch(15%_0.008_264)]"
          style={{ borderColor: BORDER }}>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function SectionOverview() {
  const { data, isLoading } = trpc.superadmin.stats.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data) return <EmptyState icon={BarChart2} text="Dati non disponibili" />;
  const kpis = [
    { label: "Utenti Totali", value: data.total, icon: Users, accent: true },
    { label: "Attivi", value: data.active, icon: Activity },
    { label: "Sospesi", value: data.suspended, icon: AlertTriangle },
    { label: "Admin/SuperAdmin", value: data.admins, icon: Shield },
    { label: "Nuovi (mese)", value: data.newThisMonth, icon: TrendingUp },
    { label: "Attivi 30gg", value: data.activeUsers30d, icon: Zap },
    { label: "Affiliati Attivi", value: data.activeAffiliates, icon: Link2 },
    { label: "Conversioni", value: data.totalConversions, icon: BarChart2 },
    { label: "Fatturato (€)", value: parseFloat(data.totalRevenue || "0").toLocaleString("it-IT"), icon: Receipt, accent: true },
    { label: "Ticket Aperti", value: data.openTickets, icon: Ticket },
    { label: "Progetti Attivi", value: data.activeProjects, icon: FolderOpen },
  ];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {kpis.map(k => (
          <div key={k.label} className="rounded-xl border p-4 flex flex-col gap-2"
            style={{ background: CARD_BG, borderColor: k.accent ? "oklch(68% 0.19 72 / 0.3)" : BORDER }}>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium">{k.label}</p>
              <k.icon className="h-3.5 w-3.5" style={{ color: k.accent ? GOLD : "oklch(55% 0.05 264)" }} />
            </div>
            <p className="text-xl font-semibold" style={k.accent ? { color: GOLD } : {}}>{k.value}</p>
          </div>
        ))}
      </div>
      {data.recentUsers && data.recentUsers.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="px-4 py-3 border-b" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <h3 className="text-sm font-semibold">Ultimi 10 utenti registrati</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground" style={{ borderColor: BORDER }}>
                <th className="text-left px-4 py-2 font-medium">Nome</th>
                <th className="text-left px-4 py-2 font-medium">Email</th>
                <th className="text-left px-4 py-2 font-medium">Ruolo</th>
                <th className="text-left px-4 py-2 font-medium">Registrato</th>
              </tr>
            </thead>
            <tbody>
              {data.recentUsers.map((u: { id: number; name: string | null; email: string | null; role: string; status: string; createdAt: Date }) => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-2.5 font-medium">{u.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground font-mono text-xs">{u.email}</td>
                  <td className="px-4 py-2.5"><Badge label={u.role} color={u.role === "superadmin" ? GOLD : u.role === "admin" ? "oklch(60% 0.18 220)" : "oklch(55% 0.05 264)"} /></td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("it-IT")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}function SectionUsers() {
  const utils = trpc.useUtils();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "user" | "admin" | "superadmin">("all");
  const [status, setStatus] = useState<"all" | "active" | "suspended" | "pending">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [showNotify, setShowNotify] = useState<number | null>(null);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", role: "user", company: "" });
  const [notifyForm, setNotifyForm] = useState({ title: "", message: "", type: "system" });
  const LIMIT = 25;
  const { data, isLoading, refetch } = trpc.superadmin.listUsersPaged.useQuery({ page, limit: LIMIT, search: search || undefined, role, status });
  const updateRole = trpc.superadmin.updateUserRole.useMutation({ onSuccess: () => { toast.success("Ruolo aggiornato"); refetch(); } });
  const updateStatus = trpc.superadmin.updateUserStatus.useMutation({ onSuccess: () => { toast.success("Stato aggiornato"); refetch(); } });
  const deleteUser = trpc.superadmin.deleteUser.useMutation({ onSuccess: () => { toast.success("Utente eliminato"); refetch(); } });
  const createUser = trpc.superadmin.createUser.useMutation({ onSuccess: () => { toast.success("Utente creato"); refetch(); setShowCreate(false); setCreateForm({ name: "", email: "", password: "", role: "user", company: "" }); } });
  const sendNotif = trpc.superadmin.sendNotificationToUser.useMutation({ onSuccess: () => { toast.success("Notifica inviata"); setShowNotify(null); setNotifyForm({ title: "", message: "", type: "system" }); } });
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 justify-between">
        <div className="flex flex-wrap gap-2">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Cerca nome o email…"
            className="h-8 px-3 rounded-lg border text-sm bg-transparent outline-none focus:border-amber-500/50 transition-colors"
            style={{ borderColor: BORDER, minWidth: 200 }} />
          <select value={role} onChange={e => { setRole(e.target.value as typeof role); setPage(1); }}
            className="h-8 px-3 rounded-lg border text-sm bg-[oklch(10%_0.006_264)] outline-none"
            style={{ borderColor: BORDER }}>
            <option value="all">Tutti i ruoli</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">SuperAdmin</option>
          </select>
          <select value={status} onChange={e => { setStatus(e.target.value as typeof status); setPage(1); }}
            className="h-8 px-3 rounded-lg border text-sm bg-[oklch(10%_0.006_264)] outline-none"
            style={{ borderColor: BORDER }}>
            <option value="all">Tutti gli stati</option>
            <option value="active">Attivo</option>
            <option value="suspended">Sospeso</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}>
          <Plus className="h-3.5 w-3.5" /> Crea Utente
        </button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h4 className="text-sm font-semibold">Nuovo Utente</h4>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={createForm.name} onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome completo" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Email *</label>
              <input type="email" value={createForm.email} onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="email@esempio.com" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Password *</label>
              <input type="password" value={createForm.password} onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Min. 8 caratteri" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Ruolo</label>
              <select value={createForm.role} onChange={e => setCreateForm(f => ({ ...f, role: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="user">User</option><option value="admin">Admin</option><option value="superadmin">SuperAdmin</option>
              </select></div>
            <div className="col-span-2"><label className="text-[10px] text-muted-foreground mb-1 block">Azienda</label>
              <input value={createForm.company} onChange={e => setCreateForm(f => ({ ...f, company: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Opzionale" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={createUser.isPending || !createForm.name || !createForm.email || createForm.password.length < 8} onClick={() => createUser.mutate({ name: createForm.name, email: createForm.email, password: createForm.password, role: createForm.role as "user"|"admin"|"superadmin", company: createForm.company || undefined })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {showNotify !== null && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h4 className="text-sm font-semibold">Invia Notifica a Utente #{showNotify}</h4>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Titolo *</label>
              <input value={notifyForm.title} onChange={e => setNotifyForm(f => ({ ...f, title: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Tipo</label>
              <select value={notifyForm.type} onChange={e => setNotifyForm(f => ({ ...f, type: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="system">System</option><option value="alert">Alert</option><option value="invoice">Invoice</option><option value="milestone">Milestone</option><option value="ticket_update">Ticket Update</option>
              </select></div>
            <div className="col-span-2"><label className="text-[10px] text-muted-foreground mb-1 block">Messaggio *</label>
              <textarea value={notifyForm.message} onChange={e => setNotifyForm(f => ({ ...f, message: e.target.value }))} rows={2} className="w-full px-2 py-1.5 rounded border text-xs bg-transparent outline-none resize-none" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowNotify(null)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={sendNotif.isPending || !notifyForm.title || !notifyForm.message} onClick={() => sendNotif.mutate({ userId: showNotify!, title: notifyForm.title, message: notifyForm.message, type: notifyForm.type as "system"|"alert"|"invoice"|"milestone"|"ticket_update"|"deployment" })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Invia</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
                <th className="text-left px-4 py-2.5 font-medium">ID</th>
                <th className="text-left px-4 py-2.5 font-medium">Nome</th>
                <th className="text-left px-4 py-2.5 font-medium">Email</th>
                <th className="text-left px-4 py-2.5 font-medium">Ruolo</th>
                <th className="text-left px-4 py-2.5 font-medium">Stato</th>
                <th className="text-left px-4 py-2.5 font-medium">Registrato</th>
                <th className="text-left px-4 py-2.5 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {data?.rows.map(u => (
                <tr key={u.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">#{u.id}</td>
                  <td className="px-4 py-2.5 font-medium">{u.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-2.5">
                    <select value={u.role} onChange={e => updateRole.mutate({ userId: u.id, role: e.target.value as "user" | "admin" | "superadmin" })}
                      className="h-7 px-2 rounded border text-xs bg-[oklch(10%_0.006_264)] outline-none"
                      style={{ borderColor: BORDER }}>
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="superadmin">superadmin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge label={u.status} color={u.status === "active" ? "oklch(60% 0.18 145)" : u.status === "suspended" ? "oklch(55% 0.22 25)" : GOLD} />
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      {u.status === "active"
                        ? <button onClick={() => updateStatus.mutate({ userId: u.id, status: "suspended" })} className="text-[10px] px-2 py-1 rounded border transition-colors hover:bg-red-500/10" style={{ borderColor: BORDER, color: "oklch(55% 0.22 25)" }}>Sospendi</button>
                        : <button onClick={() => updateStatus.mutate({ userId: u.id, status: "active" })} className="text-[10px] px-2 py-1 rounded border transition-colors hover:bg-green-500/10" style={{ borderColor: BORDER, color: "oklch(60% 0.18 145)" }}>Attiva</button>
                      }
                      <button onClick={() => { if (confirm("Eliminare utente?")) deleteUser.mutate({ userId: u.id }); }}
                        className="text-[10px] px-2 py-1 rounded border transition-colors hover:bg-red-500/10" style={{ borderColor: BORDER, color: "oklch(55% 0.22 25)" }}>Elimina</button>
                      <button onClick={() => { setShowNotify(u.id); setNotifyForm({ title: "", message: "", type: "system" }); }}
                        className="text-[10px] px-2 py-1 rounded border transition-colors hover:bg-amber-500/10" style={{ borderColor: BORDER, color: GOLD }}>Notifica</button>
                    </div>
                  </td>
                </tr>
              ))}
              {(!data?.rows || data.rows.length === 0) && (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">Nessun utente trovato</td></tr>
              )}
            </tbody>
          </table>
          {data && <div className="px-4"><Pagination page={page} pages={data.pages} total={data.total} limit={LIMIT} onPage={setPage} /></div>}
        </div>
      )}
    </div>
  );
}

function SectionAllProjects() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allProjects.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const updateStatus = trpc.superadmin.updateProjectStatus.useMutation({ onSuccess: () => { toast.success("Stato aggiornato"); utils.superadmin.allProjects.invalidate(); } });
  const createProj = trpc.superadmin.createProjectForUser.useMutation({ onSuccess: () => { toast.success("Progetto creato"); utils.superadmin.allProjects.invalidate(); setShowCreate(false); setForm({ userId: "", name: "", type: "web_app", priority: "medium", environment: "production" }); } });
  const deleteProj = trpc.superadmin.adminDeleteProject.useMutation({ onSuccess: () => { toast.success("Progetto eliminato"); utils.superadmin.allProjects.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", name: "", type: "web_app", priority: "medium", environment: "production" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}>
          <Plus className="h-3.5 w-3.5" /> Nuovo Progetto
        </button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>
                {usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome progetto" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Tipo</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="web_app">Web App</option>
                <option value="blockchain_infrastructure">Blockchain</option>
                <option value="smart_contract">Smart Contract</option>
                <option value="ai_system">AI/ML</option>
                <option value="other">Altro</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Ambiente</label>
              <select value={form.environment} onChange={e => setForm(f => ({ ...f, environment: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="dev">Development</option>
                <option value="staging">Staging</option>
                <option value="production">Production</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={createProj.isPending || !form.userId || !form.name.trim()} onClick={() => createProj.mutate({ userId: parseInt(form.userId), name: form.name, type: form.type as "web_app"|"blockchain_infrastructure"|"smart_contract"|"ai_system"|"other", priority: form.priority as "low"|"medium"|"high", environment: form.environment })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={FolderOpen} text="Nessun progetto presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
                <th className="text-left px-4 py-2.5 font-medium">Progetto</th>
                <th className="text-left px-4 py-2.5 font-medium">Utente</th>
                <th className="text-left px-4 py-2.5 font-medium">Stato</th>
                <th className="text-left px-4 py-2.5 font-medium">Priorità</th>
                <th className="text-left px-4 py-2.5 font-medium">Creato</th>
                <th className="text-left px-4 py-2.5 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.project.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-2.5 font-medium max-w-[140px] truncate">{row.project.name}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                  <td className="px-4 py-2.5"><Badge label={row.project.status} color={row.project.status === "in_progress" ? GOLD : row.project.status === "completed" ? "oklch(60% 0.18 145)" : "oklch(55% 0.05 264)"} /></td>
                  <td className="px-4 py-2.5"><Badge label={row.project.priority} color={row.project.priority === "high" ? "oklch(55% 0.22 25)" : row.project.priority === "medium" ? GOLD : "oklch(55% 0.05 264)"} /></td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.project.createdAt).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1">
                      <select value={row.project.status} onChange={e => updateStatus.mutate({ projectId: row.project.id, status: e.target.value as "planning"|"in_progress"|"completed"|"on_hold" })} className="text-[10px] px-2 py-1 rounded border outline-none" style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "oklch(70% 0.05 264)" }}>
                        <option value="planning">Planning</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completato</option>
                        <option value="on_hold">On Hold</option>
                      </select>
                      {row.project.status === "planning" && <button onClick={() => updateStatus.mutate({ projectId: row.project.id, status: "in_progress" })} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: "oklch(60% 0.18 145 / 0.4)", color: "oklch(60% 0.18 145)" }}>Approva</button>}
                      <button onClick={() => { if (confirm("Eliminare?")) deleteProj.mutate({ projectId: row.project.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllTickets() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allTickets.useQuery();
  const [expanded, setExpanded] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const reply = trpc.superadmin.replyToTicket.useMutation({ onSuccess: () => { toast.success("Risposta inviata"); setReplyText(""); utils.superadmin.allTickets.invalidate(); } });
  const updateTicketStatus = trpc.superadmin.updateTicketStatus.useMutation({ onSuccess: () => { toast.success("Stato aggiornato"); utils.superadmin.allTickets.invalidate(); } });
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Ticket} text="Nessun ticket presente" />;
  return (
    <div className="space-y-2">
      {data.map(row => (
        <div key={row.ticket.id} className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[oklch(12%_0.006_264)] transition-colors"
            onClick={() => setExpanded(expanded === row.ticket.id ? null : row.ticket.id)}>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">{row.ticket.ticketNumber}</span>
            <span className="font-medium text-sm flex-1 truncate">{row.ticket.subject}</span>
            <span className="text-xs text-muted-foreground shrink-0">{row.userName ?? row.userEmail ?? "—"}</span>
            <Badge label={row.ticket.priority} color={row.ticket.priority === "critical" ? "oklch(55% 0.22 25)" : row.ticket.priority === "high" ? "oklch(60% 0.2 35)" : GOLD} />
            <Badge label={row.ticket.status} color={row.ticket.status === "open" ? "oklch(60% 0.18 220)" : row.ticket.status === "resolved" ? "oklch(60% 0.18 145)" : GOLD} />
            <select value={row.ticket.status}
              onClick={e => e.stopPropagation()}
              onChange={e => updateTicketStatus.mutate({ ticketId: row.ticket.id, status: e.target.value as "open"|"in_progress"|"resolved"|"closed" })}
              className="text-[10px] px-2 py-1 rounded border outline-none shrink-0"
              style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "oklch(70% 0.05 264)" }}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          {expanded === row.ticket.id && (
            <div className="px-4 pb-4 pt-2 border-t space-y-3" style={{ borderColor: BORDER, background: "oklch(9% 0.005 264)" }}>
              <p className="text-xs text-muted-foreground">{new Date(row.ticket.createdAt).toLocaleString("it-IT")}</p>
              <div className="flex gap-2">
                <textarea value={replyText} onChange={e => setReplyText(e.target.value)}
                  placeholder="Scrivi una risposta come admin…"
                  rows={3}
                  className="flex-1 rounded-lg px-3 py-2 text-sm bg-transparent border outline-none resize-none"
                  style={{ borderColor: BORDER }} />
                <button disabled={reply.isPending || !replyText.trim()}
                  onClick={() => reply.mutate({ ticketId: row.ticket.id, message: replyText })}
                  className="self-end flex items-center gap-1.5 px-3 h-9 rounded-lg text-xs font-medium disabled:opacity-50 shrink-0"
                  style={{ background: GOLD, color: "#000" }}>
                  {reply.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Invia"}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionAllInvoices() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allInvoices.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const createInv = trpc.superadmin.createInvoice.useMutation({ onSuccess: () => { toast.success("Fattura creata"); utils.superadmin.allInvoices.invalidate(); setShowCreate(false); setForm({ userId: "", amount: "", description: "", due: "" }); } });
  const updateInvStatus = trpc.superadmin.updateInvoiceStatus.useMutation({ onSuccess: () => { toast.success("Stato aggiornato"); utils.superadmin.allInvoices.invalidate(); } });
  const deleteInv = trpc.superadmin.deleteInvoice.useMutation({ onSuccess: () => { toast.success("Fattura eliminata"); utils.superadmin.allInvoices.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", amount: "", description: "", due: "" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}>
          <Plus className="h-3.5 w-3.5" /> Nuova Fattura
        </button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>
                {usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Importo (€) *</label>
              <input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="0.00" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Descrizione *</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Descrizione servizio" />
            </div>
            <div>
              <label className="text-[10px] text-muted-foreground mb-1 block">Scadenza *</label>
              <input type="date" value={form.due} onChange={e => setForm(f => ({ ...f, due: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={createInv.isPending || !form.userId || !form.amount || !form.description || !form.due} onClick={() => createInv.mutate({ userId: Number(form.userId), amount: parseFloat(form.amount), description: form.description, dueDate: form.due })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Receipt} text="Nessuna fattura presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
                <th className="text-left px-4 py-2.5 font-medium">Numero</th>
                <th className="text-left px-4 py-2.5 font-medium">Utente</th>
                <th className="text-right px-4 py-2.5 font-medium">Importo</th>
                <th className="text-left px-4 py-2.5 font-medium">Stato</th>
                <th className="text-left px-4 py-2.5 font-medium">Scadenza</th>
                <th className="text-left px-4 py-2.5 font-medium">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.invoice.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-2.5 font-mono text-xs">{row.invoice.invoiceNumber}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                  <td className="px-4 py-2.5 text-right font-semibold" style={{ color: GOLD }}>€{parseFloat(row.invoice.amount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2.5">
                    <select value={row.invoice.status} onChange={e => updateInvStatus.mutate({ invoiceId: row.invoice.id, status: e.target.value as "paid"|"unpaid"|"overdue" })} className="text-[10px] px-2 py-1 rounded border outline-none" style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "oklch(70% 0.05 264)" }}>
                      <option value="unpaid">Non pagata</option>
                      <option value="paid">Pagata</option>
                      <option value="overdue">Scaduta</option>
                    </select>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.invoice.due).toLocaleDateString("it-IT")}</td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => { if (confirm("Eliminare?")) deleteInv.mutate({ invoiceId: row.invoice.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllContracts() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allContracts.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const createC = trpc.superadmin.createContract.useMutation({ onSuccess: () => { toast.success("Contratto creato"); utils.superadmin.allContracts.invalidate(); setShowCreate(false); setForm({ userId: "", contractName: "", type: "Other", endDate: "" }); } });
  const deleteC = trpc.superadmin.deleteContract.useMutation({ onSuccess: () => { toast.success("Contratto eliminato"); utils.superadmin.allContracts.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", contractName: "", type: "Other", endDate: "" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Nuovo Contratto</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.contractName} onChange={e => setForm(f => ({ ...f, contractName: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome contratto" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Tipo</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="NDA">NDA</option><option value="Service Agreement">Service Agreement</option><option value="Statement of Work">Statement of Work</option><option value="Other">Altro</option>
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Scadenza</label>
              <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={createC.isPending || !form.userId || !form.contractName} onClick={() => createC.mutate({ userId: Number(form.userId), contractName: form.contractName, type: form.type as "NDA"|"Service Agreement"|"Statement of Work"|"Other", endDate: form.endDate || undefined })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={FileText} text="Nessun contratto presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Contratto</th><th className="text-left px-4 py-2.5 font-medium">Tipo</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">Scadenza</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.contract.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-medium">{row.contract.contractName}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.contract.type}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5"><Badge label={row.contract.status} color={row.contract.status === "active" ? "oklch(60% 0.18 145)" : row.contract.status === "expired" ? "oklch(55% 0.22 25)" : GOLD} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.contract.endDate ? new Date(row.contract.endDate).toLocaleDateString("it-IT") : "—"}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteC.mutate({ contractId: row.contract.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllDocuments() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allDocuments.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const createDoc = trpc.superadmin.createDocument.useMutation({ onSuccess: () => { toast.success("Documento creato"); utils.superadmin.allDocuments.invalidate(); setShowCreate(false); setForm({ userId: "", name: "", type: "other" }); } });
  const deleteDoc = trpc.superadmin.deleteDocument.useMutation({ onSuccess: () => { toast.success("Documento eliminato"); utils.superadmin.allDocuments.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", name: "", type: "other" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Nuovo Documento</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome documento" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Tipo</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="contract">Contratto</option><option value="sow">SOW</option><option value="nda">NDA</option><option value="technical">Tecnico</option><option value="report">Report</option><option value="other">Altro</option>
              </select></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={createDoc.isPending || !form.userId || !form.name} onClick={() => createDoc.mutate({ userId: Number(form.userId), name: form.name, type: form.type as "contract"|"sow"|"nda"|"technical"|"report"|"other" })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Layers} text="Nessun documento presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Nome</th><th className="text-left px-4 py-2.5 font-medium">Tipo</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">Caricato</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.document.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-medium">{row.document.name}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.document.type ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5"><Badge label={row.document.status} color={row.document.status === "final" ? "oklch(60% 0.18 145)" : GOLD} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.document.createdAt).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteDoc.mutate({ documentId: row.document.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAffiliates() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.affiliateList.useQuery();
  const action = trpc.superadmin.affiliateAction.useMutation({ onSuccess: () => { toast.success("Azione eseguita"); utils.superadmin.affiliateList.invalidate(); } });
  const setCommission = trpc.superadmin.setAffiliateCommission.useMutation({ onSuccess: () => { toast.success("Commissione aggiornata"); utils.superadmin.affiliateList.invalidate(); } });
  const [editingCommission, setEditingCommission] = useState<Record<number, string>>({});
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Link2} text="Nessun affiliato presente" />;
  const totalConversions = data.reduce((s: number, p: any) => s + (p.conversions ?? 0), 0);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Affiliati</p>
          <p className="text-2xl font-semibold">{data.length}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Conversioni Totali</p>
          <p className="text-2xl font-semibold">{totalConversions}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.3)" }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Attivi</p>
          <p className="text-2xl font-semibold" style={{ color: GOLD }}>{data.filter((p: any) => p.status === "active").length}</p>
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Codice</th>
              <th className="text-left px-4 py-2.5 font-medium">Stato</th>
              <th className="text-left px-4 py-2.5 font-medium">Commissione %</th>
              <th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p: any) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-mono text-xs">{p.affiliateCode}</td>
                <td className="px-4 py-2.5"><Badge label={p.status} color={p.status === "active" ? "oklch(60% 0.18 145)" : p.status === "pending" ? GOLD : "oklch(55% 0.22 25)"} /></td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number" min="0" max="100" step="0.5"
                      value={editingCommission[p.id] ?? (p.commissionRate ?? "")}
                      onChange={e => setEditingCommission(prev => ({ ...prev, [p.id]: e.target.value }))}
                      className="w-16 h-7 px-2 text-xs rounded border bg-transparent outline-none"
                      style={{ borderColor: BORDER }}
                      placeholder="%"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(editingCommission[p.id] ?? "");
                        if (!isNaN(val)) setCommission.mutate({ affiliateId: p.id, commission: val });
                      }}
                      disabled={setCommission.isPending}
                      className="h-7 px-2 text-[10px] rounded border disabled:opacity-50"
                      style={{ borderColor: GOLD + "40", color: GOLD }}>
                      Salva
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    {p.status === "pending" && <button onClick={() => action.mutate({ affiliateId: p.id, action: "approve" })} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: "oklch(60% 0.18 145)40", color: "oklch(60% 0.18 145)" }}>Approva</button>}
                    {p.status === "active" && <button onClick={() => action.mutate({ affiliateId: p.id, action: "suspend" })} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: "oklch(55% 0.22 25)40", color: "oklch(55% 0.22 25)" }}>Sospendi</button>}
                    {p.status !== "active" && p.status !== "pending" && <button onClick={() => action.mutate({ affiliateId: p.id, action: "approve" })} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: GOLD + "40", color: GOLD }}>Riattiva</button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionEmail() {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [bulkFilter, setBulkFilter] = useState<"all" | "active" | "admin">("all");
  const { data: history, isLoading: histLoading, refetch } = trpc.superadmin.emailHistory.useQuery();
  const send = trpc.superadmin.sendEmail.useMutation({ onSuccess: () => { toast.success("Email inviata"); setTo(""); setSubject(""); setBody(""); refetch(); } });
  const bulk = trpc.superadmin.sendBulkEmail.useMutation({ onSuccess: (r) => { toast.success(`Inviata a ${r.sent}/${r.total} destinatari`); refetch(); } });
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h3 className="text-sm font-semibold">Email Singola</h3>
          <input value={to} onChange={e => setTo(e.target.value)} placeholder="Destinatario email" className="w-full h-9 px-3 rounded-lg border text-sm bg-transparent outline-none focus:border-amber-500/50" style={{ borderColor: BORDER }} />
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Oggetto" className="w-full h-9 px-3 rounded-lg border text-sm bg-transparent outline-none focus:border-amber-500/50" style={{ borderColor: BORDER }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Corpo del messaggio…" rows={5} className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent outline-none resize-none focus:border-amber-500/50" style={{ borderColor: BORDER }} />
          <button onClick={() => send.mutate({ to, subject, body })} disabled={send.isPending || !to || !subject || !body}
            className="h-9 px-4 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            {send.isPending ? "Invio…" : "Invia Email"}
          </button>
        </div>
        <div className="rounded-xl border p-5 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h3 className="text-sm font-semibold">Email Bulk</h3>
          <select value={bulkFilter} onChange={e => setBulkFilter(e.target.value as typeof bulkFilter)} className="w-full h-9 px-3 rounded-lg border text-sm bg-[oklch(10%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
            <option value="all">Tutti gli utenti</option>
            <option value="active">Solo utenti attivi</option>
            <option value="admin">Solo admin/superadmin</option>
          </select>
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Oggetto" className="w-full h-9 px-3 rounded-lg border text-sm bg-transparent outline-none focus:border-amber-500/50" style={{ borderColor: BORDER }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Corpo del messaggio…" rows={5} className="w-full px-3 py-2 rounded-lg border text-sm bg-transparent outline-none resize-none focus:border-amber-500/50" style={{ borderColor: BORDER }} />
          <button onClick={() => bulk.mutate({ filter: bulkFilter, subject, body })} disabled={bulk.isPending || !subject || !body}
            className="h-9 px-4 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            {bulk.isPending ? "Invio…" : "Invia Bulk"}
          </button>
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="px-4 py-3 border-b" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
          <h3 className="text-sm font-semibold">Storico Invii</h3>
        </div>
        {histLoading ? <div className="flex items-center justify-center h-20"><Loader2 className="h-4 w-4 animate-spin" style={{ color: GOLD }} /></div> : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-xs text-muted-foreground" style={{ borderColor: BORDER }}>
                <th className="text-left px-4 py-2 font-medium">A</th>
                <th className="text-left px-4 py-2 font-medium">Oggetto</th>
                <th className="text-left px-4 py-2 font-medium">Stato</th>
                <th className="text-left px-4 py-2 font-medium">Data</th>
              </tr>
            </thead>
            <tbody>
              {history?.map((h: { id: number; toEmail: string; subject: string; status: string; createdAt: Date }) => (
                <tr key={h.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-2 text-xs text-muted-foreground max-w-xs truncate">{h.toEmail}</td>
                  <td className="px-4 py-2 text-xs max-w-xs truncate">{h.subject}</td>
                  <td className="px-4 py-2"><Badge label={h.status} color={h.status === "sent" ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} /></td>
                  <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(h.createdAt).toLocaleString("it-IT")}</td>
                </tr>
              ))}
              {(!history || history.length === 0) && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">Nessun invio registrato</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function SectionSystem() {
  const { data: env } = trpc.superadmin.envStatus.useQuery();
  const { data: db } = trpc.superadmin.dbStats.useQuery();
  const { data: audit } = trpc.superadmin.auditLogList.useQuery();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4">Variabili d'Ambiente</h3>
          <div className="space-y-2">
            {env?.map((e: { key: string; configured: boolean }) => (
              <div key={e.key} className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{e.key}</span>
                <Badge label={e.configured ? "OK" : "MANCANTE"} color={e.configured ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: BORDER }}>
          <h3 className="text-sm font-semibold mb-4">Statistiche Database</h3>
          <div className="space-y-2">
            {db?.map((row: { table: string; count: number }) => (
              <div key={row.table} className="flex items-center justify-between text-xs">
                <span className="font-mono text-muted-foreground">{row.table}</span>
                <span className="font-semibold">{row.count.toLocaleString("it-IT")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <div className="px-4 py-3 border-b" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
          <h3 className="text-sm font-semibold">Audit Log (ultimi 50)</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground" style={{ borderColor: BORDER }}>
              <th className="text-left px-4 py-2 font-medium">Azione</th>
              <th className="text-left px-4 py-2 font-medium">Utente</th>
              <th className="text-left px-4 py-2 font-medium">IP</th>
              <th className="text-left px-4 py-2 font-medium">Data</th>
            </tr>
          </thead>
          <tbody>
            {audit?.map((a: { id: number; action: string; userId: number | null; ipAddress: string | null; createdAt: Date }) => (
              <tr key={a.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2 text-xs font-mono">{a.action}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">#{a.userId ?? "—"}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{a.ipAddress ?? "—"}</td>
                <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("it-IT")}</td>
              </tr>
            ))}
            {(!audit || audit.length === 0) && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground text-sm">Nessun evento registrato</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SectionAllWallets() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allWallets.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const addW = trpc.superadmin.addWalletForUser.useMutation({ onSuccess: () => { toast.success("Wallet aggiunto"); utils.superadmin.allWallets.invalidate(); setShowCreate(false); setForm({ userId: "", name: "", address: "", network: "DYNEROS Chain" }); } });
  const deleteW = trpc.superadmin.deleteWallet.useMutation({ onSuccess: () => { toast.success("Wallet eliminato"); utils.superadmin.allWallets.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", name: "", address: "", network: "DYNEROS Chain" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Aggiungi Wallet</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Es. Main Wallet" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Indirizzo (0x...) *</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none font-mono" style={{ borderColor: BORDER }} placeholder="0x..." /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Network</label>
              <input value={form.network} onChange={e => setForm(f => ({ ...f, network: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={addW.isPending || !form.userId || !form.name || !form.address} onClick={() => addW.mutate({ userId: Number(form.userId), name: form.name, address: form.address, network: form.network })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Aggiungi</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Wallet} text="Nessun wallet presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Indirizzo</th><th className="text-left px-4 py-2.5 font-medium">Network</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Creato</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.wallet.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.wallet.address}</td>
                <td className="px-4 py-2.5 text-xs">{row.wallet.network}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.wallet.createdAt).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteW.mutate({ walletId: row.wallet.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllSmartContracts() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allSmartContracts.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const addSC = trpc.superadmin.addSmartContractForUser.useMutation({ onSuccess: () => { toast.success("Smart contract aggiunto"); utils.superadmin.allSmartContracts.invalidate(); setShowCreate(false); setForm({ userId: "", name: "", address: "", network: "DYNEROS Chain" }); } });
  const deleteSC = trpc.superadmin.deleteSmartContract.useMutation({ onSuccess: () => { toast.success("Smart contract eliminato"); utils.superadmin.allSmartContracts.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", name: "", address: "", network: "DYNEROS Chain" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Nuovo Smart Contract</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome contratto" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Indirizzo (0x...) *</label>
              <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none font-mono" style={{ borderColor: BORDER }} placeholder="0x..." /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Network</label>
              <input value={form.network} onChange={e => setForm(f => ({ ...f, network: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={addSC.isPending || !form.userId || !form.name || !form.address} onClick={() => addSC.mutate({ userId: Number(form.userId), name: form.name, address: form.address, network: form.network })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Aggiungi</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Box} text="Nessun smart contract presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Nome</th><th className="text-left px-4 py-2.5 font-medium">Indirizzo</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.sc.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-medium">{row.sc.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.sc.address}</td>
                <td className="px-4 py-2.5"><Badge label={row.sc.status} color={row.sc.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteSC.mutate({ contractId: row.sc.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllDomains() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allDomains.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const addD = trpc.superadmin.addDomainForUser.useMutation({ onSuccess: () => { toast.success("Dominio aggiunto"); utils.superadmin.allDomains.invalidate(); setShowCreate(false); setForm({ userId: "", domainName: "", registrar: "" }); } });
  const deleteD = trpc.superadmin.deleteDomain.useMutation({ onSuccess: () => { toast.success("Dominio eliminato"); utils.superadmin.allDomains.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", domainName: "", registrar: "" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Aggiungi Dominio</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Dominio *</label>
              <input value={form.domainName} onChange={e => setForm(f => ({ ...f, domainName: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="es. example.com" /></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Registrar</label>
              <input value={form.registrar} onChange={e => setForm(f => ({ ...f, registrar: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="es. GoDaddy" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={addD.isPending || !form.userId || !form.domainName} onClick={() => addD.mutate({ userId: Number(form.userId), domainName: form.domainName, registrar: form.registrar || undefined })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Aggiungi</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Globe} text="Nessun dominio presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Dominio</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">SSL</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.domain.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-mono text-xs">{row.domain.domainName}</td>
                <td className="px-4 py-2.5"><Badge label={row.domain.status} color={row.domain.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
                <td className="px-4 py-2.5"><Badge label={row.domain.sslStatus} color={row.domain.sslStatus === "valid" ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteD.mutate({ domainId: row.domain.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllAI() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allAiProjects.useQuery();
  const { data: usersList } = trpc.superadmin.listUsers.useQuery();
  const addAI = trpc.superadmin.addAiProjectForUser.useMutation({ onSuccess: () => { toast.success("Progetto AI aggiunto"); utils.superadmin.allAiProjects.invalidate(); setShowCreate(false); setForm({ userId: "", name: "", description: "" }); } });
  const deleteAI = trpc.superadmin.deleteAiProject.useMutation({ onSuccess: () => { toast.success("Progetto AI eliminato"); utils.superadmin.allAiProjects.invalidate(); } });
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", name: "", description: "" });
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setShowCreate(v => !v)} className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium" style={{ background: GOLD, color: "#000" }}><Plus className="h-3.5 w-3.5" /> Nuovo Progetto AI</button>
      </div>
      {showCreate && (
        <div className="rounded-xl border p-4 space-y-3" style={{ background: CARD_BG, borderColor: BORDER }}>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Utente *</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-[oklch(12%_0.006_264)] outline-none" style={{ borderColor: BORDER }}>
                <option value="">Seleziona utente</option>{usersList?.map(u => <option key={u.id} value={u.id}>{u.name ?? u.email}</option>)}
              </select></div>
            <div><label className="text-[10px] text-muted-foreground mb-1 block">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Nome progetto AI" /></div>
            <div className="col-span-2"><label className="text-[10px] text-muted-foreground mb-1 block">Descrizione</label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full h-8 px-2 rounded border text-xs bg-transparent outline-none" style={{ borderColor: BORDER }} placeholder="Descrizione opzionale" /></div>
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setShowCreate(false)} className="px-3 h-8 rounded-lg text-xs border" style={{ borderColor: BORDER }}>Annulla</button>
            <button disabled={addAI.isPending || !form.userId || !form.name} onClick={() => addAI.mutate({ userId: Number(form.userId), name: form.name, description: form.description || undefined })} className="px-3 h-8 rounded-lg text-xs font-medium disabled:opacity-50" style={{ background: GOLD, color: "#000" }}>Crea</button>
          </div>
        </div>
      )}
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Bot} text="Nessun progetto AI presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Nome</th><th className="text-left px-4 py-2.5 font-medium">Tipo</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.ai.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-medium">{row.ai.name}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.ai.environment}</td>
                <td className="px-4 py-2.5"><Badge label={row.ai.status} color={row.ai.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5"><button onClick={() => { if (confirm("Eliminare?")) deleteAI.mutate({ projectId: row.ai.id }); }} className="h-7 w-7 flex items-center justify-center rounded hover:bg-red-900/30 text-red-400"><Trash2 className="h-3.5 w-3.5" /></button></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionAllApiKeys() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.superadmin.allApiKeys.useQuery();
  const revokeKey = trpc.superadmin.revokeApiKeyAdmin.useMutation({ onSuccess: () => { toast.success("API key revocata"); utils.superadmin.allApiKeys.invalidate(); } });
  return (
    <div className="space-y-3">
      {isLoading ? <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div> : !data || data.length === 0 ? <EmptyState icon={Key} text="Nessuna API key presente" /> : (
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
          <table className="w-full text-sm">
            <thead><tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Nome</th><th className="text-left px-4 py-2.5 font-medium">Prefisso</th><th className="text-left px-4 py-2.5 font-medium">Stato</th><th className="text-left px-4 py-2.5 font-medium">Utente</th><th className="text-left px-4 py-2.5 font-medium">Creata</th><th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr></thead>
            <tbody>{data.map(row => (
              <tr key={row.key.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-medium">{row.key.name}</td>
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.key.keyPrefix}…</td>
                <td className="px-4 py-2.5"><Badge label={row.key.revokedAt ? "revocata" : "attiva"} color={!row.key.revokedAt ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} /></td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
                <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.key.createdAt).toLocaleDateString("it-IT")}</td>
                <td className="px-4 py-2.5">{!row.key.revokedAt && <button onClick={() => { if (confirm("Revocare questa API key?")) revokeKey.mutate({ keyId: row.key.id }); }} className="text-[10px] px-2 py-1 rounded border" style={{ borderColor: "oklch(55% 0.22 25)40", color: "oklch(55% 0.22 25)" }}>Revoca</button>}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SectionBlockchain() {
  const { data, isLoading } = trpc.superadmin.blockchainStats.useQuery();
  const chainInfo = [
    { label: "Chain ID", value: "24589" },
    { label: "Nome", value: "DYNEROS Chain" },
    { label: "Valuta", value: "DYN" },
    { label: "RPC", value: "https://mainnet.dyneros.com" },
    { label: "Explorer", value: "https://explorer.dyneros.com" },
    { label: "Wallet", value: "https://wallet.dyneros.com" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.3)" }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Blocco Corrente</p>
          <p className="text-xl font-semibold" style={{ color: GOLD }}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin inline" /> : data?.blockNumber ? data.blockNumber.toLocaleString("it-IT") : "—"}
          </p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Wallet Registrati</p>
          <p className="text-xl font-semibold">{isLoading ? "…" : data?.walletsCount ?? 0}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Smart Contracts</p>
          <p className="text-xl font-semibold">{isLoading ? "…" : data?.contractsCount ?? 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {chainInfo.map(item => (
          <div key={item.label} className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{item.label}</p>
            <p className="text-sm font-mono font-medium truncate">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionPlaceholder({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return <EmptyState icon={Icon} text={`${title} — Nessun dato disponibile`} />;
}

function SectionPayments() {
  const [tab, setTab] = useState<"stripe" | "paypal" | "bank_transfer">("stripe");
  const { data: settings, refetch } = trpc.superadmin.getPaymentSettings.useQuery();
  const saveMut = trpc.superadmin.savePaymentSettings.useMutation({ onSuccess: () => { toast.success("Impostazioni salvate"); refetch(); } });

  const get = (provider: "stripe" | "paypal" | "bank_transfer") =>
    settings?.find((s: { provider: string }) => s.provider === provider);

  const StripeForm = () => {
    const s = get("stripe");
    const [form, setForm] = useState({ enabled: s?.enabled ?? false, publicKey: s?.publicKey ?? "", secretKey: s?.secretKey ?? "", webhookSecret: s?.webhookSecret ?? "" });
    return (
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} className="h-4 w-4 accent-amber-500" />
            <span className="text-sm font-medium">Abilita Stripe</span>
          </label>
        </div>
        {[{ label: "Publishable Key (pk_...)", key: "publicKey" as const, placeholder: "pk_live_..." },
          { label: "Secret Key (sk_...)", key: "secretKey" as const, placeholder: "sk_live_..." },
          { label: "Webhook Secret (whsec_...)", key: "webhookSecret" as const, placeholder: "whsec_..." }].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-muted-foreground mb-1">{label}</label>
            <input type="password" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full h-9 rounded-lg border bg-transparent px-3 text-sm font-mono focus:outline-none focus:ring-1"
              style={{ borderColor: BORDER }} />
          </div>
        ))}
        <button disabled={saveMut.isPending} onClick={() => saveMut.mutate({ provider: "stripe", enabled: form.enabled, publicKey: form.publicKey, secretKey: form.secretKey, webhookSecret: form.webhookSecret })}
          className="h-9 px-4 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: GOLD, color: "#000" }}>
          {saveMut.isPending ? "Salvataggio..." : "Salva Stripe"}
        </button>
      </div>
    );
  };

  const PayPalForm = () => {
    const s = get("paypal");
    const [form, setForm] = useState({ enabled: s?.enabled ?? false, clientId: s?.clientId ?? "", clientSecret: s?.clientSecret ?? "" });
    return (
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} className="h-4 w-4 accent-amber-500" />
            <span className="text-sm font-medium">Abilita PayPal</span>
          </label>
        </div>
        {[{ label: "Client ID", key: "clientId" as const, placeholder: "AaBb..." },
          { label: "Client Secret", key: "clientSecret" as const, placeholder: "EcFg..." }].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-muted-foreground mb-1">{label}</label>
            <input type="password" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full h-9 rounded-lg border bg-transparent px-3 text-sm font-mono focus:outline-none focus:ring-1"
              style={{ borderColor: BORDER }} />
          </div>
        ))}
        <button disabled={saveMut.isPending} onClick={() => saveMut.mutate({ provider: "paypal", enabled: form.enabled, clientId: form.clientId, clientSecret: form.clientSecret })}
          className="h-9 px-4 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: GOLD, color: "#000" }}>
          {saveMut.isPending ? "Salvataggio..." : "Salva PayPal"}
        </button>
      </div>
    );
  };

  const BankForm = () => {
    const s = get("bank_transfer");
    const [form, setForm] = useState({
      enabled: s?.enabled ?? false,
      bankAccountHolder: s?.bankAccountHolder ?? "",
      bankName: s?.bankName ?? "",
      bankIban: s?.bankIban ?? "",
      bankSwift: s?.bankSwift ?? "",
      bankReference: s?.bankReference ?? "",
    });
    return (
      <div className="space-y-4 max-w-xl">
        <div className="flex items-center gap-3 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.enabled} onChange={e => setForm(f => ({ ...f, enabled: e.target.checked }))} className="h-4 w-4 accent-amber-500" />
            <span className="text-sm font-medium">Abilita Bonifico Bancario</span>
          </label>
        </div>
        {[{ label: "Intestatario Conto", key: "bankAccountHolder" as const, placeholder: "The Oxygen Factory S.r.l." },
          { label: "Banca", key: "bankName" as const, placeholder: "Banca Sella" },
          { label: "IBAN", key: "bankIban" as const, placeholder: "IT60 X054 2811 1010 0000 0123 456" },
          { label: "BIC/SWIFT", key: "bankSwift" as const, placeholder: "SELBIT2B" },
          { label: "Causale predefinita", key: "bankReference" as const, placeholder: "Pagamento fattura #..." }].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs text-muted-foreground mb-1">{label}</label>
            <input type="text" value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              placeholder={placeholder}
              className="w-full h-9 rounded-lg border bg-transparent px-3 text-sm focus:outline-none focus:ring-1"
              style={{ borderColor: BORDER }} />
          </div>
        ))}
        <button disabled={saveMut.isPending} onClick={() => saveMut.mutate({ provider: "bank_transfer", enabled: form.enabled, bankAccountHolder: form.bankAccountHolder, bankName: form.bankName, bankIban: form.bankIban, bankSwift: form.bankSwift, bankReference: form.bankReference })}
          className="h-9 px-4 rounded-lg text-sm font-semibold disabled:opacity-50"
          style={{ background: GOLD, color: "#000" }}>
          {saveMut.isPending ? "Salvataggio..." : "Salva Bonifico"}
        </button>
      </div>
    );
  };

  const TABS: { id: "stripe" | "paypal" | "bank_transfer"; label: string; icon: React.ElementType }[] = [
    { id: "stripe", label: "Stripe", icon: CreditCard },
    { id: "paypal", label: "PayPal", icon: Wallet },
    { id: "bank_transfer", label: "Bonifico Bancario", icon: Receipt },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Metodi di Pagamento</h2>
        <p className="text-sm text-muted-foreground">Configura i gateway di pagamento accettati dalla piattaforma. Le chiavi vengono salvate cifrate nel database.</p>
      </div>
      <div className="flex gap-2 mb-6 border-b" style={{ borderColor: BORDER }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px"
            style={{ borderColor: tab === t.id ? GOLD : "transparent", color: tab === t.id ? GOLD : undefined }}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>
      <div className="rounded-xl border p-6" style={{ borderColor: BORDER, background: CARD_BG }}>
        {tab === "stripe" && <StripeForm />}
        {tab === "paypal" && <PayPalForm />}
        {tab === "bank_transfer" && <BankForm />}
      </div>
    </div>
  );
}

function renderSection(section: Section) {
  switch (section) {
    case "overview": return <SectionOverview />;
    case "users": return <SectionUsers />;
    case "projects": return <SectionAllProjects />;
    case "tickets": return <SectionAllTickets />;
    case "invoices": return <SectionAllInvoices />;
    case "contracts": return <SectionAllContracts />;
    case "documents": return <SectionAllDocuments />;
    case "affiliates": return <SectionAffiliates />;
    case "email": return <SectionEmail />;
    case "system": return <SectionSystem />;
    case "blockchain": return <SectionBlockchain />;
    case "wallets": return <SectionAllWallets />;
    case "smart-contracts": return <SectionAllSmartContracts />;
    case "domains": return <SectionAllDomains />;
    case "ai": return <SectionAllAI />;
    case "api-keys": return <SectionAllApiKeys />;
    case "notifications": return <SectionPlaceholder icon={Bell} title="Notifiche Sistema" />;
    case "settings": return <SectionPlaceholder icon={Settings} title="Impostazioni Piattaforma" />;
    case "security": return <SectionSystem />;
    case "email-settings": return <SectionPlaceholder icon={Zap} title="Configurazione Email" />;
    case "payments": return <SectionPayments />;
    default: return null;
  }
}

export default function SuperAdmin() {
  const [section, setSection] = useState<Section>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [, setLocation] = useLocation();
  const logout = trpc.auth.logout.useMutation({ onSuccess: () => setLocation("/login") });

  const groups = Array.from(new Set(NAV_ITEMS.map(i => i.group)));
  const current = NAV_ITEMS.find(i => i.id === section);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "oklch(8% 0.005 264)", color: "#f9fafb" }}>
      <aside className="flex flex-col shrink-0 border-r transition-all duration-200"
        style={{ width: sidebarOpen ? 240 : 56, background: SIDEBAR_BG, borderColor: BORDER }}>
        <div className="flex items-center gap-2 px-3 h-14 border-b shrink-0" style={{ borderColor: BORDER }}>
          {sidebarOpen && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: GOLD_DIM }}>
                <span className="text-xs font-bold" style={{ color: GOLD }}>SA</span>
              </div>
              <span className="text-xs font-semibold truncate">SuperAdmin</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} className="h-7 w-7 flex items-center justify-center rounded-lg transition-colors hover:bg-[oklch(15%_0.008_264)] shrink-0">
            {sidebarOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {groups.map(group => (
            <div key={group}>
              {sidebarOpen && <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pt-3 pb-1">{group}</p>}
              {NAV_ITEMS.filter(i => i.group === group).map(item => (
                <button key={item.id} onClick={() => setSection(item.id)}
                  className="w-full flex items-center gap-2.5 px-2 h-8 rounded-lg text-xs transition-colors"
                  style={{
                    background: section === item.id ? GOLD_DIM : "transparent",
                    color: section === item.id ? GOLD : "oklch(65% 0.03 264)",
                    fontWeight: section === item.id ? 600 : 400,
                  }}>
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t p-2 shrink-0" style={{ borderColor: BORDER }}>
          <button onClick={() => logout.mutate()}
            className="w-full flex items-center gap-2.5 px-2 h-8 rounded-lg text-xs transition-colors hover:bg-[oklch(15%_0.008_264)]"
            style={{ color: "oklch(55% 0.22 25)" }}>
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center gap-3 px-6 h-14 border-b shrink-0" style={{ background: SIDEBAR_BG, borderColor: BORDER }}>
          <h1 className="text-sm font-semibold">{current?.label ?? "SuperAdmin"}</h1>
          <span className="text-xs text-muted-foreground ml-auto">Dyneros Platform Control</span>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {renderSection(section)}
        </div>
      </main>
    </div>
  );
}
