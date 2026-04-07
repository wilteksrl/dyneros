import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, Users } from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  available: "oklch(60% 0.18 145)", busy: GOLD, away: "oklch(55% 0.05 264)",
};
const STATUS_LABELS: Record<string, string> = {
  available: "Disponibile", busy: "Occupato", away: "Assente",
};

export default function DashTeam() {
  const { data, isLoading } = trpc.dashboard.teamContacts.useQuery();

  if (isLoading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">Team / Referenti</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Il tuo team dedicato Dyneros</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data?.team.map(member => {
            const sc = STATUS_COLORS[member.status] || "oklch(55% 0.05 264)";
            const initials = member.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
            return (
              <div key={member.email} className="p-4 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
                style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                    style={{ background: GOLD_DIM, color: GOLD }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold">{member.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ color: sc, background: `${sc}12` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc }} />
                        {STATUS_LABELS[member.status] || member.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    <a href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-xs mt-2 transition-colors hover:text-foreground"
                      style={{ color: GOLD }}>
                      <Mail className="h-3 w-3" />
                      {member.email}
                    </a>
                    {member.projects.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {member.projects.map(p => (
                          <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[oklch(15%_0.008_264)] text-muted-foreground font-mono">{p}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.15)" }}>
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4" style={{ color: GOLD }} />
            <h2 className="text-sm font-semibold">Contatti Generali Dyneros</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Supporto Tecnico", email: "support@dyneros.com" },
              { label: "Commerciale", email: "sales@dyneros.com" },
              { label: "Fatturazione", email: "billing@dyneros.com" },
            ].map(c => (
              <div key={c.email} className="p-3 rounded-lg" style={{ background: "oklch(13% 0.006 264)", border: `1px solid ${BORDER}` }}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{c.label}</p>
                <a href={`mailto:${c.email}`} className="text-sm font-medium transition-colors hover:text-foreground" style={{ color: GOLD }}>
                  {c.email}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
