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
const Box = ({ color, children }: { color: "gold" | "green" | "red"; children: React.ReactNode }) => {
  const styles = {
    gold: "border-[oklch(68%_0.19_72/0.4)] bg-[oklch(68%_0.19_72/0.06)] text-[oklch(80%_0.12_72)]",
    green: "border-[oklch(60%_0.18_145/0.4)] bg-[oklch(60%_0.18_145/0.06)] text-[oklch(75%_0.12_145)]",
    red: "border-[oklch(55%_0.22_25/0.4)] bg-[oklch(55%_0.22_25/0.06)] text-[oklch(75%_0.15_25)]",
  }[color];
  return (
    <div className={`border rounded-xl p-5 mb-4 ${styles}`}>
      <p className="text-sm leading-relaxed font-medium">{children}</p>
    </div>
  );
};

const sectionsIT = [
  {
    id: "natura-tecnologica",
    title: "1. Natura Tecnologica di Dyneros",
    content: (
      <>
        <Box color="gold">
          Dyneros Ltd è una società tecnologica che sviluppa e gestisce infrastruttura blockchain enterprise. Dyneros NON è e NON si qualifica come: istituto di credito, istituto di pagamento, intermediario finanziario, gestore di fondi di investimento, exchange di criptovalute, fornitore di servizi di portafoglio digitale custodial, né come qualsiasi altro soggetto regolamentato dalla normativa finanziaria italiana (TUB, TUF, D.Lgs. 231/2007) o europea (MiCA, MiFID II, DORA).
        </Box>
        <P>Dyneros fornisce esclusivamente <Strong>software, infrastruttura tecnica e strumenti di sviluppo</Strong>. Qualsiasi utilizzo dei Servizi Dyneros per finalità finanziarie è di esclusiva responsabilità dell'utente.</P>
      </>
    ),
  },
  {
    id: "no-consulenza",
    title: "2. Nessuna Consulenza Finanziaria",
    content: (
      <>
        <Box color="red">
          NESSUNA INFORMAZIONE, DATO, ANALISI, DOCUMENTAZIONE O COMUNICAZIONE FORNITA DA DYNEROS, DAI SUOI DIPENDENTI, COLLABORATORI O PARTNER COSTITUISCE CONSULENZA FINANZIARIA, DI INVESTIMENTO, LEGALE O FISCALE AI SENSI DELLA NORMATIVA VIGENTE.
        </Box>
        <P>In particolare:</P>
        <UL>
          <LI>Dyneros non fornisce raccomandazioni di investimento in asset digitali o token</LI>
          <LI>Dyneros non effettua previsioni sul valore futuro del token DYN o di altri asset</LI>
          <LI>Le informazioni tecniche sulla rete Dyneros Chain non costituiscono promozione finanziaria</LI>
          <LI>I dati di performance della rete (TPS, uptime, ecc.) sono indicatori tecnici, non rendimenti finanziari</LI>
        </UL>
        <P>Gli utenti devono consultare un consulente finanziario, legale e fiscale indipendente e qualificato prima di prendere qualsiasi decisione relativa all'utilizzo di asset digitali o tecnologie blockchain.</P>
      </>
    ),
  },
  {
    id: "non-custodial",
    title: "3. Architettura Non-Custodial — Controllo delle Chiavi Private",
    content: (
      <>
        <Box color="green">
          Gli utenti di Dyneros mantengono SEMPRE il pieno controllo esclusivo delle proprie chiavi private. Dyneros non ha mai accesso, non custodisce e non può recuperare le chiavi private degli utenti. La perdita delle chiavi private è irreversibile e comporta la perdita permanente dell'accesso agli asset on-chain.
        </Box>
        <P>Questo principio si applica a tutti gli strumenti Dyneros:</P>
        <UL>
          <LI><Strong>Dyneros Wallet</Strong>: il wallet è non-custodial. Dyneros non detiene né può accedere alle chiavi private degli utenti</LI>
          <LI><Strong>Smart contract</Strong>: i contratti distribuiti sulla rete Dyneros Chain sono controllati dai loro deployer, non da Dyneros</LI>
          <LI><Strong>Asset on-chain</Strong>: dUSD, dGLD, WDYN e altri token sono controllati dagli smart contract e dai loro holder, non da Dyneros</LI>
        </UL>
        <P>Dyneros non può: bloccare, congelare, trasferire o recuperare asset on-chain degli utenti, salvo quanto tecnicamente previsto dagli smart contract di governance della rete.</P>
      </>
    ),
  },
  {
    id: "no-gestione-fondi",
    title: "4. Nessuna Gestione di Fondi di Terzi",
    content: (
      <>
        <P>Dyneros non gestisce, non raccoglie, non custodisce né investe fondi di terzi in alcuna forma. In particolare:</P>
        <UL>
          <LI>Dyneros non accetta depositi di denaro fiat o asset digitali per conto degli utenti</LI>
          <LI>Dyneros non effettua operazioni di trading, staking o yield farming per conto degli utenti</LI>
          <LI>I pagamenti per i Servizi Dyneros (abbonamenti, commissioni) sono corrispettivi per servizi tecnologici, non investimenti</LI>
          <LI>Dyneros non partecipa a Initial Coin Offering (ICO), Initial DEX Offering (IDO) né a qualsiasi forma di raccolta fondi pubblica tramite token</LI>
        </UL>
      </>
    ),
  },
  {
    id: "rischi",
    title: "5. Rischi Associati alla Tecnologia Blockchain",
    content: (
      <>
        <P>L'utilizzo di tecnologie blockchain comporta rischi intrinseci che l'utente accetta consapevolmente:</P>
        <UL>
          <LI><Strong>Irreversibilità delle transazioni</Strong>: le transazioni on-chain sono definitive e non possono essere annullate</LI>
          <LI><Strong>Vulnerabilità smart contract</Strong>: i contratti intelligenti possono contenere bug o vulnerabilità</LI>
          <LI><Strong>Rischi di rete</Strong>: interruzioni, fork o attacchi alla rete possono influire sulla disponibilità dei Servizi</LI>
          <LI><Strong>Rischi regolatori</Strong>: la normativa sulle tecnologie blockchain è in evoluzione e potrebbe cambiare</LI>
          <LI><Strong>Rischi di sicurezza personale</Strong>: phishing, malware, social engineering possono compromettere i wallet degli utenti</LI>
        </UL>
      </>
    ),
  },
  {
    id: "contatti-legali",
    title: "6. Contatti per Questioni Legali",
    content: (
      <>
        <P>Per questioni legali, richieste di autorità competenti o segnalazioni di violazioni, contattare:</P>
        <P><Strong>Email legale</Strong>: legal@dyneros.com</P>
        <P><Strong>Email privacy</Strong>: privacy@dyneros.com</P>
        <P><Strong>Email AML/Compliance</Strong>: compliance@dyneros.com</P>
      </>
    ),
  },
];

const sectionsEN = [
  {
    id: "tech-nature",
    title: "1. Technological Nature of Dyneros",
    content: (
      <>
        <Box color="gold">
          Dyneros Ltd is a technology company that develops and manages enterprise blockchain infrastructure. Dyneros is NOT and does NOT qualify as: a credit institution, payment institution, financial intermediary, investment fund manager, cryptocurrency exchange, custodial digital wallet service provider, or any other entity regulated by Italian financial law (TUB, TUF, D.Lgs. 231/2007) or European law (MiCA, MiFID II, DORA).
        </Box>
        <P>Dyneros provides exclusively <Strong>software, technical infrastructure and development tools</Strong>. Any use of Dyneros Services for financial purposes is the sole responsibility of the user.</P>
      </>
    ),
  },
  {
    id: "no-advice",
    title: "2. No Financial Advice",
    content: (
      <>
        <Box color="red">
          NO INFORMATION, DATA, ANALYSIS, DOCUMENTATION OR COMMUNICATION PROVIDED BY DYNEROS, ITS EMPLOYEES, COLLABORATORS OR PARTNERS CONSTITUTES FINANCIAL, INVESTMENT, LEGAL OR TAX ADVICE UNDER APPLICABLE LAW.
        </Box>
        <P>In particular: Dyneros does not provide investment recommendations for digital assets or tokens, does not make predictions about the future value of the DYN token or other assets, technical information about the Dyneros Chain network does not constitute financial promotion, and network performance data (TPS, uptime, etc.) are technical indicators, not financial returns.</P>
        <P>Users must consult an independent qualified financial, legal and tax advisor before making any decisions relating to the use of digital assets or blockchain technologies.</P>
      </>
    ),
  },
  {
    id: "non-custodial-en",
    title: "3. Non-Custodial Architecture — Private Key Control",
    content: (
      <>
        <Box color="green">
          Dyneros users ALWAYS maintain full exclusive control of their private keys. Dyneros never has access to, does not custody, and cannot recover users' private keys. Loss of private keys is irreversible and results in permanent loss of access to on-chain assets.
        </Box>
        <P>Dyneros cannot: block, freeze, transfer or recover users' on-chain assets, except as technically provided by the network governance smart contracts.</P>
      </>
    ),
  },
  {
    id: "no-fund-management",
    title: "4. No Third-Party Fund Management",
    content: (
      <>
        <P>Dyneros does not manage, collect, custody or invest third-party funds in any form. Dyneros does not accept deposits of fiat money or digital assets on behalf of users, does not perform trading, staking or yield farming operations on behalf of users, and does not participate in ICOs, IDOs or any form of public fundraising via tokens.</P>
      </>
    ),
  },
  {
    id: "risks",
    title: "5. Risks Associated with Blockchain Technology",
    content: (
      <>
        <P>The use of blockchain technologies involves inherent risks that the user consciously accepts, including: irreversibility of transactions, smart contract vulnerabilities, network risks (interruptions, forks, attacks), evolving regulatory risks, and personal security risks (phishing, malware, social engineering).</P>
      </>
    ),
  },
  {
    id: "legal-contacts",
    title: "6. Legal Contacts",
    content: (
      <>
        <P>For legal matters, requests from competent authorities or violation reports, contact:</P>
        <P><Strong>Legal email</Strong>: legal@dyneros.com</P>
        <P><Strong>Privacy email</Strong>: privacy@dyneros.com</P>
        <P><Strong>AML/Compliance email</Strong>: compliance@dyneros.com</P>
      </>
    ),
  },
];

export default function Disclaimer() {
  return (
    <LegalPage
      titleIT="Disclaimer Legale"
      titleEN="Legal Disclaimer"
      lastUpdated="5 Aprile 2025 / April 5, 2025"
      sectionsIT={sectionsIT}
      sectionsEN={sectionsEN}
    />
  );
}
