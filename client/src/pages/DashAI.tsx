import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Bot, ExternalLink, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const GOLD = "oklch(68% 0.19 72)";
const GOLD_DIM = "oklch(68% 0.19 72 / 0.12)";
const BORDER = "oklch(20% 0.008 264)";
const CARD_BG = "oklch(10% 0.006 264)";

const STATUS_COLORS: Record<string, string> = {
  in_development: GOLD, delivered: "oklch(60% 0.18 145)", planned: "oklch(55% 0.18 220)",
};

export default function DashAI() {
  const { t } = useLanguage();
  const { data, isLoading } = trpc.dashboard.aiProjects.useQuery();

  const statusLabels: Record<string, string> = {
    in_development: t("ai.development"), delivered: t("status.delivered"), planned: t("status.planned"),
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-semibold">{t("dash.ai")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("ai.workspace_desc")}</p>
        </div>

        <div className="space-y-3">
          {data?.projects.map(project => {
            const sc = STATUS_COLORS[project.status] || "oklch(55% 0.05 264)";
            return (
              <div key={project.id} className="p-5 rounded-xl border transition-all hover:border-[oklch(68%_0.19_72/0.3)]"
                style={{ background: CARD_BG, borderColor: BORDER }}>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: GOLD_DIM }}>
                    <Bot className="h-5 w-5" style={{ color: GOLD }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold">{project.name}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                        style={{ color: sc, borderColor: `${sc}40`, background: `${sc}12` }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: sc }} />
                        {statusLabels[project.status] || project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{t("label.environment")}: {project.environment}</span>
                      <span>·</span>
                      <span>{t("label.created")}: {new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {(!data?.projects || data.projects.length === 0) && (
            <div className="text-center py-16 text-muted-foreground">
              <Bot className="h-8 w-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">{t("ai.empty")}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5" style={{ background: CARD_BG, borderColor: "oklch(68% 0.19 72 / 0.15)" }}>
          <h2 className="text-sm font-semibold mb-2">{t("ai.cta_title")}</h2>
          <p className="text-sm text-muted-foreground mb-4">{t("ai.cta_desc")}</p>
          <button className="flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors"
            style={{ background: GOLD, color: "#000" }}>
            <ExternalLink className="h-3.5 w-3.5" />
            {t("ai.request_project")}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
