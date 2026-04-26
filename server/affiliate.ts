import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { eq, and, desc, sql, isNull, or } from "drizzle-orm";
import { getDb } from "./db";
import {
  affiliateProfiles, affiliateClicks, affiliateLeads,
  affiliateConversions, affiliatePayouts, affiliateAgreements,
} from "../drizzle/schema";
import crypto from "crypto";

function generateAffiliateCode(type: "affiliate" | "sub_affiliate"): string {
  const prefix = type === "affiliate" ? "DYN-AFF" : "DYN-SUB";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${suffix}`;
}

function hashIp(ip: string): string {
  return crypto.createHash("sha256").update(ip + "dyneros-salt-2024").digest("hex").slice(0, 32);
}

export const affiliateRouter = router({
  applyAffiliate: publicProcedure
    .input(z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      companyName: z.string().optional(),
      taxId: z.string().optional(),
      vatNumber: z.string().optional(),
      website: z.string().optional(),
      country: z.string().optional(),
      promoChannels: z.string().optional(),
      paymentMethod: z.enum(["bank", "paypal", "dyn", "usdt", "usdc", "btc", "eth"]).default("bank"),
      iban: z.string().optional(),
      walletAddress: z.string().optional(),
      privacyConsent: z.boolean().refine(v => v === true, "Devi accettare la privacy policy"),
      termsConsent: z.boolean().refine(v => v === true, "Devi accettare i termini"),
      ipAddress: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const existing = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.email, input.email)).limit(1);
      if (existing.length > 0) throw new Error("Email già registrata come affiliato");
      let code = generateAffiliateCode("affiliate");
      let attempts = 0;
      while (attempts < 10) {
        const dup = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, code)).limit(1);
        if (dup.length === 0) break;
        code = generateAffiliateCode("affiliate");
        attempts++;
      }
      const ipHash = input.ipAddress ? hashIp(input.ipAddress) : hashIp("unknown");
      const [result] = await db.insert(affiliateProfiles).values({
        type: "affiliate",
        status: "pending",
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        taxId: input.taxId,
        vatNumber: input.vatNumber,
        website: input.website,
        country: input.country,
        promoChannels: input.promoChannels,
        paymentMethod: input.paymentMethod,
        iban: input.iban,
        walletAddress: input.walletAddress,
        affiliateCode: code,
        referralUrl: `https://dyneros.com/?ref=${code}`,
      });
      const newId = (result as { insertId: number }).insertId;
      await db.insert(affiliateAgreements).values({
        affiliateProfileId: newId,
        agreementVersion: "1.0",
        ipHash,
      });
      return { success: true, affiliateCode: code, message: "Richiesta inviata. Riceverai una conferma via email entro 24-48 ore." };
    }),

  applySubAffiliate: publicProcedure
    .input(z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      companyName: z.string().optional(),
      promoChannels: z.string().optional(),
      parentAffiliateCode: z.string().min(10),
      paymentMethod: z.enum(["bank", "paypal", "dyn", "usdt", "usdc", "btc", "eth"]).default("bank"),
      iban: z.string().optional(),
      walletAddress: z.string().optional(),
      privacyConsent: z.boolean().refine(v => v === true, "Devi accettare la privacy policy"),
      termsConsent: z.boolean().refine(v => v === true, "Devi accettare i termini"),
      ipAddress: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const parent = await db.select({ id: affiliateProfiles.id, status: affiliateProfiles.status }).from(affiliateProfiles).where(and(eq(affiliateProfiles.affiliateCode, input.parentAffiliateCode), eq(affiliateProfiles.type, "affiliate"))).limit(1);
      if (parent.length === 0) throw new Error("Codice affiliato padre non valido");
      if (parent[0].status !== "active") throw new Error("L'affiliato padre non è attivo");
      const existing = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.email, input.email)).limit(1);
      if (existing.length > 0) throw new Error("Email già registrata come affiliato");
      let code = generateAffiliateCode("sub_affiliate");
      let attempts = 0;
      while (attempts < 10) {
        const dup = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, code)).limit(1);
        if (dup.length === 0) break;
        code = generateAffiliateCode("sub_affiliate");
        attempts++;
      }
      const ipHash = input.ipAddress ? hashIp(input.ipAddress) : hashIp("unknown");
      const [result] = await db.insert(affiliateProfiles).values({
        type: "sub_affiliate",
        status: "pending",
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        promoChannels: input.promoChannels,
        paymentMethod: input.paymentMethod,
        iban: input.iban,
        walletAddress: input.walletAddress,
        affiliateCode: code,
        parentAffiliateId: parent[0].id,
        referralUrl: `https://dyneros.com/?subref=${code}`,
      });
      const newId = (result as { insertId: number }).insertId;
      await db.insert(affiliateAgreements).values({
        affiliateProfileId: newId,
        agreementVersion: "1.0",
        ipHash,
      });
      return { success: true, affiliateCode: code, message: "Richiesta sub affiliato inviata. Riceverai una conferma via email entro 24-48 ore." };
    }),

  trackClick: publicProcedure
    .input(z.object({
      code: z.string(),
      landingPage: z.string(),
      ipAddress: z.string().optional(),
      userAgent: z.string().optional(),
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { success: false };
      const profile = await db.select({ id: affiliateProfiles.id, type: affiliateProfiles.type, parentAffiliateId: affiliateProfiles.parentAffiliateId, status: affiliateProfiles.status }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, input.code)).limit(1);
      if (profile.length === 0 || profile[0].status !== "active") return { success: false };
      const p = profile[0];
      const ipHash = input.ipAddress ? hashIp(input.ipAddress) : hashIp("unknown");
      await db.insert(affiliateClicks).values({
        affiliateId: p.type === "affiliate" ? p.id : p.parentAffiliateId,
        subAffiliateId: p.type === "sub_affiliate" ? p.id : null,
        codeUsed: input.code,
        landingPage: input.landingPage.slice(0, 500),
        refType: p.type,
        ipHash,
        userAgent: input.userAgent,
        utmSource: input.utmSource,
        utmMedium: input.utmMedium,
        utmCampaign: input.utmCampaign,
      });
      return { success: true };
    }),

  resolveCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const profile = await db.select({ id: affiliateProfiles.id, type: affiliateProfiles.type, status: affiliateProfiles.status, fullName: affiliateProfiles.fullName }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, input.code)).limit(1);
      if (profile.length === 0) return null;
      return profile[0];
    }),

  myProfile: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;
    const profile = await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.userId, ctx.user.id)).limit(1);
    return profile[0] ?? null;
  }),

  myDashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return { profile: null, kpi: null, leads: [], conversions: [], payouts: [], subAffiliates: [] };
    const profiles = await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.userId, ctx.user.id)).limit(1);
    if (profiles.length === 0) return { profile: null, kpi: null, leads: [], conversions: [], payouts: [], subAffiliates: [] };
    const profile = profiles[0];
    const isAffiliate = profile.type === "affiliate";
    const affId = isAffiliate ? profile.id : null;
    const subId = !isAffiliate ? profile.id : null;
    const clickCount = await db.select({ count: sql<number>`count(*)` }).from(affiliateClicks).where(isAffiliate ? eq(affiliateClicks.affiliateId, profile.id) : eq(affiliateClicks.subAffiliateId, profile.id));
    const leads = await db.select().from(affiliateLeads).where(isAffiliate ? eq(affiliateLeads.affiliateId, profile.id) : eq(affiliateLeads.subAffiliateId, profile.id)).orderBy(desc(affiliateLeads.createdAt)).limit(50);
    const conversions = await db.select().from(affiliateConversions).where(isAffiliate ? eq(affiliateConversions.affiliateId, profile.id) : eq(affiliateConversions.subAffiliateId, profile.id)).orderBy(desc(affiliateConversions.createdAt)).limit(50);
    const payouts = await db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateProfileId, profile.id)).orderBy(desc(affiliatePayouts.createdAt)).limit(50);
    const subAffiliates = isAffiliate ? await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.parentAffiliateId, profile.id)).orderBy(desc(affiliateProfiles.createdAt)) : [];
    const totalCommission = conversions.filter(c => ["approved", "invoiced", "paid"].includes(c.status)).reduce((sum, c) => sum + parseFloat(c.commissionAmount ?? "0"), 0);
    const paidCommission = conversions.filter(c => c.status === "paid").reduce((sum, c) => sum + parseFloat(c.commissionAmount ?? "0"), 0);
    const overrideEarned = isAffiliate ? conversions.filter(c => c.parentOverrideAmount && ["approved", "invoiced", "paid"].includes(c.status)).reduce((sum, c) => sum + parseFloat(c.parentOverrideAmount ?? "0"), 0) : 0;
    return {
      profile,
      kpi: {
        clicks: clickCount[0]?.count ?? 0,
        leads: leads.length,
        conversions: conversions.filter(c => c.status !== "rejected" && c.status !== "cancelled").length,
        totalCommission,
        paidCommission,
        overrideEarned,
      },
      leads,
      conversions,
      payouts,
      subAffiliates,
    };
  }),

  linkAccount: protectedProcedure
    .input(z.object({ affiliateCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const profile = await db.select({ id: affiliateProfiles.id, userId: affiliateProfiles.userId }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, input.affiliateCode)).limit(1);
      if (profile.length === 0) throw new Error("Codice non trovato");
      if (profile[0].userId !== null) throw new Error("Profilo già collegato a un account");
      await db.update(affiliateProfiles).set({ userId: ctx.user.id }).where(eq(affiliateProfiles.id, profile[0].id));
      return { success: true };
    }),

  adminListAffiliates: protectedProcedure
    .input(z.object({
      type: z.enum(["affiliate", "sub_affiliate", "all"]).default("all"),
      status: z.enum(["pending", "active", "suspended", "rejected", "all"]).default("all"),
      page: z.number().default(1),
      limit: z.number().default(50),
    }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return { items: [], total: 0 };
      let query = db.select().from(affiliateProfiles);
      const conditions = [];
      if (input.type !== "all") conditions.push(eq(affiliateProfiles.type, input.type));
      if (input.status !== "all") conditions.push(eq(affiliateProfiles.status, input.status));
      const items = await db.select().from(affiliateProfiles)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(desc(affiliateProfiles.createdAt))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);
      const totalResult = await db.select({ count: sql<number>`count(*)` }).from(affiliateProfiles)
        .where(conditions.length > 0 ? and(...conditions) : undefined);
      return { items, total: totalResult[0]?.count ?? 0 };
    }),

  adminUpdateStatus: protectedProcedure
    .input(z.object({
      affiliateId: z.number(),
      status: z.enum(["pending", "active", "suspended", "rejected"]),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const updateData: Record<string, unknown> = { status: input.status };
      if (input.status === "active") updateData.approvedAt = new Date();
      if (input.notes) updateData.notes = input.notes;
      await db.update(affiliateProfiles).set(updateData).where(eq(affiliateProfiles.id, input.affiliateId));
      return { success: true };
    }),

  adminCreateLead: protectedProcedure
    .input(z.object({
      affiliateCode: z.string(),
      subAffiliateCode: z.string().optional(),
      fullName: z.string(),
      email: z.string().email(),
      phone: z.string().optional(),
      companyName: z.string().optional(),
      serviceCategory: z.string().optional(),
      estimatedValue: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const affiliate = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, input.affiliateCode)).limit(1);
      if (affiliate.length === 0) throw new Error("Codice affiliato non trovato");
      let subAffId: number | null = null;
      if (input.subAffiliateCode) {
        const sub = await db.select({ id: affiliateProfiles.id }).from(affiliateProfiles).where(eq(affiliateProfiles.affiliateCode, input.subAffiliateCode)).limit(1);
        if (sub.length > 0) subAffId = sub[0].id;
      }
      const windowEnd = new Date();
      windowEnd.setDate(windowEnd.getDate() + 90);
      await db.insert(affiliateLeads).values({
        affiliateId: affiliate[0].id,
        subAffiliateId: subAffId,
        source: "manual",
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        companyName: input.companyName,
        serviceCategory: input.serviceCategory,
        estimatedValue: input.estimatedValue,
        attributionWindowEndsAt: windowEnd,
        notes: input.notes,
      });
      return { success: true };
    }),

  adminCreateConversion: protectedProcedure
    .input(z.object({
      leadId: z.number(),
      contractValueNet: z.string(),
      serviceCategory: z.string(),
      commissionRate: z.string(),
      recurrenceType: z.enum(["one_time", "monthly", "annual"]).default("one_time"),
      recurrenceMonths: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      const lead = await db.select().from(affiliateLeads).where(eq(affiliateLeads.id, input.leadId)).limit(1);
      if (lead.length === 0) throw new Error("Lead non trovato");
      const l = lead[0];
      const contractValue = parseFloat(input.contractValueNet);
      const rate = parseFloat(input.commissionRate);
      const commissionAmount = (contractValue * rate) / 100;
      let parentOverrideAmount: string | null = null;
      if (l.subAffiliateId) {
        parentOverrideAmount = ((commissionAmount * 50) / 100).toFixed(2);
      }
      await db.insert(affiliateConversions).values({
        leadId: l.id,
        affiliateId: l.affiliateId,
        subAffiliateId: l.subAffiliateId,
        contractValueNet: input.contractValueNet,
        serviceCategory: input.serviceCategory,
        commissionRate: input.commissionRate,
        commissionAmount: commissionAmount.toFixed(2),
        parentOverrideRate: "50.00",
        parentOverrideAmount,
        recurrenceType: input.recurrenceType,
        recurrenceMonths: input.recurrenceMonths,
        status: "pending",
      });
      await db.update(affiliateLeads).set({ status: "won" }).where(eq(affiliateLeads.id, l.id));
      return { success: true };
    }),

  adminRegisterPayout: protectedProcedure
    .input(z.object({
      affiliateProfileId: z.number(),
      amount: z.string(),
      currency: z.string().default("EUR"),
      method: z.enum(["bank", "paypal", "crypto"]),
      reference: z.string().optional(),
      markConversionIds: z.array(z.number()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) throw new Error("Database non disponibile");
      await db.insert(affiliatePayouts).values({
        affiliateProfileId: input.affiliateProfileId,
        amount: input.amount,
        currency: input.currency,
        method: input.method,
        status: "paid",
        reference: input.reference,
        paidAt: new Date(),
      });
      if (input.markConversionIds && input.markConversionIds.length > 0) {
        for (const cid of input.markConversionIds) {
          await db.update(affiliateConversions).set({ status: "paid" }).where(eq(affiliateConversions.id, cid));
        }
      }
      return { success: true };
    }),

  adminGetAffiliate: protectedProcedure
    .input(z.object({ affiliateId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return null;
      const profile = await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.id, input.affiliateId)).limit(1);
      if (profile.length === 0) return null;
      const p = profile[0];
      const leads = await db.select().from(affiliateLeads).where(or(eq(affiliateLeads.affiliateId, p.id), eq(affiliateLeads.subAffiliateId, p.id))).orderBy(desc(affiliateLeads.createdAt)).limit(100);
      const conversions = await db.select().from(affiliateConversions).where(or(eq(affiliateConversions.affiliateId, p.id), eq(affiliateConversions.subAffiliateId, p.id))).orderBy(desc(affiliateConversions.createdAt)).limit(100);
      const payouts = await db.select().from(affiliatePayouts).where(eq(affiliatePayouts.affiliateProfileId, p.id)).orderBy(desc(affiliatePayouts.createdAt)).limit(100);
      const subAffiliates = p.type === "affiliate" ? await db.select().from(affiliateProfiles).where(eq(affiliateProfiles.parentAffiliateId, p.id)) : [];
      return { profile: p, leads, conversions, payouts, subAffiliates };
    }),

  adminExportCsv: protectedProcedure
    .input(z.object({ type: z.enum(["affiliates", "leads", "conversions", "payouts"]) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "superadmin") throw new Error("Accesso negato");
      const db = await getDb();
      if (!db) return { csv: "" };
      let rows: Record<string, unknown>[] = [];
      let headers: string[] = [];
      if (input.type === "affiliates") {
        rows = await db.select().from(affiliateProfiles).orderBy(desc(affiliateProfiles.createdAt));
        headers = ["id", "type", "status", "fullName", "email", "phone", "companyName", "affiliateCode", "country", "paymentMethod", "createdAt"];
      } else if (input.type === "leads") {
        rows = await db.select().from(affiliateLeads).orderBy(desc(affiliateLeads.createdAt));
        headers = ["id", "affiliateId", "subAffiliateId", "source", "fullName", "email", "serviceCategory", "estimatedValue", "status", "createdAt"];
      } else if (input.type === "conversions") {
        rows = await db.select().from(affiliateConversions).orderBy(desc(affiliateConversions.createdAt));
        headers = ["id", "leadId", "affiliateId", "subAffiliateId", "contractValueNet", "commissionRate", "commissionAmount", "parentOverrideAmount", "status", "convertedAt"];
      } else {
        rows = await db.select().from(affiliatePayouts).orderBy(desc(affiliatePayouts.createdAt));
        headers = ["id", "affiliateProfileId", "amount", "currency", "method", "status", "reference", "paidAt", "createdAt"];
      }
      const csvLines = [headers.join(",")];
      for (const row of rows) {
        const line = headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return "";
          const s = String(val).replace(/"/g, '""');
          return s.includes(",") || s.includes('"') || s.includes("\n") ? `"${s}"` : s;
        }).join(",");
        csvLines.push(line);
      }
      return { csv: csvLines.join("\n") };
    }),
});
