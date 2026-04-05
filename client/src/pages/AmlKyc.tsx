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
            <td className="py-2 pr-4 font-medium text-foreground align-top w-2/5">{a}</td>
            <td className="py-2 text-muted-foreground align-top">{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const Box = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-[oklch(68%_0.19_72/0.3)] bg-[oklch(68%_0.19_72/0.05)] rounded-xl p-4 mb-4">
    <p className="text-sm text-[oklch(80%_0.12_72)] leading-relaxed">{children}</p>
  </div>
);

const sectionsIT = [
  {
    id: "premessa",
    title: "1. Premessa e Quadro Normativo",
    content: (
      <>
        <P>Dyneros Ltd riconosce l'importanza della lotta al riciclaggio di denaro (Anti-Money Laundering, AML) e al finanziamento del terrorismo (Counter-Terrorist Financing, CTF) e si impegna a rispettare la normativa applicabile, tra cui:</P>
        <UL>
          <LI><Strong>D.Lgs. 231/2007</Strong> (attuazione della Direttiva UE 2005/60/CE) e successive modifiche (D.Lgs. 90/2017, D.Lgs. 125/2019)</LI>
          <LI><Strong>IV e V Direttiva Antiriciclaggio UE</Strong> (AMLD4 2015/849/UE, AMLD5 2018/843/UE)</LI>
          <LI><Strong>Regolamento UE 2023/1113</Strong> (Transfer of Funds Regulation — TFR, applicabile ai crypto-asset service provider)</LI>
          <LI><Strong>Raccomandazioni FATF/GAFI</Strong> in materia di virtual asset e virtual asset service provider (VASP)</LI>
          <LI>Normativa UK in materia di AML/CTF (Proceeds of Crime Act 2002, Terrorism Act 2000, Money Laundering Regulations 2017)</LI>
        </UL>
        <Box>
          Dyneros è consapevole che la classificazione come VASP (Virtual Asset Service Provider) ai sensi della normativa FATF e delle direttive europee dipende dalla natura specifica dei servizi offerti. Dyneros si avvale di consulenza legale specializzata per determinare gli obblighi applicabili e aggiorna periodicamente la propria politica AML/KYC in conformità all'evoluzione normativa.
        </Box>
      </>
    ),
  },
  {
    id: "approccio",
    title: "2. Approccio Basato sul Rischio",
    content: (
      <>
        <P>Dyneros adotta un approccio basato sul rischio (Risk-Based Approach, RBA) nella gestione degli obblighi AML/KYC, in conformità all'art. 15 D.Lgs. 231/2007 e alle linee guida dell'Autorità Bancaria Europea (EBA).</P>
        <P>La valutazione del rischio considera i seguenti fattori:</P>
        <Table rows={[
          ["Rischio cliente", "Natura giuridica, settore di attività, paese di residenza, PEP status, precedenti"],
          ["Rischio geografico", "Paesi ad alto rischio FATF, giurisdizioni soggette a sanzioni internazionali"],
          ["Rischio prodotto/servizio", "Tipologia di servizio blockchain utilizzato, volumi di transazione"],
          ["Rischio canale distributivo", "Modalità di onboarding, presenza fisica vs. digitale"],
        ]} />
      </>
    ),
  },
  {
    id: "kyc",
    title: "3. Procedure di Identificazione (KYC)",
    content: (
      <>
        <P>Per i clienti enterprise che accedono a servizi gestiti o stipulano contratti commerciali con Dyneros, sono previste le seguenti procedure di identificazione:</P>
        <P><Strong>3.1 Persone Giuridiche (Clienti Enterprise)</Strong></P>
        <UL>
          <LI>Visura camerale o documento equivalente (non più vecchio di 3 mesi)</LI>
          <LI>Statuto sociale e atto costitutivo</LI>
          <LI>Identificazione dei titolari effettivi (Ultimate Beneficial Owner, UBO) con partecipazione ≥ 25%</LI>
          <LI>Documento d'identità valido e prova di indirizzo per i rappresentanti legali e gli UBO</LI>
          <LI>Dichiarazione sull'origine dei fondi per contratti superiori a soglie definite</LI>
        </UL>
        <P><Strong>3.2 Persone Fisiche (Sviluppatori/Utenti Individuali)</Strong></P>
        <P>Per gli utenti individuali che accedono a servizi di base (Explorer, documentazione pubblica), non è richiesta identificazione formale. Per servizi avanzati o accesso a funzionalità enterprise, potrebbe essere richiesta verifica dell'identità tramite processo KYC digitale.</P>
        <P><Strong>3.3 Wallet Address Monitoring</Strong></P>
        <P>Dyneros si riserva il diritto di utilizzare strumenti di blockchain analytics per monitorare i wallet address che interagiscono con la rete Dyneros Chain, al fine di identificare transazioni associate a indirizzi sanzionati o attività illecite note.</P>
      </>
    ),
  },
  {
    id: "obblighi-segnalazione",
    title: "4. Obblighi di Segnalazione",
    content: (
      <>
        <P>In conformità alla normativa applicabile, Dyneros si impegna a:</P>
        <UL>
          <LI><Strong>Segnalare operazioni sospette</Strong> (SOS) all'Unità di Informazione Finanziaria (UIF) della Banca d'Italia, ove applicabile ai sensi dell'art. 35 D.Lgs. 231/2007</LI>
          <LI><Strong>Astenersi dall'eseguire</Strong> operazioni quando sussistono sospetti di riciclaggio o finanziamento del terrorismo</LI>
          <LI><Strong>Conservare la documentazione</Strong> raccolta in fase di KYC per un periodo minimo di 10 anni dalla cessazione del rapporto</LI>
          <LI><Strong>Cooperare</Strong> con le autorità competenti (UIF, GdF, Autorità Giudiziaria) in caso di indagini</LI>
          <LI><Strong>Non divulgare</Strong> agli interessati l'avvenuta segnalazione (tipping-off prohibition, art. 41 D.Lgs. 231/2007)</LI>
        </UL>
      </>
    ),
  },
  {
    id: "sanzioni",
    title: "5. Screening Sanzioni Internazionali",
    content: (
      <>
        <P>Dyneros effettua screening sistematico nei confronti delle liste di sanzioni internazionali, tra cui:</P>
        <UL>
          <LI>Lista consolidata UE (Regolamento CE 2580/2001 e successive)</LI>
          <LI>OFAC SDN List (Office of Foreign Assets Control, USA)</LI>
          <LI>Lista ONU del Comitato per le Sanzioni</LI>
          <LI>HM Treasury Financial Sanctions List (UK)</LI>
        </UL>
        <P>L'accesso ai Servizi Dyneros è automaticamente bloccato per soggetti presenti nelle suddette liste. Dyneros si riserva il diritto di bloccare o congelare l'accesso ai Servizi in caso di corrispondenza positiva con liste di sanzioni.</P>
      </>
    ),
  },
  {
    id: "formazione",
    title: "6. Formazione e Governance Interna",
    content: (
      <>
        <P>Dyneros implementa le seguenti misure organizzative:</P>
        <UL>
          <LI><Strong>Responsabile AML/Compliance</Strong>: Dyneros ha designato un responsabile interno per la conformità AML/CTF (compliance@dyneros.com)</LI>
          <LI><Strong>Formazione periodica</Strong>: il personale riceve formazione regolare sugli obblighi AML/KYC e sulle procedure interne</LI>
          <LI><Strong>Revisione periodica</Strong>: la presente politica è soggetta a revisione annuale o in caso di significative modifiche normative</LI>
          <LI><Strong>Audit interno</Strong>: procedure di audit interno per verificare l'efficacia delle misure AML/KYC adottate</LI>
        </UL>
      </>
    ),
  },
  {
    id: "segnalazioni",
    title: "7. Segnalazioni e Contatti",
    content: (
      <>
        <P>Per segnalare attività sospette o per informazioni sulla presente politica AML/KYC:</P>
        <Table rows={[
          ["Email Compliance/AML", "compliance@dyneros.com"],
          ["Email Legale", "legal@dyneros.com"],
          ["Canale segnalazioni anonime", "Disponibile su richiesta per clienti enterprise"],
        ]} />
        <P>Dyneros si riserva il diritto di aggiornare la presente politica in conformità all'evoluzione normativa. La versione aggiornata sarà sempre disponibile su dyneros.com/aml-kyc.</P>
      </>
    ),
  },
];

const sectionsEN = [
  {
    id: "preamble",
    title: "1. Preamble and Regulatory Framework",
    content: (
      <>
        <P>Dyneros Ltd recognises the importance of combating money laundering (AML) and terrorist financing (CTF) and is committed to complying with applicable regulations, including:</P>
        <UL>
          <LI><Strong>Italian D.Lgs. 231/2007</Strong> (implementing EU Directive 2005/60/EC) and subsequent amendments</LI>
          <LI><Strong>EU 4th and 5th Anti-Money Laundering Directives</Strong> (AMLD4 2015/849/EU, AMLD5 2018/843/EU)</LI>
          <LI><Strong>EU Regulation 2023/1113</Strong> (Transfer of Funds Regulation — TFR, applicable to crypto-asset service providers)</LI>
          <LI><Strong>FATF/GAFI Recommendations</Strong> on virtual assets and virtual asset service providers (VASPs)</LI>
          <LI>UK AML/CTF legislation (Proceeds of Crime Act 2002, Terrorism Act 2000, Money Laundering Regulations 2017)</LI>
        </UL>
        <Box>
          Dyneros is aware that classification as a VASP (Virtual Asset Service Provider) under FATF regulations and European directives depends on the specific nature of the services offered. Dyneros relies on specialised legal advice to determine applicable obligations and periodically updates its AML/KYC policy in line with regulatory developments.
        </Box>
      </>
    ),
  },
  {
    id: "rba",
    title: "2. Risk-Based Approach",
    content: (
      <>
        <P>Dyneros adopts a Risk-Based Approach (RBA) in managing AML/KYC obligations, in accordance with EBA guidelines. Risk assessment considers: customer risk (legal nature, sector, country of residence, PEP status), geographic risk (FATF high-risk countries, sanctioned jurisdictions), product/service risk (type of blockchain service used, transaction volumes), and distribution channel risk.</P>
      </>
    ),
  },
  {
    id: "kyc-en",
    title: "3. Identification Procedures (KYC)",
    content: (
      <>
        <P>For enterprise customers accessing managed services or entering into commercial contracts with Dyneros, the following identification procedures apply:</P>
        <P><Strong>Legal Entities (Enterprise Customers)</Strong>: company registration documents, articles of association, identification of Ultimate Beneficial Owners (UBO) with ≥25% shareholding, valid identity documents for legal representatives and UBOs, and declaration of source of funds for contracts above defined thresholds.</P>
        <P><Strong>Individual Users (Developers)</Strong>: for users accessing basic services (Explorer, public documentation), no formal identification is required. For advanced services or enterprise features, identity verification via digital KYC process may be required.</P>
        <P><Strong>Wallet Address Monitoring</Strong>: Dyneros reserves the right to use blockchain analytics tools to monitor wallet addresses interacting with the Dyneros Chain network to identify transactions associated with sanctioned addresses or known illicit activities.</P>
      </>
    ),
  },
  {
    id: "reporting",
    title: "4. Reporting Obligations",
    content: (
      <>
        <P>In accordance with applicable law, Dyneros undertakes to: report suspicious transactions (SARs) to the competent Financial Intelligence Unit where applicable, refrain from executing transactions when there are suspicions of money laundering or terrorist financing, retain KYC documentation for a minimum of 10 years from the end of the relationship, cooperate with competent authorities in investigations, and not disclose to subjects that a report has been made (tipping-off prohibition).</P>
      </>
    ),
  },
  {
    id: "sanctions",
    title: "5. International Sanctions Screening",
    content: (
      <>
        <P>Dyneros performs systematic screening against international sanctions lists, including: EU Consolidated List, OFAC SDN List (USA), UN Sanctions Committee List, and HM Treasury Financial Sanctions List (UK). Access to Dyneros Services is automatically blocked for subjects on these lists.</P>
      </>
    ),
  },
  {
    id: "governance",
    title: "6. Training and Internal Governance",
    content: (
      <>
        <P>Dyneros implements the following organisational measures: a designated AML/Compliance Officer (compliance@dyneros.com), regular staff training on AML/KYC obligations, annual policy review, and internal audit procedures to verify the effectiveness of AML/KYC measures adopted.</P>
      </>
    ),
  },
  {
    id: "contacts",
    title: "7. Reports and Contacts",
    content: (
      <>
        <P>To report suspicious activities or for information on this AML/KYC policy:</P>
        <Table rows={[
          ["Compliance/AML Email", "compliance@dyneros.com"],
          ["Legal Email", "legal@dyneros.com"],
          ["Anonymous reporting channel", "Available on request for enterprise customers"],
        ]} />
      </>
    ),
  },
];

export default function AmlKyc() {
  return (
    <LegalPage
      titleIT="Politica AML/KYC"
      titleEN="AML/KYC Policy"
      lastUpdated="5 Aprile 2025 / April 5, 2025"
      sectionsIT={sectionsIT}
      sectionsEN={sectionsEN}
    />
  );
}
