import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Loader2,
  X,
} from "lucide-react";

const GOLD = "oklch(68% 0.19 72)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  in_progress: GOLD, completed: "oklch(60% 0.18 145)", planning: "oklch(55% 0.18 220)", on_hold: "oklch(55% 0.05 264)",
};
const PRIORITY_COLORS: Record<string, string> = {
  critical: "oklch(55% 0.22 25)", high: "oklch(60% 0.2 35)", medium: GOLD, low: "oklch(60% 0.18 145)",
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
  id: number; name: string; type: string; status: string; priority: string;
  startDate: Date | null; eta: Date | null; environment: string; stack?: string[]; progress: number;
  description?: string | null; createdAt: Date;
};

function ProjectCard({ project, onClick, statusLabels, priorityLabels, typeLabels, t }: {
  project: Project; onClick: () => void;
  statusLabels: Record<string, string>; priorityLabels: Record<string, string>; typeLabels: Record<string, string>;
  t: (k: string) => string;
}) {
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
            <span className="text-[10px] font-mono text-muted-foreground">#{project.id}</span>
            <Badge color={sc} label={statusLabels[project.status] || project.status} />
            <Badge color={pc} label={priorityLabels[project.priority] || project.priority} />
          </div>
          <h3 className="text-sm font-semibold truncate">{project.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{typeLabels[project.type] || project.type}</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground">{t("proj.progress")}</span>
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
          <span>ETA: {project.eta ? new Date(project.eta).toLocaleDateString() : "—"}</span>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          {(project.stack ?? []).slice(0, 3).map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] bg-[oklch(15%_0.008_264)]">{s}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ id, onClose, statusLabels, priorityLabels, typeLabels, t }: {
  id: number; onClose: () => void;
  statusLabels: Record<string, string>; priorityLabels: Record<string, string>; typeLabels: Record<string, string>;
  t: (k: string) => string;
}) {
  const { data, isLoading } = trpc.dashboard.projects.useQuery();
  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-5 w-5 animate-spin" style={{ color: GOLD }} />
    </div>
  );
  const project = Array.isArray(data) ? data.find(p => p.id === id) : null;
  if (!project) return (
    <div className="text-center py-12 text-muted-foreground">
      <p>{t("proj.not_found")}</p>
      <button onClick={onClose} className="mt-4 text-sm text-[oklch(68%_0.19_72)] hover:underline">{t("proj.back")}</button>
    </div>
  );

  const sc = STATUS_COLORS[project.status] || "oklch(55% 0.05 264)";
  const pc = PRIORITY_COLORS[project.priority] || GOLD;

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-mono text-muted-foreground">#{project.id}</span>
            <Badge color={sc} label={statusLabels[project.status] || project.status} />
            <Badge color={pc} label={priorityLabels[project.priority] || project.priority} />
          </div>
          <h2 className="text-lg font-semibold">{project.name}</h2>
          <p className="text-sm text-muted-foreground">{typeLabels[project.type] || project.type} · {project.environment}</p>
        </div>
        <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[oklch(15%_0.008_264)] transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{t("proj.progress")}</span>
          <span className="text-sm font-semibold" style={{ color: GOLD }}>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-[oklch(18%_0.008_264)] overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${project.progress}%`, background: GOLD }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t("proj.start_date")}</p>
          <p className="text-sm font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : "—"}</p>
        </div>
        <div className="rounded-lg p-3" style={{ background: "oklch(12% 0.006 264)", border: `1px solid ${BORDER}` }}>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">{t("proj.eta")}</p>
          <p className="text-sm font-medium">{project.eta ? new Date(project.eta).toLocaleDateString() : "—"}</p>
        </div>
      </div>

      {project.description && (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("proj.description")}</h3>
          <p className="text-sm text-muted-foreground">{project.description}</p>
        </div>
      )}

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{t("proj.created_at")}</h3>
        <p className="text-sm">{new Date(project.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

export default function DashProjects() {
  const { t } = useLanguage();
  const { data: projects, isLoading } = trpc.dashboard.projects.useQuery();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const statusLabels: Record<string, string> = {
    in_progress: t("status.in_progress"), completed: t("status.completed"),
    planning: t("status.planning"), on_hold: t("status.on_hold"),
  };
  const priorityLabels: Record<string, string> = {
    high: t("status.high"), medium: t("status.medium"), low: t("status.low"), critical: t("status.critical"),
  };
  const typeLabels: Record<string, string> = {
    blockchain_infrastructure: t("proj.type.blockchain"), smart_contract: t("proj.type.smart_contract"),
    web_app: t("proj.type.web_app"), ai_system: t("proj.type.ai_system"),
  };

  const filters = [
    { key: "all", label: t("common.all") },
    { key: "in_progress", label: t("status.in_progress") },
    { key: "planning", label: t("status.planning") },
    { key: "completed", label: t("status.completed") },
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
              {t("proj.back")}
            </button>
            <div className="rounded-xl border p-6" style={{ background: CARD_BG, borderColor: BORDER }}>
              <ProjectDetail id={selectedId} onClose={() => setSelectedId(null)}
                statusLabels={statusLabels} priorityLabels={priorityLabels} typeLabels={typeLabels} t={t} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold">{t("dash.projects")}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {projects?.length ?? 0} {t("proj.in_workspace")}
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
                  <ProjectCard key={p.id} project={p as Project} onClick={() => setSelectedId(p.id)}
                    statusLabels={statusLabels} priorityLabels={priorityLabels} typeLabels={typeLabels} t={t} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
