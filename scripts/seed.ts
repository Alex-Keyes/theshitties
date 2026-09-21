import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { getDb } from "../src/lib/db";
import { randomUUID } from "node:crypto";
async function main() {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL ||
    (process.env.DATABASE_URL && process.env.ALLOW_DEMO_SEED !== "true")
  )
    throw new Error(
      "Demo seeding is only allowed locally or in an explicitly enabled development database.",
    );
  const db = await getDb();
  const [existing] = await db.query<{ count: number }>(
    "SELECT count(*)::int AS count FROM nominees",
  );
  if (existing.count) {
    console.log("Database already has nominations; seed skipped.");
    return;
  }
  const entries = [
    [
      "Streamly",
      "Now with ads. Even when you pay.",
      "ads",
      "The fictional streaming service added commercial breaks to its paid plan. The price stayed the same; the uninterrupted experience became an extra.",
    ],
    [
      "CloudPocket",
      "Your files. Their exit fee.",
      "lock-in",
      "This fictional storage company replaced one-click export with a paid migration package. Downloading your own archive now requires an upgrade.",
    ],
    [
      "NoteNest",
      "The search feature has left the chat.",
      "features",
      "A fictional note-taking app removed offline search in its latest update. Finding a note on an airplane now requires an internet connection.",
    ],
    [
      "FitLoop",
      "Congratulations. Your watch needs a subscription.",
      "subscriptions",
      "This fictional fitness tracker moved previously included sleep history behind a monthly membership, including data from devices already purchased.",
    ],
    [
      "QuietSearch",
      "The private search engine that changed its mind.",
      "bait-switch",
      "A fictional search engine built its audience on a promise of no profiling. Its new default experience uses search history for personalized promotions.",
    ],
    [
      "RecipeRoom",
      "A recipe for more pop-ups.",
      "ads",
      "This fictional recipe site now covers the ingredient list with autoplay video and sticky promotions. The jump-to-recipe button jumps to an advertisement.",
    ],
  ];
  for (const [company, headline, category, description] of entries) {
    await db.query(
      "INSERT INTO nominees(id,season_id,company,headline,category,description,sources) VALUES($1,2026,$2,$3,$4,$5,$6::jsonb)",
      [
        randomUUID(),
        company,
        headline,
        category,
        description,
        JSON.stringify(["https://example.com/fictional-demo"]),
      ],
    );
  }
  console.log("Added six fictional nominations; no demo votes.");
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
