import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Redirect } from "wouter";
import { trpc } from "@/lib/trpc";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import Terms from "./pages/Terms";
import Disclaimer from "./pages/Disclaimer";
import AmlKyc from "./pages/AmlKyc";
import CookieBanner from "./components/CookieBanner";
import DashProjects from "./pages/DashProjects";
import DashTickets from "./pages/DashTickets";
import DashDocuments from "./pages/DashDocuments";
import DashContracts from "./pages/DashContracts";
import DashInvoices from "./pages/DashInvoices";
import DashBlockchain from "./pages/DashBlockchain";
import DashWallet from "./pages/DashWallet";
import DashSmartContracts from "./pages/DashSmartContracts";
import DashDomains from "./pages/DashDomains";
import DashAI from "./pages/DashAI";
import DashTeam from "./pages/DashTeam";
import DashNotifications from "./pages/DashNotifications";
import DashSettings from "./pages/DashSettings";
import DashSecurity from "./pages/DashSecurity";
import DashApiKeys from "./pages/DashApiKeys";
import DashKnowledgeBase from "./pages/DashKnowledgeBase";
import DashEmailSettings from "./pages/DashEmailSettings";
import Register from "./pages/Register";
import { useReferralTracking } from "./hooks/useReferralTracking";
import Affiliazione from "./pages/Affiliazione";
import AffiliateApply from "./pages/AffiliateApply";
import SubAffiliateApply from "./pages/SubAffiliateApply";
import DashAffiliate from "./pages/DashAffiliate";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SuperAdmin from "./pages/SuperAdmin";
import VerifyEmail from "./pages/VerifyEmail";
import LandingIT from "./pages/LandingIT";
import LandingEN from "./pages/LandingEN";
import MarketingTools from "./pages/MarketingTools";
import EmbedBannerHorizontal from "./pages/EmbedBannerHorizontal";
import EmbedBannerSquare from "./pages/EmbedBannerSquare";
import EmbedBannerSocial from "./pages/EmbedBannerSocial";
import EmbedBannerVertical from "./pages/EmbedBannerVertical";

const GOLD = "oklch(68% 0.19 72)";

function FullPageSpinner() {
  return (
    <div style={{ position: "fixed", inset: 0, background: "oklch(8% 0.006 264)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, border: `3px solid ${GOLD}20`, borderTop: `3px solid ${GOLD}`, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Redirect to="/login" />;
  if (user.role !== "superadmin") return <Redirect to="/dashboard" />;
  return <>{children}</>;
}

function UserRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = trpc.auth.me.useQuery();
  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Redirect to="/login" />;
  if (user.role === "superadmin") return <Redirect to="/superadmin" />;
  return <>{children}</>;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/superadmin">{() => <SuperAdminRoute><SuperAdmin /></SuperAdminRoute>}</Route>
      <Route path="/super-admin">{() => <Redirect to="/superadmin" />}</Route>
      <Route path="/dashboard">{() => <UserRoute><Dashboard /></UserRoute>}</Route>
      <Route path="/dashboard/projects">{() => <UserRoute><DashProjects /></UserRoute>}</Route>
      <Route path="/dashboard/tickets">{() => <UserRoute><DashTickets /></UserRoute>}</Route>
      <Route path="/dashboard/documents">{() => <UserRoute><DashDocuments /></UserRoute>}</Route>
      <Route path="/dashboard/contracts">{() => <UserRoute><DashContracts /></UserRoute>}</Route>
      <Route path="/dashboard/invoices">{() => <UserRoute><DashInvoices /></UserRoute>}</Route>
      <Route path="/dashboard/blockchain">{() => <UserRoute><DashBlockchain /></UserRoute>}</Route>
      <Route path="/dashboard/wallet">{() => <UserRoute><DashWallet /></UserRoute>}</Route>
      <Route path="/dashboard/smart-contracts">{() => <UserRoute><DashSmartContracts /></UserRoute>}</Route>
      <Route path="/dashboard/domains">{() => <UserRoute><DashDomains /></UserRoute>}</Route>
      <Route path="/dashboard/ai">{() => <UserRoute><DashAI /></UserRoute>}</Route>
      <Route path="/dashboard/team">{() => <UserRoute><DashTeam /></UserRoute>}</Route>
      <Route path="/dashboard/notifications">{() => <UserRoute><DashNotifications /></UserRoute>}</Route>
      <Route path="/dashboard/settings">{() => <UserRoute><DashSettings /></UserRoute>}</Route>
      <Route path="/dashboard/security">{() => <UserRoute><DashSecurity /></UserRoute>}</Route>
      <Route path="/dashboard/api-keys">{() => <UserRoute><DashApiKeys /></UserRoute>}</Route>
      <Route path="/dashboard/knowledge-base">{() => <UserRoute><DashKnowledgeBase /></UserRoute>}</Route>
      <Route path="/dashboard/email-settings">{() => <UserRoute><DashEmailSettings /></UserRoute>}</Route>
      <Route path="/dashboard/affiliate">{() => <UserRoute><DashAffiliate /></UserRoute>}</Route>
      <Route path="/affiliazione" component={Affiliazione} />
      <Route path="/affiliazione/candidatura" component={AffiliateApply} />
      <Route path="/affiliazione/sub-affiliato" component={SubAffiliateApply} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/aml-kyc" component={AmlKyc} />
      <Route path="/landing-dyneros" component={LandingIT} />
      <Route path="/en/dyneros-landing" component={LandingEN} />
      <Route path="/marketing-tools" component={MarketingTools} />
      <Route path="/embed/banner-horizontal" component={EmbedBannerHorizontal} />
      <Route path="/embed/banner-square" component={EmbedBannerSquare} />
      <Route path="/embed/banner-social" component={EmbedBannerSocial} />
      <Route path="/embed/banner-vertical" component={EmbedBannerVertical} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useReferralTracking();
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
          <CookieBanner />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
