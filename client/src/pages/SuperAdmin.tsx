import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";
import {
  Activity, AlertTriangle, BarChart2, Box, ChevronLeft, ChevronRight,
  CircuitBoard, Database, FileText, Globe, Key, Layers, Loader2,
  LogOut, Mail, Menu, Receipt, Server, Settings, Shield, Ticket,
  TrendingUp, Users, Wallet, X, Zap, FolderOpen, Bot, Bell, Link2
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";
const SIDEBAR_BG = "oklch(8% 0.005 264)";

type Section =
  | "overview" | "users" | "projects" | "tickets" | "invoices" | "contracts"
  | "documents" | "affiliates" | "email" | "system"
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
}

function SectionUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<"all" | "user" | "admin" | "superadmin">("all");
  const [status, setStatus] = useState<"all" | "active" | "suspended" | "pending">("all");
  const LIMIT = 25;
  const { data, isLoading, refetch } = trpc.superadmin.listUsersPaged.useQuery({ page, limit: LIMIT, search: search || undefined, role, status });
  const updateRole = trpc.superadmin.updateUserRole.useMutation({ onSuccess: () => { toast.success("Ruolo aggiornato"); refetch(); } });
  const updateStatus = trpc.superadmin.updateUserStatus.useMutation({ onSuccess: () => { toast.success("Stato aggiornato"); refetch(); } });
  const deleteUser = trpc.superadmin.deleteUser.useMutation({ onSuccess: () => { toast.success("Utente eliminato"); refetch(); } });
  return (
    <div className="space-y-4">
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
  const { data, isLoading } = trpc.superadmin.allProjects.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={FolderOpen} text="Nessun progetto presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Progetto</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Priorità</th>
            <th className="text-left px-4 py-2.5 font-medium">Creato</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.project.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.project.name}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5"><Badge label={row.project.status} color={row.project.status === "in_progress" ? GOLD : row.project.status === "completed" ? "oklch(60% 0.18 145)" : "oklch(55% 0.05 264)"} /></td>
              <td className="px-4 py-2.5"><Badge label={row.project.priority} color={row.project.priority === "high" ? "oklch(55% 0.22 25)" : row.project.priority === "medium" ? GOLD : "oklch(55% 0.05 264)"} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.project.createdAt).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllTickets() {
  const { data, isLoading } = trpc.superadmin.allTickets.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Ticket} text="Nessun ticket presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Ticket</th>
            <th className="text-left px-4 py-2.5 font-medium">Oggetto</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Priorità</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Creato</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.ticket.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.ticket.ticketNumber}</td>
              <td className="px-4 py-2.5 font-medium max-w-xs truncate">{row.ticket.subject}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5"><Badge label={row.ticket.priority} color={row.ticket.priority === "critical" ? "oklch(55% 0.22 25)" : row.ticket.priority === "high" ? "oklch(60% 0.2 35)" : GOLD} /></td>
              <td className="px-4 py-2.5"><Badge label={row.ticket.status} color={row.ticket.status === "open" ? "oklch(60% 0.18 220)" : row.ticket.status === "resolved" ? "oklch(60% 0.18 145)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.ticket.createdAt).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllInvoices() {
  const { data, isLoading } = trpc.superadmin.allInvoices.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Receipt} text="Nessuna fattura presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Numero</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-right px-4 py-2.5 font-medium">Importo</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Scadenza</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.invoice.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-mono text-xs">{row.invoice.invoiceNumber}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5 text-right font-semibold" style={{ color: GOLD }}>€{parseFloat(row.invoice.amount).toLocaleString("it-IT", { minimumFractionDigits: 2 })}</td>
              <td className="px-4 py-2.5"><Badge label={row.invoice.status} color={row.invoice.status === "paid" ? "oklch(60% 0.18 145)" : row.invoice.status === "overdue" ? "oklch(55% 0.22 25)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.invoice.due).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllContracts() {
  const { data, isLoading } = trpc.superadmin.allContracts.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={FileText} text="Nessun contratto presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Contratto</th>
            <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Scadenza</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.contract.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.contract.contractName}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.contract.type}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5"><Badge label={row.contract.status} color={row.contract.status === "active" ? "oklch(60% 0.18 145)" : row.contract.status === "expired" ? "oklch(55% 0.22 25)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.contract.endDate ? new Date(row.contract.endDate).toLocaleDateString("it-IT") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllDocuments() {
  const { data, isLoading } = trpc.superadmin.allDocuments.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Layers} text="Nessun documento presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Nome</th>
            <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Caricato</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.document.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.document.name}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.document.type ?? "—"}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5"><Badge label={row.document.status} color={row.document.status === "final" ? "oklch(60% 0.18 145)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.document.createdAt).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAffiliates() {
  const { data, isLoading, refetch } = trpc.superadmin.affiliateList.useQuery();
  const action = trpc.superadmin.affiliateAction.useMutation({ onSuccess: () => { toast.success("Azione eseguita"); refetch(); } });
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.profiles.length === 0) return <EmptyState icon={Link2} text="Nessun affiliato presente" />;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Affiliati</p>
          <p className="text-2xl font-semibold">{data.profiles.length}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: BORDER }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Conversioni</p>
          <p className="text-2xl font-semibold">{data.stats.totalConversions}</p>
        </div>
        <div className="rounded-xl border p-4" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.3)" }}>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Payout Pending (€)</p>
          <p className="text-2xl font-semibold" style={{ color: GOLD }}>{parseFloat(data.stats.pendingPayouts || "0").toLocaleString("it-IT")}</p>
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
              <th className="text-left px-4 py-2.5 font-medium">Codice</th>
              <th className="text-left px-4 py-2.5 font-medium">Stato</th>
              <th className="text-left px-4 py-2.5 font-medium">Commissione</th>
              <th className="text-left px-4 py-2.5 font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody>
              {data.profiles.map((p: { id: number; affiliateCode: string; status: string; commissionRate?: string | null }) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
                <td className="px-4 py-2.5 font-mono text-xs">{p.affiliateCode}</td>
                <td className="px-4 py-2.5"><Badge label={p.status} color={p.status === "active" ? "oklch(60% 0.18 145)" : p.status === "pending" ? GOLD : "oklch(55% 0.22 25)"} /></td>
                <td className="px-4 py-2.5 text-xs">{p.commissionRate ?? "—"}%</td>
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
  const { data, isLoading } = trpc.superadmin.allWallets.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Wallet} text="Nessun wallet presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Indirizzo</th>
            <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Creato</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.wallet.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.wallet.address}</td>
              <td className="px-4 py-2.5 text-xs">{row.wallet.network}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.wallet.createdAt).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllSmartContracts() {
  const { data, isLoading } = trpc.superadmin.allSmartContracts.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Box} text="Nessun smart contract presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Nome</th>
            <th className="text-left px-4 py-2.5 font-medium">Indirizzo</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.sc.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.sc.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.sc.address}</td>
              <td className="px-4 py-2.5"><Badge label={row.sc.status} color={row.sc.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllDomains() {
  const { data, isLoading } = trpc.superadmin.allDomains.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Globe} text="Nessun dominio presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Dominio</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">SSL</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.domain.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-mono text-xs">{row.domain.domainName}</td>
              <td className="px-4 py-2.5"><Badge label={row.domain.status} color={row.domain.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
              <td className="px-4 py-2.5"><Badge label={row.domain.sslStatus} color={row.domain.sslStatus === "valid" ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllAI() {
  const { data, isLoading } = trpc.superadmin.allAiProjects.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Bot} text="Nessun progetto AI presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Nome</th>
            <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.ai.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.ai.name}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.ai.environment}</td>
              <td className="px-4 py-2.5"><Badge label={row.ai.status} color={row.ai.status === "active" ? "oklch(60% 0.18 145)" : GOLD} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionAllApiKeys() {
  const { data, isLoading } = trpc.superadmin.allApiKeys.useQuery();
  if (isLoading) return <div className="flex items-center justify-center h-40"><Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} /></div>;
  if (!data || data.length === 0) return <EmptyState icon={Key} text="Nessuna API key presente" />;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground" style={{ background: "oklch(9% 0.005 264)", borderColor: BORDER }}>
            <th className="text-left px-4 py-2.5 font-medium">Nome</th>
            <th className="text-left px-4 py-2.5 font-medium">Prefisso</th>
            <th className="text-left px-4 py-2.5 font-medium">Stato</th>
            <th className="text-left px-4 py-2.5 font-medium">Utente</th>
            <th className="text-left px-4 py-2.5 font-medium">Creata</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.key.id} className="border-b last:border-0 hover:bg-[oklch(12%_0.006_264)] transition-colors" style={{ borderColor: BORDER }}>
              <td className="px-4 py-2.5 font-medium">{row.key.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.key.keyPrefix}…</td>
              <td className="px-4 py-2.5"><Badge label={row.key.revokedAt ? "revocata" : "attiva"} color={!row.key.revokedAt ? "oklch(60% 0.18 145)" : "oklch(55% 0.22 25)"} /></td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.userName ?? row.userEmail ?? "—"}</td>
              <td className="px-4 py-2.5 text-xs text-muted-foreground">{new Date(row.key.createdAt).toLocaleDateString("it-IT")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionBlockchain() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Chain ID", value: "24589" },
          { label: "Nome", value: "DYNEROS Chain" },
          { label: "Valuta", value: "DYN" },
          { label: "RPC", value: "https://mainnet.dyneros.com" },
          { label: "Explorer", value: "https://explorer.dyneros.com" },
          { label: "Wallet", value: "https://wallet.dyneros.com" },
        ].map(item => (
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
