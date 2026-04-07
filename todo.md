# Dyneros Ltd — Project TODO

## Global Setup
- [x] Global CSS: gold/black theme, Inter + Space Grotesk fonts, CSS variables
- [x] App.tsx: dark theme, routes for all pages
- [x] Navbar: logo, nav links, CTA, mobile hamburger

## Landing Page Sections
- [x] Section 01 — Hero: animated grid, headline, two CTAs
- [x] Section 02 — Trust Bar: three pillars horizontal bar
- [x] Section 03 — Dyneros Chain: feature cards, network endpoints, positioning line
- [x] Section 04 — Platform: three-panel macOS-style mockups
- [x] Section 05 — Solutions: six industry cards with problem/solution/outcome
- [x] Section 06 — Services: four service tiles
- [x] Section 07 — Developers: build on Dyneros, three access points
- [x] Section 08 — Case Studies: three dark metric cards
- [x] Section 09 — Pricing: three-tier SaaS pricing
- [x] Section 11 — Support: chat widget, status link
- [x] Section 12 — About/Company: vision, team scale, growth

## Auth & Dashboard
- [x] Section 10 — Login page (Manus OAuth)
- [x] Section 10 — Registration / onboarding (via Manus OAuth)
- [x] Section 10 — Protected dashboard: service panel, account management, network status widget

## Backend
- [x] DB schema: no extra tables needed beyond users for MVP
- [x] tRPC: network status mock procedure (public)
- [x] tRPC: dashboard data procedure (protected)

## Additional Deliverables
- [x] Investor Pitch Deck (10 slides, gold/black, Series A)
- [x] Dyneros Chain Whitepaper PDF (11 sections, technical)

## SEO & Performance
- [x] Meta tags, Open Graph, structured data
- [x] Lighthouse-ready: lazy loading, font optimization

## Aggiornamenti Richiesti
- [x] Traduzione completa in italiano: Navbar, Hero, TrustBar, ChainSection
- [x] Traduzione completa in italiano: PlatformSection, SolutionsSection, ServicesSection, DevelopersSection
- [x] Traduzione completa in italiano: CaseStudiesSection, PricingSection, SupportSection, CompanySection, Footer
- [x] Traduzione completa in italiano: Login, Dashboard, NotFound
- [x] Fix link Mainnet → https://mainnet.dyneros.com
- [x] Fix link Explorer → https://explorer.dyneros.com
- [x] Fix link Wallet → https://wallet.dyneros.com
- [x] Fix link nel tRPC router (dashboard.data)
- [x] Aggiornamento index.html: lang="it", meta tag in italiano

## Pagine Legali (Aggiornamento)
- [x] Privacy Policy GDPR (IT/EN) — /privacy-policy
- [x] Cookie Policy (IT/EN) + banner cookie conforme Garante 2021 — /cookie-policy
- [x] Termini e Condizioni (IT/EN) — /terms
- [x] Disclaimer Legale (IT/EN) — /disclaimer
- [x] AML/KYC Policy (IT/EN) — /aml-kyc
- [x] Aggiornamento Footer con link a tutte le pagine legali
- [x] Route in App.tsx per tutte le pagine legali

## Client Control Panel — Phase 1 MVP
- [ ] DB schema: companies, projects, tickets, documents, invoices, contracts, quotes, notifications, smart_contracts, wallets
- [ ] tRPC procedures: dashboard stats, projects CRUD, tickets CRUD, documents list, invoices list, notifications list
- [ ] DashboardLayout: sidebar (17 voci), topbar (search, notifiche, profilo), collapsible, gold/black branding
- [ ] Dashboard home: header account (Customer ID, stato, piano, referenti), KPI cards (9 metriche), activity timeline, priority widgets
- [ ] Progetti list: tabella professionale con filtri, stati, tipi progetto
- [ ] Progetto detail: tab Overview, Tasks, Milestones, Files, Activity, Team, Billing, Deployments
- [ ] Ticket list: tabella con filtri, priorità, SLA, stati
- [ ] Ticket detail: thread conversazionale, allegati, cronologia stati, SLA tracking
- [ ] Documents: cartelle, tagging, versioning, upload, preview
- [ ] Contracts: lista contratti, stato firma, tipo, durata
- [ ] Quotes: lista preventivi, stati, importi, approvazione
- [ ] Invoices: lista fatture, paid/unpaid/overdue, download PDF
- [ ] Blockchain Console: network info DYN (Chain ID 24589, RPC, Explorer), token ufficiali (dUSD, dGLD, WDYN, LP)
- [ ] Wallet & Assets: address cards, portfolio, token balances, on-chain history
- [ ] Smart Contracts: registry con address, status, verified, ABI, explorer link
- [ ] Domains & Deploy: elenco domini, SSL, hosting status, deploy history
- [ ] AI & Automations: progetti AI, workflow, stato ambienti
- [ ] Team & Contacts: account manager, PM, tech lead, blockchain specialist
- [ ] Notifications: centro notifiche unificato
- [ ] Settings: profilo cliente, CRM fields, preferenze
- [ ] Security: sessioni, audit log, device list, ruoli
- [ ] Knowledge Base: guide, FAQ, documentazione DYNEROS Chain
- [ ] Global search: progetti, ticket, documenti, invoice, wallet address
