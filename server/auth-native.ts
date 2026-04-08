import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { users, type User } from "../drizzle/schema";
import { ENV } from "./_core/env";
import { COOKIE_NAME } from "@shared/const";

const JWT_SECRET = new TextEncoder().encode(ENV.cookieSecret || "dyneros-fallback-secret-change-me");
const SESSION_TTL_DAYS = 30;

export { COOKIE_NAME as NATIVE_COOKIE_NAME };

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export async function signSessionJWT(userId: number, role: string): Promise<string> {
  return new SignJWT({ sub: String(userId), role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(JWT_SECRET);
}

export async function verifySessionJWT(token: string): Promise<{ userId: number; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { userId: Number(payload.sub), role: payload.role as string };
  } catch {
    return null;
  }
}

export async function getUserFromCookie(cookieHeader: string | undefined): Promise<User | null> {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  if (!match?.[1]) return null;
  const payload = await verifySessionJWT(match[1]);
  if (!payload) return null;
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
  return rows[0] ?? null;
}

export function sessionCookieOptions(secure: boolean) {
  return {
    httpOnly: true,
    secure,
    sameSite: secure ? ("none" as const) : ("lax" as const),
    path: "/",
    maxAge: 60 * 60 * 24 * SESSION_TTL_DAYS,
  };
}

export async function ensureSuperAdmin(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const email = process.env.SUPERADMIN_EMAIL || "admin@dyneros.com";
  const password = process.env.SUPERADMIN_PASSWORD || "Dyneros@2026!";
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing.length > 0) return;
  const passwordHash = await hashPassword(password);
  await db.insert(users).values({
    email,
    name: "Super Admin",
    company: "Dyneros Ltd",
    passwordHash,
    loginMethod: "email",
    role: "superadmin",
    status: "active",
    emailVerified: true,
    openId: `superadmin-${Date.now()}`,
    lastSignedIn: new Date(),
  });
  console.log(`[Auth] Superadmin created: ${email}`);
}
