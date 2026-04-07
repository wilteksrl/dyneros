import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let _transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (!_transporter) {
    const port = parseInt(process.env.SMTP_PORT ?? "587", 10);
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST ?? "",
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER ?? "",
        pass: process.env.SMTP_PASS ?? "",
      },
      tls: { rejectUnauthorized: false },
    });
  }
  return _transporter;
}

export function getFromAddress(): string {
  const name = process.env.SMTP_FROM_NAME ?? "Dyneros Platform";
  const email = process.env.SMTP_FROM_EMAIL ?? "noreply@dyneros.com";
  return `"${name}" <${email}>`;
}

export async function verifySmtp(): Promise<{ ok: boolean; error?: string }> {
  try {
    const t = getTransporter();
    await t.verify();
    return { ok: true };
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(opts: SendEmailOptions): Promise<{ ok: boolean; messageId?: string; error?: string }> {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn("[Email] SMTP not configured — skipping send");
    return { ok: false, error: "SMTP not configured" };
  }
  try {
    const info = await getTransporter().sendMail({
      from: getFromAddress(),
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text ?? opts.html.replace(/<[^>]+>/g, ""),
    });
    console.log(`[Email] Sent to ${opts.to} — messageId: ${info.messageId}`);
    return { ok: true, messageId: info.messageId };
  } catch (err: unknown) {
    console.error("[Email] Send failed:", err);
    return { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}

const BASE_STYLE = `
  body { margin:0; padding:0; background:#0a0a0a; font-family:'Inter',Arial,sans-serif; color:#e8e8e8; }
  .wrap { max-width:600px; margin:0 auto; background:#0d0d0d; border:1px solid #1e1e1e; border-radius:12px; overflow:hidden; }
  .header { background:#0d0d0d; border-bottom:1px solid #1e1e1e; padding:28px 36px; display:flex; align-items:center; gap:12px; }
  .logo-hex { width:36px; height:36px; }
  .logo-name { font-size:20px; font-weight:700; color:#c9922a; letter-spacing:-0.5px; }
  .body { padding:36px; }
  .title { font-size:22px; font-weight:700; color:#f0f0f0; margin:0 0 8px; }
  .subtitle { font-size:14px; color:#888; margin:0 0 28px; }
  .divider { height:1px; background:#1e1e1e; margin:24px 0; }
  .btn { display:inline-block; background:#c9922a; color:#000 !important; font-weight:700; font-size:14px; padding:12px 28px; border-radius:8px; text-decoration:none; }
  .info-box { background:#111; border:1px solid #1e1e1e; border-radius:8px; padding:16px 20px; margin:20px 0; }
  .info-row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #1a1a1a; font-size:13px; }
  .info-row:last-child { border-bottom:none; }
  .info-label { color:#888; }
  .info-value { color:#e8e8e8; font-weight:500; }
  .badge { display:inline-block; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:700; }
  .badge-critical { background:rgba(220,50,50,0.15); color:#e05555; border:1px solid rgba(220,50,50,0.3); }
  .badge-warning { background:rgba(201,146,42,0.15); color:#c9922a; border:1px solid rgba(201,146,42,0.3); }
  .badge-success { background:rgba(60,180,100,0.15); color:#3cb464; border:1px solid rgba(60,180,100,0.3); }
  .badge-info { background:rgba(60,130,220,0.15); color:#4a9ee0; border:1px solid rgba(60,130,220,0.3); }
  .footer { background:#080808; border-top:1px solid #1a1a1a; padding:20px 36px; font-size:11px; color:#555; text-align:center; }
  .footer a { color:#888; text-decoration:none; }
  p { font-size:14px; line-height:1.7; color:#ccc; margin:0 0 16px; }
  h3 { font-size:16px; color:#e8e8e8; margin:0 0 12px; }
`;

function baseTemplate(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="color-scheme" content="dark">
<style>${BASE_STYLE}</style>
</head>
<body>
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:#0d0d0d;">${preheader}</div>` : ""}
<div class="wrap">
  <div class="header">
    <svg class="logo-hex" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="18,2 33,10 33,26 18,34 3,26 3,10" fill="none" stroke="#c9922a" stroke-width="2"/>
      <polygon points="18,8 27,13 27,23 18,28 9,23 9,13" fill="rgba(201,146,42,0.12)" stroke="#c9922a" stroke-width="1"/>
      <circle cx="18" cy="18" r="3" fill="#c9922a"/>
    </svg>
    <span class="logo-name">Dyneros</span>
  </div>
  <div class="body">${content}</div>
  <div class="footer">
    <p style="margin:0 0 6px;">Dyneros Ltd &mdash; Infrastruttura Digitale per la Prossima Generazione</p>
    <p style="margin:0 0 6px;">
      <a href="https://dyneros.com">dyneros.com</a> &nbsp;&middot;&nbsp;
      <a href="https://dyneros.com/privacy-policy">Privacy Policy</a> &nbsp;&middot;&nbsp;
      <a href="https://dyneros.com/terms">Termini</a>
    </p>
    <p style="margin:0;color:#444;">Hai ricevuto questa email perché sei registrato sulla piattaforma Dyneros.<br>
    Per disiscriverti dalle notifiche non critiche, accedi alle <a href="https://dyneros.com/dashboard/settings">Impostazioni</a>.</p>
  </div>
</div>
</body>
</html>`;
}

export function templateWelcome(opts: { name: string; dashboardUrl: string; customerId: string }): { subject: string; html: string } {
  return {
    subject: "Benvenuto su Dyneros — Il tuo account è attivo",
    html: baseTemplate(`
      <p class="title">Benvenuto su Dyneros, ${opts.name}!</p>
      <p class="subtitle">Il tuo account enterprise è stato attivato con successo.</p>
      <p>Siamo lieti di averti a bordo. La tua area clienti è ora disponibile con accesso completo a tutti i servizi Dyneros: gestione progetti, supporto tecnico, modulo blockchain e molto altro.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Customer ID</span><span class="info-value">${opts.customerId}</span></div>
        <div class="info-row"><span class="info-label">Stato Account</span><span class="info-value"><span class="badge badge-success">Attivo</span></span></div>
        <div class="info-row"><span class="info-label">Rete Blockchain</span><span class="info-value">DYNEROS Chain (ID 24589)</span></div>
      </div>
      <p>Il tuo Account Manager ti contatterà entro 24 ore lavorative per il briefing iniziale.</p>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Accedi alla Dashboard &rarr;</a>
    `, `Benvenuto su Dyneros, ${opts.name}! Il tuo account è attivo.`),
  };
}

export function templatePasswordReset(opts: { name: string; resetUrl: string; expiresIn: string }): { subject: string; html: string } {
  return {
    subject: "Dyneros — Richiesta reset password",
    html: baseTemplate(`
      <p class="title">Reset Password</p>
      <p class="subtitle">Hai richiesto il reset della tua password.</p>
      <p>Ciao ${opts.name}, abbiamo ricevuto una richiesta di reset della password per il tuo account Dyneros. Se non sei stato tu, ignora questa email — la tua password rimarrà invariata.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Scade tra</span><span class="info-value">${opts.expiresIn}</span></div>
        <div class="info-row"><span class="info-label">Sicurezza</span><span class="info-value">Link monouso — non condividere</span></div>
      </div>
      <div class="divider"></div>
      <a href="${opts.resetUrl}" class="btn">Reimposta Password &rarr;</a>
      <p style="margin-top:20px;font-size:12px;color:#666;">Se il pulsante non funziona, copia e incolla questo link nel browser:<br><span style="color:#888;word-break:break-all;">${opts.resetUrl}</span></p>
    `, "Hai richiesto il reset della password Dyneros."),
  };
}

export function templateEmailVerification(opts: { name: string; verifyUrl: string }): { subject: string; html: string } {
  return {
    subject: "Dyneros — Conferma il tuo indirizzo email",
    html: baseTemplate(`
      <p class="title">Conferma Email</p>
      <p class="subtitle">Verifica il tuo indirizzo email per completare la registrazione.</p>
      <p>Ciao ${opts.name}, clicca sul pulsante qui sotto per confermare il tuo indirizzo email e attivare il tuo account Dyneros.</p>
      <div class="divider"></div>
      <a href="${opts.verifyUrl}" class="btn">Conferma Email &rarr;</a>
      <p style="margin-top:20px;font-size:12px;color:#666;">Il link scade tra 24 ore. Se non hai creato un account Dyneros, ignora questa email.</p>
    `, "Conferma il tuo indirizzo email Dyneros."),
  };
}

export function templateNewTicket(opts: { clientName: string; ticketId: string; subject: string; priority: string; category: string; dashboardUrl: string }): { subject: string; html: string } {
  const priorityBadge: Record<string, string> = { critical: "badge-critical", high: "badge-warning", medium: "badge-info", low: "badge-success" };
  const badge = priorityBadge[opts.priority] ?? "badge-info";
  return {
    subject: `[${opts.ticketId}] Nuovo ticket aperto — ${opts.subject}`,
    html: baseTemplate(`
      <p class="title">Nuovo Ticket Aperto</p>
      <p class="subtitle">Il tuo ticket è stato registrato nel sistema Dyneros.</p>
      <p>Ciao ${opts.clientName}, abbiamo ricevuto la tua richiesta. Il nostro team tecnico la prenderà in carico entro i tempi SLA previsti dal tuo piano.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Ticket ID</span><span class="info-value">${opts.ticketId}</span></div>
        <div class="info-row"><span class="info-label">Oggetto</span><span class="info-value">${opts.subject}</span></div>
        <div class="info-row"><span class="info-label">Categoria</span><span class="info-value">${opts.category}</span></div>
        <div class="info-row"><span class="info-label">Priorità</span><span class="info-value"><span class="badge ${badge}">${opts.priority.toUpperCase()}</span></span></div>
        <div class="info-row"><span class="info-label">Stato</span><span class="info-value"><span class="badge badge-info">Aperto</span></span></div>
      </div>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Visualizza Ticket &rarr;</a>
    `, `Ticket ${opts.ticketId} aperto: ${opts.subject}`),
  };
}

export function templateTicketUpdate(opts: { clientName: string; ticketId: string; subject: string; status: string; message: string; author: string; dashboardUrl: string }): { subject: string; html: string } {
  return {
    subject: `[${opts.ticketId}] Aggiornamento ticket — ${opts.subject}`,
    html: baseTemplate(`
      <p class="title">Aggiornamento Ticket</p>
      <p class="subtitle">Il tuo ticket è stato aggiornato dal team Dyneros.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Ticket ID</span><span class="info-value">${opts.ticketId}</span></div>
        <div class="info-row"><span class="info-label">Oggetto</span><span class="info-value">${opts.subject}</span></div>
        <div class="info-row"><span class="info-label">Nuovo Stato</span><span class="info-value"><span class="badge badge-info">${opts.status}</span></span></div>
        <div class="info-row"><span class="info-label">Aggiornato da</span><span class="info-value">${opts.author}</span></div>
      </div>
      <h3>Messaggio dal Team</h3>
      <div class="info-box" style="border-left:3px solid #c9922a;">
        <p style="margin:0;font-size:14px;color:#ccc;">${opts.message}</p>
      </div>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Rispondi al Ticket &rarr;</a>
    `, `Aggiornamento ticket ${opts.ticketId}: ${opts.status}`),
  };
}

export function templateContractExpiry(opts: { clientName: string; contractName: string; contractId: string; expiryDate: string; daysLeft: number; dashboardUrl: string }): { subject: string; html: string } {
  const urgency = opts.daysLeft <= 7 ? "badge-critical" : opts.daysLeft <= 30 ? "badge-warning" : "badge-info";
  const urgencyText = opts.daysLeft <= 7 ? "URGENTE" : opts.daysLeft <= 30 ? "ATTENZIONE" : "AVVISO";
  return {
    subject: `[${urgencyText}] Contratto in scadenza tra ${opts.daysLeft} giorni — ${opts.contractName}`,
    html: baseTemplate(`
      <p class="title">Contratto in Scadenza</p>
      <p class="subtitle"><span class="badge ${urgency}">${urgencyText}</span> &nbsp; Scade tra ${opts.daysLeft} giorni</p>
      <p>Ciao ${opts.clientName}, ti informiamo che il seguente contratto è prossimo alla scadenza. Ti invitiamo a contattare il tuo Account Manager per procedere al rinnovo.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Contratto</span><span class="info-value">${opts.contractName}</span></div>
        <div class="info-row"><span class="info-label">ID Documento</span><span class="info-value">${opts.contractId}</span></div>
        <div class="info-row"><span class="info-label">Data Scadenza</span><span class="info-value">${opts.expiryDate}</span></div>
        <div class="info-row"><span class="info-label">Giorni Rimanenti</span><span class="info-value"><span class="badge ${urgency}">${opts.daysLeft} giorni</span></span></div>
      </div>
      <p>Per avviare il processo di rinnovo, accedi alla tua dashboard o contatta direttamente il tuo Account Manager.</p>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Gestisci Contratto &rarr;</a>
    `, `Il contratto ${opts.contractName} scade tra ${opts.daysLeft} giorni.`),
  };
}

export function templateInvoiceOverdue(opts: { clientName: string; invoiceId: string; amount: number; currency: string; dueDate: string; description: string; dashboardUrl: string }): { subject: string; html: string } {
  const formatted = new Intl.NumberFormat("it-IT", { style: "currency", currency: opts.currency }).format(opts.amount);
  return {
    subject: `[SCADUTA] Fattura ${opts.invoiceId} — ${formatted}`,
    html: baseTemplate(`
      <p class="title">Fattura Scaduta</p>
      <p class="subtitle"><span class="badge badge-critical">SCADUTA</span> &nbsp; Pagamento non ricevuto</p>
      <p>Ciao ${opts.clientName}, la seguente fattura risulta scaduta e non ancora saldata. Ti invitiamo a procedere con il pagamento il prima possibile per evitare interruzioni ai servizi.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Fattura</span><span class="info-value">${opts.invoiceId}</span></div>
        <div class="info-row"><span class="info-label">Importo</span><span class="info-value" style="color:#c9922a;font-weight:700;">${formatted}</span></div>
        <div class="info-row"><span class="info-label">Scadenza</span><span class="info-value">${opts.dueDate}</span></div>
        <div class="info-row"><span class="info-label">Descrizione</span><span class="info-value">${opts.description}</span></div>
        <div class="info-row"><span class="info-label">Stato</span><span class="info-value"><span class="badge badge-critical">SCADUTA</span></span></div>
      </div>
      <p>Per qualsiasi chiarimento, contatta il nostro ufficio amministrativo: <a href="mailto:billing@dyneros.com" style="color:#c9922a;">billing@dyneros.com</a></p>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Visualizza Fattura &rarr;</a>
    `, `Fattura ${opts.invoiceId} scaduta — ${formatted}`),
  };
}

export function templateMilestoneAlert(opts: { clientName: string; milestoneName: string; projectName: string; projectId: string; date: string; daysLeft: number; dashboardUrl: string }): { subject: string; html: string } {
  return {
    subject: `[Milestone] ${opts.milestoneName} — ${opts.projectName} tra ${opts.daysLeft} giorni`,
    html: baseTemplate(`
      <p class="title">Milestone Imminente</p>
      <p class="subtitle"><span class="badge badge-warning">TRA ${opts.daysLeft} GIORNI</span></p>
      <p>Ciao ${opts.clientName}, ti ricordiamo che la seguente milestone si avvicina. Assicurati che tutte le attività siano completate nei tempi previsti.</p>
      <div class="info-box">
        <div class="info-row"><span class="info-label">Milestone</span><span class="info-value">${opts.milestoneName}</span></div>
        <div class="info-row"><span class="info-label">Progetto</span><span class="info-value">${opts.projectName}</span></div>
        <div class="info-row"><span class="info-label">ID Progetto</span><span class="info-value">${opts.projectId}</span></div>
        <div class="info-row"><span class="info-label">Data Prevista</span><span class="info-value">${opts.date}</span></div>
        <div class="info-row"><span class="info-label">Giorni Rimanenti</span><span class="info-value"><span class="badge badge-warning">${opts.daysLeft} giorni</span></span></div>
      </div>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Visualizza Progetto &rarr;</a>
    `, `Milestone ${opts.milestoneName} del progetto ${opts.projectName} tra ${opts.daysLeft} giorni.`),
  };
}

export function templateCriticalAlert(opts: { clientName: string; alertTitle: string; alertMessage: string; severity: "critical" | "high"; affectedService: string; timestamp: string; dashboardUrl: string }): { subject: string; html: string } {
  const badge = opts.severity === "critical" ? "badge-critical" : "badge-warning";
  const label = opts.severity === "critical" ? "CRITICO" : "ALTO";
  return {
    subject: `[ALERT ${label}] ${opts.alertTitle} — Dyneros Platform`,
    html: baseTemplate(`
      <p class="title">Alert di Sistema</p>
      <p class="subtitle"><span class="badge ${badge}">SEVERITÀ: ${label}</span></p>
      <p>Ciao ${opts.clientName}, il sistema di monitoraggio Dyneros ha rilevato un evento che richiede la tua attenzione.</p>
      <div class="info-box" style="border-left:3px solid ${opts.severity === "critical" ? "#e05555" : "#c9922a"};">
        <div class="info-row"><span class="info-label">Titolo Alert</span><span class="info-value">${opts.alertTitle}</span></div>
        <div class="info-row"><span class="info-label">Servizio Interessato</span><span class="info-value">${opts.affectedService}</span></div>
        <div class="info-row"><span class="info-label">Timestamp</span><span class="info-value">${opts.timestamp}</span></div>
        <div class="info-row"><span class="info-label">Severità</span><span class="info-value"><span class="badge ${badge}">${label}</span></span></div>
      </div>
      <h3>Dettagli</h3>
      <div class="info-box">
        <p style="margin:0;font-size:14px;color:#ccc;">${opts.alertMessage}</p>
      </div>
      <p>Il nostro team tecnico è stato notificato e sta analizzando la situazione. Riceverai un aggiornamento non appena disponibile.</p>
      <div class="divider"></div>
      <a href="${opts.dashboardUrl}" class="btn">Vai alla Dashboard &rarr;</a>
    `, `Alert ${label}: ${opts.alertTitle}`),
  };
}
