import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, TrendingUp, Wallet, Copy, Check, Clock,
  DollarSign, Award, XCircle, Loader2, ChevronRight, Link2,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    approved: { label: "Approved", className: "bg-green-500/10 text-green-400 border-green-500/20" },
    rejected: { label: "Rejected", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    suspended: { label: "Suspended", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
    converted: { label: "Converted", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    expired: { label: "Expired", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
    processing: { label: "Processing", className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    paid: { label: "Paid", className: "bg-green-500/10 text-green-400 border-green-500/20" },
    failed: { label: "Failed", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    invoiced: { label: "Invoiced", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    cancelled: { label: "Cancelled", className: "bg-gray-500/10 text-gray-400 border-gray-500/20" },
  };
  const s = map[status] ?? { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
  return <Badge className={s.className}>{s.label}</Badge>;
}

export default function DashAffiliate() {
  const { language } = useLanguage();
  const isIT = language === "it";
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "leads" | "conversions" | "payouts" | "subaffiliates">("overview");

  const dashQuery = trpc.affiliate.myDashboard.useQuery();
  const data = dashQuery.data;
  const profile = data?.profile;
  const kpi = data?.kpi;

  function copyCode() {
    if (!profile?.affiliateCode) return;
    navigator.clipboard.writeText(profile.affiliateCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success(isIT ? "Codice copiato!" : "Code copied!");
  }

  function copyLink() {
    if (!profile?.affiliateCode) return;
    const link = `${window.location.origin}?ref=${profile.affiliateCode}`;
    navigator.clipboard.writeText(link);
    toast.success(isIT ? "Link copiato!" : "Link copied!");
  }

  if (dashQuery.isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#00d4ff]" />
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-[#00d4ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-[#00d4ff]" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isIT ? "Non sei ancora un affiliato" : "You are not an affiliate yet"}
          </h1>
          <p className="text-gray-400 mb-8">
            {isIT
              ? "Candidati al programma affiliazione Dyneros per iniziare a guadagnare commissioni ricorrenti."
              : "Apply to the Dyneros affiliate program to start earning recurring commissions."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/affiliazione/candidatura">
              <Button className="bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white">
                {isIT ? "Candidati come Affiliato" : "Apply as Affiliate"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/affiliazione/sub-affiliato">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                {isIT ? "Candidati come Sub-Affiliato" : "Apply as Sub-Affiliate"}
              </Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (profile.status === "pending") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isIT ? "Candidatura in revisione" : "Application under review"}
          </h1>
          <p className="text-gray-400 mb-4">
            {isIT
              ? "La tua candidatura è in fase di revisione. Riceverai una conferma via email entro 24-48 ore lavorative."
              : "Your application is under review. You will receive a confirmation by email within 24-48 business hours."}
          </p>
          <div className="bg-[#0d1530] border border-yellow-500/20 rounded-xl p-4 inline-block">
            <div className="text-sm text-gray-400 mb-1">{isIT ? "Il tuo codice (in attesa)" : "Your code (pending)"}</div>
            <div className="text-xl font-mono font-bold text-yellow-400">{profile.affiliateCode}</div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (profile.status === "rejected") {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-4">
            {isIT ? "Candidatura non approvata" : "Application not approved"}
          </h1>
          <p className="text-gray-400 mb-8">
            {isIT
              ? "La tua candidatura non è stata approvata. Contatta il supporto per maggiori informazioni."
              : "Your application was not approved. Contact support for more information."}
          </p>
          <Link href="/dashboard/ticket">
            <Button className="bg-[#00d4ff] hover:bg-[#00d4ff]/90 text-black">
              {isIT ? "Contatta il Supporto" : "Contact Support"}
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: "overview" as const, label: isIT ? "Panoramica" : "Overview" },
    { id: "leads" as const, label: isIT ? "Lead / Click" : "Leads / Clicks" },
    { id: "conversions" as const, label: isIT ? "Conversioni" : "Conversions" },
    { id: "payouts" as const, label: isIT ? "Pagamenti" : "Payouts" },
    { id: "subaffiliates" as const, label: isIT ? "Sub-Affiliati" : "Sub-Affiliates" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{isIT ? "Pannello Affiliato" : "Affiliate Panel"}</h1>
            <p className="text-gray-400 text-sm mt-1">
              {isIT ? "Monitora le tue performance e i tuoi guadagni" : "Monitor your performance and earnings"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={profile.status} />
            <Badge className="bg-[#7c3aed]/10 text-[#7c3aed] border-[#7c3aed]/20">{profile.type}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0d1530] border border-[#00d4ff]/20 rounded-xl p-5">
            <div className="text-sm text-gray-400 mb-2">{isIT ? "Il tuo codice affiliato" : "Your affiliate code"}</div>
            <div className="flex items-center gap-3">
              <div className="text-2xl font-mono font-bold text-[#00d4ff] flex-1">{profile.affiliateCode}</div>
              <Button size="sm" variant="outline" className="border-[#00d4ff]/30 text-[#00d4ff] hover:bg-[#00d4ff]/10" onClick={copyCode}>
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
          <div className="bg-[#0d1530] border border-white/10 rounded-xl p-5">
            <div className="text-sm text-gray-400 mb-2">{isIT ? "Il tuo link referral" : "Your referral link"}</div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-300 flex-1 truncate font-mono">
                {window.location.origin}?ref={profile.affiliateCode}
              </div>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={copyLink}>
                <Link2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {kpi && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: isIT ? "Click totali" : "Total clicks", value: kpi.clicks, color: "text-[#00d4ff]" },
              { icon: TrendingUp, label: isIT ? "Lead" : "Leads", value: kpi.leads, color: "text-blue-400" },
              { icon: DollarSign, label: isIT ? "Commissioni totali" : "Total commissions", value: `€ ${kpi.totalCommission.toFixed(2)}`, color: "text-[#7c3aed]" },
              { icon: Wallet, label: isIT ? "Pagato" : "Paid out", value: `€ ${kpi.paidCommission.toFixed(2)}`, color: "text-green-400" },
            ].map((item, i) => (
              <Card key={i} className="bg-[#0d1530] border-white/10">
                <CardContent className="p-5">
                  <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
                  <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
                  <div className="text-xs text-gray-400">{item.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="flex gap-1 border-b border-white/10 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "text-[#00d4ff] border-b-2 border-[#00d4ff]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && kpi && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-[#0d1530] border-white/10">
              <CardHeader>
                <CardTitle className="text-base">{isIT ? "Performance" : "Performance"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: isIT ? "Click totali" : "Total clicks", value: kpi.clicks },
                  { label: isIT ? "Lead generati" : "Leads generated", value: kpi.leads },
                  { label: isIT ? "Conversioni" : "Conversions", value: kpi.conversions },
                  { label: isIT ? "Override guadagnati" : "Override earned", value: `€ ${kpi.overrideEarned.toFixed(2)}` },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className="font-semibold text-white">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-[#0d1530] border-white/10">
              <CardHeader>
                <CardTitle className="text-base">{isIT ? "Saldo commissioni" : "Commission balance"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: isIT ? "Commissioni totali" : "Total commissions", value: `€ ${kpi.totalCommission.toFixed(2)}`, color: "text-[#00d4ff]" },
                  { label: isIT ? "Già pagato" : "Already paid", value: `€ ${kpi.paidCommission.toFixed(2)}`, color: "text-green-400" },
                  { label: isIT ? "In attesa" : "Pending", value: `€ ${(kpi.totalCommission - kpi.paidCommission).toFixed(2)}`, color: "text-yellow-400" },
                  { label: isIT ? "Sub-affiliati" : "Sub-affiliates", value: data?.subAffiliates?.length ?? 0, color: "text-[#7c3aed]" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="bg-[#0d1530] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold">{isIT ? "Lead e click" : "Leads and clicks"}</h3>
            </div>
            {!data?.leads.length ? (
              <div className="text-center py-12 text-gray-400">
                {isIT ? "Nessun lead ancora. Condividi il tuo link!" : "No leads yet. Share your link!"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">IP</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">UTM Source</th>
                      <th className="text-center px-6 py-3 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Data" : "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.leads.map((r) => (
                      <tr key={r.id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-6 py-3 font-mono text-sm text-gray-300">{r.email ?? "—"}</td>
                        <td className="px-6 py-3 text-sm text-gray-300">{r.source ?? "—"}</td>
                        <td className="px-6 py-3 text-center"><StatusBadge status={r.status} /></td>
                        <td className="px-6 py-3 text-right text-sm text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "conversions" && (
          <div className="bg-[#0d1530] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold">{isIT ? "Le tue conversioni" : "Your conversions"}</h3>
            </div>
            {!data?.conversions.length ? (
              <div className="text-center py-12 text-gray-400">
                {isIT ? "Nessuna conversione ancora." : "No conversions yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Servizio" : "Service"}</th>
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Valore" : "Value"}</th>
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Commissione" : "Commission"}</th>
                      <th className="text-center px-6 py-3 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Data" : "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.conversions.map((c) => (
                      <tr key={c.id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-6 py-3 text-sm text-gray-300">{c.serviceCategory ?? "—"}</td>
                        <td className="px-6 py-3 text-right text-sm font-medium">€ {Number(c.contractValueNet).toFixed(2)}</td>
                        <td className="px-6 py-3 text-right text-sm font-medium text-[#00d4ff]">€ {Number(c.commissionAmount).toFixed(2)}</td>
                        <td className="px-6 py-3 text-center"><StatusBadge status={c.status} /></td>
                        <td className="px-6 py-3 text-right text-sm text-gray-400">
                          {new Date(c.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "payouts" && (
          <div className="bg-[#0d1530] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10">
              <h3 className="font-semibold">{isIT ? "Storico pagamenti" : "Payment history"}</h3>
            </div>
            {!data?.payouts.length ? (
              <div className="text-center py-12 text-gray-400">
                {isIT ? "Nessun pagamento ancora." : "No payments yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Importo" : "Amount"}</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Metodo" : "Method"}</th>
                      <th className="text-center px-6 py-3 text-gray-400 text-sm font-medium">Status</th>
                      <th className="text-right px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Data" : "Date"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.payouts.map((p) => (
                      <tr key={p.id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-6 py-3 text-right font-bold text-[#00d4ff]">€ {Number(p.amount).toFixed(2)}</td>
                        <td className="px-6 py-3 text-sm text-gray-300 uppercase">{p.method}</td>
                        <td className="px-6 py-3 text-center"><StatusBadge status={p.status} /></td>
                        <td className="px-6 py-3 text-right text-sm text-gray-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "subaffiliates" && (
          <div className="bg-[#0d1530] border border-white/10 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-semibold">{isIT ? "I tuoi sub-affiliati" : "Your sub-affiliates"}</h3>
              <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10" onClick={() => {
                const link = `${window.location.origin}/affiliazione/sub-affiliato?parent=${profile.affiliateCode}`;
                navigator.clipboard.writeText(link);
                toast.success(isIT ? "Link invito copiato!" : "Invite link copied!");
              }}>
                <Copy className="w-4 h-4 mr-2" />
                {isIT ? "Copia link invito" : "Copy invite link"}
              </Button>
            </div>
            {!data?.subAffiliates?.length ? (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  {isIT ? "Nessun sub-affiliato ancora. Condividi il tuo link invito!" : "No sub-affiliates yet. Share your invite link!"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Nome" : "Name"}</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm font-medium">{isIT ? "Codice" : "Code"}</th>
                      <th className="text-center px-6 py-3 text-gray-400 text-sm font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.subAffiliates.map((sa) => (
                      <tr key={sa.id} className="border-b border-white/5 hover:bg-white/3">
                        <td className="px-6 py-3 text-sm text-gray-300">{sa.fullName}</td>
                        <td className="px-6 py-3 font-mono text-sm text-[#7c3aed]">{sa.affiliateCode}</td>
                        <td className="px-6 py-3 text-center"><StatusBadge status={sa.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
