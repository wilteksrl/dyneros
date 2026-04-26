import { useState } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, Users, Globe, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const COUNTRIES = ["Italia", "Francia", "Germania", "Spagna", "UK", "USA", "Svizzera", "Belgio", "Olanda", "Austria", "Altro"];
const PAYMENT_METHODS = [
  { value: "bank", label: "Bonifico Bancario / Bank Transfer" },
  { value: "paypal", label: "PayPal" },
  { value: "usdt", label: "USDT (TRC20/ERC20)" },
  { value: "usdc", label: "USDC (ERC20)" },
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "dyn", label: "Token DYN (Dyneros Chain)" },
];

export default function AffiliateApply() {
  const { language } = useLanguage();
  const isIT = language === "it";

  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", companyName: "", taxId: "", vatNumber: "",
    website: "", country: "", promoChannels: "",
    paymentMethod: "bank" as "bank" | "paypal" | "dyn" | "usdt" | "usdc" | "btc" | "eth",
    iban: "", walletAddress: "",
    privacyConsent: false, termsConsent: false,
  });
  const [success, setSuccess] = useState<{ code: string } | null>(null);

  const applyMutation = trpc.affiliate.applyAffiliate.useMutation({
    onSuccess: (data) => {
      setSuccess({ code: data.affiliateCode });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.privacyConsent || !form.termsConsent) {
      toast.error(isIT ? "Devi accettare privacy policy e termini" : "You must accept privacy policy and terms");
      return;
    }
    applyMutation.mutate({
      ...form,
      ipAddress: undefined,
    });
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="max-w-lg w-full text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              {isIT ? "Candidatura inviata!" : "Application submitted!"}
            </h1>
            <p className="text-gray-400 mb-6">
              {isIT
                ? "La tua richiesta è in fase di revisione. Riceverai una conferma via email entro 24-48 ore lavorative."
                : "Your request is under review. You will receive a confirmation by email within 24-48 business hours."}
            </p>
            <div className="bg-[#0d1530] border border-[#00d4ff]/20 rounded-xl p-6 mb-6">
              <div className="text-sm text-gray-400 mb-2">{isIT ? "Il tuo codice affiliato" : "Your affiliate code"}</div>
              <div className="text-2xl font-mono font-bold text-[#00d4ff]">{success.code}</div>
              <div className="text-xs text-gray-500 mt-2">
                {isIT ? "Sarà attivo dopo l'approvazione" : "Will be active after approval"}
              </div>
            </div>
            <Link href="/affiliazione">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <ArrowLeft className="mr-2 w-4 h-4" />
                {isIT ? "Torna al programma affiliazione" : "Back to affiliate program"}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <Link href="/affiliazione" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6">
              <ArrowLeft className="w-4 h-4" />
              {isIT ? "Torna al programma affiliazione" : "Back to affiliate program"}
            </Link>
            <Badge className="mb-4 bg-[#00d4ff]/10 text-[#00d4ff] border border-[#00d4ff]/20">
              {isIT ? "Candidatura Affiliato" : "Affiliate Application"}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">
              {isIT ? "Diventa Affiliato Dyneros" : "Become a Dyneros Affiliate"}
            </h1>
            <p className="text-gray-400">
              {isIT
                ? "Compila il form per candidarti al programma. Approvazione in 24-48 ore."
                : "Fill in the form to apply for the program. Approval in 24-48 hours."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#0d1530] border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#00d4ff]" />
                {isIT ? "Dati Personali / Aziendali" : "Personal / Company Data"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Nome e Cognome *" : "Full Name *"}</Label>
                  <Input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="Mario Rossi" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">Email *</Label>
                  <Input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="mario@example.com" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Telefono" : "Phone"}</Label>
                  <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="+39 333 000 0000" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Azienda" : "Company"}</Label>
                  <Input value={form.companyName} onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="Acme Srl" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Codice Fiscale" : "Tax ID"}</Label>
                  <Input value={form.taxId} onChange={e => setForm(f => ({ ...f, taxId: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="RSSMRA80A01H501Z" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">Partita IVA / VAT</Label>
                  <Input value={form.vatNumber} onChange={e => setForm(f => ({ ...f, vatNumber: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="IT12345678901" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">Website</Label>
                  <Input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="https://example.com" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Paese" : "Country"}</Label>
                  <Select value={form.country} onValueChange={v => setForm(f => ({ ...f, country: v }))}>
                    <SelectTrigger className="bg-[#0a0e1a] border-white/20 text-white">
                      <SelectValue placeholder={isIT ? "Seleziona paese" : "Select country"} />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0d1530] border-white/20">
                      {COUNTRIES.map(c => <SelectItem key={c} value={c} className="text-white hover:bg-white/10">{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-[#0d1530] border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00d4ff]" />
                {isIT ? "Canali Promozionali" : "Promotional Channels"}
              </h2>
              <div>
                <Label className="text-gray-300 mb-1.5 block">
                  {isIT ? "Come intendi promuovere Dyneros?" : "How do you plan to promote Dyneros?"}
                </Label>
                <Textarea
                  value={form.promoChannels}
                  onChange={e => setForm(f => ({ ...f, promoChannels: e.target.value }))}
                  className="bg-[#0a0e1a] border-white/20 text-white resize-none"
                  rows={3}
                  placeholder={isIT ? "Es: LinkedIn, blog tech, eventi, newsletter, referral diretto..." : "E.g.: LinkedIn, tech blog, events, newsletter, direct referral..."}
                />
              </div>
            </div>

            <div className="bg-[#0d1530] border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="font-semibold text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#00d4ff]" />
                {isIT ? "Metodo di Pagamento" : "Payment Method"}
              </h2>
              <div>
                <Label className="text-gray-300 mb-1.5 block">{isIT ? "Preferenza pagamento commissioni" : "Commission payment preference"}</Label>
                <Select value={form.paymentMethod} onValueChange={v => setForm(f => ({ ...f, paymentMethod: v as typeof form.paymentMethod }))}>
                  <SelectTrigger className="bg-[#0a0e1a] border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0d1530] border-white/20">
                    {PAYMENT_METHODS.map(m => <SelectItem key={m.value} value={m.value} className="text-white hover:bg-white/10">{m.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {form.paymentMethod === "bank" && (
                <div>
                  <Label className="text-gray-300 mb-1.5 block">IBAN</Label>
                  <Input value={form.iban} onChange={e => setForm(f => ({ ...f, iban: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="IT60 X054 2811 1010 0000 0123 456" />
                </div>
              )}
              {["usdt", "usdc", "btc", "eth", "dyn"].includes(form.paymentMethod) && (
                <div>
                  <Label className="text-gray-300 mb-1.5 block">{isIT ? "Indirizzo Wallet" : "Wallet Address"}</Label>
                  <Input value={form.walletAddress} onChange={e => setForm(f => ({ ...f, walletAddress: e.target.value }))} className="bg-[#0a0e1a] border-white/20 text-white" placeholder="0x..." />
                </div>
              )}
            </div>

            <div className="bg-[#0d1530] border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="privacy"
                  checked={form.privacyConsent}
                  onCheckedChange={v => setForm(f => ({ ...f, privacyConsent: !!v }))}
                  className="mt-0.5"
                />
                <Label htmlFor="privacy" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                  {isIT
                    ? "Accetto la Privacy Policy di Dyneros Ltd e autorizzo il trattamento dei miei dati personali per la gestione del programma affiliazione."
                    : "I accept Dyneros Ltd's Privacy Policy and authorize the processing of my personal data for the management of the affiliate program."}
                </Label>
              </div>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={form.termsConsent}
                  onCheckedChange={v => setForm(f => ({ ...f, termsConsent: !!v }))}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed cursor-pointer">
                  {isIT
                    ? "Accetto i Termini e Condizioni del Programma Affiliazione Dyneros v1.0, incluse le politiche di commissione e pagamento."
                    : "I accept the Terms and Conditions of the Dyneros Affiliate Program v1.0, including commission and payment policies."}
                </Label>
              </div>
            </div>

            <Button
              type="submit"
              disabled={applyMutation.isPending}
              className="w-full bg-gradient-to-r from-[#00d4ff] to-[#7c3aed] hover:opacity-90 text-white py-4 text-lg font-semibold"
            >
              {applyMutation.isPending
                ? (isIT ? "Invio in corso..." : "Submitting...")
                : (isIT ? "Invia Candidatura" : "Submit Application")}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
