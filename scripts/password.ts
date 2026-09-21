import { passwordHash } from "../src/lib/auth";
if (!process.argv[2] || process.argv[2].length < 12)
  throw new Error("Provide a password of at least 12 characters.");
console.log(passwordHash(process.argv[2]));
