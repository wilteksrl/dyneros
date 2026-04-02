import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  /**
   * Public procedure: returns live-simulated Dyneros Chain network status.
   * No database access required — metrics are computed from runtime state.
   */
  network: router({
    status: publicProcedure.query(() => {
      const now = Date.now();
      // Simulate deterministic but time-varying metrics
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
      };
    }),
  }),

  /**
   * Protected procedure: returns dashboard data for the authenticated user.
   * Extends the base user profile with service tier and usage metrics.
   */
  dashboard: router({
    data: protectedProcedure.query(({ ctx }) => {
      const user = ctx.user;
      // Derive tier from role; admins get Enterprise view
      const tier = user.role === "admin" ? "Enterprise" : "Business";
      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        service: {
          tier,
          status: "active" as const,
          txUsed: 284_312,
          txLimit: tier === "Enterprise" ? null : 500_000,
          nextBillingDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
        network: {
          chainId: 1337,
          rpcEndpoint: "https://mainnet.dyneros.com",
          wsEndpoint: "wss://mainnet.dyneros.com",
          explorerUrl: "https://explorer.dyneros.com",
          walletUrl: "https://wallet.dyneros.com",
        },
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
