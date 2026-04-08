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
- [x] DB schema: companies, projects, tickets, documents, invoices, contracts, quotes, notifications, smart_contracts, wallets
- [x] tRPC procedures: dashboard stats, projects CRUD, tickets CRUD, documents list, invoices list, notifications list
- [x] DashboardLayout: sidebar (17 voci), topbar (search, notifiche, profilo), collapsible, gold/black branding
- [x] Dashboard home: header account (Customer ID, stato, piano, referenti), KPI cards (9 metriche), activity timeline, priority widgets
- [x] Progetti list: tabella professionale con filtri, stati, tipi progetto
- [x] Progetto detail: tab Overview, Milestones, Team, Activity
- [x] Ticket list: tabella con filtri, priorità, SLA, stati
- [x] Ticket detail: thread conversazionale, cronologia stati, SLA tracking
- [x] Documents: lista con categorie, status badge, download, preview
- [x] Contracts: lista contratti, stato firma, tipo, durata
- [x] Quotes: inclusi in Contracts (SOW/preventivi)
- [x] Invoices: lista fatture, paid/unpaid/overdue, download PDF
- [x] Blockchain Console: network info DYN (Chain ID 24589, RPC, Explorer), token ufficiali (dUSD, dGLD, WDYN, LP)
- [x] Wallet & Assets: address cards, portfolio, token balances, on-chain history
- [x] Smart Contracts: registry con address, status, verified, ABI, explorer link
- [x] Domains & Deploy: elenco domini, SSL, hosting status, deploy history
- [x] AI & Automations: progetti AI, workflow, stato ambienti
- [x] Team & Contacts: account manager, PM, tech lead, blockchain specialist
- [x] Notifications: centro notifiche unificato
- [x] Settings: profilo cliente, preferenze notifiche, lingua, aspetto
- [x] Security: sessioni attive, audit log, security log
- [x] Knowledge Base: guide, FAQ, documentazione DYNEROS Chain
- [x] Global search: ricerca nella topbar (UI presente nel DashboardLayout)

## Sistema Email Completo
- [x] Installazione nodemailer + @types/nodemailer
- [x] Variabili SMTP in .env.example e webdev secrets
- [x] server/email.ts: servizio email con SMTP configurabile
- [x] Template: Welcome / Benvenuto
- [x] Template: Reset Password / Forgot Password
- [x] Template: Conferma Registrazione
- [x] Template: Nuovo Ticket aperto
- [x] Template: Aggiornamento Ticket
- [x] Template: Scadenza Contratto (30/7/1 giorni prima)
- [x] Template: Fattura Scaduta / Overdue Invoice
- [x] Template: Milestone Imminente
- [x] Template: Alert Critico (sistema)
- [x] tRPC: sendWelcomeEmail (trigger su nuovo utente)
- [x] tRPC: sendPasswordReset (forgot password flow)
- [x] tRPC: sendTicketNotification (nuovo ticket / aggiornamento)
- [x] tRPC: sendContractExpiryAlert (scadenza contratto)
- [x] tRPC: sendInvoiceOverdueAlert (fattura scaduta)
- [x] tRPC: sendMilestoneAlert (milestone imminente)
- [x] tRPC: sendTestEmail (test SMTP dalla dashboard)
- [x] Pagina Preferenze Notifiche Email in dashboard
- [x] Sezione SMTP in Settings con test connessione
- [x] Documentazione SMTP_CONFIG.md

## Sistema Auth Nativo (Sostituzione Manus OAuth)
- [x] Schema DB: aggiungere passwordHash, emailVerified, verifyToken, resetToken, resetTokenExpiry, status, lastLoginAt a users
- [x] Installare bcryptjs + @types/bcryptjs
- [x] server/auth-native.ts: helpers hashPassword, verifyPassword, generateToken, createSession JWT
- [x] tRPC: auth.register (email, password, nome, azienda)
- [x] tRPC: auth.login (email + password → JWT cookie)
- [x] tRPC: auth.logout (clear cookie)
- [x] tRPC: auth.me (legge cookie JWT)
- [x] tRPC: auth.forgotPassword (genera token, invia email reset)
- [x] tRPC: auth.resetPassword (token + nuova password)
- [x] tRPC: auth.verifyEmail (token verifica email)
- [x] Pagina Login: form email/password, link registrazione e forgot password
- [x] Pagina Register: form nome, azienda, email, password, conferma password
- [x] Pagina ForgotPassword: form email
- [x] Pagina ResetPassword: form nuova password con token URL
- [x] Pagina VerifyEmail: conferma verifica email (redirect automatico)
- [x] SuperAdmin panel: /superadmin - lista utenti, ruoli, ban/attiva, stats
- [x] Rimuovere tutti i riferimenti Manus OAuth da DashboardLayout, hooks, App.tsx
- [x] Aggiornare useAuth hook per leggere JWT nativo
- [x] Creare superadmin iniziale via script seed (email + password configurabili)
- [x] Documentazione credenziali superadmin

## Bug Fix — Pulsanti e Errori Build
- [ ] Fix pulsanti "Accedi" e "Inizia Ora" nella Navbar (navigazione rotta)
- [ ] Fix pulsanti CTA nella HeroSection
- [ ] Rimuovere OAuth init dal server (log "[OAuth] Initialized")
- [ ] Fix CSS @import order (Google Fonts deve essere prima di :root)
- [ ] Rimuovere VITE_ANALYTICS_ENDPOINT e VITE_ANALYTICS_WEBSITE_ID da index.html
