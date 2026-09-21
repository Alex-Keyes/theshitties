import { randomUUID } from "node:crypto";
import { getDb, type Connection } from "./db";
import { type Nominee, type Season } from "./constants";
import { nominationInput, winners } from "./validation";
export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
export async function rateLimit(
  key: string,
  max: number,
  windowSeconds: number,
) {
  const db = await getDb();
  const rows = await db.query<{ count: number }>(
    `INSERT INTO rate_limits(key,count,expires_at) VALUES($1,1,now()+$2*interval '1 second') ON CONFLICT(key) DO UPDATE SET count=CASE WHEN rate_limits.expires_at<=now() THEN 1 ELSE rate_limits.count+1 END, expires_at=CASE WHEN rate_limits.expires_at<=now() THEN now()+$2*interval '1 second' ELSE rate_limits.expires_at END RETURNING count`,
    [key, windowSeconds],
  );
  if (rows[0].count > max)
    throw new AppError(
      "A little too enthusiastic. Please try again later.",
      429,
    );
}
const select = `SELECT n.id,n.season_id AS "seasonId",n.company,n.headline,n.description,n.category,n.sources,n.status,n.duplicate_of AS "duplicateOf",n.created_at AS "createdAt",(SELECT count(*)::int FROM votes v WHERE v.nominee_id=n.id) AS count`;
export async function listNominees(voter: string | null = null, all = false) {
  const db = await getDb();
  return db.query<Nominee>(
    `${select},EXISTS(SELECT 1 FROM votes v WHERE v.nominee_id=n.id AND v.voter_id=$1::uuid) AS voted FROM nominees n ${all ? "" : "WHERE n.status='visible'"} ORDER BY count DESC,n.created_at ASC,n.id`,
    [voter],
  );
}
export async function season() {
  const db = await getDb();
  const [s] = await db.query<Season>(
    'SELECT id,closes_at AS "closesAt",finalized_at AS "finalizedAt" FROM seasons ORDER BY id DESC LIMIT 1',
  );
  if (!s) throw new AppError("No award season configured.", 503);
  return s;
}
async function lockedSeason(tx: Connection) {
  const [locked] = await tx.query<{ id: number }>(
    `SELECT id FROM seasons ORDER BY id DESC LIMIT 1 FOR UPDATE`,
  );
  if (!locked) throw new AppError("No award season configured.", 503);
  const [s] = await tx.query<{ id: number; closed: boolean }>(
    `SELECT id,closes_at<=clock_timestamp() AS closed FROM seasons WHERE id=$1`,
    [locked.id],
  );
  if (!s) throw new AppError("No award season configured.", 503);
  return s;
}
export async function submitNominee(input: unknown) {
  const parsed = nominationInput.safeParse(input);
  if (!parsed.success) throw new AppError(parsed.error.issues[0].message);
  const n = parsed.data;
  const db = await getDb();
  return db.transaction(async (tx) => {
    const s = await lockedSeason(tx);
    if (s.closed) throw new AppError("This year’s nominations have closed.");
    const id = randomUUID();
    await tx.query(
      `INSERT INTO nominees(id,season_id,company,headline,description,category,sources) VALUES($1,$2,$3,$4,$5,$6,$7::jsonb)`,
      [
        id,
        s.id,
        n.company,
        n.headline,
        n.description,
        n.category,
        JSON.stringify(n.sources),
      ],
    );
    return id;
  });
}
export async function castVote(id: string, voter: string, active: boolean) {
  const db = await getDb();
  return db.transaction(async (tx) => {
    const s = await lockedSeason(tx);
    if (s.closed) throw new AppError("Voting has closed for this year.");
    const [n] = await tx.query<{ status: string; season_id: number }>(
      "SELECT status,season_id FROM nominees WHERE id=$1",
      [id],
    );
    if (!n || n.status !== "visible" || n.season_id !== s.id)
      throw new AppError("This nomination is not open for voting.", 404);
    await tx.query("INSERT INTO voters(id) VALUES($1) ON CONFLICT DO NOTHING", [
      voter,
    ]);
    if (active)
      await tx.query(
        "INSERT INTO votes(nominee_id,voter_id) VALUES($1,$2) ON CONFLICT DO NOTHING",
        [id, voter],
      );
    else
      await tx.query("DELETE FROM votes WHERE nominee_id=$1 AND voter_id=$2", [
        id,
        voter,
      ]);
    const [row] = await tx.query<{ count: number }>(
      "SELECT count(*)::int AS count FROM votes WHERE nominee_id=$1",
      [id],
    );
    return { count: row.count, voted: active };
  });
}
async function snapshotClosedSeason(tx: Connection, id: number) {
  const existing = await tx.query(
    "SELECT season_id FROM results WHERE season_id=$1",
    [id],
  );
  if (existing.length) return;
  const rows = await tx.query<Nominee>(
    `${select},false AS voted FROM nominees n WHERE n.status='visible' AND n.season_id=$1 ORDER BY count DESC,n.created_at ASC,n.id`,
    [id],
  );
  await tx.query(
    "INSERT INTO results(season_id,snapshot) VALUES($1,$2::jsonb)",
    [id, JSON.stringify({ nominees: rows, ...winners(rows) })],
  );
  await tx.query("UPDATE seasons SET finalized_at=now() WHERE id=$1", [id]);
}
export async function finalize() {
  const db = await getDb();
  await db.transaction(async (tx) => {
    const s = await lockedSeason(tx);
    if (s.closed) await snapshotClosedSeason(tx, s.id);
  });
}
export async function resultArchives() {
  await finalize();
  return (await getDb()).query<{
    season_id: number;
    snapshot: {
      nominees: Nominee[];
      overall: Nominee[];
      categories: Record<string, Nominee[]>;
    };
  }>("SELECT season_id,snapshot FROM results ORDER BY season_id DESC");
}
export async function reportNominee(id: string, reason: string) {
  if (reason.trim().length < 5 || reason.length > 1000)
    throw new AppError("Please give a reason between 5 and 1,000 characters.");
  const db = await getDb();
  const rows = await db.query(
    "SELECT id FROM nominees WHERE id=$1 AND status='visible'",
    [id],
  );
  if (!rows.length) throw new AppError("Nomination not found.", 404);
  await db.query("INSERT INTO reports(id,nominee_id,reason) VALUES($1,$2,$3)", [
    randomUUID(),
    id,
    reason.trim(),
  ]);
}
export async function adminAction(body: Record<string, unknown>) {
  await finalize();
  const db = await getDb();
  if (body.action === "resolve") {
    await db.query("UPDATE reports SET resolved=1 WHERE id=$1", [body.id]);
    return;
  }
  await db.transaction(async (tx) => {
    const s = await lockedSeason(tx);
    if (s.closed) await snapshotClosedSeason(tx, s.id);
    if (body.action === "deadline") {
      const date = new Date(String(body.date));
      if (s.closed) throw new AppError("A closed season cannot be reopened.");
      if (!Number.isFinite(date.getTime()) || date.getTime() <= Date.now())
        throw new AppError("Choose a future closing date.");
      await tx.query("UPDATE seasons SET closes_at=$1 WHERE id=$2", [
        date,
        s.id,
      ]);
      return;
    }
    if (body.action === "moderate") {
      if (!["visible", "hidden", "duplicate"].includes(String(body.status)))
        throw new AppError("Invalid status.");
      if (body.status === "duplicate") {
        if (s.closed)
          throw new AppError("Duplicates cannot be changed after closing.");
        if (body.id === body.duplicateOf)
          throw new AppError("An entry cannot duplicate itself.");
        const targets = await tx.query(
          "SELECT id FROM nominees WHERE id=$1 AND status='visible' AND season_id=$2",
          [body.duplicateOf, s.id],
        );
        if (!targets.length)
          throw new AppError("Choose a visible original from this season.");
      }
      await tx.query(
        "UPDATE nominees SET status=$1,duplicate_of=$2 WHERE id=$3 AND season_id=$4",
        [
          body.status,
          body.status === "duplicate" ? body.duplicateOf : null,
          body.id,
          s.id,
        ],
      );
      return;
    }
    throw new AppError("Unknown action.");
  });
}
