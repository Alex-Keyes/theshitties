import {
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";
function secret() {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  if (process.env.NODE_ENV === "production" && !process.env.LOCAL_PREVIEW)
    throw new Error("Set SESSION_SECRET to at least 32 characters.");
  return "local-only-shitties-session-secret-not-for-production";
}
export function sign(value: string) {
  return (
    value + "." + createHmac("sha256", secret()).update(value).digest("hex")
  );
}
export function verify(token: string | undefined) {
  if (!token) return null;
  const p = token.lastIndexOf(".");
  const value = token.slice(0, p);
  const expected = sign(value);
  return token.length === expected.length &&
    timingSafeEqual(Buffer.from(token), Buffer.from(expected))
    ? value
    : null;
}
export async function voterId() {
  const raw = verify((await cookies()).get("shitties_voter")?.value);
  return raw && /^[0-9a-f-]{36}$/.test(raw) ? raw : null;
}
export async function isAdmin() {
  const value = verify((await cookies()).get("shitties_admin")?.value);
  return (
    !!value && value.startsWith("admin:") && Number(value.slice(6)) > Date.now()
  );
}
export function passwordHash(
  password: string,
  salt = randomBytes(16).toString("hex"),
) {
  return salt + ":" + scryptSync(password, salt, 64).toString("hex");
}
export function passwordValid(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  const [salt, key] = hash.split(":");
  if (!salt || !key || key.length !== 128) return false;
  const expected = passwordHash(password, salt);
  return (
    expected.length === hash.length &&
    timingSafeEqual(Buffer.from(expected), Buffer.from(hash))
  );
}
export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production" && !process.env.LOCAL_PREVIEW,
  path: "/",
};
export function clientKey(ip: string) {
  return createHmac("sha256", secret())
    .update("rate:" + ip)
    .digest("hex");
}
