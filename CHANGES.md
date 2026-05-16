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

---

# CHANGES — CRUD Completo v4 (15 Maggio 2026)

## File modificati (5)

### `server/routers.ts`
- `dashboard.walletInfo`: aggiunto campo `id` nel mapping degli indirizzi wallet (abilita il pulsante "Rimuovi")
- `dashboard.domains`: aggiunto campo `id` nel mapping dei domini (abilita il pulsante "Rimuovi")
- `dashboard.addWallet`: nuovo endpoint — aggiunge wallet per utente corrente (nome, indirizzo 0x, rete)
- `dashboard.removeWallet`: nuovo endpoint — rimuove wallet per ID (solo proprietario)
- `dashboard.addDomain`: nuovo endpoint — aggiunge dominio (nome, registrar, scadenza, note)
- `dashboard.removeDomain`: nuovo endpoint — rimuove dominio per ID (solo proprietario)
- `superadmin.updateProjectStatus`: nuovo endpoint — cambia stato progetto (planning/in_progress/completed/on_hold)
- `superadmin.replyToTicket`: nuovo endpoint — risposta admin a ticket, salva in `ticket_replies`
- `superadmin.updateTicketStatus`: nuovo endpoint — cambia stato ticket (open/in_progress/resolved/closed)
- `superadmin.setAffiliateCommission`: nuovo endpoint — salva commissione % nelle note affiliato
- `superadmin.generateApiKeyForUser`: nuovo endpoint — genera API key per utente specifico (solo superadmin)
- `superadmin.blockchainStats`: nuovo endpoint — blocco corrente live dal nodo DYNEROS + conteggi DB (wallet, smart contracts)

### `client/src/pages/DashProjects.tsx`
- Aggiunto pulsante "+ Nuovo Progetto" con modal form (nome, tipo, priorità, ambiente, descrizione)
- Mutation `trpc.dashboard.createProject` con invalidazione automatica della lista

### `client/src/pages/DashWallet.tsx`
- Aggiunto form "Aggiungi Wallet" (nome, indirizzo 0x, rete)
- Aggiunto pulsante "Rimuovi" per ogni wallet (richiede `id` ora presente nel response)

### `client/src/pages/DashDomains.tsx`
- Aggiunto form "Aggiungi Dominio" (nome dominio, registrar, data scadenza, note)
- Aggiunto pulsante "Rimuovi" per ogni dominio (richiede `id` ora presente nel response)

### `client/src/pages/SuperAdmin.tsx`
- **SectionAllProjects**: aggiunta colonna "Cambia Stato" con `<select>` inline per ogni progetto
- **SectionAllTickets**: riscritta come accordion espandibile — click su riga apre form risposta + dropdown stato ticket
- **SectionAffiliates**: aggiunta colonna "Commissione %" con input numerico editabile + pulsante "Salva" per ogni affiliato
- **SectionBlockchain**: aggiornata con 3 KPI reali (blocco corrente live, wallet registrati, smart contracts) + info chain

## Comandi deploy
```bash
npm run build
pm2 restart dyneros
```
Nessun `db:push` necessario — schema invariato.

---
*IT Team Alfassa*

---

# CHANGES — Fix CRUD v6 (16 Maggio 2026)

## File modificati: 1

### `server/routers.ts`
- `createProject`: accetta ora `"development"` come valore valido per `environment` (alias di `"dev"`)
- Mapping automatico `"development"` → `"dev"` prima dell'insert nel DB (schema enum invariato)

### Stato CRUD verificato (nessuna modifica necessaria ai file client)
- `walletInfo` restituisce già `id` per ogni wallet ✅
- `domains` restituisce già `id` per ogni dominio ✅
- `DashProjects.tsx`: modal "Nuovo Progetto" già presente ✅
- `DashWallet.tsx`: modal "Aggiungi Wallet" + pulsante rimozione già presenti ✅
- `DashDomains.tsx`: modal "Aggiungi Dominio" + pulsante rimozione già presenti ✅

## Comandi deploy
```bash
npm run build
pm2 restart dyneros
```
Nessun `db:push` necessario — schema invariato.

---
*IT Team Alfassa*
