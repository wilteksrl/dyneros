import LegalPage from "@/components/LegalPage";

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm text-muted-foreground leading-relaxed mb-3">{children}</p>
);
const UL = ({ children }: { children: React.ReactNode }) => (
  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground mb-3 pl-2">{children}</ul>
);
const LI = ({ children }: { children: React.ReactNode }) => <li className="leading-relaxed">{children}</li>;
const Strong = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-foreground font-semibold">{children}</strong>
);
const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="border-b border-[oklch(22%_0.008_264)]">
          {headers.map((h) => (
            <th key={h} className="py-2 pr-4 text-left font-semibold text-foreground">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b border-[oklch(22%_0.008_264/0.5)]">
            {row.map((cell, j) => (
              <td key={j} className="py-2 pr-4 text-muted-foreground align-top">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const sectionsIT = [
  {
    id: "cosa-sono",
    title: "1. Cosa sono i Cookie",
    content: (
      <>
        <P>I cookie sono piccoli file di testo che i siti web visitati dall'utente inviano al suo terminale (computer, tablet, smartphone), dove vengono memorizzati per essere poi ritrasmessi agli stessi siti alla visita successiva. I cookie permettono al sito di riconoscere il browser dell'utente e di memorizzare alcune informazioni sulle sue preferenze o azioni passate.</P>
        <P>Oltre ai cookie, Dyneros può utilizzare tecnologie similari come pixel tag, web beacon, local storage e fingerprinting, che operano in modo analogo ai cookie.</P>
      </>
    ),
  },
  {
    id: "tipologie",
    title: "2. Tipologie di Cookie Utilizzati",
    content: (
      <>
        <P><Strong>2.1 Cookie Tecnici Necessari</Strong> — Non richiedono consenso (art. 122 D.Lgs. 196/2003)</P>
        <Table
          headers={["Nome", "Finalità", "Durata"]}
          rows={[
            ["session_token", "Autenticazione e mantenimento della sessione utente", "Sessione"],
            ["csrf_token", "Protezione contro attacchi Cross-Site Request Forgery", "Sessione"],
            ["cookie_consent", "Memorizzazione delle preferenze cookie dell'utente", "12 mesi"],
            ["lang_pref", "Memorizzazione della lingua preferita dall'utente", "12 mesi"],
          ]}
        />
        <P><Strong>2.2 Cookie Analitici</Strong> — Richiedono consenso se non anonimizzati</P>
        <Table
          headers={["Nome", "Fornitore", "Finalità", "Durata"]}
          rows={[
            ["_umami", "Umami Analytics (self-hosted)", "Analisi aggregata del traffico, pagine visitate, durata sessione. Nessun dato personale trasmesso a terzi.", "13 mesi"],
          ]}
        />
        <P><Strong>2.3 Cookie di Terze Parti</Strong> — Richiedono consenso esplicito</P>
        <P>Dyneros non utilizza attualmente cookie di terze parti per finalità pubblicitarie o di profilazione. Eventuali integrazioni future saranno comunicate tramite aggiornamento della presente Cookie Policy e richiesta di nuovo consenso.</P>
      </>
    ),
  },
  {
    id: "consenso",
    title: "3. Consenso e Banner Cookie",
    content: (
      <>
        <P>In conformità alle <Strong>Linee Guida del Garante per la protezione dei dati personali del 10 giugno 2021</Strong> (provvedimento n. 231), Dyneros adotta le seguenti misure:</P>
        <UL>
          <LI>Il banner cookie appare al primo accesso al sito e richiede un'azione positiva dell'utente (no scroll-as-consent)</LI>
          <LI>Il banner offre opzioni chiare: "Accetta tutti", "Rifiuta tutti" e "Personalizza"</LI>
          <LI>I cookie non essenziali vengono attivati solo dopo il consenso esplicito</LI>
          <LI>Il consenso è revocabile in qualsiasi momento tramite il link "Gestisci Cookie" nel footer</LI>
          <LI>Le preferenze vengono memorizzate per 12 mesi, dopodiché viene richiesto nuovo consenso</LI>
        </UL>
      </>
    ),
  },
  {
    id: "gestione",
    title: "4. Come Gestire i Cookie",
    content: (
      <>
        <P>L'utente può gestire le proprie preferenze cookie nei seguenti modi:</P>
        <P><Strong>Tramite il pannello preferenze del sito</Strong>: clicca su "Gestisci Cookie" nel footer del sito per modificare le tue preferenze in qualsiasi momento.</P>
        <P><Strong>Tramite le impostazioni del browser</Strong>: la maggior parte dei browser consente di controllare i cookie tramite le impostazioni. Di seguito i link alle guide dei principali browser:</P>
        <UL>
          <LI><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Google Chrome</a></LI>
          <LI><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Mozilla Firefox</a></LI>
          <LI><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Apple Safari</a></LI>
          <LI><a href="https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Microsoft Edge</a></LI>
        </UL>
        <P>Si avverte che la disabilitazione dei cookie tecnici necessari potrebbe compromettere il corretto funzionamento del sito e dei servizi Dyneros.</P>
      </>
    ),
  },
  {
    id: "aggiornamenti",
    title: "5. Aggiornamenti",
    content: (
      <>
        <P>La presente Cookie Policy può essere aggiornata in qualsiasi momento. La data dell'ultimo aggiornamento è indicata in cima alla pagina. In caso di modifiche sostanziali, verrà nuovamente visualizzato il banner di consenso.</P>
        <P>Per ulteriori informazioni sul trattamento dei dati personali, si rimanda alla <a href="/privacy-policy" className="text-[oklch(68%_0.19_72)] hover:underline">Privacy Policy</a> completa. Per domande, contattare: <Strong>privacy@dyneros.com</Strong></P>
      </>
    ),
  },
];

const sectionsEN = [
  {
    id: "what-are",
    title: "1. What are Cookies",
    content: (
      <>
        <P>Cookies are small text files that websites send to the user's device (computer, tablet, smartphone), where they are stored and then retransmitted to the same websites on subsequent visits. Cookies allow the website to recognise the user's browser and store some information about their preferences or past actions.</P>
        <P>In addition to cookies, Dyneros may use similar technologies such as pixel tags, web beacons, local storage and fingerprinting, which operate similarly to cookies.</P>
      </>
    ),
  },
  {
    id: "types",
    title: "2. Types of Cookies Used",
    content: (
      <>
        <P><Strong>2.1 Strictly Necessary Technical Cookies</Strong> — No consent required</P>
        <Table
          headers={["Name", "Purpose", "Duration"]}
          rows={[
            ["session_token", "User authentication and session maintenance", "Session"],
            ["csrf_token", "Protection against Cross-Site Request Forgery attacks", "Session"],
            ["cookie_consent", "Storing user cookie preferences", "12 months"],
            ["lang_pref", "Storing user's preferred language", "12 months"],
          ]}
        />
        <P><Strong>2.2 Analytical Cookies</Strong> — Require consent if not anonymised</P>
        <Table
          headers={["Name", "Provider", "Purpose", "Duration"]}
          rows={[
            ["_umami", "Umami Analytics (self-hosted)", "Aggregate traffic analysis, pages visited, session duration. No personal data transmitted to third parties.", "13 months"],
          ]}
        />
        <P><Strong>2.3 Third-Party Cookies</Strong> — Require explicit consent</P>
        <P>Dyneros does not currently use third-party cookies for advertising or profiling purposes. Any future integrations will be communicated via an update to this Cookie Policy and a request for new consent.</P>
      </>
    ),
  },
  {
    id: "consent",
    title: "3. Consent and Cookie Banner",
    content: (
      <>
        <P>In accordance with the <Strong>Italian Data Protection Authority Guidelines of 10 June 2021</Strong> (provision no. 231), Dyneros adopts the following measures:</P>
        <UL>
          <LI>The cookie banner appears on first access to the site and requires a positive action from the user (no scroll-as-consent)</LI>
          <LI>The banner offers clear options: "Accept all", "Reject all" and "Customise"</LI>
          <LI>Non-essential cookies are activated only after explicit consent</LI>
          <LI>Consent can be revoked at any time via the "Manage Cookies" link in the footer</LI>
          <LI>Preferences are stored for 12 months, after which new consent is requested</LI>
        </UL>
      </>
    ),
  },
  {
    id: "manage",
    title: "4. How to Manage Cookies",
    content: (
      <>
        <P>Users can manage their cookie preferences in the following ways:</P>
        <P><Strong>Via the site preferences panel</Strong>: click "Manage Cookies" in the site footer to modify your preferences at any time.</P>
        <P><Strong>Via browser settings</Strong>: most browsers allow you to control cookies through settings. Links to guides for major browsers:</P>
        <UL>
          <LI><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Google Chrome</a></LI>
          <LI><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Mozilla Firefox</a></LI>
          <LI><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Apple Safari</a></LI>
          <LI><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[oklch(68%_0.19_72)] hover:underline">Microsoft Edge</a></LI>
        </UL>
      </>
    ),
  },
  {
    id: "updates",
    title: "5. Updates",
    content: (
      <>
        <P>This Cookie Policy may be updated at any time. The date of the last update is indicated at the top of the page. In the event of material changes, the consent banner will be displayed again.</P>
        <P>For further information on the processing of personal data, please refer to the full <a href="/privacy-policy" className="text-[oklch(68%_0.19_72)] hover:underline">Privacy Policy</a>. For questions, contact: <Strong>privacy@dyneros.com</Strong></P>
      </>
    ),
  },
];

export default function CookiePolicy() {
  return (
    <LegalPage
      titleIT="Cookie Policy"
      titleEN="Cookie Policy"
      lastUpdated="5 Aprile 2025 / April 5, 2025"
      sectionsIT={sectionsIT}
      sectionsEN={sectionsEN}
    />
  );
}
