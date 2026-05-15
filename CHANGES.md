# CHANGES — Overhaul v2 (15 Maggio 2026)

## File modificati (6)

### `server/routers.ts`
- Aggiunto import `emailLog` da schema
- Nuovo endpoint `superadmin.listUsersPaged` — paginazione 25/pagina, filtri role/status/search
- Nuovo endpoint `superadmin.sendEmail` — invia email singola e logga su `email_log`
- Nuovo endpoint `superadmin.sendBulkEmail` — invia a tutti/ruolo/stato, logga ogni invio
- Nuovo endpoint `superadmin.emailHistory` — ultimi 50 invii da `email_log`
- Nuovo endpoint `superadmin.auditLogList` — ultimi 50 eventi da `audit_log`
- Nuovo endpoint `superadmin.dbStats` — conteggio righe per ogni tabella
- Nuovo endpoint `superadmin.envStatus` — stato variabili d'ambiente (no valori)
- Nuovo endpoint `superadmin.affiliateList` — lista profili + stats conversioni/payout
- Nuovo endpoint `superadmin.affiliateAction` — approva/rifiuta/sospendi affiliato
- Nuovo endpoint `superadmin.recentConversions` — ultime 20 conversioni
- `dashboard.teamContacts` — ora legge admin/superadmin reali dal DB (fallback se DB vuoto)

### `client/src/pages/SuperAdmin.tsx`
- Riscritto completamente: layout sidebar + main content
- **Tab Overview**: 8 KPI reali + tabella ultimi 10 utenti registrati
- **Tab Utenti**: tabella paginata 25/pag, filtri role/status/search, azioni sospendi/attiva/elimina/cambia ruolo
- **Tab Email**: form singola + form bulk con filtro destinatari + storico invii 50 righe
- **Tab Sistema**: env status, SMTP status, DB stats per tabella, audit log 50 eventi
- **Tab Affiliati**: KPI conversioni/payout + tabella profili + azioni + conversioni recenti

### `client/src/App.tsx`
- Aggiunto `SuperAdminRoute` — guard: richiede ruolo `superadmin`, altrimenti redirect
- Aggiunto `UserRoute` — guard: richiede login, se superadmin redirect a `/superadmin`
- Route `/superadmin` e `/super-admin` ora usano `SuperAdminRoute`

### `client/src/pages/DashTeam.tsx`
- Fix TypeScript: `member.name` può essere null — usato `member.name || member.email || "?"`

### `drizzle/schema.ts`
- Aggiunta tabella `email_log` (id, toEmail, subject, body, status, isBulk, sentBy, createdAt)

### `drizzle/0003_faithful_the_renegades.sql`
- Migrazione SQL per la tabella `email_log`

## Comandi deploy
```bash
npm run build
pm2 restart dyneros
```
Nessun `db:push` necessario — la migrazione è già applicata.

---
*IT Team Alfassa*

---

# CHANGES — Overhaul v3 (15 Maggio 2026)

## File modificati (4)

### `server/routers.ts`
- 10 nuovi endpoint superadmin: `allProjects`, `allTickets`, `allInvoices`, `allContracts`, `allDocuments`, `allWallets`, `allSmartContracts`, `allDomains`, `allAiProjects`, `allApiKeys`
- `dashboard.stats`: rimosso `activeServices: 8` hardcoded, `onlineEnvironments: 3` hardcoded, `nextMilestone` hardcoded, nomi staff hardcoded

### `client/src/pages/SuperAdmin.tsx`
- Riscrittura completa: sidebar collassabile 20 sezioni in 4 gruppi
- Overview: 11 KPI + ultimi 10 utenti
- Utenti: paginazione 25/pag + filtri + azioni inline
- Tutte le tabelle globali (Progetti, Ticket, Fatture, Contratti, Documenti, Wallet, SmartContracts, Domini, AI, API Keys) con dati reali di tutti gli utenti

### `client/src/App.tsx`
- `FullPageSpinner` gold durante caricamento auth
- Tutte le 19 route `/dashboard/*` wrappate con `UserRoute`
- `/super-admin` → redirect a `/superadmin`

### `client/src/pages/Dashboard.tsx`
- Rimosso blocco `nextMilestone` hardcoded

## Comandi deploy
```bash
npm run build
pm2 restart dyneros
```
Nessun `db:push` necessario.

---
*IT Team Alfassa*
