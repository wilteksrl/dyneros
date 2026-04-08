import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  hashPassword, verifyPassword, generateToken, signSessionJWT,
  sessionCookieOptions
} from "./auth-native";
import {
  sendEmail, verifySmtp,
  templateWelcome, templatePasswordReset, templateEmailVerification,
  templateNewTicket, templateTicketUpdate, templateContractExpiry,
  templateInvoiceOverdue, templateMilestoneAlert, templateCriticalAlert,
} from "./email";
const GOLD_CHAIN = {
  chainId: 24589,
  name: "DYNEROS Chain",
  rpcUrl: "https://mainnet.dyneros.com",
  explorerUrl: "https://explorer.dyneros.com",
  walletUrl: "https://wallet.dyneros.com",
  currency: "DYN",
};

const OFFICIAL_TOKENS = [
  { symbol: "dUSD", name: "Dyneros USD", contract: "0xfa69e3c56aCe1f93C6E332a656318Ba0Cc4d7e57", decimals: 18 },
  { symbol: "dGLD", name: "Dyneros Gold", contract: "0xB43369f13013799B4B5a4c6B46F80e5618B25292", decimals: 18 },
  { symbol: "WDYN", name: "Wrapped DYN", contract: "0xd270c9AA03019c894c68e4Ea134995Cd30EC226b", decimals: 18 },
  { symbol: "dUSD/WDYN LP", name: "LP Token", contract: "0x03d48a305C83E9A53c8DE3FC8f933c94Be09B1cE", decimals: 18 },
];

const OFFICIAL_CONTRACTS = {
  factory: "0xc8148DD9089fc2C6f09aAe15c347F3dFc3757451",
  router: "0xD6c26Ce48bDe29bca596Abe5C3b3DF93C6b91F97",
  weth9: "0xd270c9AA03019c894c68e4Ea134995Cd30EC226b",
};

const MOCK_PROJECTS = [
  { id: "PRJ-2026-0001", name: "Dyneros Chain Explorer v2", type: "blockchain_infrastructure", status: "in_progress", priority: "high", startDate: "2026-01-15", eta: "2026-06-30", environment: "production", stack: ["Solidity", "React", "Node.js"], progress: 65 },
  { id: "PRJ-2026-0002", name: "dUSD Stablecoin Integration", type: "smart_contract", status: "in_progress", priority: "high", startDate: "2026-02-01", eta: "2026-05-15", environment: "staging", stack: ["Solidity", "Hardhat", "TypeScript"], progress: 40 },
  { id: "PRJ-2026-0003", name: "Corporate Portal Enterprise", type: "web_app", status: "completed", priority: "medium", startDate: "2025-10-01", eta: "2026-03-31", environment: "production", stack: ["React", "tRPC", "PostgreSQL"], progress: 100 },
  { id: "PRJ-2026-0004", name: "AI Compliance Automation", type: "ai_system", status: "planning", priority: "medium", startDate: "2026-04-01", eta: "2026-09-30", environment: "staging", stack: ["Python", "LangChain", "FastAPI"], progress: 10 },
];

const MOCK_TICKETS = [
  { id: "TKT-2026-0041", subject: "RPC endpoint latency spike su mainnet", category: "blockchain_integration", priority: "critical", status: "in_progress", project: "PRJ-2026-0001", created: "2026-04-05T09:00:00Z", sla: "4h", assignee: "Marco Ferretti" },
  { id: "TKT-2026-0040", subject: "Revisione ABI smart contract dUSD", category: "smart_contract_issue", priority: "high", status: "waiting_for_client", project: "PRJ-2026-0002", created: "2026-04-03T14:30:00Z", sla: "8h", assignee: "Luca Bianchi" },
  { id: "TKT-2026-0038", subject: "Aggiornamento certificato SSL dominio staging", category: "deployment", priority: "medium", status: "open", project: "PRJ-2026-0003", created: "2026-04-01T11:00:00Z", sla: "24h", assignee: "Sara Conti" },
  { id: "TKT-2026-0035", subject: "Richiesta documentazione API v2", category: "richiesta_sviluppo", priority: "low", status: "resolved", project: "PRJ-2026-0001", created: "2026-03-28T10:00:00Z", sla: "48h", assignee: "Marco Ferretti" },
];

const MOCK_INVOICES = [
  { id: "INV-2026-0012", amount: 8500, currency: "EUR", status: "paid", issued: "2026-03-01", due: "2026-03-31", description: "Sviluppo Smart Contract dUSD — Marzo 2026" },
  { id: "INV-2026-0011", amount: 12000, currency: "EUR", status: "unpaid", issued: "2026-04-01", due: "2026-04-30", description: "Retainer mensile Enterprise — Aprile 2026" },
  { id: "INV-2026-0010", amount: 3200, currency: "EUR", status: "paid", issued: "2026-02-01", due: "2026-02-28", description: "Consulenza blockchain architecture — Febbraio 2026" },
  { id: "INV-2026-0009", amount: 1800, currency: "EUR", status: "overdue", issued: "2026-01-15", due: "2026-02-15", description: "Hosting & Deploy Q1 2026" },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "ticket_update", title: "Ticket TKT-2026-0041 aggiornato", message: "Marco Ferretti ha aggiunto un aggiornamento al ticket RPC latency.", read: false, createdAt: "2026-04-05T10:30:00Z" },
  { id: 2, type: "invoice", title: "Nuova fattura emessa", message: "Fattura INV-2026-0011 di €12.000 disponibile per il pagamento.", read: false, createdAt: "2026-04-01T09:00:00Z" },
  { id: 3, type: "milestone", title: "Milestone completata", message: "Milestone 'Smart Contract Audit' del progetto dUSD completata.", read: true, createdAt: "2026-03-30T15:00:00Z" },
  { id: 4, type: "deployment", title: "Deploy completato", message: "Corporate Portal v2.4.1 distribuito in produzione con successo.", read: true, createdAt: "2026-03-28T18:00:00Z" },
];

const MOCK_SMART_CONTRACTS = [
  { id: "SC-2026-0001", name: "dUSD Stablecoin", projectId: "PRJ-2026-0002", network: "DYNEROS Chain", address: "0xfa69e3c56aCe1f93C6E332a656318Ba0Cc4d7e57", status: "active", verified: true, deployDate: "2025-11-15", owner: "Dyneros Treasury", relatedToken: "dUSD" },
  { id: "SC-2026-0002", name: "dGLD Token", projectId: "PRJ-2026-0001", network: "DYNEROS Chain", address: "0xB43369f13013799B4B5a4c6B46F80e5618B25292", status: "active", verified: true, deployDate: "2025-11-15", owner: "Dyneros Treasury", relatedToken: "dGLD" },
  { id: "SC-2026-0003", name: "WDYN Wrapper", projectId: "PRJ-2026-0001", network: "DYNEROS Chain", address: "0xd270c9AA03019c894c68e4Ea134995Cd30EC226b", status: "active", verified: true, deployDate: "2025-10-01", owner: "Dyneros Core", relatedToken: "WDYN" },
  { id: "SC-2026-0004", name: "DEX Router", projectId: "PRJ-2026-0001", network: "DYNEROS Chain", address: "0xD6c26Ce48bDe29bca596Abe5C3b3DF93C6b91F97", status: "active", verified: true, deployDate: "2025-10-01", owner: "Dyneros Core", relatedToken: null },
];

const MOCK_DOCUMENTS = [
  { id: "DOC-2026-0001", name: "Contratto Enterprise 2026", type: "contract", category: "Contratti", size: "245 KB", uploaded: "2026-01-10", author: "Dyneros Legal", status: "signed" },
  { id: "DOC-2026-0002", name: "SOW — Blockchain Infrastructure Q1", type: "sow", category: "Preventivi", size: "180 KB", uploaded: "2026-01-15", author: "Dyneros PM", status: "approved" },
  { id: "DOC-2026-0003", name: "NDA Riservatezza 2026", type: "nda", category: "Legale", size: "95 KB", uploaded: "2026-01-05", author: "Dyneros Legal", status: "signed" },
  { id: "DOC-2026-0004", name: "Specifiche Tecniche dUSD v2", type: "technical", category: "Tecnico", size: "520 KB", uploaded: "2026-02-20", author: "Dyneros Tech", status: "final" },
  { id: "DOC-2026-0005", name: "Report Audit Smart Contract", type: "report", category: "Tecnico", size: "1.2 MB", uploaded: "2026-03-15", author: "Dyneros Security", status: "final" },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),

    register: publicProcedure
      .input(z.object({
        name: z.string().min(2),
        email: z.string().email(),
        password: z.string().min(8),
        company: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const existing = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (existing.length > 0) throw new Error("Email già registrata");
        const passwordHash = await hashPassword(input.password);
        const verifyToken = generateToken();
        const verifyExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const [inserted] = await db.insert(users).values({
          name: input.name,
          email: input.email,
          passwordHash,
          company: input.company ?? null,
          phone: input.phone ?? null,
          loginMethod: "email",
          role: "user",
          status: "active",
          emailVerified: false,
          emailVerifyToken: verifyToken,
          emailVerifyExpiry: verifyExpiry,
          openId: `native-${Date.now()}-${Math.random().toString(36).slice(2)}`,
          lastSignedIn: new Date(),
        });
        const newUser = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (!newUser[0]) throw new Error("Errore creazione utente");
        const token = await signSessionJWT(newUser[0].id, newUser[0].role);
        const secure = ctx.req.protocol === "https" || (ctx.req.headers["x-forwarded-proto"] === "https");
        ctx.res.cookie(COOKIE_NAME, token, sessionCookieOptions(secure));
        const verifyUrl = `${ctx.req.headers.origin ?? "https://dyneros.com"}/verify-email?token=${verifyToken}`;
        try {
          const tpl = templateEmailVerification({ name: input.name, verifyUrl });
          await sendEmail({ to: input.email, subject: tpl.subject, html: tpl.html });
        } catch {}
        return { success: true, user: { id: newUser[0].id, name: newUser[0].name, email: newUser[0].email, role: newUser[0].role } };
      }),

    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const rows = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        const user = rows[0];
        if (!user || !user.passwordHash) throw new Error("Credenziali non valide");
        const valid = await verifyPassword(input.password, user.passwordHash);
        if (!valid) throw new Error("Credenziali non valide");
        if (user.status === "suspended") throw new Error("Account sospeso. Contatta il supporto.");
        await db.update(users).set({ lastSignedIn: new Date(), lastLoginAt: new Date() }).where(eq(users.id, user.id));
        const token = await signSessionJWT(user.id, user.role);
        const secure = ctx.req.protocol === "https" || (ctx.req.headers["x-forwarded-proto"] === "https");
        ctx.res.cookie(COOKIE_NAME, token, sessionCookieOptions(secure));
        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    forgotPassword: publicProcedure
      .input(z.object({ email: z.string().email(), origin: z.string().optional() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: true };
        const rows = await db.select().from(users).where(eq(users.email, input.email)).limit(1);
        if (rows.length === 0) return { success: true };
        const user = rows[0];
        const token = generateToken();
        const expiry = new Date(Date.now() + 60 * 60 * 1000);
        await db.update(users).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(users.id, user.id));
        const origin = input.origin ?? "https://dyneros.com";
        const resetUrl = `${origin}/reset-password?token=${token}`;
        try {
          const tpl = templatePasswordReset({ name: user.name ?? "Utente", resetUrl, expiresIn: "1 ora" });
          await sendEmail({ to: input.email, subject: tpl.subject, html: tpl.html });
        } catch {}
        return { success: true };
      }),

    resetPassword: publicProcedure
      .input(z.object({ token: z.string(), password: z.string().min(8) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const rows = await db.select().from(users).where(eq(users.resetToken, input.token)).limit(1);
        const user = rows[0];
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) throw new Error("Token non valido o scaduto");
        const passwordHash = await hashPassword(input.password);
        await db.update(users).set({ passwordHash, resetToken: null, resetTokenExpiry: null }).where(eq(users.id, user.id));
        return { success: true };
      }),

    verifyEmail: publicProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const rows = await db.select().from(users).where(eq(users.emailVerifyToken, input.token)).limit(1);
        const user = rows[0];
        if (!user) throw new Error("Token non valido");
        await db.update(users).set({ emailVerified: true, emailVerifyToken: null, emailVerifyExpiry: null, status: "active" }).where(eq(users.id, user.id));
        return { success: true };
      }),
  }),

  network: router({
    status: publicProcedure.query(() => {
      const now = Date.now();
      const blockHeight = 1_420_000 + Math.floor((now / 1000 - 1743000000) / 2);
      const tps = 1180 + Math.floor(Math.sin(now / 30000) * 120);
      return {
        status: "operational" as const,
        blockHeight: Math.max(blockHeight, 1_420_000),
        tps: Math.max(tps, 900),
        validators: { active: 12, total: 12 },
        uptime: 99.97,
        finality: "immediate" as const,
        lastUpdated: new Date(),
        chain: GOLD_CHAIN,
      };
    }),
  }),

  dashboard: router({
    notificationCount: protectedProcedure.query(() => {
      return { count: MOCK_NOTIFICATIONS.filter(n => !n.read).length };
    }),

    stats: protectedProcedure.query(({ ctx }) => {
      const user = ctx.user;
      const tier = user.role === "admin" ? "Enterprise" : "Business";
      const customerId = `DYN-CLI-2026-${String(user.id).padStart(4, "0")}`;
      return {
        customerId,
        tier,
        accountStatus: "active" as const,
        accountManager: { name: "Alessia Romano", email: "a.romano@dyneros.com", role: "Account Manager" },
        techLead: { name: "Marco Ferretti", email: "m.ferretti@dyneros.com", role: "Technical Lead" },
        lastLogin: new Date(),
        kpi: {
          activeProjects: MOCK_PROJECTS.filter(p => p.status === "in_progress").length,
          openTickets: MOCK_TICKETS.filter(t => t.status !== "resolved" && t.status !== "closed").length,
          pendingInvoices: MOCK_INVOICES.filter(i => i.status === "unpaid" || i.status === "overdue").length,
          activeServices: 8,
          deployedContracts: MOCK_SMART_CONTRACTS.length,
          completedTasksMonth: 24,
          onlineEnvironments: 3,
          connectedWallets: 2,
          documentsShared: MOCK_DOCUMENTS.length,
        },
        recentActivity: [
          { id: 1, type: "ticket_update", text: "Ticket TKT-2026-0041 aggiornato da Marco Ferretti", time: "2h fa", icon: "ticket" },
          { id: 2, type: "invoice", text: "Fattura INV-2026-0011 emessa — €12.000", time: "3 giorni fa", icon: "invoice" },
          { id: 3, type: "milestone", text: "Milestone 'Smart Contract Audit' completata", time: "6 giorni fa", icon: "milestone" },
          { id: 4, type: "deployment", text: "Deploy Corporate Portal v2.4.1 in produzione", time: "8 giorni fa", icon: "deploy" },
          { id: 5, type: "contract", text: "Contratto Enterprise 2026 firmato digitalmente", time: "12 giorni fa", icon: "contract" },
          { id: 6, type: "project", text: "Progetto AI Compliance Automation avviato", time: "15 giorni fa", icon: "project" },
        ],
        nextMilestone: { name: "dUSD Mainnet Launch", project: "PRJ-2026-0002", date: "2026-05-15", daysLeft: 38 },
        criticalTickets: MOCK_TICKETS.filter(t => t.priority === "critical" || t.priority === "high").slice(0, 2),
      };
    }),

    projects: protectedProcedure.query(() => MOCK_PROJECTS),

    projectDetail: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        const project = MOCK_PROJECTS.find(p => p.id === input.id);
        if (!project) return null;
        return {
          ...project,
          milestones: [
            { id: 1, name: "Architettura & Design", status: "completed", date: "2026-02-15" },
            { id: 2, name: "Sviluppo Core", status: "in_progress", date: "2026-04-30" },
            { id: 3, name: "Audit & Testing", status: "pending", date: "2026-05-15" },
            { id: 4, name: "Deploy Mainnet", status: "pending", date: "2026-06-30" },
          ],
          team: [
            { name: "Marco Ferretti", role: "Technical Lead", avatar: "MF" },
            { name: "Luca Bianchi", role: "Blockchain Dev", avatar: "LB" },
            { name: "Sara Conti", role: "DevOps", avatar: "SC" },
          ],
          recentActivity: [
            { text: "Deploy su staging completato", time: "2 giorni fa" },
            { text: "Revisione codice smart contract", time: "4 giorni fa" },
            { text: "Milestone 'Audit' pianificata", time: "1 settimana fa" },
          ],
        };
      }),

    tickets: protectedProcedure.query(() => MOCK_TICKETS),

    ticketDetail: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => {
        const ticket = MOCK_TICKETS.find(t => t.id === input.id);
        if (!ticket) return null;
        return {
          ...ticket,
          description: "Sono stati rilevati picchi di latenza sull'endpoint RPC principale della mainnet Dyneros. Il tempo di risposta medio è salito da 120ms a 850ms nelle ultime 6 ore. Impatto: degradazione delle performance per le DApp connesse.",
          thread: [
            { author: "Sistema", role: "auto", text: "Ticket aperto automaticamente dal sistema di monitoring.", time: "2026-04-05T09:00:00Z" },
            { author: "Marco Ferretti", role: "dyneros", text: "Preso in carico. Sto analizzando i log del nodo validator #7.", time: "2026-04-05T09:45:00Z" },
            { author: "Sara Conti", role: "dyneros", text: "Confermato: il nodo #7 ha un problema di memoria. Stiamo procedendo con il restart controllato.", time: "2026-04-05T10:15:00Z" },
          ],
          statusHistory: [
            { status: "open", time: "2026-04-05T09:00:00Z" },
            { status: "triage", time: "2026-04-05T09:30:00Z" },
            { status: "in_progress", time: "2026-04-05T09:45:00Z" },
          ],
        };
      }),

    documents: protectedProcedure.query(() => MOCK_DOCUMENTS),

    invoices: protectedProcedure.query(() => MOCK_INVOICES),

    notifications: protectedProcedure.query(() => MOCK_NOTIFICATIONS),

    smartContracts: protectedProcedure.query(() => ({
      contracts: MOCK_SMART_CONTRACTS,
      officialTokens: OFFICIAL_TOKENS,
      officialContracts: OFFICIAL_CONTRACTS,
      chain: GOLD_CHAIN,
    })),

    blockchainInfo: protectedProcedure.query(() => ({
      chain: GOLD_CHAIN,
      tokens: OFFICIAL_TOKENS,
      contracts: OFFICIAL_CONTRACTS,
      stats: {
        totalTransactions: 4_218_904,
        totalBlocks: 1_423_412,
        activeValidators: 12,
        totalHolders: 8_241,
        totalContracts: 342,
      },
    })),

    walletInfo: protectedProcedure.query(({ ctx }) => ({
      addresses: [
        { label: "Account Principale", address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", type: "eoa" },
        { label: "Treasury Multisig", address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", type: "multisig" },
      ],
      portfolio: OFFICIAL_TOKENS.map(t => ({ ...t, balance: (Math.random() * 10000).toFixed(2) })),
      recentTx: [
        { hash: "0xabc123...def456", type: "Transfer", amount: "500 dUSD", to: "0x1234...5678", time: "2026-04-04T12:00:00Z", status: "confirmed" },
        { hash: "0xfed987...cba654", type: "Swap", amount: "100 WDYN → 98 dUSD", to: "DEX Router", time: "2026-04-03T09:30:00Z", status: "confirmed" },
      ],
      chain: GOLD_CHAIN,
    })),

    teamContacts: protectedProcedure.query(() => ({
      team: [
        { name: "Alessia Romano", role: "Account Manager", email: "a.romano@dyneros.com", status: "available", projects: ["PRJ-2026-0001", "PRJ-2026-0002"] },
        { name: "Marco Ferretti", role: "Technical Lead", email: "m.ferretti@dyneros.com", status: "available", projects: ["PRJ-2026-0001", "PRJ-2026-0002", "PRJ-2026-0004"] },
        { name: "Luca Bianchi", role: "Blockchain Specialist", email: "l.bianchi@dyneros.com", status: "busy", projects: ["PRJ-2026-0002"] },
        { name: "Sara Conti", role: "DevOps Engineer", email: "s.conti@dyneros.com", status: "available", projects: ["PRJ-2026-0003"] },
        { name: "Giulia Esposito", role: "AI Specialist", email: "g.esposito@dyneros.com", status: "available", projects: ["PRJ-2026-0004"] },
        { name: "Riccardo Mancini", role: "Billing Contact", email: "billing@dyneros.com", status: "available", projects: [] },
      ],
    })),

    domains: protectedProcedure.query(() => ({
      domains: [
        { domain: "dyneros.com", status: "active", ssl: "valid", hosting: "Dyneros Cloud", lastDeploy: "2026-04-01", environment: "production", uptime: 99.98 },
        { domain: "app.dyneros.com", status: "active", ssl: "valid", hosting: "Dyneros Cloud", lastDeploy: "2026-04-03", environment: "production", uptime: 99.95 },
        { domain: "staging.dyneros.com", status: "active", ssl: "valid", hosting: "Dyneros Cloud", lastDeploy: "2026-04-05", environment: "staging", uptime: 99.80 },
        { domain: "docs.dyneros.com", status: "active", ssl: "valid", hosting: "Dyneros Cloud", lastDeploy: "2026-03-28", environment: "production", uptime: 100 },
      ],
      deployHistory: [
        { id: "DEP-2026-0018", domain: "app.dyneros.com", version: "v2.4.1", status: "success", time: "2026-04-03T18:00:00Z", duration: "2m 34s" },
        { id: "DEP-2026-0017", domain: "staging.dyneros.com", version: "v2.5.0-beta", status: "success", time: "2026-04-05T10:00:00Z", duration: "1m 58s" },
        { id: "DEP-2026-0016", domain: "docs.dyneros.com", version: "v1.8.2", status: "success", time: "2026-03-28T14:30:00Z", duration: "45s" },
      ],
    })),

    aiProjects: protectedProcedure.query(() => ({
      projects: [
        { id: "AI-2026-0001", name: "Compliance Automation Agent", status: "in_development", environment: "staging", description: "Agente AI per automazione processi AML/KYC e compliance documentale.", lastUpdate: "2026-04-01" },
        { id: "AI-2026-0002", name: "Smart Contract Analyzer", status: "delivered", environment: "production", description: "Sistema di analisi automatica degli smart contract per rilevamento vulnerabilità.", lastUpdate: "2026-03-15" },
      ],
    })),

    securityInfo: protectedProcedure.query(({ ctx }) => ({
      authMethod: "Manus OAuth",
      twoFa: false,
      activeSessions: [
        { device: "Chrome / macOS", location: "Milano, IT", ip: "185.12.xx.xx", lastActive: new Date().toISOString(), current: true },
        { device: "Safari / iPhone", location: "Roma, IT", ip: "151.38.xx.xx", lastActive: new Date(Date.now() - 3600000).toISOString(), current: false },
      ],
      securityLog: [
        { event: "Login riuscito via Manus OAuth", ip: "185.12.xx.xx", time: new Date().toISOString(), severity: "low" },
        { event: "Sessione terminata manualmente", ip: "151.38.xx.xx", time: new Date(Date.now() - 86400000).toISOString(), severity: "low" },
        { event: "Tentativo di accesso fallito", ip: "91.108.xx.xx", time: new Date(Date.now() - 172800000).toISOString(), severity: "high" },
      ],
    })),

    apiKeys: protectedProcedure.query(() => ({
      keys: [
        { id: "key_prod_1", name: "Produzione — Backend", prefix: "dyn_live_", created: "2026-01-10", lastUsed: "2026-04-05", status: "active", permissions: ["read", "write", "blockchain"] },
        { id: "key_stg_1", name: "Staging — Test", prefix: "dyn_test_", created: "2026-02-01", lastUsed: "2026-04-04", status: "active", permissions: ["read", "blockchain"] },
      ],
    })),

    knowledgeBase: protectedProcedure.query(() => ({
      articles: [
        { id: "kb-001", title: "Come aggiungere la DYNEROS Chain a MetaMask", category: "Blockchain", views: 1240, updated: "2026-03-15" },
        { id: "kb-002", title: "Guida all'integrazione RPC Mainnet", category: "Sviluppo", views: 890, updated: "2026-03-20" },
        { id: "kb-003", title: "Come aprire un ticket di supporto", category: "Supporto", views: 670, updated: "2026-02-28" },
        { id: "kb-004", title: "Fatturazione e metodi di pagamento", category: "Billing", views: 540, updated: "2026-03-01" },
        { id: "kb-005", title: "Gestione chiavi API e sicurezza", category: "Sicurezza", views: 420, updated: "2026-03-10" },
        { id: "kb-006", title: "Deploy smart contract su DYNEROS Chain", category: "Blockchain", views: 1100, updated: "2026-04-01" },
      ],
    })),

    data: protectedProcedure.query(({ ctx }) => {
      const user = ctx.user;
      const tier = user.role === "admin" ? "Enterprise" : "Business";
      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        service: {
          tier,
          status: "active" as const,
          txUsed: 284_312,
          txLimit: tier === "Enterprise" ? null : 500_000,
          nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        network: {
          chainId: 24589,
          rpcEndpoint: "https://mainnet.dyneros.com",
          wsEndpoint: "wss://mainnet.dyneros.com",
          explorerUrl: "https://explorer.dyneros.com",
          walletUrl: "https://wallet.dyneros.com",
        },
      };
    }),
  }),

  email: router({
    verifySmtp: protectedProcedure.mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") return { ok: false, error: "Accesso negato" };
      return verifySmtp();
    }),

    sendTest: protectedProcedure
      .input(z.object({ to: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") return { ok: false, error: "Accesso negato" };
        const tpl = templateCriticalAlert({
          clientName: ctx.user.name ?? "Utente",
          alertTitle: "Test Email Sistema Dyneros",
          alertMessage: "Questa è un'email di test per verificare la configurazione SMTP della piattaforma Dyneros. Se hai ricevuto questo messaggio, la configurazione è corretta.",
          severity: "high",
          affectedService: "Sistema Email",
          timestamp: new Date().toLocaleString("it-IT"),
          dashboardUrl: "https://dyneros.com/dashboard",
        });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendWelcome: protectedProcedure
      .input(z.object({ to: z.string().email(), name: z.string(), customerId: z.string() }))
      .mutation(async ({ input }) => {
        const tpl = templateWelcome({ name: input.name, dashboardUrl: "https://dyneros.com/dashboard", customerId: input.customerId });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendPasswordReset: publicProcedure
      .input(z.object({ to: z.string().email(), name: z.string(), resetUrl: z.string().url() }))
      .mutation(async ({ input }) => {
        const tpl = templatePasswordReset({ name: input.name, resetUrl: input.resetUrl, expiresIn: "1 ora" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendEmailVerification: publicProcedure
      .input(z.object({ to: z.string().email(), name: z.string(), verifyUrl: z.string().url() }))
      .mutation(async ({ input }) => {
        const tpl = templateEmailVerification({ name: input.name, verifyUrl: input.verifyUrl });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendNewTicket: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        ticketId: z.string(),
        subject: z.string(),
        priority: z.string(),
        category: z.string(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateNewTicket({ ...input, dashboardUrl: `https://dyneros.com/dashboard/tickets` });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendTicketUpdate: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        ticketId: z.string(),
        subject: z.string(),
        status: z.string(),
        message: z.string(),
        author: z.string(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateTicketUpdate({ ...input, dashboardUrl: `https://dyneros.com/dashboard/tickets` });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendContractExpiry: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        contractName: z.string(),
        contractId: z.string(),
        expiryDate: z.string(),
        daysLeft: z.number(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateContractExpiry({ ...input, dashboardUrl: "https://dyneros.com/dashboard/contracts" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendInvoiceOverdue: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        invoiceId: z.string(),
        amount: z.number(),
        currency: z.string(),
        dueDate: z.string(),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateInvoiceOverdue({ ...input, dashboardUrl: "https://dyneros.com/dashboard/invoices" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendMilestoneAlert: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        milestoneName: z.string(),
        projectName: z.string(),
        projectId: z.string(),
        date: z.string(),
        daysLeft: z.number(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateMilestoneAlert({ ...input, dashboardUrl: `https://dyneros.com/dashboard/projects` });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendCriticalAlert: protectedProcedure
      .input(z.object({
        to: z.string().email(),
        clientName: z.string(),
        alertTitle: z.string(),
        alertMessage: z.string(),
        severity: z.enum(["critical", "high"]),
        affectedService: z.string(),
      }))
      .mutation(async ({ input }) => {
        const tpl = templateCriticalAlert({
          ...input,
          timestamp: new Date().toLocaleString("it-IT"),
          dashboardUrl: "https://dyneros.com/dashboard",
        });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    smtpConfig: protectedProcedure.query(({ ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") return null;
      return {
        host: process.env.SMTP_HOST ?? "",
        port: process.env.SMTP_PORT ?? "587",
        user: process.env.SMTP_USER ?? "",
        fromName: process.env.SMTP_FROM_NAME ?? "",
        fromEmail: process.env.SMTP_FROM_EMAIL ?? "",
        configured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      };
    }),
  }),

  superadmin: router({
    listUsers: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        status: users.status,
        company: users.company,
        emailVerified: users.emailVerified,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
      }).from(users).orderBy(users.createdAt);
    }),

    updateUserRole: protectedProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin", "superadmin"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        if (input.userId === ctx.user.id) throw new Error("Non puoi modificare il tuo stesso ruolo");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(users).set({ role: input.role }).where(eq(users.id, input.userId));
        return { success: true };
      }),

    updateUserStatus: protectedProcedure
      .input(z.object({ userId: z.number(), status: z.enum(["active", "suspended"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        if (input.userId === ctx.user.id) throw new Error("Non puoi sospendere te stesso");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(users).set({ status: input.status }).where(eq(users.id, input.userId));
        return { success: true };
      }),

    deleteUser: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        if (input.userId === ctx.user.id) throw new Error("Non puoi eliminare te stesso");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.delete(users).where(eq(users.id, input.userId));
        return { success: true };
      }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return { total: 0, active: 0, suspended: 0, admins: 0, newThisMonth: 0 };
      const all = await db.select({ role: users.role, status: users.status, createdAt: users.createdAt }).from(users);
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        total: all.length,
        active: all.filter(u => u.status === "active").length,
        suspended: all.filter(u => u.status === "suspended").length,
        admins: all.filter(u => u.role === "admin" || u.role === "superadmin").length,
        newThisMonth: all.filter(u => u.createdAt >= monthStart).length,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
