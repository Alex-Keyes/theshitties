import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import postgres from "postgres";
import { drizzle as localDrizzle } from "drizzle-orm/pglite";
import { migrate as localMigrate } from "drizzle-orm/pglite/migrator";
import { drizzle as remoteDrizzle } from "drizzle-orm/postgres-js";
import { migrate as remoteMigrate } from "drizzle-orm/postgres-js/migrator";
export interface Connection {
  query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[],
  ): Promise<T[]>;
  transaction<T>(fn: (tx: Connection) => Promise<T>): Promise<T>;
}
function wrapLocal(pg: any): Connection {
  return {
    query: async <T>(sql: string, params: unknown[] = []) =>
      (await pg.query(sql, params)).rows as T[],
    transaction: (fn) => pg.transaction((tx: any) => fn(wrapLocal(tx))),
  };
}
function wrapRemote(pg: any): Connection {
  return {
    query: async <T>(sql: string, params: unknown[] = []) =>
      (await pg.unsafe(sql, params)) as T[],
    transaction: (fn) => pg.begin((tx: any) => fn(wrapRemote(tx))),
  };
}
const state = globalThis as unknown as { shittiesDb?: Promise<Connection> };
export async function getDb() {
  return (state.shittiesDb ??= connect());
}
async function connect() {
  if (process.env.DATABASE_URL)
    return wrapRemote(
      postgres(process.env.DATABASE_URL, { max: 5, prepare: false }),
    );
  if (process.env.NODE_ENV === "production" && !process.env.LOCAL_PREVIEW)
    throw new Error("DATABASE_URL is required in production.");
  const localPath = process.env.LOCAL_DB_PATH || ".local/postgres";
  if (localPath !== "memory://")
    mkdirSync(dirname(localPath), { recursive: true });
  const pg = new PGlite(localPath);
  await localMigrate(localDrizzle(pg), { migrationsFolder: "drizzle" });
  const db = wrapLocal(pg);
  await initSeason(db);
  return db;
}
export async function initSeason(db: Connection) {
  await db.query(
    "INSERT INTO seasons(id,closes_at) VALUES(2026,'2027-01-01T05:00:00Z') ON CONFLICT DO NOTHING",
  );
}
export async function migrateDatabase() {
  if (process.env.DATABASE_URL) {
    const pg = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    await remoteMigrate(remoteDrizzle(pg), { migrationsFolder: "drizzle" });
    await initSeason(wrapRemote(pg));
    await pg.end();
  } else {
    await getDb();
  }
}
