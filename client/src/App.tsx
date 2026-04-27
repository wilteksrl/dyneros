import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/superadmin" component={SuperAdmin} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/projects" component={DashProjects} />
      <Route path="/dashboard/tickets" component={DashTickets} />
      <Route path="/dashboard/documents" component={DashDocuments} />
      <Route path="/dashboard/contracts" component={DashContracts} />
      <Route path="/dashboard/invoices" component={DashInvoices} />
      <Route path="/dashboard/blockchain" component={DashBlockchain} />
      <Route path="/dashboard/wallet" component={DashWallet} />
      <Route path="/dashboard/smart-contracts" component={DashSmartContracts} />
      <Route path="/dashboard/domains" component={DashDomains} />
      <Route path="/dashboard/ai" component={DashAI} />
      <Route path="/dashboard/team" component={DashTeam} />
      <Route path="/dashboard/notifications" component={DashNotifications} />
      <Route path="/dashboard/settings" component={DashSettings} />
      <Route path="/dashboard/security" component={DashSecurity} />
      <Route path="/dashboard/api-keys" component={DashApiKeys} />
      <Route path="/dashboard/knowledge-base" component={DashKnowledgeBase} />
      <Route path="/dashboard/email-settings" component={DashEmailSettings} />
      <Route path="/dashboard/affiliate" component={DashAffiliate} />
      <Route path="/affiliazione" component={Affiliazione} />
      <Route path="/affiliazione/candidatura" component={AffiliateApply} />
      <Route path="/affiliazione/sub-affiliato" component={SubAffiliateApply} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/cookie-policy" component={CookiePolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/disclaimer" component={Disclaimer} />
      <Route path="/aml-kyc" component={AmlKyc} />
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
