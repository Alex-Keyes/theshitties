import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());
import { migrateDatabase } from "../src/lib/db";
migrateDatabase()
  .then(() => {
    console.log("Database migrated.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
