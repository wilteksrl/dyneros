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
const Table = ({ rows }: { rows: [string, string][] }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm border-collapse">
      <tbody>
        {rows.map(([a, b], i) => (
          <tr key={i} className="border-b border-[oklch(22%_0.008_264)]">
            <td className="py-2 pr-4 font-medium text-foreground align-top w-1/3">{a}</td>
            <td className="py-2 text-muted-foreground align-top">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const sectionsIT = [
  {
    id: "titolare",
    title: "1. Titolare del Trattamento",
    content: (
      <>
        <P>Il Titolare del trattamento dei dati personali è <Strong>Dyneros Ltd</Strong>, società di diritto inglese con sede legale in Inghilterra e Galles (di seguito "Dyneros", "noi" o "la Società").</P>
        <P>Per qualsiasi comunicazione relativa al trattamento dei dati personali, è possibile contattare il Titolare ai seguenti recapiti:</P>
        <Table rows={[
          ["Email", "privacy@dyneros.com"],
          ["Sito web", "https://dyneros.com"],
          ["DPO (Responsabile Protezione Dati)", "dpo@dyneros.com"],
        ]} />
      </>
    ),
  },
  {
    id: "dati-raccolti",
    title: "2. Tipologie di Dati Raccolti",
    content: (
      <>
        <P>Dyneros raccoglie le seguenti categorie di dati personali:</P>
        <P><Strong>2.1 Dati forniti direttamente dall'utente</Strong></P>
        <UL>
          <LI>Nome e cognome, indirizzo email, numero di telefono (in fase di registrazione o contatto commerciale)</LI>
          <LI>Dati aziendali: ragione sociale, partita IVA, indirizzo sede legale</LI>
          <LI>Credenziali di accesso (username, hash della password)</LI>
          <LI>Comunicazioni inviate tramite moduli di contatto o email</LI>
        </UL>
        <P><Strong>2.2 Dati tecnici raccolti automaticamente</Strong></P>
        <UL>
          <LI>Indirizzo IP, tipo di browser, sistema operativo, lingua</LI>
          <LI>Pagine visitate, durata della sessione, URL di provenienza</LI>
          <LI>Cookie e tecnologie di tracciamento (vedi Cookie Policy)</LI>
        </UL>
        <P><Strong>2.3 Dati blockchain (wallet address e dati on-chain)</Strong></P>
        <P>Quando l'utente interagisce con Dyneros Chain, vengono trattati i seguenti dati:</P>
        <UL>
          <LI><Strong>Wallet address</Strong>: indirizzo pubblico del portafoglio blockchain (es. 0x...). Si tratta di un dato pseudonimo ma potenzialmente identificativo se associato ad altri dati.</LI>
          <LI><Strong>Transazioni on-chain</Strong>: hash delle transazioni, importi, timestamp, indirizzi mittente/destinatario registrati immutabilmente sulla blockchain.</LI>
          <LI><Strong>Smart contract interactions</Strong>: chiamate a funzioni, parametri trasmessi, eventi emessi.</LI>
        </UL>
        <P>Si precisa che i dati registrati sulla blockchain sono per natura <Strong>immutabili e pubblicamente accessibili</Strong> tramite l'Explorer (explorer.dyneros.com). L'esercizio del diritto alla cancellazione (art. 17 GDPR) non è tecnicamente applicabile ai dati on-chain; tuttavia Dyneros adotta misure di pseudonimizzazione e non associa automaticamente wallet address a identità reali nei propri sistemi off-chain.</P>
      </>
    ),
  },
  {
    id: "finalita",
    title: "3. Finalità del Trattamento",
    content: (
      <>
        <Table rows={[
          ["Erogazione del servizio", "Fornitura dell'infrastruttura blockchain, gestione degli account, supporto tecnico"],
          ["Adempimenti contrattuali", "Esecuzione del contratto di servizio, fatturazione, gestione dei pagamenti"],
          ["Sicurezza e prevenzione frodi", "Monitoraggio di accessi anomali, protezione dell'infrastruttura, audit trail"],
          ["Obblighi legali", "Adempimento obblighi fiscali, antiriciclaggio (D.Lgs. 231/2007), risposte ad autorità competenti"],
          ["Marketing (con consenso)", "Invio di newsletter, aggiornamenti di prodotto, comunicazioni promozionali"],
          ["Analisi e miglioramento", "Analisi aggregata dell'utilizzo del servizio per migliorare le funzionalità"],
        ]} />
      </>
    ),
  },
  {
    id: "base-giuridica",
    title: "4. Base Giuridica del Trattamento",
    content: (
      <>
        <Table rows={[
          ["Esecuzione di un contratto (art. 6.1.b GDPR)", "Trattamento necessario per erogare i servizi richiesti dall'utente"],
          ["Obbligo legale (art. 6.1.c GDPR)", "Adempimenti fiscali, antiriciclaggio, richieste di autorità"],
          ["Legittimo interesse (art. 6.1.f GDPR)", "Sicurezza dell'infrastruttura, prevenzione frodi, analisi aggregate"],
          ["Consenso (art. 6.1.a GDPR)", "Marketing, cookie non essenziali, profilazione (revocabile in qualsiasi momento)"],
        ]} />
      </>
    ),
  },
  {
    id: "conservazione",
    title: "5. Periodo di Conservazione",
    content: (
      <>
        <Table rows={[
          ["Dati contrattuali e fiscali", "10 anni dalla cessazione del rapporto contrattuale (obbligo di legge)"],
          ["Log di accesso e sicurezza", "12 mesi dalla registrazione"],
          ["Dati di marketing", "Fino alla revoca del consenso o per 24 mesi dall'ultima interazione"],
          ["Dati di supporto", "36 mesi dalla chiusura del ticket"],
          ["Dati on-chain", "Permanenti per natura tecnica della blockchain (immutabili)"],
          ["Cookie analitici", "13 mesi (linee guida Garante 2021)"],
        ]} />
      </>
    ),
  },
  {
    id: "diritti",
    title: "6. Diritti dell'Interessato",
    content: (
      <>
        <P>In conformità al Regolamento UE 2016/679 (GDPR), l'interessato ha diritto di:</P>
        <UL>
          <LI><Strong>Accesso (art. 15)</Strong>: ottenere conferma del trattamento e copia dei dati personali</LI>
          <LI><Strong>Rettifica (art. 16)</Strong>: correggere dati inesatti o incompleti</LI>
          <LI><Strong>Cancellazione (art. 17)</Strong>: ottenere la cancellazione dei dati (nei limiti tecnici per i dati on-chain)</LI>
          <LI><Strong>Limitazione (art. 18)</Strong>: limitare il trattamento in determinate circostanze</LI>
          <LI><Strong>Portabilità (art. 20)</Strong>: ricevere i dati in formato strutturato e leggibile da macchina</LI>
          <LI><Strong>Opposizione (art. 21)</Strong>: opporsi al trattamento basato su legittimo interesse o per finalità di marketing</LI>
          <LI><Strong>Revoca del consenso</Strong>: revocare in qualsiasi momento il consenso prestato, senza pregiudicare la liceità del trattamento precedente</LI>
        </UL>
        <P>Per esercitare i propri diritti, l'interessato può inviare una richiesta a <Strong>privacy@dyneros.com</Strong>. Dyneros risponde entro 30 giorni dalla ricezione della richiesta. In caso di risposta insoddisfacente, è possibile proporre reclamo al <Strong>Garante per la protezione dei dati personali</Strong> (www.garanteprivacy.it) o all'autorità di controllo del paese di residenza.</P>
      </>
    ),
  },
  {
    id: "trasferimenti",
    title: "7. Trasferimenti Internazionali",
    content: (
      <>
        <P>I dati personali sono trattati prevalentemente all'interno dello Spazio Economico Europeo (SEE). Eventuali trasferimenti verso paesi terzi avvengono esclusivamente in presenza di:</P>
        <UL>
          <LI>Decisione di adeguatezza della Commissione Europea (art. 45 GDPR)</LI>
          <LI>Garanzie appropriate tramite Clausole Contrattuali Standard (SCC) approvate dalla Commissione (art. 46 GDPR)</LI>
          <LI>Binding Corporate Rules (BCR) ove applicabili</LI>
        </UL>
        <P>I fornitori di servizi cloud e infrastrutturali utilizzati da Dyneros (es. provider di hosting, CDN) possono avere data center in paesi extra-SEE. In tali casi, Dyneros garantisce l'adozione delle misure di salvaguardia appropriate.</P>
      </>
    ),
  },
  {
    id: "cookie",
    title: "8. Cookie e Tecnologie di Tracciamento",
    content: (
      <>
        <P>Dyneros utilizza cookie e tecnologie similari per il funzionamento del sito e l'analisi dell'utilizzo. Per informazioni dettagliate, si rimanda alla <a href="/cookie-policy" className="text-[oklch(68%_0.19_72)] hover:underline">Cookie Policy</a> separata, conforme alle linee guida del Garante italiano del 10 giugno 2021.</P>
      </>
    ),
  },
  {
    id: "sicurezza",
    title: "9. Misure di Sicurezza",
    content: (
      <>
        <P>Dyneros adotta misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati, perdita, distruzione o divulgazione, tra cui:</P>
        <UL>
          <LI>Crittografia dei dati in transito (TLS 1.3) e a riposo (AES-256)</LI>
          <LI>Autenticazione a più fattori per l'accesso ai sistemi interni</LI>
          <LI>Audit trail e monitoraggio degli accessi</LI>
          <LI>Procedure di gestione degli incidenti di sicurezza (Data Breach Notification entro 72 ore al Garante, art. 33 GDPR)</LI>
          <LI>Formazione periodica del personale</LI>
        </UL>
      </>
    ),
  },
  {
    id: "minori",
    title: "10. Minori",
    content: (
      <>
        <P>I servizi Dyneros sono destinati esclusivamente a persone di età pari o superiore a 18 anni. Dyneros non raccoglie consapevolmente dati personali di minori. Se si ritiene che un minore abbia fornito dati personali, si prega di contattare privacy@dyneros.com per la cancellazione immediata.</P>
      </>
    ),
  },
  {
    id: "modifiche",
    title: "11. Modifiche alla Privacy Policy",
    content: (
      <>
        <P>Dyneros si riserva il diritto di aggiornare la presente Privacy Policy in qualsiasi momento. Le modifiche sostanziali saranno comunicate tramite email o avviso prominente sul sito. La versione aggiornata sarà sempre disponibile alla pagina <a href="/privacy-policy" className="text-[oklch(68%_0.19_72)] hover:underline">dyneros.com/privacy-policy</a>.</P>
      </>
    ),
  },
];

const sectionsEN = [
  {
    id: "controller",
    title: "1. Data Controller",
    content: (
      <>
        <P>The Data Controller is <Strong>Dyneros Ltd</Strong>, a company incorporated under the laws of England and Wales (hereinafter "Dyneros", "we" or "the Company").</P>
        <P>For any communication regarding the processing of personal data, please contact the Controller at:</P>
        <Table rows={[
          ["Email", "privacy@dyneros.com"],
          ["Website", "https://dyneros.com"],
          ["DPO (Data Protection Officer)", "dpo@dyneros.com"],
        ]} />
      </>
    ),
  },
  {
    id: "data-collected",
    title: "2. Types of Data Collected",
    content: (
      <>
        <P>Dyneros collects the following categories of personal data:</P>
        <P><Strong>2.1 Data provided directly by the user</Strong></P>
        <UL>
          <LI>Name, email address, phone number (during registration or commercial contact)</LI>
          <LI>Company data: business name, VAT number, registered address</LI>
          <LI>Access credentials (username, password hash)</LI>
          <LI>Communications sent via contact forms or email</LI>
        </UL>
        <P><Strong>2.2 Technical data collected automatically</Strong></P>
        <UL>
          <LI>IP address, browser type, operating system, language</LI>
          <LI>Pages visited, session duration, referring URL</LI>
          <LI>Cookies and tracking technologies (see Cookie Policy)</LI>
        </UL>
        <P><Strong>2.3 Blockchain data (wallet address and on-chain data)</Strong></P>
        <P>When the user interacts with Dyneros Chain, the following data are processed:</P>
        <UL>
          <LI><Strong>Wallet address</Strong>: public blockchain wallet address (e.g. 0x...). This is pseudonymous data but potentially identifiable when combined with other data.</LI>
          <LI><Strong>On-chain transactions</Strong>: transaction hashes, amounts, timestamps, sender/recipient addresses immutably recorded on the blockchain.</LI>
          <LI><Strong>Smart contract interactions</Strong>: function calls, transmitted parameters, emitted events.</LI>
        </UL>
        <P>Data recorded on the blockchain is by nature <Strong>immutable and publicly accessible</Strong> via the Explorer (explorer.dyneros.com). The right to erasure (Art. 17 GDPR) is not technically applicable to on-chain data; however, Dyneros adopts pseudonymisation measures and does not automatically associate wallet addresses with real identities in its off-chain systems.</P>
      </>
    ),
  },
  {
    id: "purposes",
    title: "3. Purposes of Processing",
    content: (
      <>
        <Table rows={[
          ["Service provision", "Providing blockchain infrastructure, account management, technical support"],
          ["Contractual obligations", "Execution of service agreement, invoicing, payment management"],
          ["Security and fraud prevention", "Monitoring anomalous access, infrastructure protection, audit trail"],
          ["Legal obligations", "Tax compliance, anti-money laundering (D.Lgs. 231/2007), responses to competent authorities"],
          ["Marketing (with consent)", "Sending newsletters, product updates, promotional communications"],
          ["Analytics and improvement", "Aggregate analysis of service usage to improve features"],
        ]} />
      </>
    ),
  },
  {
    id: "legal-basis",
    title: "4. Legal Basis for Processing",
    content: (
      <>
        <Table rows={[
          ["Contract performance (Art. 6.1.b GDPR)", "Processing necessary to provide services requested by the user"],
          ["Legal obligation (Art. 6.1.c GDPR)", "Tax compliance, anti-money laundering, authority requests"],
          ["Legitimate interest (Art. 6.1.f GDPR)", "Infrastructure security, fraud prevention, aggregate analytics"],
          ["Consent (Art. 6.1.a GDPR)", "Marketing, non-essential cookies, profiling (revocable at any time)"],
        ]} />
      </>
    ),
  },
  {
    id: "retention",
    title: "5. Retention Period",
    content: (
      <>
        <Table rows={[
          ["Contractual and tax data", "10 years from termination of contractual relationship (legal obligation)"],
          ["Access and security logs", "12 months from recording"],
          ["Marketing data", "Until consent is withdrawn or 24 months from last interaction"],
          ["Support data", "36 months from ticket closure"],
          ["On-chain data", "Permanent by technical nature of blockchain (immutable)"],
          ["Analytical cookies", "13 months (Italian DPA 2021 guidelines)"],
        ]} />
      </>
    ),
  },
  {
    id: "rights",
    title: "6. Data Subject Rights",
    content: (
      <>
        <P>In accordance with EU Regulation 2016/679 (GDPR), data subjects have the right to:</P>
        <UL>
          <LI><Strong>Access (Art. 15)</Strong>: obtain confirmation of processing and a copy of personal data</LI>
          <LI><Strong>Rectification (Art. 16)</Strong>: correct inaccurate or incomplete data</LI>
          <LI><Strong>Erasure (Art. 17)</Strong>: obtain deletion of data (subject to technical limitations for on-chain data)</LI>
          <LI><Strong>Restriction (Art. 18)</Strong>: restrict processing in certain circumstances</LI>
          <LI><Strong>Portability (Art. 20)</Strong>: receive data in a structured, machine-readable format</LI>
          <LI><Strong>Objection (Art. 21)</Strong>: object to processing based on legitimate interest or for marketing purposes</LI>
          <LI><Strong>Withdrawal of consent</Strong>: withdraw consent at any time without affecting the lawfulness of prior processing</LI>
        </UL>
        <P>To exercise these rights, please send a request to <Strong>privacy@dyneros.com</Strong>. Dyneros responds within 30 days of receiving the request. If unsatisfied, you may lodge a complaint with the <Strong>Italian Data Protection Authority</Strong> (www.garanteprivacy.it) or the supervisory authority of your country of residence.</P>
      </>
    ),
  },
  {
    id: "transfers",
    title: "7. International Transfers",
    content: (
      <>
        <P>Personal data is processed primarily within the European Economic Area (EEA). Any transfers to third countries occur only in the presence of:</P>
        <UL>
          <LI>European Commission adequacy decision (Art. 45 GDPR)</LI>
          <LI>Appropriate safeguards via Standard Contractual Clauses (SCC) approved by the Commission (Art. 46 GDPR)</LI>
          <LI>Binding Corporate Rules (BCR) where applicable</LI>
        </UL>
      </>
    ),
  },
  {
    id: "cookies-en",
    title: "8. Cookies and Tracking Technologies",
    content: (
      <>
        <P>Dyneros uses cookies and similar technologies for website operation and usage analysis. For detailed information, please refer to the separate <a href="/cookie-policy" className="text-[oklch(68%_0.19_72)] hover:underline">Cookie Policy</a>, compliant with the Italian DPA guidelines of 10 June 2021.</P>
      </>
    ),
  },
  {
    id: "security-en",
    title: "9. Security Measures",
    content: (
      <>
        <P>Dyneros implements appropriate technical and organisational measures to protect personal data from unauthorised access, loss, destruction or disclosure, including:</P>
        <UL>
          <LI>Encryption of data in transit (TLS 1.3) and at rest (AES-256)</LI>
          <LI>Multi-factor authentication for internal system access</LI>
          <LI>Audit trail and access monitoring</LI>
          <LI>Data breach management procedures (notification to DPA within 72 hours, Art. 33 GDPR)</LI>
          <LI>Regular staff training</LI>
        </UL>
      </>
    ),
  },
  {
    id: "minors-en",
    title: "10. Minors",
    content: (
      <>
        <P>Dyneros services are intended exclusively for persons aged 18 or over. Dyneros does not knowingly collect personal data from minors. If you believe a minor has provided personal data, please contact privacy@dyneros.com for immediate deletion.</P>
      </>
    ),
  },
  {
    id: "changes-en",
    title: "11. Changes to Privacy Policy",
    content: (
      <>
        <P>Dyneros reserves the right to update this Privacy Policy at any time. Material changes will be communicated via email or prominent notice on the website. The updated version will always be available at <a href="/privacy-policy" className="text-[oklch(68%_0.19_72)] hover:underline">dyneros.com/privacy-policy</a>.</P>
      </>
    ),
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      titleIT="Informativa sulla Privacy"
      titleEN="Privacy Policy"
      lastUpdated="5 Aprile 2025 / April 5, 2025"
      sectionsIT={sectionsIT}
      sectionsEN={sectionsEN}
    />
  );
}
