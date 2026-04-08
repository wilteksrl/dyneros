import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  AlertTriangle, CheckCircle, Crown, Loader2, LogOut, Search,
  Shield, ShieldAlert, Trash2, UserCheck, UserX, Users
} from "lucide-react";
import { toast } from "sonner";

const GOLD = "oklch(68% 0.19 72)";
const BG = "oklch(8% 0.006 264)";
const BORDER = "oklch(20% 0.008 264)";

const ROLE_LABELS: Record<string, string> = { user: "Utente", admin: "Admin", superadmin: "SuperAdmin" };
const ROLE_COLORS: Record<string, string> = {
  user: "oklch(60% 0.08 264)",
  admin: "oklch(68% 0.19 72)",
  superadmin: "oklch(75% 0.22 30)",
};

export default function SuperAdmin() {
  const [, setLocation] = useLocation();
  const { data: me } = trpc.auth.me.useQuery();
  const { data: stats, refetch: refetchStats } = trpc.superadmin.stats.useQuery(undefined, { enabled: me?.role === "superadmin" });
  const { data: users, isLoading, refetch } = trpc.superadmin.listUsers.useQuery(undefined, { enabled: me?.role === "superadmin" });
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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

  return (
    <div className="min-h-screen" style={{ background: "#050505", fontFamily: "'Inter', sans-serif" }}>
      {/* Topbar */}
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
          <a href="/dashboard" className="text-sm px-3 h-8 rounded-lg border flex items-center gap-1.5 hover:bg-white/5 transition-colors"
            style={{ borderColor: BORDER }}>
            Dashboard
          </a>
          <button onClick={() => logout.mutate()} className="text-sm px-3 h-8 rounded-lg flex items-center gap-1.5 hover:bg-white/5 transition-colors text-muted-foreground">
            <LogOut className="h-3.5 w-3.5" /> Esci
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="h-5 w-5" style={{ color: "oklch(75% 0.22 30)" }} />
            <h1 className="text-2xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Pannello SuperAdmin</h1>
          </div>
          <p className="text-sm text-muted-foreground">Gestione completa degli utenti, ruoli e accessi della piattaforma Dyneros.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
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

        {/* User table */}
        <div className="rounded-xl border overflow-hidden" style={{ background: BG, borderColor: BORDER }}>
          <div className="px-5 py-4 border-b flex items-center justify-between gap-4" style={{ borderColor: BORDER }}>
            <h2 className="font-semibold text-sm">Gestione Utenti</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cerca per nome, email, azienda..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="h-8 pl-8 pr-4 rounded-lg text-sm border focus:outline-none w-64"
                style={{ background: "oklch(12% 0.006 264)", borderColor: BORDER, color: "inherit" }}
              />
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
                        <select
                          value={u.role}
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
                          <button
                            onClick={() => setConfirmDelete(u.id)}
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
      </div>

      {/* Delete confirm modal */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: "oklch(0% 0 0 / 0.7)" }}>
          <div className="rounded-2xl border p-6 w-full max-w-sm" style={{ background: BG, borderColor: BORDER }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "oklch(55% 0.22 25 / 0.15)" }}>
                <AlertTriangle className="h-5 w-5" style={{ color: "oklch(65% 0.22 25)" }} />
              </div>
              <div>
                <h3 className="font-semibold">Elimina utente</h3>
                <p className="text-xs text-muted-foreground">Questa azione è irreversibile</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Sei sicuro di voler eliminare definitivamente questo utente? Tutti i suoi dati verranno rimossi.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)}
                className="flex-1 h-9 rounded-lg border text-sm hover:bg-white/5 transition-colors" style={{ borderColor: BORDER }}>
                Annulla
              </button>
              <button
                onClick={() => deleteUser.mutate({ userId: confirmDelete })}
                disabled={deleteUser.isPending}
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
