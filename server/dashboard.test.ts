import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import type { User } from "../drizzle/schema";

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue(null),
}));

function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: 1,
    openId: null,
    name: "Test User",
    email: "test@dyneros.com",
    passwordHash: null,
    company: null,
    phone: null,
    loginMethod: "email",
    role: "user",
    status: "active",
    emailVerified: true,
    emailVerifyToken: null,
    emailVerifyExpiry: null,
    resetToken: null,
    resetTokenExpiry: null,
    lastLoginAt: null,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    lastSignedIn: new Date("2026-01-01"),
    ...overrides,
  };
}

function makeCtx(user: User | null = makeUser()): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("dashboard.notificationCount", () => {
  it("returns count 0 when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.notificationCount();
    expect(result).toEqual({ count: 0 });
  });
});

describe("dashboard.stats", () => {
  it("returns tier Enterprise for admin user", async () => {
    const ctx = makeCtx(makeUser({ role: "admin" }));
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.stats();
    expect(result.tier).toBe("Enterprise");
  });

  it("returns tier Business for regular user", async () => {
    const ctx = makeCtx(makeUser({ role: "user" }));
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.stats();
    expect(result.tier).toBe("Business");
  });

  it("returns accountStatus active", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.stats();
    expect(result.accountStatus).toBe("active");
  });

  it("returns customerId with correct format", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ id: 42 })));
    const result = await caller.dashboard.stats();
    expect(result.customerId).toMatch(/^DYN-CLI-2026-0042$/);
  });
});

describe("dashboard.projects", () => {
  it("returns empty array when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.projects();
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(0);
  });
});

describe("dashboard.tickets", () => {
  it("returns empty array when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.tickets();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard.invoices", () => {
  it("returns empty array when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.invoices();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard.notifications", () => {
  it("returns empty array when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.notifications();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard.apiKeys", () => {
  it("returns empty keys array when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.apiKeys();
    expect(result).toHaveProperty("keys");
    expect(Array.isArray(result.keys)).toBe(true);
  });
});

describe("dashboard.settings", () => {
  it("returns default settings when db is unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.settings();
    expect(result).toMatchObject({
      language: "it",
      theme: "dark",
      notificationsEmail: true,
      notificationsTickets: true,
      notificationsInvoices: true,
      notificationsMilestones: true,
    });
  });
});

describe("dashboard.knowledgeBase", () => {
  it("returns articles array", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.knowledgeBase();
    expect(result).toHaveProperty("articles");
    expect(result.articles.length).toBeGreaterThan(0);
    expect(result.articles[0]).toHaveProperty("id");
    expect(result.articles[0]).toHaveProperty("title");
    expect(result.articles[0]).toHaveProperty("category");
  });
});

describe("dashboard.teamContacts", () => {
  it("returns team array with required fields", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.teamContacts();
    expect(result).toHaveProperty("team");
    expect(result.team.length).toBeGreaterThan(0);
    const member = result.team[0];
    expect(member).toHaveProperty("name");
    expect(member).toHaveProperty("role");
    expect(member).toHaveProperty("email");
    expect(member).toHaveProperty("status");
  });
});

describe("dashboard.blockchainInfo", () => {
  it("returns chain info with correct chainId", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.blockchainInfo();
    expect(result.chain.chainId).toBe(24589);
    expect(result.chain.name).toBe("DYNEROS Chain");
    expect(Array.isArray(result.tokens)).toBe(true);
    expect(typeof result.contracts).toBe("object");
    expect(result.contracts).toHaveProperty("factory");
    expect(result.contracts).toHaveProperty("router");
  });
});

describe("dashboard.walletInfo", () => {
  it("returns wallet structure when db unavailable", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.dashboard.walletInfo();
    expect(result).toHaveProperty("addresses");
    expect(result).toHaveProperty("portfolio");
    expect(result).toHaveProperty("recentTx");
    expect(result).toHaveProperty("chain");
  });
});

describe("network.status", () => {
  it("returns operational status with valid block height", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const result = await caller.network.status();
    expect(result.status).toBe("operational");
    expect(result.blockHeight).toBeGreaterThanOrEqual(1_420_000);
    expect(result.validators.active).toBe(12);
    expect(result.uptime).toBe(99.97);
  });
});

describe("superadmin.stats", () => {
  it("throws when user is not superadmin", async () => {
    const ctx = makeCtx(makeUser({ role: "user" }));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.superadmin.stats()).rejects.toThrow("Accesso negato");
  });

  it("returns stats object for superadmin when db unavailable", async () => {
    const ctx = makeCtx(makeUser({ role: "superadmin" }));
    const caller = appRouter.createCaller(ctx);
    const result = await caller.superadmin.stats();
    expect(result).toMatchObject({ total: 0, active: 0, suspended: 0, admins: 0, newThisMonth: 0 });
  });
});

describe("superadmin.listUsers", () => {
  it("throws when user is not superadmin", async () => {
    const ctx = makeCtx(makeUser({ role: "admin" }));
    const caller = appRouter.createCaller(ctx);
    await expect(caller.superadmin.listUsers()).rejects.toThrow("Accesso negato");
  });

  it("returns empty array for superadmin when db unavailable", async () => {
    const ctx = makeCtx(makeUser({ role: "superadmin" }));
    const caller = appRouter.createCaller(ctx);
    const result = await caller.superadmin.listUsers();
    expect(Array.isArray(result)).toBe(true);
  });
});
