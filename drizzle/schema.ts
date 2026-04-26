import {
  boolean, decimal, int, mysqlEnum, mysqlTable,
  text, timestamp, varchar, index
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  company: varchar("company", { length: 255 }),
  phone: varchar("phone", { length: 64 }),
  loginMethod: varchar("loginMethod", { length: 64 }).default("email"),
  role: mysqlEnum("role", ["user", "admin", "superadmin"]).default("user").notNull(),
  status: mysqlEnum("status", ["active", "pending", "suspended"]).default("pending").notNull(),
  emailVerified: boolean("emailVerified").default(false).notNull(),
  emailVerifyToken: varchar("emailVerifyToken", { length: 128 }),
  emailVerifyExpiry: timestamp("emailVerifyExpiry"),
  resetToken: varchar("resetToken", { length: 128 }),
  resetTokenExpiry: timestamp("resetTokenExpiry"),
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["blockchain_infrastructure", "smart_contract", "web_app", "ai_system", "other"]).default("other").notNull(),
  status: mysqlEnum("status", ["planning", "in_progress", "completed", "on_hold"]).default("planning").notNull(),
  priority: mysqlEnum("priority", ["low", "medium", "high"]).default("medium").notNull(),
  startDate: timestamp("startDate"),
  eta: timestamp("eta"),
  progress: int("progress").default(0),
  environment: mysqlEnum("environment", ["dev", "staging", "production"]).default("dev").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  userIdx: index("projects_user_idx").on(t.userId),
  statusIdx: index("projects_status_idx").on(t.status),
}));

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

export const tickets = mysqlTable("tickets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  projectId: int("projectId"),
  ticketNumber: varchar("ticketNumber", { length: 50 }).notNull().unique(),
  subject: varchar("subject", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  priority: mysqlEnum("priority", ["low", "medium", "high", "critical"]).default("medium").notNull(),
  status: mysqlEnum("status", ["open", "in_progress", "waiting_for_client", "resolved", "closed"]).default("open").notNull(),
  slaHours: int("slaHours").default(24),
  assignedTo: int("assignedTo"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  userIdx: index("tickets_user_idx").on(t.userId),
  statusIdx: index("tickets_status_idx").on(t.status),
}));

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = typeof tickets.$inferInsert;

export const ticketReplies = mysqlTable("ticket_replies", {
  id: int("id").autoincrement().primaryKey(),
  ticketId: int("ticketId").notNull(),
  userId: int("userId").notNull(),
  message: text("message").notNull(),
  attachments: varchar("attachments", { length: 1000 }),
  isStaff: boolean("isStaff").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  ticketIdx: index("replies_ticket_idx").on(t.ticketId),
}));

export type TicketReply = typeof ticketReplies.$inferSelect;

export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).default("EUR").notNull(),
  status: mysqlEnum("status", ["paid", "unpaid", "overdue"]).default("unpaid").notNull(),
  issued: timestamp("issued").notNull(),
  due: timestamp("due").notNull(),
  description: text("description"),
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("invoices_user_idx").on(t.userId),
  statusIdx: index("invoices_status_idx").on(t.status),
}));

export type Invoice = typeof invoices.$inferSelect;

export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  contractName: varchar("contractName", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["NDA", "Service Agreement", "Statement of Work", "Other"]).default("Other").notNull(),
  status: mysqlEnum("status", ["draft", "active", "signed", "expired"]).default("draft").notNull(),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  signedAt: timestamp("signedAt"),
  documentUrl: varchar("documentUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("contracts_user_idx").on(t.userId),
}));

export type Contract = typeof contracts.$inferSelect;

export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["contract", "sow", "nda", "technical", "report", "other"]).default("other"),
  category: varchar("category", { length: 100 }).notNull().default("general"),
  fileUrl: varchar("fileUrl", { length: 500 }).notNull(),
  fileSize: int("fileSize"),
  status: mysqlEnum("status", ["draft", "approved", "signed", "final", "archived"]).default("draft").notNull(),
  uploadedBy: int("uploadedBy").notNull(),
  deletedAt: timestamp("deletedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("documents_user_idx").on(t.userId),
}));

export type Document = typeof documents.$inferSelect;

export const wallets = mysqlTable("wallets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  address: varchar("address", { length: 42 }).notNull().unique(),
  name: varchar("name", { length: 100 }),
  network: varchar("network", { length: 50 }).default("DYNEROS Chain").notNull(),
  privateKeyEncrypted: text("privateKeyEncrypted"),
  balance: decimal("balance", { precision: 30, scale: 18 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("wallets_user_idx").on(t.userId),
}));

export type Wallet = typeof wallets.$inferSelect;

export const smartContracts = mysqlTable("smart_contracts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 42 }).notNull(),
  network: varchar("network", { length: 50 }).default("DYNEROS Chain").notNull(),
  status: mysqlEnum("status", ["active", "inactive", "deprecated"]).default("active").notNull(),
  verified: boolean("verified").default(false).notNull(),
  abi: text("abi"),
  sourceCode: text("sourceCode"),
  deployDate: timestamp("deployDate"),
  owner: varchar("owner", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("sc_user_idx").on(t.userId),
}));

export type SmartContract = typeof smartContracts.$inferSelect;

export const domains = mysqlTable("domains", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  domainName: varchar("domainName", { length: 255 }).notNull(),
  registrar: varchar("registrar", { length: 100 }),
  status: mysqlEnum("status", ["active", "expiring_soon", "expired"]).default("active").notNull(),
  expiryDate: timestamp("expiryDate"),
  sslStatus: mysqlEnum("sslStatus", ["valid", "expiring_soon", "expired"]).default("valid").notNull(),
  sslExpiryDate: timestamp("sslExpiryDate"),
  dnsRecords: text("dnsRecords"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("domains_user_idx").on(t.userId),
}));

export type Domain = typeof domains.$inferSelect;

export const aiProjects = mysqlTable("ai_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  status: mysqlEnum("status", ["active", "training", "paused", "archived"]).default("active").notNull(),
  environment: mysqlEnum("environment", ["dev", "staging", "production"]).default("dev").notNull(),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  latency: int("latency"),
  monthlyCost: decimal("monthlyCost", { precision: 10, scale: 2 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("ai_user_idx").on(t.userId),
}));

export type AiProject = typeof aiProjects.$inferSelect;

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["ticket_update", "invoice", "milestone", "deployment", "alert", "system"]).default("system").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  read: boolean("read").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("notif_user_idx").on(t.userId),
  readIdx: index("notif_read_idx").on(t.read),
}));

export type Notification = typeof notifications.$inferSelect;

export const userSettings = mysqlTable("user_settings", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  language: mysqlEnum("language", ["it", "en"]).default("it").notNull(),
  theme: mysqlEnum("theme", ["dark", "light"]).default("dark").notNull(),
  notificationsEmail: boolean("notificationsEmail").default(true).notNull(),
  notificationsTickets: boolean("notificationsTickets").default(true).notNull(),
  notificationsInvoices: boolean("notificationsInvoices").default(true).notNull(),
  notificationsMilestones: boolean("notificationsMilestones").default(true).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserSettings = typeof userSettings.$inferSelect;

export const apiKeys = mysqlTable("api_keys", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("keyHash", { length: 64 }).notNull().unique(),
  keyPrefix: varchar("keyPrefix", { length: 12 }).notNull(),
  scopes: varchar("scopes", { length: 500 }).default("read").notNull(),
  lastUsedAt: timestamp("lastUsedAt"),
  revokedAt: timestamp("revokedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("apikeys_user_idx").on(t.userId),
}));

export type ApiKey = typeof apiKeys.$inferSelect;

export const auditLog = mysqlTable("audit_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  resourceId: varchar("resourceId", { length: 50 }),
  changes: text("changes"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  userIdx: index("audit_user_idx").on(t.userId),
  actionIdx: index("audit_action_idx").on(t.action),
}));

export type AuditLog = typeof auditLog.$inferSelect;

export const usersRelations = relations(users, ({ many, one }) => ({
  projects: many(projects),
  tickets: many(tickets),
  invoices: many(invoices),
  contracts: many(contracts),
  documents: many(documents),
  wallets: many(wallets),
  smartContracts: many(smartContracts),
  domains: many(domains),
  aiProjects: many(aiProjects),
  notifications: many(notifications),
  settings: one(userSettings, { fields: [users.id], references: [userSettings.userId] }),
  apiKeys: many(apiKeys),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.userId], references: [users.id] }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
  user: one(users, { fields: [tickets.userId], references: [users.id] }),
  project: one(projects, { fields: [tickets.projectId], references: [projects.id] }),
  replies: many(ticketReplies),
}));

export const ticketRepliesRelations = relations(ticketReplies, ({ one }) => ({
  ticket: one(tickets, { fields: [ticketReplies.ticketId], references: [tickets.id] }),
  user: one(users, { fields: [ticketReplies.userId], references: [users.id] }),
}));

export const affiliateProfiles = mysqlTable("affiliate_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  type: mysqlEnum("type", ["affiliate", "sub_affiliate"]).notNull(),
  status: mysqlEnum("status", ["pending", "active", "suspended", "rejected"]).default("pending").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  companyName: varchar("companyName", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 50 }),
  taxId: varchar("taxId", { length: 50 }),
  vatNumber: varchar("vatNumber", { length: 50 }),
  website: varchar("website", { length: 500 }),
  country: varchar("country", { length: 100 }),
  promoChannels: text("promoChannels"),
  paymentMethod: mysqlEnum("paymentMethod", ["bank", "paypal", "dyn", "usdt", "usdc", "btc", "eth"]).default("bank").notNull(),
  iban: varchar("iban", { length: 50 }),
  walletAddress: varchar("walletAddress", { length: 100 }),
  affiliateCode: varchar("affiliateCode", { length: 30 }).notNull().unique(),
  parentAffiliateId: int("parentAffiliateId"),
  referralUrl: varchar("referralUrl", { length: 500 }),
  notes: text("notes"),
  approvedAt: timestamp("approvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  emailIdx: index("aff_email_idx").on(t.email),
  codeIdx: index("aff_code_idx").on(t.affiliateCode),
  parentIdx: index("aff_parent_idx").on(t.parentAffiliateId),
  statusIdx: index("aff_status_idx").on(t.status),
}));
export type AffiliateProfile = typeof affiliateProfiles.$inferSelect;

export const affiliateClicks = mysqlTable("affiliate_clicks", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId"),
  subAffiliateId: int("subAffiliateId"),
  codeUsed: varchar("codeUsed", { length: 30 }).notNull(),
  landingPage: varchar("landingPage", { length: 500 }).notNull(),
  refType: mysqlEnum("refType", ["affiliate", "sub_affiliate"]).notNull(),
  ipHash: varchar("ipHash", { length: 64 }).notNull(),
  userAgent: text("userAgent"),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmCampaign: varchar("utmCampaign", { length: 100 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  affIdx: index("click_aff_idx").on(t.affiliateId),
  subIdx: index("click_sub_idx").on(t.subAffiliateId),
  codeIdx: index("click_code_idx").on(t.codeUsed),
}));
export type AffiliateClick = typeof affiliateClicks.$inferSelect;

export const affiliateLeads = mysqlTable("affiliate_leads", {
  id: int("id").autoincrement().primaryKey(),
  affiliateId: int("affiliateId"),
  subAffiliateId: int("subAffiliateId"),
  source: mysqlEnum("source", ["contact_form", "manual", "crm", "api"]).default("contact_form").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  companyName: varchar("companyName", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  serviceCategory: varchar("serviceCategory", { length: 100 }),
  estimatedValue: decimal("estimatedValue", { precision: 12, scale: 2 }),
  status: mysqlEnum("status", ["new", "qualified", "proposal", "won", "lost", "invalid"]).default("new").notNull(),
  attributionWindowEndsAt: timestamp("attributionWindowEndsAt").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  affIdx: index("lead_aff_idx").on(t.affiliateId),
  subIdx: index("lead_sub_idx").on(t.subAffiliateId),
  statusIdx: index("lead_status_idx").on(t.status),
}));
export type AffiliateLead = typeof affiliateLeads.$inferSelect;

export const affiliateConversions = mysqlTable("affiliate_conversions", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  affiliateId: int("affiliateId"),
  subAffiliateId: int("subAffiliateId"),
  contractValueNet: decimal("contractValueNet", { precision: 12, scale: 2 }).notNull(),
  serviceCategory: varchar("serviceCategory", { length: 100 }).notNull(),
  commissionRate: decimal("commissionRate", { precision: 5, scale: 2 }).notNull(),
  commissionAmount: decimal("commissionAmount", { precision: 12, scale: 2 }).notNull(),
  parentOverrideRate: decimal("parentOverrideRate", { precision: 5, scale: 2 }).default("50.00").notNull(),
  parentOverrideAmount: decimal("parentOverrideAmount", { precision: 12, scale: 2 }),
  recurrenceType: mysqlEnum("recurrenceType", ["one_time", "monthly", "annual"]).default("one_time").notNull(),
  recurrenceMonths: int("recurrenceMonths"),
  status: mysqlEnum("status", ["pending", "approved", "invoiced", "paid", "rejected", "cancelled"]).default("pending").notNull(),
  convertedAt: timestamp("convertedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (t) => ({
  affIdx: index("conv_aff_idx").on(t.affiliateId),
  subIdx: index("conv_sub_idx").on(t.subAffiliateId),
  statusIdx: index("conv_status_idx").on(t.status),
  leadIdx: index("conv_lead_idx").on(t.leadId),
}));
export type AffiliateConversion = typeof affiliateConversions.$inferSelect;

export const affiliatePayouts = mysqlTable("affiliate_payouts", {
  id: int("id").autoincrement().primaryKey(),
  affiliateProfileId: int("affiliateProfileId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EUR").notNull(),
  method: mysqlEnum("method", ["bank", "paypal", "crypto"]).notNull(),
  status: mysqlEnum("status", ["pending", "processing", "paid", "failed", "cancelled"]).default("pending").notNull(),
  reference: varchar("reference", { length: 255 }),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (t) => ({
  affIdx: index("payout_aff_idx").on(t.affiliateProfileId),
  statusIdx: index("payout_status_idx").on(t.status),
}));
export type AffiliatePayout = typeof affiliatePayouts.$inferSelect;

export const affiliateAgreements = mysqlTable("affiliate_agreements", {
  id: int("id").autoincrement().primaryKey(),
  affiliateProfileId: int("affiliateProfileId").notNull(),
  agreementVersion: varchar("agreementVersion", { length: 20 }).default("1.0").notNull(),
  acceptedAt: timestamp("acceptedAt").defaultNow().notNull(),
  ipHash: varchar("ipHash", { length: 64 }).notNull(),
  documentUrl: varchar("documentUrl", { length: 500 }),
}, (t) => ({
  affIdx: index("agree_aff_idx").on(t.affiliateProfileId),
}));
export type AffiliateAgreement = typeof affiliateAgreements.$inferSelect;
