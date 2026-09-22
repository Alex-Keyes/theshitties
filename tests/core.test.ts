import { test, before } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
process.env.LOCAL_DB_PATH = "memory://";
process.env.DATABASE_URL = "";
process.env.SESSION_SECRET =
  "test-session-secret-at-least-thirty-two-characters";
import { getDb } from "../src/lib/db";
import {
  submitNominee,
  castVote,
  listNominees,
  rateLimit,
  reportNominee,
  adminAction,
  finalize,
  resultArchives,
} from "../src/lib/service";
import { nominationInput, winners } from "../src/lib/validation";
import { sign, verify, passwordHash, passwordValid } from "../src/lib/auth";
const input = {
  company: "Test Company",
  headline: "The update that removed everything",
  category: "features",
  description:
    "This product removed the useful features customers had already paid for.",
  sources: ["https://example.com/evidence"],
  images: [
    {
      kind: "external" as const,
      url: "https://example.com/evidence.png",
      alt: "Screenshot of the removed feature",
    },
  ],
  website: "",
};
before(async () => {
  await getDb();
});
test("validation accepts plain text and rejects unsafe sources and honeypot", () => {
  assert.equal(nominationInput.safeParse(input).success, true);
  assert.equal(
    nominationInput.safeParse({ ...input, sources: ["javascript:alert(1)"] })
      .success,
    false,
  );
  assert.equal(
    nominationInput.safeParse({ ...input, website: "spam" }).success,
    false,
  );
  assert.equal(
    nominationInput.safeParse({ ...input, sources: [] }).success,
    false,
  );
  assert.equal(
    nominationInput.safeParse({
      ...input,
      images: Array.from({ length: 4 }, () => input.images[0]),
    }).success,
    false,
  );
  assert.equal(
    nominationInput.safeParse({
      ...input,
      images: [{ ...input.images[0], url: "http://example.com/image.png" }],
    }).success,
    false,
  );
});
test("signed tokens reject tampering; password hashes verify", () => {
  const token = sign("hello");
  assert.equal(verify(token), "hello");
  assert.equal(verify(token + "x"), null);
  process.env.ADMIN_PASSWORD_HASH = passwordHash("long-test-password");
  assert.equal(passwordValid("long-test-password"), true);
  assert.equal(passwordValid("wrong"), false);
});
test("winner calculation preserves ties and empty categories", () => {
  const result = winners([
    { category: "ads", count: 2 },
    { category: "features", count: 2 },
    { category: "ads", count: 1 },
  ]);
  assert.equal(result.overall.length, 2);
  assert.equal(result.categories.ads.length, 1);
  assert.equal(result.categories["lock-in"].length, 0);
  assert.equal(winners([]).overall.length, 0);
});
test("database-backed submission, votes, moderation, reports, limits and finalization", async () => {
  const db = await getDb();
  const id = await submitNominee(input);
  const other = await submitNominee({ ...input, company: "Second Company" });
  const voter = randomUUID();
  assert.equal((await listNominees()).length, 2);
  assert.equal(
    (await listNominees()).find((n) => n.id === id)?.images[0].alt,
    "Screenshot of the removed feature",
  );
  await Promise.all(
    Array.from({ length: 12 }, () => castVote(id, voter, true)),
  );
  assert.equal((await listNominees(voter)).find((n) => n.id === id)?.count, 1);
  assert.equal(
    (await listNominees(voter)).find((n) => n.id === id)?.voted,
    true,
  );
  await castVote(id, voter, false);
  await castVote(id, voter, false);
  assert.equal((await listNominees()).find((n) => n.id === id)?.count, 0);
  await Promise.all(
    Array.from({ length: 8 }, () => castVote(id, randomUUID(), true)),
  );
  assert.equal((await listNominees()).find((n) => n.id === id)?.count, 8);
  await reportNominee(id, "Please review this source.");
  const [report] = await db.query<{ id: string }>("SELECT id FROM reports");
  await adminAction({ action: "resolve", id: report.id });
  assert.equal(
    (await db.query<{ resolved: number }>("SELECT resolved FROM reports"))[0]
      .resolved,
    1,
  );
  await adminAction({ action: "moderate", id, status: "hidden" });
  assert.equal(
    (await listNominees()).some((n) => n.id === id),
    false,
  );
  await assert.rejects(() => castVote(id, voter, true), /not open/);
  await adminAction({ action: "moderate", id, status: "visible" });
  await adminAction({
    action: "removeImage",
    id,
    url: "https://example.com/evidence.png",
  });
  assert.equal((await listNominees()).find((n) => n.id === id)?.images.length, 0);
  await assert.rejects(
    () =>
      adminAction({
        action: "moderate",
        id,
        status: "duplicate",
        duplicateOf: id,
      }),
    /itself/,
  );
  await adminAction({
    action: "moderate",
    id: other,
    status: "duplicate",
    duplicateOf: id,
  });
  assert.equal((await listNominees()).length, 1);
  assert.equal((await listNominees())[0].count, 8);
  await rateLimit("test-limit", 2, 60);
  await rateLimit("test-limit", 2, 60);
  await assert.rejects(() => rateLimit("test-limit", 2, 60), /enthusiastic/);
  await db.query(
    "UPDATE rate_limits SET expires_at=now()-interval '1 second' WHERE key='test-limit'",
  );
  await rateLimit("test-limit", 2, 60);
  await adminAction({ action: "deadline", date: "2029-01-01T05:00:00Z" });
  await finalize();
  assert.equal((await db.query("SELECT * FROM results")).length, 0);
  await db.query("UPDATE seasons SET closes_at=now()-interval '1 second'");
  await assert.rejects(() => castVote(id, voter, true), /closed/);
  await assert.rejects(() => submitNominee(input), /closed/);
  await Promise.all([finalize(), finalize(), finalize()]);
  const archives = await resultArchives();
  assert.equal(archives.length, 1);
  assert.equal(archives[0].snapshot.overall[0].count, 8);
  await adminAction({ action: "moderate", id, status: "hidden" });
  assert.equal((await resultArchives())[0].snapshot.overall[0].count, 8);
  await assert.rejects(
    () => adminAction({ action: "deadline", date: "2030-01-01T00:00:00Z" }),
    /reopened/,
  );
});
