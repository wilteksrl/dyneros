import { systemRouter } from "./_core/systemRouter";
import { affiliateRouter } from "./affiliate";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { eq, and, desc, asc, count, sql, isNull, sum } from "drizzle-orm";
import { getDb } from "./db";
import {
  users, projects, tickets, ticketReplies, invoices, contracts,
  documents, wallets, smartContracts, domains, aiProjects,
  notifications, userSettings, apiKeys, auditLog,
  affiliateProfiles, affiliateConversions, affiliatePayouts,
  affiliateLeads, emailLog
} from "../drizzle/schema";
import { COOKIE_NAME } from "@shared/const";
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
import crypto from "crypto";

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

function generateApiKey(): { key: string; prefix: string; hash: string } {
  const raw = `dyn_live_${crypto.randomBytes(24).toString("hex")}`;
  const prefix = raw.slice(0, 12);
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  return { key: raw, prefix, hash };
}

export const appRouter = router({
  system: systemRouter,
  affiliate: affiliateRouter,

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
        await db.insert(users).values({
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
        await db.insert(userSettings).values({ userId: newUser[0].id }).catch(() => {});
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
      const secure = ctx.req.protocol === "https" ||
        ctx.req.headers["x-forwarded-proto"] === "https";
      ctx.res.clearCookie(COOKIE_NAME, {
        httpOnly: true,
        secure,
        sameSite: secure ? "none" : "lax",
        path: "/",
        maxAge: -1,
      });
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
    notificationCount: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { count: 0 };
      const rows = await db.select({ c: count() }).from(notifications)
        .where(and(eq(notifications.userId, ctx.user.id), eq(notifications.read, false)));
      return { count: rows[0]?.c ?? 0 };
    }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      const user = ctx.user;
      const tier = user.role === "admin" || user.role === "superadmin" ? "Enterprise" : "Business";
      const customerId = `DYN-CLI-2026-${String(user.id).padStart(4, "0")}`;
      let kpi = { activeProjects: 0, openTickets: 0, pendingInvoices: 0, activeServices: 8, deployedContracts: 0, completedTasksMonth: 0, onlineEnvironments: 0, connectedWallets: 0, documentsShared: 0 };
      let recentActivity: { id: number; type: string; text: string; time: string; icon: string }[] = [];
      let criticalTickets: { id: number; ticketNumber: string; subject: string; priority: string; status: string }[] = [];
      if (db) {
        const [pRows, tRows, iRows, scRows, wRows, dRows] = await Promise.all([
          db.select({ c: count() }).from(projects).where(and(eq(projects.userId, user.id), eq(projects.status, "in_progress"))),
          db.select({ c: count() }).from(tickets).where(and(eq(tickets.userId, user.id), sql`status NOT IN ('resolved','closed')`)),
          db.select({ c: count() }).from(invoices).where(and(eq(invoices.userId, user.id), sql`status IN ('unpaid','overdue')`)),
          db.select({ c: count() }).from(smartContracts).where(eq(smartContracts.userId, user.id)),
          db.select({ c: count() }).from(wallets).where(eq(wallets.userId, user.id)),
          db.select({ c: count() }).from(documents).where(and(eq(documents.userId, user.id), isNull(documents.deletedAt))),
        ]);
        kpi = {
          activeProjects: pRows[0]?.c ?? 0,
          openTickets: tRows[0]?.c ?? 0,
          pendingInvoices: iRows[0]?.c ?? 0,
          activeServices: scRows[0]?.c ?? 0,
          deployedContracts: scRows[0]?.c ?? 0,
          completedTasksMonth: 0,
          onlineEnvironments: wRows[0]?.c ?? 0,
          connectedWallets: wRows[0]?.c ?? 0,
          documentsShared: dRows[0]?.c ?? 0,
        };
        const critRows = await db.select({ id: tickets.id, ticketNumber: tickets.ticketNumber, subject: tickets.subject, priority: tickets.priority, status: tickets.status })
          .from(tickets).where(and(eq(tickets.userId, user.id), sql`priority IN ('critical','high') AND status NOT IN ('resolved','closed')`)).limit(2);
        criticalTickets = critRows;
        const notifRows = await db.select().from(notifications).where(eq(notifications.userId, user.id)).orderBy(desc(notifications.createdAt)).limit(6);
        recentActivity = notifRows.map((n, i) => ({
          id: n.id,
          type: n.type,
          text: n.title,
          time: new Date(n.createdAt).toLocaleDateString("it-IT"),
          icon: n.type,
        }));
      }
      return {
        customerId, tier,
        accountStatus: "active" as const,
        accountManager: { name: "Dyneros Support", email: "support@dyneros.com", role: "Account Manager" },
        techLead: { name: "Dyneros Tech", email: "tech@dyneros.com", role: "Technical Lead" },
        lastLogin: new Date(),
        kpi,
        recentActivity,
        nextMilestone: null,
        criticalTickets,
      };
    }),

    projects: protectedProcedure
      .input(z.object({ status: z.string().optional(), search: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        let q = db.select().from(projects).where(eq(projects.userId, ctx.user.id)).$dynamic();
        const rows = await q.orderBy(desc(projects.createdAt));
        return rows.filter(p => {
          if (input?.status && input.status !== "all" && p.status !== input.status) return false;
          if (input?.search && !p.name.toLowerCase().includes(input.search.toLowerCase())) return false;
          return true;
        });
      }),

    createProject: protectedProcedure
      .input(z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        type: z.enum(["blockchain_infrastructure", "smart_contract", "web_app", "ai_system", "other"]),
        priority: z.enum(["low", "medium", "high"]),
        environment: z.enum(["dev", "staging", "production"]),
        eta: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.insert(projects).values({
          userId: ctx.user.id,
          name: input.name,
          description: input.description ?? null,
          type: input.type,
          priority: input.priority,
          environment: input.environment,
          status: "planning",
          progress: 0,
          startDate: new Date(),
          eta: input.eta ? new Date(input.eta) : null,
        });
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "system",
          title: `Progetto "${input.name}" creato`,
          message: `Il progetto è stato creato con successo.`,
          read: false,
        });
        return { success: true };
      }),

    updateProject: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["planning", "in_progress", "completed", "on_hold"]).optional(),
        progress: z.number().min(0).max(100).optional(),
        priority: z.enum(["low", "medium", "high"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const { id, ...updates } = input;
        await db.update(projects).set(updates).where(and(eq(projects.id, id), eq(projects.userId, ctx.user.id)));
        return { success: true };
      }),

    tickets: protectedProcedure
      .input(z.object({ status: z.string().optional(), priority: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(tickets).where(eq(tickets.userId, ctx.user.id)).orderBy(desc(tickets.createdAt));
        return rows.filter(t => {
          if (input?.status && input.status !== "all" && t.status !== input.status) return false;
          if (input?.priority && input.priority !== "all" && t.priority !== input.priority) return false;
          return true;
        });
      }),

    ticketDetail: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return null;
        const rows = await db.select().from(tickets).where(and(eq(tickets.id, input.id), eq(tickets.userId, ctx.user.id))).limit(1);
        if (!rows[0]) return null;
        const replies = await db.select({
          id: ticketReplies.id,
          message: ticketReplies.message,
          isStaff: ticketReplies.isStaff,
          createdAt: ticketReplies.createdAt,
          userName: users.name,
        }).from(ticketReplies)
          .leftJoin(users, eq(ticketReplies.userId, users.id))
          .where(eq(ticketReplies.ticketId, input.id))
          .orderBy(asc(ticketReplies.createdAt));
        return { ...rows[0], replies };
      }),

    createTicket: protectedProcedure
      .input(z.object({
        subject: z.string().min(5),
        description: z.string().optional(),
        category: z.string(),
        priority: z.enum(["low", "medium", "high", "critical"]),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const countRows = await db.select({ c: count() }).from(tickets).where(eq(tickets.userId, ctx.user.id));
        const num = (countRows[0]?.c ?? 0) + 1;
        const ticketNumber = `TKT-${new Date().getFullYear()}-${String(num).padStart(4, "0")}`;
        const slaMap: Record<string, number> = { low: 48, medium: 24, high: 8, critical: 4 };
        await db.insert(tickets).values({
          userId: ctx.user.id,
          ticketNumber,
          subject: input.subject,
          description: input.description ?? null,
          category: input.category,
          priority: input.priority,
          status: "open",
          slaHours: slaMap[input.priority] ?? 24,
          projectId: input.projectId ?? null,
        });
        await db.insert(notifications).values({
          userId: ctx.user.id,
          type: "ticket_update",
          title: `Ticket ${ticketNumber} aperto`,
          message: input.subject,
          read: false,
        });
        return { success: true, ticketNumber };
      }),

    replyTicket: protectedProcedure
      .input(z.object({ ticketId: z.number(), message: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.insert(ticketReplies).values({
          ticketId: input.ticketId,
          userId: ctx.user.id,
          message: input.message,
          isStaff: false,
        });
        await db.update(tickets).set({ status: "waiting_for_client", updatedAt: new Date() }).where(eq(tickets.id, input.ticketId));
        return { success: true };
      }),

    invoices: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(invoices).where(eq(invoices.userId, ctx.user.id)).orderBy(desc(invoices.issued));
        return rows.filter(i => {
          if (input?.status && input.status !== "all" && i.status !== input.status) return false;
          return true;
        });
      }),

    contracts: protectedProcedure
      .input(z.object({ status: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(contracts).where(eq(contracts.userId, ctx.user.id)).orderBy(desc(contracts.createdAt));
        return rows.filter(c => {
          if (input?.status && input.status !== "all" && c.status !== input.status) return false;
          return true;
        });
      }),

    documents: protectedProcedure
      .input(z.object({ category: z.string().optional(), search: z.string().optional() }).optional())
      .query(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) return [];
        const rows = await db.select().from(documents)
          .where(and(eq(documents.userId, ctx.user.id), isNull(documents.deletedAt)))
          .orderBy(desc(documents.createdAt));
        return rows.filter(d => {
          if (input?.category && input.category !== "all" && d.category !== input.category) return false;
          if (input?.search && !d.name.toLowerCase().includes(input.search.toLowerCase())) return false;
          return true;
        });
      }),

    notifications: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(notifications).where(eq(notifications.userId, ctx.user.id)).orderBy(desc(notifications.createdAt)).limit(50);
    }),

    markNotificationRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(notifications).set({ read: true }).where(and(eq(notifications.id, input.id), eq(notifications.userId, ctx.user.id)));
        return { success: true };
      }),

    markAllNotificationsRead: protectedProcedure.mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      await db.update(notifications).set({ read: true }).where(eq(notifications.userId, ctx.user.id));
      return { success: true };
    }),

    smartContracts: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      let userContracts: typeof smartContracts.$inferSelect[] = [];
      if (db) {
        userContracts = await db.select().from(smartContracts).where(eq(smartContracts.userId, ctx.user.id)).orderBy(desc(smartContracts.createdAt));
      }
      return {
        contracts: userContracts,
        officialTokens: OFFICIAL_TOKENS,
        officialContracts: OFFICIAL_CONTRACTS,
        chain: GOLD_CHAIN,
      };
    }),

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

    walletInfo: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      let userWallets: typeof wallets.$inferSelect[] = [];
      if (db) {
        userWallets = await db.select().from(wallets).where(eq(wallets.userId, ctx.user.id));
      }
      return {
        addresses: userWallets.map(w => ({ id: w.id, label: w.name ?? "Wallet", address: w.address, type: "eoa" })),
        portfolio: OFFICIAL_TOKENS.map(t => ({ ...t, balance: "0.00" })),
        recentTx: [],
        chain: GOLD_CHAIN,
      };
    }),

    teamContacts: protectedProcedure.query(async () => {
      const db = await getDb();
      const fallback = [
        { name: "Alessia Romano", role: "Account Manager", email: "a.romano@dyneros.com", status: "available", projects: [] },
        { name: "Marco Ferretti", role: "Technical Lead", email: "m.ferretti@dyneros.com", status: "available", projects: [] },
        { name: "Luca Bianchi", role: "Blockchain Specialist", email: "l.bianchi@dyneros.com", status: "busy", projects: [] },
        { name: "Sara Conti", role: "DevOps Engineer", email: "s.conti@dyneros.com", status: "available", projects: [] },
        { name: "Giulia Esposito", role: "AI Specialist", email: "g.esposito@dyneros.com", status: "available", projects: [] },
        { name: "Riccardo Mancini", role: "Billing Contact", email: "billing@dyneros.com", status: "available", projects: [] },
      ];
      if (!db) return { team: fallback };
      const admins = await db.select({ id: users.id, name: users.name, email: users.email, role: users.role }).from(users).where(sql`${users.role} IN ('admin', 'superadmin')`).limit(20);
      if (admins.length === 0) return { team: fallback };
      const roleLabel: Record<string, string> = { superadmin: "Responsabile Piattaforma", admin: "Amministratore" };
      return {
        team: admins.map(a => ({
          name: a.name ?? a.email,
          role: roleLabel[a.role] ?? "Staff",
          email: a.email,
          status: "available",
          projects: [],
        })),
      };
    }),

    addWallet: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        address: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Indirizzo non valido (formato 0x...)"),
        network: z.string().default("DYNEROS Chain"),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const existing = await db.select({ id: wallets.id }).from(wallets).where(eq(wallets.address, input.address)).limit(1);
        if (existing.length > 0) throw new Error("Indirizzo già registrato");
        await db.insert(wallets).values({ userId: ctx.user.id, name: input.name, address: input.address, network: input.network });
        return { success: true };
      }),

    removeWallet: protectedProcedure
      .input(z.object({ walletId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.delete(wallets).where(and(eq(wallets.id, input.walletId), eq(wallets.userId, ctx.user.id)));
        return { success: true };
      }),

    addDomain: protectedProcedure
      .input(z.object({
        domainName: z.string().min(3),
        registrar: z.string().optional(),
        expiryDate: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.insert(domains).values({
          userId: ctx.user.id,
          domainName: input.domainName,
          registrar: input.registrar ?? null,
          expiryDate: input.expiryDate ? new Date(input.expiryDate) : null,
          status: "active",
          sslStatus: "valid",
        });
        return { success: true };
      }),

    removeDomain: protectedProcedure
      .input(z.object({ domainId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.delete(domains).where(and(eq(domains.id, input.domainId), eq(domains.userId, ctx.user.id)));
        return { success: true };
      }),

    domains: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      let userDomains: typeof domains.$inferSelect[] = [];
      if (db) {
        userDomains = await db.select().from(domains).where(eq(domains.userId, ctx.user.id));
      }
      return {
        domains: userDomains.map(d => ({
          id: d.id,
          domain: d.domainName,
          status: d.status,
          ssl: d.sslStatus,
          hosting: "Dyneros Cloud",
          lastDeploy: d.createdAt.toISOString(),
          environment: "production",
          uptime: 99.98,
        })),
        deployHistory: [],
      };
    }),

    aiProjects: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      let rows: typeof aiProjects.$inferSelect[] = [];
      if (db) {
        rows = await db.select().from(aiProjects).where(eq(aiProjects.userId, ctx.user.id)).orderBy(desc(aiProjects.createdAt));
      }
      return { projects: rows };
    }),

    securityInfo: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      let auditRows: typeof auditLog.$inferSelect[] = [];
      if (db) {
        auditRows = await db.select().from(auditLog).where(eq(auditLog.userId, ctx.user.id)).orderBy(desc(auditLog.createdAt)).limit(10);
      }
      return {
        authMethod: "Email / Password",
        twoFa: false,
        activeSessions: [
          { device: "Browser attuale", location: "—", ip: "—", lastActive: new Date().toISOString(), current: true },
        ],
        securityLog: auditRows.map(r => ({
          event: r.action,
          ip: r.ipAddress ?? "—",
          time: r.createdAt.toISOString(),
          severity: "low",
        })),
      };
    }),

    apiKeys: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { keys: [] };
      const rows = await db.select({
        id: apiKeys.id,
        name: apiKeys.name,
        keyPrefix: apiKeys.keyPrefix,
        scopes: apiKeys.scopes,
        lastUsedAt: apiKeys.lastUsedAt,
        revokedAt: apiKeys.revokedAt,
        createdAt: apiKeys.createdAt,
      }).from(apiKeys).where(and(eq(apiKeys.userId, ctx.user.id), isNull(apiKeys.revokedAt))).orderBy(desc(apiKeys.createdAt));
      return {
        keys: rows.map(k => ({
          id: String(k.id),
          name: k.name,
          prefix: k.keyPrefix,
          created: k.createdAt.toISOString().slice(0, 10),
          lastUsed: k.lastUsedAt?.toISOString().slice(0, 10) ?? "Mai",
          status: "active",
          permissions: k.scopes.split(","),
        })),
      };
    }),

    generateApiKey: protectedProcedure
      .input(z.object({ name: z.string().min(2), scopes: z.array(z.string()).min(1) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const { key, prefix, hash } = generateApiKey();
        await db.insert(apiKeys).values({
          userId: ctx.user.id,
          name: input.name,
          keyHash: hash,
          keyPrefix: prefix,
          scopes: input.scopes.join(","),
        });
        return { success: true, key };
      }),

    revokeApiKey: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(apiKeys).set({ revokedAt: new Date() }).where(and(eq(apiKeys.id, input.id), eq(apiKeys.userId, ctx.user.id)));
        return { success: true };
      }),

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

    settings: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return { language: "it", theme: "dark", notificationsEmail: true, notificationsTickets: true, notificationsInvoices: true, notificationsMilestones: true };
      const rows = await db.select().from(userSettings).where(eq(userSettings.userId, ctx.user.id)).limit(1);
      if (rows[0]) return rows[0];
      await db.insert(userSettings).values({ userId: ctx.user.id }).catch(() => {});
      return { language: "it" as const, theme: "dark" as const, notificationsEmail: true, notificationsTickets: true, notificationsInvoices: true, notificationsMilestones: true };
    }),

    updateSettings: protectedProcedure
      .input(z.object({
        language: z.enum(["it", "en"]).optional(),
        theme: z.enum(["dark", "light"]).optional(),
        notificationsEmail: z.boolean().optional(),
        notificationsTickets: z.boolean().optional(),
        notificationsInvoices: z.boolean().optional(),
        notificationsMilestones: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const existing = await db.select().from(userSettings).where(eq(userSettings.userId, ctx.user.id)).limit(1);
        if (existing.length === 0) {
          await db.insert(userSettings).values({ userId: ctx.user.id, ...input });
        } else {
          await db.update(userSettings).set(input).where(eq(userSettings.userId, ctx.user.id));
        }
        return { success: true };
      }),

    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().min(2).optional(),
        company: z.string().optional(),
        phone: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(users).set(input).where(eq(users.id, ctx.user.id));
        return { success: true };
      }),

    changePassword: protectedProcedure
      .input(z.object({ currentPassword: z.string(), newPassword: z.string().min(8) }))
      .mutation(async ({ ctx, input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const rows = await db.select().from(users).where(eq(users.id, ctx.user.id)).limit(1);
        const user = rows[0];
        if (!user || !user.passwordHash) throw new Error("Utente non trovato");
        const valid = await verifyPassword(input.currentPassword, user.passwordHash);
        if (!valid) throw new Error("Password attuale non corretta");
        const newHash = await hashPassword(input.newPassword);
        await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, user.id));
        await db.insert(auditLog).values({
          userId: user.id,
          action: "password_changed",
          resource: "user",
          resourceId: String(user.id),
          ipAddress: "—",
        });
        return { success: true };
      }),

    data: protectedProcedure.query(({ ctx }) => {
      const user = ctx.user;
      const tier = user.role === "admin" || user.role === "superadmin" ? "Enterprise" : "Business";
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
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") return { ok: false, error: "Accesso negato" };
      return verifySmtp();
    }),

    sendTest: protectedProcedure
      .input(z.object({ to: z.string().email() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") return { ok: false, error: "Accesso negato" };
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
      .input(z.object({ to: z.string().email(), clientName: z.string(), ticketId: z.string(), subject: z.string(), priority: z.string(), category: z.string() }))
      .mutation(async ({ input }) => {
        const tpl = templateNewTicket({ ...input, dashboardUrl: "https://dyneros.com/dashboard/tickets" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendTicketUpdate: protectedProcedure
      .input(z.object({ to: z.string().email(), clientName: z.string(), ticketId: z.string(), subject: z.string(), status: z.string(), message: z.string(), author: z.string() }))
      .mutation(async ({ input }) => {
        const tpl = templateTicketUpdate({ ...input, dashboardUrl: "https://dyneros.com/dashboard/tickets" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendContractExpiry: protectedProcedure
      .input(z.object({ to: z.string().email(), clientName: z.string(), contractName: z.string(), contractId: z.string(), expiryDate: z.string(), daysLeft: z.number() }))
      .mutation(async ({ input }) => {
        const tpl = templateContractExpiry({ ...input, dashboardUrl: "https://dyneros.com/dashboard/contracts" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendInvoiceOverdue: protectedProcedure
      .input(z.object({ to: z.string().email(), clientName: z.string(), invoiceId: z.string(), amount: z.number(), currency: z.string(), dueDate: z.string(), description: z.string() }))
      .mutation(async ({ input }) => {
        const tpl = templateInvoiceOverdue({ ...input, dashboardUrl: "https://dyneros.com/dashboard/invoices" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendMilestoneAlert: protectedProcedure
      .input(z.object({ to: z.string().email(), clientName: z.string(), milestoneName: z.string(), projectName: z.string(), projectId: z.string(), date: z.string(), daysLeft: z.number() }))
      .mutation(async ({ input }) => {
        const tpl = templateMilestoneAlert({ ...input, dashboardUrl: "https://dyneros.com/dashboard/projects" });
        return sendEmail({ to: input.to, subject: tpl.subject, html: tpl.html });
      }),

    sendCriticalAlert: protectedProcedure
      .input(z.object({ to: z.string().email(), clientName: z.string(), alertTitle: z.string(), alertMessage: z.string(), severity: z.enum(["critical", "high"]), affectedService: z.string() }))
      .mutation(async ({ input }) => {
        const tpl = templateCriticalAlert({ ...input, timestamp: new Date().toLocaleString("it-IT"), dashboardUrl: "https://dyneros.com/dashboard" });
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

    listUsersPaged: protectedProcedure
      .input(z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(25),
        search: z.string().optional(),
        role: z.enum(["user", "admin", "superadmin", "all"]).default("all"),
        status: z.enum(["active", "suspended", "pending", "all"]).default("all"),
      }))
      .query(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) return { rows: [], total: 0, pages: 0 };
        const offset = (input.page - 1) * input.limit;
        const conditions: ReturnType<typeof eq>[] = [];
        if (input.role !== "all") conditions.push(eq(users.role, input.role as "user" | "admin" | "superadmin"));
        if (input.status !== "all") conditions.push(eq(users.status, input.status as "active" | "suspended" | "pending"));
        if (input.search) {
          const s = `%${input.search}%`;
          conditions.push(sql`(${users.name} LIKE ${s} OR ${users.email} LIKE ${s} OR ${users.company} LIKE ${s})` as ReturnType<typeof eq>);
        }
        const where = conditions.length > 0 ? and(...conditions) : undefined;
        const [rows, totalRows] = await Promise.all([
          db.select({ id: users.id, name: users.name, email: users.email, role: users.role, status: users.status, company: users.company, emailVerified: users.emailVerified, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users).where(where).orderBy(desc(users.createdAt)).limit(input.limit).offset(offset),
          db.select({ c: count() }).from(users).where(where),
        ]);
        const total = totalRows[0]?.c ?? 0;
        return { rows, total, pages: Math.ceil(total / input.limit) };
      }),

    sendEmail: protectedProcedure
      .input(z.object({ to: z.string().email(), subject: z.string().min(1), body: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        const result = await sendEmail({ to: input.to, subject: input.subject, html: `<div style="font-family:sans-serif">${input.body.replace(/\n/g, "<br>")}</div>` });
        if (db) await db.insert(emailLog).values({ sentBy: ctx.user.id, toEmail: input.to, subject: input.subject, body: input.body, status: result.ok ? "sent" : "failed", errorMessage: result.error ?? null, isBulk: false, recipientCount: 1 }).catch(() => {});
        return result;
      }),

    sendBulkEmail: protectedProcedure
      .input(z.object({ filter: z.enum(["all", "user", "admin", "active", "pending"]), subject: z.string().min(1), body: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const allUsers = await db.select({ email: users.email, role: users.role, status: users.status }).from(users);
        const recipients = allUsers.filter(u => {
          if (input.filter === "all") return true;
          if (input.filter === "user" || input.filter === "admin") return u.role === input.filter;
          if (input.filter === "active") return u.status === "active";
          if (input.filter === "pending") return u.status === "pending";
          return false;
        });
        let sent = 0; let failed = 0;
        for (const r of recipients) {
          if (!r.email) continue;
          const res = await sendEmail({ to: r.email, subject: input.subject, html: `<div style="font-family:sans-serif">${input.body.replace(/\n/g, "<br>")}</div>` });
          if (res.ok) sent++; else failed++;
        }
        await db.insert(emailLog).values({ sentBy: ctx.user.id, toEmail: `bulk:${input.filter}`, subject: input.subject, body: input.body, status: failed === 0 ? "sent" : "failed", isBulk: true, recipientCount: recipients.length }).catch(() => {});
        return { sent, failed, total: recipients.length };
      }),

    emailHistory: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select().from(emailLog).orderBy(desc(emailLog.createdAt)).limit(50);
    }),

    auditLogList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select().from(auditLog).orderBy(desc(auditLog.createdAt)).limit(50);
    }),

    dbStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      const results = await Promise.all([
        db.select({ c: count() }).from(users).then(r => ({ table: "users", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(projects).then(r => ({ table: "projects", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(tickets).then(r => ({ table: "tickets", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(invoices).then(r => ({ table: "invoices", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(contracts).then(r => ({ table: "contracts", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(documents).then(r => ({ table: "documents", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(wallets).then(r => ({ table: "wallets", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(smartContracts).then(r => ({ table: "smart_contracts", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(notifications).then(r => ({ table: "notifications", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(apiKeys).then(r => ({ table: "api_keys", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(affiliateProfiles).then(r => ({ table: "affiliate_profiles", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(affiliateConversions).then(r => ({ table: "affiliate_conversions", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(emailLog).then(r => ({ table: "email_log", count: r[0]?.c ?? 0 })),
        db.select({ c: count() }).from(auditLog).then(r => ({ table: "audit_log", count: r[0]?.c ?? 0 })),
      ]);
      return results;
    }),

    envStatus: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      return [
        { key: "DATABASE_URL", configured: !!process.env.DATABASE_URL },
        { key: "SMTP_HOST", configured: !!process.env.SMTP_HOST },
        { key: "SMTP_USER", configured: !!process.env.SMTP_USER },
        { key: "SMTP_PASS", configured: !!process.env.SMTP_PASS },
        { key: "SMTP_PORT", configured: !!process.env.SMTP_PORT },
        { key: "SMTP_FROM_EMAIL", configured: !!process.env.SMTP_FROM_EMAIL },
        { key: "JWT_SECRET", configured: !!process.env.JWT_SECRET },
        { key: "VITE_APP_ID", configured: !!process.env.VITE_APP_ID },
        { key: "BUILT_IN_FORGE_API_KEY", configured: !!process.env.BUILT_IN_FORGE_API_KEY },
        { key: "VITE_ANALYTICS_ENDPOINT", configured: !!process.env.VITE_ANALYTICS_ENDPOINT },
      ];
    }),

    affiliateList: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return { profiles: [], stats: { totalConversions: 0, pendingPayouts: "0" } };
      const [profiles, convRows, payoutRows] = await Promise.all([
        db.select().from(affiliateProfiles).orderBy(desc(affiliateProfiles.createdAt)),
        db.select({ c: count() }).from(affiliateConversions),
        db.select({ s: sum(affiliatePayouts.amount) }).from(affiliatePayouts).where(eq(affiliatePayouts.status, "pending")),
      ]);
      return { profiles, stats: { totalConversions: convRows[0]?.c ?? 0, pendingPayouts: payoutRows[0]?.s ?? "0" } };
    }),

    affiliateAction: protectedProcedure
      .input(z.object({ affiliateId: z.number(), action: z.enum(["approve", "suspend", "reject"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const newStatus = input.action === "approve" ? "active" : input.action === "suspend" ? "suspended" : "rejected";
        await db.update(affiliateProfiles).set({ status: newStatus as "active" | "suspended" | "rejected", approvedAt: input.action === "approve" ? new Date() : null }).where(eq(affiliateProfiles.id, input.affiliateId));
        return { success: true };
      }),

    recentConversions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select().from(affiliateConversions).orderBy(desc(affiliateConversions.createdAt)).limit(20);
    }),

    stats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return { total: 0, active: 0, suspended: 0, admins: 0, newThisMonth: 0, activeUsers30d: 0, activeAffiliates: 0, totalConversions: 0, totalRevenue: "0", openTickets: 0, activeProjects: 0, recentUsers: [] };
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const [all, affRows, convRows, revenueRows, ticketRows, projectRows, recentUsersRows] = await Promise.all([
        db.select({ role: users.role, status: users.status, createdAt: users.createdAt, lastSignedIn: users.lastSignedIn }).from(users),
        db.select({ c: count() }).from(affiliateProfiles).where(eq(affiliateProfiles.status, "active")),
        db.select({ c: count() }).from(affiliateConversions),
        db.select({ s: sum(invoices.amount) }).from(invoices).where(eq(invoices.status, "paid")),
        db.select({ c: count() }).from(tickets).where(sql`status NOT IN ('resolved','closed')`),
        db.select({ c: count() }).from(projects).where(eq(projects.status, "in_progress")),
        db.select({ id: users.id, name: users.name, email: users.email, role: users.role, status: users.status, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(10),
      ]);
      return {
        total: all.length,
        active: all.filter(u => u.status === "active").length,
        suspended: all.filter(u => u.status === "suspended").length,
        admins: all.filter(u => u.role === "admin" || u.role === "superadmin").length,
        newThisMonth: all.filter(u => u.createdAt >= monthStart).length,
        activeUsers30d: all.filter(u => u.lastSignedIn && u.lastSignedIn >= thirtyDaysAgo).length,
        activeAffiliates: affRows[0]?.c ?? 0,
        totalConversions: convRows[0]?.c ?? 0,
        totalRevenue: revenueRows[0]?.s ?? "0",
        openTickets: ticketRows[0]?.c ?? 0,
        activeProjects: projectRows[0]?.c ?? 0,
        recentUsers: recentUsersRows,
      };
     }),

    allProjects: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ project: projects, userName: users.name, userEmail: users.email }).from(projects).leftJoin(users, eq(projects.userId, users.id)).orderBy(desc(projects.createdAt));
    }),

    allTickets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ ticket: tickets, userName: users.name, userEmail: users.email }).from(tickets).leftJoin(users, eq(tickets.userId, users.id)).orderBy(desc(tickets.createdAt));
    }),

    allInvoices: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ invoice: invoices, userName: users.name, userEmail: users.email }).from(invoices).leftJoin(users, eq(invoices.userId, users.id)).orderBy(desc(invoices.createdAt));
    }),

    allContracts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ contract: contracts, userName: users.name, userEmail: users.email }).from(contracts).leftJoin(users, eq(contracts.userId, users.id)).orderBy(desc(contracts.createdAt));
    }),

    allDocuments: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ document: documents, userName: users.name, userEmail: users.email }).from(documents).leftJoin(users, eq(documents.userId, users.id)).orderBy(desc(documents.createdAt));
    }),

    allWallets: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ wallet: wallets, userName: users.name, userEmail: users.email }).from(wallets).leftJoin(users, eq(wallets.userId, users.id)).orderBy(desc(wallets.createdAt));
    }),

    allSmartContracts: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ sc: smartContracts, userName: users.name, userEmail: users.email }).from(smartContracts).leftJoin(users, eq(smartContracts.userId, users.id)).orderBy(desc(smartContracts.createdAt));
    }),

    allDomains: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ domain: domains, userName: users.name, userEmail: users.email }).from(domains).leftJoin(users, eq(domains.userId, users.id)).orderBy(desc(domains.createdAt));
    }),

    allAiProjects: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ ai: aiProjects, userName: users.name, userEmail: users.email }).from(aiProjects).leftJoin(users, eq(aiProjects.userId, users.id)).orderBy(desc(aiProjects.createdAt));
    }),

    allApiKeys: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return [];
      return db.select({ key: apiKeys, userName: users.name, userEmail: users.email }).from(apiKeys).leftJoin(users, eq(apiKeys.userId, users.id)).orderBy(desc(apiKeys.createdAt));
    }),

    updateProjectStatus: protectedProcedure
      .input(z.object({ projectId: z.number(), status: z.enum(["planning", "in_progress", "completed", "on_hold"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(projects).set({ status: input.status }).where(eq(projects.id, input.projectId));
        if (input.status === "in_progress") {
          const proj = await db.select().from(projects).where(eq(projects.id, input.projectId)).limit(1);
          if (proj[0]) {
            await db.insert(notifications).values({ userId: proj[0].userId, type: "milestone", title: "Progetto approvato", message: `Il tuo progetto "${proj[0].name}" è stato approvato e avviato`, read: false });
          }
        }
        return { success: true };
      }),

    replyToTicket: protectedProcedure
      .input(z.object({ ticketId: z.number(), message: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.insert(ticketReplies).values({ ticketId: input.ticketId, userId: ctx.user.id, message: input.message, isStaff: true });
        const tk = await db.select().from(tickets).where(eq(tickets.id, input.ticketId)).limit(1);
        if (tk[0]) {
          await db.update(tickets).set({ status: "in_progress", updatedAt: new Date() }).where(eq(tickets.id, input.ticketId));
          await db.insert(notifications).values({ userId: tk[0].userId, type: "ticket_update", title: "Risposta al tuo ticket", message: `Il team ha risposto al ticket ${tk[0].ticketNumber ?? String(tk[0].id)}`, read: false });
        }
        return { success: true };
      }),

    updateTicketStatus: protectedProcedure
      .input(z.object({ ticketId: z.number(), status: z.enum(["open", "in_progress", "waiting_for_client", "resolved", "closed"]) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(tickets).set({ status: input.status, updatedAt: new Date() }).where(eq(tickets.id, input.ticketId));
        return { success: true };
      }),

    setAffiliateCommission: protectedProcedure
      .input(z.object({ affiliateId: z.number(), commission: z.number().min(0).max(100) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        await db.update(affiliateProfiles).set({ notes: `Commissione: ${input.commission}%` }).where(eq(affiliateProfiles.id, input.affiliateId));
        return { success: true };
      }),

    generateApiKeyForUser: protectedProcedure
      .input(z.object({ userId: z.number(), name: z.string().min(2), scopes: z.string().default("read") }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
        const db = await getDb();
        if (!db) throw new Error("Database non disponibile");
        const { key, prefix, hash } = generateApiKey();
        await db.insert(apiKeys).values({ userId: input.userId, name: input.name, keyHash: hash, keyPrefix: prefix, scopes: input.scopes });
        return { success: true, key };
      }),

    blockchainStats: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      let walletsCount = 0;
      let contractsCount = 0;
      if (db) {
        const wc = await db.select({ c: count() }).from(wallets);
        walletsCount = wc[0]?.c ?? 0;
        const cc = await db.select({ c: count() }).from(smartContracts);
        contractsCount = cc[0]?.c ?? 0;
      }
      let blockNumber: number | null = null;
      try {
        const res = await fetch("https://mainnet.dyneros.com", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }), signal: AbortSignal.timeout(4000) });
        const json = await res.json() as { result?: string };
        if (json.result) blockNumber = parseInt(json.result, 16);
      } catch { blockNumber = null; }
      return { blockNumber, walletsCount, contractsCount };
    }),
  }),
});
export type AppRouter = typeof appRouter;
