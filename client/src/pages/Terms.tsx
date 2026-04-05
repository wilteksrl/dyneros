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
const Warning = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-[oklch(68%_0.19_72/0.3)] bg-[oklch(68%_0.19_72/0.05)] rounded-xl p-4 mb-4">
    <p className="text-sm text-[oklch(80%_0.12_72)] leading-relaxed">{children}</p>
  </div>
);

const sectionsIT = [
  {
    id: "accettazione",
    title: "1. Accettazione dei Termini",
    content: (
      <>
        <P>I presenti Termini e Condizioni d'Uso ("Termini") regolano l'accesso e l'utilizzo dei servizi offerti da <Strong>Dyneros Ltd</Strong> ("Dyneros", "noi", "la Società"), inclusi il sito web dyneros.com, la piattaforma Dyneros Chain, l'Explorer, il Wallet e tutti i servizi correlati (collettivamente "Servizi").</P>
        <P>Accedendo o utilizzando i Servizi, l'utente dichiara di aver letto, compreso e accettato integralmente i presenti Termini. Se non si accettano i presenti Termini, è necessario cessare immediatamente l'utilizzo dei Servizi.</P>
        <P>I presenti Termini costituiscono un accordo legalmente vincolante tra l'utente e Dyneros Ltd.</P>
      </>
    ),
  },
  {
    id: "natura-servizio",
    title: "2. Natura del Servizio",
    content: (
      <>
        <Warning>
          IMPORTANTE: Dyneros è esclusivamente una piattaforma tecnologica di infrastruttura blockchain. Dyneros NON è un istituto finanziario, una banca, un exchange di criptovalute, un gestore di fondi, né un fornitore di servizi di investimento. I Servizi Dyneros non costituiscono in alcun modo un'attività finanziaria regolamentata.
        </Warning>
        <P>Dyneros fornisce:</P>
        <UL>
          <LI><Strong>Infrastruttura blockchain enterprise</Strong>: accesso alla rete Dyneros Chain (Chain ID 24589), un layer blockchain privato e permissionato compatibile EVM</LI>
          <LI><Strong>Strumenti di sviluppo</Strong>: SDK, API, documentazione tecnica per la costruzione di applicazioni decentralizzate (dApp)</LI>
          <LI><Strong>Servizi gestiti</Strong>: deployment di nodi, monitoraggio della rete, supporto tecnico enterprise</LI>
          <LI><Strong>Explorer e Wallet</Strong>: strumenti per la visualizzazione delle transazioni on-chain e la gestione degli asset sulla rete Dyneros</LI>
        </UL>
        <P>Dyneros <Strong>non gestisce, custodisce né controlla</Strong> i fondi, gli asset o le chiavi private degli utenti. L'utente mantiene sempre il pieno controllo delle proprie chiavi private (architettura non-custodial).</P>
      </>
    ),
  },
  {
    id: "token-dyn",
    title: "3. Token DYN — Utility Token",
    content: (
      <>
        <Warning>
          Il token DYN è un UTILITY TOKEN. Non rappresenta una partecipazione societaria, un titolo di credito, uno strumento finanziario, un'obbligazione né alcun altro strumento regolamentato dalla normativa finanziaria italiana o europea. Il token DYN non conferisce diritti di voto, dividendi o partecipazione agli utili di Dyneros Ltd.
        </Warning>
        <P>Il token DYN è utilizzato esclusivamente per:</P>
        <UL>
          <LI>Pagamento delle commissioni di transazione (gas fee) sulla rete Dyneros Chain</LI>
          <LI>Accesso a funzionalità premium della piattaforma</LI>
          <LI>Partecipazione ai meccanismi di governance tecnica della rete (ove applicabile)</LI>
          <LI>Incentivazione dei validatori della rete</LI>
        </UL>
        <P>I token ufficiali della rete Dyneros sono: <Strong>DYN</Strong> (valuta nativa), <Strong>dUSD</Strong> (stablecoin), <Strong>dGLD</Strong> (token oro), <Strong>WDYN</Strong> (DYN wrapped). Gli indirizzi contrattuali verificati sono disponibili su docs.dyneros.com.</P>
        <P>Dyneros non garantisce il valore di mercato del token DYN né la sua liquidità. L'acquisto o l'utilizzo del token DYN non costituisce un investimento e non deve essere interpretato come tale.</P>
      </>
    ),
  },
  {
    id: "disclaimer-investimenti",
    title: "4. Disclaimer Investimenti",
    content: (
      <>
        <Warning>
          I SERVIZI DYNEROS NON COSTITUISCONO CONSULENZA FINANZIARIA, DI INVESTIMENTO, LEGALE O FISCALE. NESSUNA INFORMAZIONE FORNITA DA DYNEROS DEVE ESSERE INTERPRETATA COME RACCOMANDAZIONE DI INVESTIMENTO. GLI UTENTI DEVONO CONSULTARE PROFESSIONISTI QUALIFICATI PRIMA DI PRENDERE DECISIONI FINANZIARIE.
        </Warning>
        <P>Il settore blockchain e delle criptovalute è soggetto a elevata volatilità e rischi significativi, tra cui:</P>
        <UL>
          <LI>Perdita totale o parziale del capitale investito</LI>
          <LI>Volatilità estrema dei prezzi degli asset digitali</LI>
          <LI>Rischi regolatori e normativi in evoluzione</LI>
          <LI>Rischi tecnici (bug, vulnerabilità smart contract, attacchi informatici)</LI>
          <LI>Rischi di liquidità</LI>
        </UL>
        <P>Dyneros non è responsabile per perdite finanziarie derivanti dall'utilizzo dei Servizi o dall'interazione con la rete Dyneros Chain.</P>
      </>
    ),
  },
  {
    id: "esclusioni-geografiche",
    title: "5. Restrizioni Geografiche",
    content: (
      <>
        <P>I Servizi Dyneros non sono disponibili per utenti residenti o domiciliati in giurisdizioni in cui l'utilizzo di tecnologie blockchain o asset digitali è vietato o soggetto a restrizioni significative, incluse a titolo esemplificativo:</P>
        <UL>
          <LI>Paesi soggetti a sanzioni internazionali (OFAC, UE, ONU)</LI>
          <LI>Giurisdizioni che vietano esplicitamente l'utilizzo di criptovalute o blockchain</LI>
        </UL>
        <P>Utilizzando i Servizi, l'utente dichiara di non essere residente né di operare da tali giurisdizioni. Dyneros si riserva il diritto di bloccare l'accesso ai Servizi da determinate aree geografiche.</P>
      </>
    ),
  },
  {
    id: "obblighi-utente",
    title: "6. Obblighi dell'Utente",
    content: (
      <>
        <P>L'utente si impegna a:</P>
        <UL>
          <LI>Utilizzare i Servizi esclusivamente per scopi leciti e conformi alla normativa applicabile</LI>
          <LI>Non utilizzare i Servizi per attività di riciclaggio di denaro, finanziamento del terrorismo o altre attività illecite</LI>
          <LI>Non tentare di compromettere la sicurezza, l'integrità o la disponibilità dell'infrastruttura Dyneros</LI>
          <LI>Non distribuire malware, spam o contenuti dannosi tramite la rete Dyneros</LI>
          <LI>Mantenere riservate le proprie credenziali di accesso e chiavi private</LI>
          <LI>Fornire informazioni accurate e aggiornate in fase di registrazione</LI>
        </UL>
      </>
    ),
  },
  {
    id: "limitazioni",
    title: "7. Limitazioni di Responsabilità",
    content: (
      <>
        <P>Nei limiti consentiti dalla legge applicabile, Dyneros non è responsabile per:</P>
        <UL>
          <LI>Perdite dirette, indirette, incidentali, speciali o consequenziali derivanti dall'utilizzo o dall'impossibilità di utilizzo dei Servizi</LI>
          <LI>Perdita di dati, profitti, avviamento o altre perdite immateriali</LI>
          <LI>Interruzioni del servizio dovute a manutenzione, guasti tecnici, attacchi informatici o cause di forza maggiore</LI>
          <LI>Azioni di terze parti che interagiscono con la rete Dyneros Chain</LI>
          <LI>Perdita delle chiavi private dell'utente o accesso non autorizzato al wallet dell'utente</LI>
          <LI>Errori o vulnerabilità in smart contract di terze parti distribuiti sulla rete</LI>
        </UL>
        <P>La responsabilità complessiva di Dyneros nei confronti dell'utente, per qualsiasi causa, è limitata all'importo pagato dall'utente per i Servizi nei 12 mesi precedenti all'evento che ha dato origine alla responsabilità.</P>
      </>
    ),
  },
  {
    id: "proprieta-intellettuale",
    title: "8. Proprietà Intellettuale",
    content: (
      <>
        <P>Tutti i diritti di proprietà intellettuale relativi ai Servizi Dyneros, inclusi software, documentazione, marchi, loghi e contenuti, sono di proprietà esclusiva di Dyneros Ltd o dei suoi licenziatari. È vietata qualsiasi riproduzione, distribuzione o utilizzo non autorizzato.</P>
        <P>Il codice open source distribuito da Dyneros è soggetto alle rispettive licenze open source indicate nei repository ufficiali.</P>
      </>
    ),
  },
  {
    id: "legge-applicabile",
    title: "9. Legge Applicabile e Foro Competente",
    content: (
      <>
        <P>I presenti Termini sono regolati dalla legge inglese (England and Wales). Per qualsiasi controversia derivante dai presenti Termini, le parti si sottopongono alla giurisdizione esclusiva dei tribunali di Inghilterra e Galles, fatti salvi i diritti inderogabili dei consumatori previsti dalla normativa del paese di residenza dell'utente.</P>
      </>
    ),
  },
  {
    id: "modifiche-termini",
    title: "10. Modifiche ai Termini",
    content: (
      <>
        <P>Dyneros si riserva il diritto di modificare i presenti Termini in qualsiasi momento. Le modifiche saranno comunicate con almeno 30 giorni di preavviso tramite email o avviso sul sito. L'utilizzo continuato dei Servizi dopo la data di entrata in vigore delle modifiche costituisce accettazione dei nuovi Termini.</P>
      </>
    ),
  },
];

const sectionsEN = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <>
        <P>These Terms and Conditions of Use ("Terms") govern access to and use of the services offered by <Strong>Dyneros Ltd</Strong> ("Dyneros", "we", "the Company"), including the dyneros.com website, the Dyneros Chain platform, the Explorer, the Wallet and all related services (collectively "Services").</P>
        <P>By accessing or using the Services, the user declares to have read, understood and fully accepted these Terms. If you do not accept these Terms, you must immediately cease using the Services.</P>
      </>
    ),
  },
  {
    id: "service-nature",
    title: "2. Nature of the Service",
    content: (
      <>
        <Warning>
          IMPORTANT: Dyneros is exclusively a blockchain infrastructure technology platform. Dyneros is NOT a financial institution, bank, cryptocurrency exchange, fund manager, or investment services provider. Dyneros Services do not constitute any regulated financial activity.
        </Warning>
        <P>Dyneros provides:</P>
        <UL>
          <LI><Strong>Enterprise blockchain infrastructure</Strong>: access to the Dyneros Chain network (Chain ID 24589), a private permissioned EVM-compatible blockchain layer</LI>
          <LI><Strong>Development tools</Strong>: SDK, API, technical documentation for building decentralised applications (dApps)</LI>
          <LI><Strong>Managed services</Strong>: node deployment, network monitoring, enterprise technical support</LI>
          <LI><Strong>Explorer and Wallet</Strong>: tools for viewing on-chain transactions and managing assets on the Dyneros network</LI>
        </UL>
        <P>Dyneros does <Strong>not manage, custody or control</Strong> users' funds, assets or private keys. Users always maintain full control of their private keys (non-custodial architecture).</P>
      </>
    ),
  },
  {
    id: "dyn-token",
    title: "3. DYN Token — Utility Token",
    content: (
      <>
        <Warning>
          The DYN token is a UTILITY TOKEN. It does not represent a company share, debt instrument, financial instrument, bond or any other instrument regulated by Italian or European financial law. The DYN token does not confer voting rights, dividends or profit participation in Dyneros Ltd.
        </Warning>
        <P>The DYN token is used exclusively for:</P>
        <UL>
          <LI>Payment of transaction fees (gas fees) on the Dyneros Chain network</LI>
          <LI>Access to premium platform features</LI>
          <LI>Participation in network technical governance mechanisms (where applicable)</LI>
          <LI>Network validator incentivisation</LI>
        </UL>
        <P>Dyneros does not guarantee the market value of the DYN token or its liquidity. Purchasing or using the DYN token does not constitute an investment and should not be interpreted as such.</P>
      </>
    ),
  },
  {
    id: "investment-disclaimer",
    title: "4. Investment Disclaimer",
    content: (
      <>
        <Warning>
          DYNEROS SERVICES DO NOT CONSTITUTE FINANCIAL, INVESTMENT, LEGAL OR TAX ADVICE. NO INFORMATION PROVIDED BY DYNEROS SHOULD BE INTERPRETED AS AN INVESTMENT RECOMMENDATION. USERS MUST CONSULT QUALIFIED PROFESSIONALS BEFORE MAKING FINANCIAL DECISIONS.
        </Warning>
        <P>The blockchain and cryptocurrency sector is subject to high volatility and significant risks, including total or partial loss of invested capital, extreme price volatility, evolving regulatory risks, technical risks (bugs, smart contract vulnerabilities, cyberattacks), and liquidity risks.</P>
      </>
    ),
  },
  {
    id: "geo-restrictions",
    title: "5. Geographic Restrictions",
    content: (
      <>
        <P>Dyneros Services are not available to users resident or domiciled in jurisdictions where the use of blockchain technologies or digital assets is prohibited or subject to significant restrictions, including jurisdictions subject to international sanctions (OFAC, EU, UN) and jurisdictions that explicitly prohibit the use of cryptocurrencies or blockchain.</P>
        <P>By using the Services, the user declares that they are not resident or operating from such jurisdictions.</P>
      </>
    ),
  },
  {
    id: "user-obligations",
    title: "6. User Obligations",
    content: (
      <>
        <P>The user undertakes to use the Services exclusively for lawful purposes, not to use the Services for money laundering, terrorist financing or other illegal activities, not to attempt to compromise the security or integrity of Dyneros infrastructure, to maintain the confidentiality of their access credentials and private keys, and to provide accurate information during registration.</P>
      </>
    ),
  },
  {
    id: "liability",
    title: "7. Limitation of Liability",
    content: (
      <>
        <P>To the extent permitted by applicable law, Dyneros is not liable for direct, indirect, incidental, special or consequential losses arising from the use or inability to use the Services, loss of data, profits or goodwill, service interruptions, actions of third parties interacting with the Dyneros Chain network, or loss of user private keys.</P>
        <P>Dyneros's total liability to the user, for any cause, is limited to the amount paid by the user for the Services in the 12 months preceding the event giving rise to liability.</P>
      </>
    ),
  },
  {
    id: "ip",
    title: "8. Intellectual Property",
    content: (
      <>
        <P>All intellectual property rights relating to Dyneros Services, including software, documentation, trademarks, logos and content, are the exclusive property of Dyneros Ltd or its licensors. Any unauthorised reproduction, distribution or use is prohibited.</P>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "9. Governing Law and Jurisdiction",
    content: (
      <>
        <P>These Terms are governed by the laws of England and Wales. For any dispute arising from these Terms, the parties submit to the exclusive jurisdiction of the courts of England and Wales, subject to the mandatory rights of consumers under the law of the user's country of residence.</P>
      </>
    ),
  },
  {
    id: "changes",
    title: "10. Changes to Terms",
    content: (
      <>
        <P>Dyneros reserves the right to modify these Terms at any time. Changes will be communicated with at least 30 days' notice via email or notice on the website. Continued use of the Services after the effective date of changes constitutes acceptance of the new Terms.</P>
      </>
    ),
  },
];

export default function Terms() {
  return (
    <LegalPage
      titleIT="Termini e Condizioni d'Uso"
      titleEN="Terms and Conditions of Use"
      lastUpdated="5 Aprile 2025 / April 5, 2025"
      sectionsIT={sectionsIT}
      sectionsEN={sectionsEN}
    />
  );
}
