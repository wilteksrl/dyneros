# Configurazione SMTP — Dyneros Platform

Questa guida spiega come configurare il sistema di notifiche email della piattaforma Dyneros.

---

## Dove impostare le variabili d'ambiente

### In sviluppo locale

Crea un file `.env` nella root del progetto (non committare mai questo file su Git):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@dyneros.com
SMTP_PASS=your_app_password_here
SMTP_FROM_NAME=Dyneros Platform
SMTP_FROM_EMAIL=noreply@dyneros.com
```

### In produzione (server)

Imposta le variabili d'ambiente direttamente nel sistema operativo o nel tuo servizio di hosting:

```bash
export SMTP_HOST=smtp.dyneros.com
export SMTP_PORT=587
export SMTP_USER=noreply@dyneros.com
export SMTP_PASS=your_password
export SMTP_FROM_NAME="Dyneros Platform"
export SMTP_FROM_EMAIL=noreply@dyneros.com
```

### Tramite il pannello Dyneros (se deployato su Manus)

Accedi a **Settings → Secrets** nel pannello di gestione e inserisci le 6 variabili SMTP.

---

## Variabili richieste

| Variabile | Descrizione | Esempio |
|---|---|---|
| `SMTP_HOST` | Host del server SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` (TLS) o `465` (SSL) |
| `SMTP_USER` | Username/email di autenticazione | `noreply@dyneros.com` |
| `SMTP_PASS` | Password o API key | `abc123xyz` |
| `SMTP_FROM_NAME` | Nome mittente visualizzato | `Dyneros Platform` |
| `SMTP_FROM_EMAIL` | Indirizzo email mittente | `noreply@dyneros.com` |

---

## Configurazioni comuni

### Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tua-email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx  # App Password (non la password Gmail)
```

Per generare un'App Password Gmail: Account Google → Sicurezza → Verifica in due passaggi → App Password.

### SendGrid

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxx  # API Key SendGrid
```

### Mailgun

```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@mg.dyneros.com
SMTP_PASS=your_mailgun_smtp_password
```

### Aruba / OVH / server custom

```env
SMTP_HOST=smtps.aruba.it
SMTP_PORT=465
SMTP_USER=noreply@dyneros.com
SMTP_PASS=your_password
```

---

## Template email disponibili

| Template | Trigger | Procedura tRPC |
|---|---|---|
| Benvenuto | Nuovo utente registrato | `trpc.email.sendWelcome` |
| Reset Password | Richiesta forgot password | `trpc.email.sendPasswordReset` |
| Verifica Email | Nuova registrazione | `trpc.email.sendEmailVerification` |
| Nuovo Ticket | Ticket creato | `trpc.email.sendNewTicket` |
| Aggiornamento Ticket | Risposta nel thread | `trpc.email.sendTicketUpdate` |
| Scadenza Contratto | Job automatico 30/7/1 giorni | `trpc.email.sendContractExpiry` |
| Fattura Scaduta | Data scadenza superata | `trpc.email.sendInvoiceOverdue` |
| Milestone Alert | 14/3 giorni prima | `trpc.email.sendMilestoneAlert` |
| Alert Critico | Evento urgente di sistema | `trpc.email.sendCriticalAlert` |
| Test Email | Verifica manuale SMTP | `trpc.email.sendTest` |

---

## Test e verifica

### Dalla dashboard (utenti admin)

1. Accedi a `/dashboard/email-settings`
2. Nella sezione **Configurazione SMTP** clicca **Verifica Connessione** per testare la connessione al server SMTP
3. Inserisci un indirizzo email e clicca **Test** per ricevere un'email di prova

### Da riga di comando

```bash
cd dyneros
node -e "
import('./server/email.js').then(({ verifySmtp }) => {
  verifySmtp().then(r => console.log(r));
});
"
```

---

## Troubleshooting

| Errore | Causa | Soluzione |
|---|---|---|
| `ECONNREFUSED` | Host/porta errati | Verifica `SMTP_HOST` e `SMTP_PORT` |
| `EAUTH` | Credenziali errate | Controlla `SMTP_USER` e `SMTP_PASS` |
| `ETIMEDOUT` | Firewall blocca la porta | Prova porta 465 invece di 587 |
| `Invalid login` | Gmail senza App Password | Genera App Password nelle impostazioni Google |
| Email in spam | Dominio non verificato | Configura SPF, DKIM e DMARC per il dominio |

---

## Configurazione SPF/DKIM consigliata per dyneros.com

Per evitare che le email finiscano in spam, aggiungi questi record DNS:

```
# SPF
TXT @ "v=spf1 include:_spf.google.com include:mailgun.org ~all"

# DMARC
TXT _dmarc "v=DMARC1; p=quarantine; rua=mailto:dmarc@dyneros.com"
```

Il record DKIM viene fornito dal tuo provider SMTP (Gmail, SendGrid, Mailgun, ecc.).
