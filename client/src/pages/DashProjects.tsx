import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Activity,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  ExternalLink,
  Loader2,
  Users,
  X,
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_LABELS: Record<string, string> = {
  in_progress: "In Corso", completed: "Completato", planning: "Pianificazione", on_hold: "In Pausa",
};
const STATUS_COLORS: Record<string, string> = {
  in_progress: GOLD, completed: "oklch(60% 0.18 145)", planning: "oklch(55% 0.18 220)", on_hold: "oklch(55% 0.05 264)",
};
const PRIORITY_LABELS: Record<string, string> = { high: "Alta", medium: "Media", low: "Bassa", critical: "Critica" };
const PRIORITY_COLORS: Record<string, string> = {
  critical: "oklch(55% 0.22 25)", high: "oklch(60% 0.2 35)", medium: GOLD, low: "oklch(60% 0.18 145)",
};
const TYPE_LABELS: Record<string, string> = {
  blockchain_infrastructure: "Infrastruttura Blockchain", smart_contract: "Smart Contract",
  web_app: "Web Application", ai_system: "Sistema AI",
};

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
      style={{ color, borderColor: `${color}40`, background: `${color}12` }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

type Project = {
  id: string; name: string; type: string; status: string; priority: string;
  startDate: string; eta: string; environment: string; stack: string[]; progress: number;
};

function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  const sc = STATUS_COLORS[project.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[project.priority] || GOLD;
  return (
    <div
      onClick={onClick}
      className="rounded-xl border p-5 cursor-pointer transition-all hover:border-[oklch(68%_0.19_72/0.3)] hover:bg-[oklch(11%_0.006_264)]"
      style={{ background: CARD_BG, borderColor: BORDER }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-[10px] font-mono text-muted-foreground">{project.id}</span>
            <Badge color={sc} label={STATUS_LABELS[project.status] || project.status} />
            <Badge color={pc} label={PRIORITY_LABELS[project.priority] || project.priority} />
          </div>
          <h3 className="text-sm font-semibold truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{TYPE_LABELS[project.type] || project.type}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground">Avanzamento</span>
          <span className="text-[11px] font-semibold" style={{ color: project.progress === 100 ? "oklch(60% 0.18 145)" : GOLD }}>
            {project.progress}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-[oklch(18%_0.008_264)] overflow-hidden">
          <div className="h-full rounded-full transition-all"
            style={{ width: `${project.progress}%`, background: project.progress === 100 ? "oklch(60% 0.18 145)" : GOLD }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3 w-3" />
          <span>ETA: {project.eta}</span>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {project.stack.slice(0, 3).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-[oklch(15%_0.008_264)]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { data, isLoading } = trpc.dashboard.projectDetail.useQuery({ id });
  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
    </div>
  );
  if (!data) return null;

  const sc = STATUS_COLORS[data.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[data.priority] || GOLD;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-muted-foreground">{data.id}</span>
            <Badge color={sc} label={STATUS_LABELS[data.status] || data.status} />
            <Badge color={pc} label={PRIORITY_LABELS[data.priority] || data.priority} />
          </div>
          <h2 className="text-lg font-semibold">{data.name}</h2>
          <p className="text-sm text-muted-foreground">{TYPE_LABELS[data.type] || data.type} · {data.environment}</p>
        </div>
        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Avanzamento globale</span>
          <span className="text-sm font-semibold" style={{ color: GOLD }}>{data.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[oklch(18%_0.008_264)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${data.progress}%`, background: GOLD }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Data Inizio</p>
          <p className="text-sm font-medium">{data.startDate}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">ETA Consegna</p>
          <p className="text-sm font-medium">{data.eta}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Milestone</h3>
        <div className="space-y-2">
          {data.milestones.map((m) => {
            const mc = m.status === "completed" ? "oklch(60% 0.18 145)" : m.status === "in_progress" ? GOLD : "oklch(40% 0.005 264)";
            return (
              <div key={m.id} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ background: "oklch(12% 0.006 264)" }}>
                <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: mc }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.date}</p>
                </div>
                <Badge color={mc} label={STATUS_LABELS[m.status] || m.status} />
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Team Assegnato</h3>
        <div className="flex flex-wrap gap-2">
          {data.team.map((member) => (
            <div key={member.name} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
              <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: GOLD_DIM, color: GOLD }}>{member.avatar}</div>
              <div>
                <p className="text-xs font-medium">{member.name}</p>
                <p className="text-[10px] text-muted-foreground">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">Attività Recenti</h3>
        <div className="space-y-2">
          {data.recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="h-1.5 w-1.5 rounded-full mt-2 shrink-0" style={{ background: GOLD }} />
              <div>
                <p className="text-sm">{a.text}</p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Stack Tecnologico</h3>
        <div className="flex flex-wrap gap-2">
          {data.stack.map(s => (
            <span key={s} className="px-2.5 py-1 rounded-lg text-xs bg-[oklch(15%_0.008_264)]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashProjects() {
  const { data: projects, isLoading } = trpc.dashboard.projects.useQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  const filters = [
    { key: "all", label: "Tutti" },
    { key: "in_progress", label: "In Corso" },
    { key: "planning", label: "Pianificazione" },
    { key: "completed", label: "Completati" },
  ];

  const filtered = projects?.filter(p => filter === "all" || p.status === filter) ?? [];

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {selectedId ? (
          <div>
            <button
              onClick={() => setSelectedId(null)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" />
              Torna ai Progetti
            </button>
            <div className="rounded-xl border p-6" style={{ background: CARD_BG, borderColor: BORDER }}>
              <ProjectDetail id={selectedId} onClose={() => setSelectedId(null)} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">Progetti</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {projects?.length ?? 0} progetti nel tuo workspace
                </p>
              </div>
            </div>

            <div className="flex gap-2 mb-5 flex-wrap">
              {filters.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className="px-3 h-8 rounded-lg text-xs font-medium transition-colors"
                  style={filter === f.key
                    ? { background: GOLD, color: "#000" }
                    : { background: "oklch(12% 0.006 264)", color: "oklch(60% 0.05 264)", border: `1px solid ${BORDER}` }
                  }>
                  {f.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-48">
                <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => (
                  <ProjectCard key={p.id} project={p} onClick={() => setSelectedId(p.id)} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
