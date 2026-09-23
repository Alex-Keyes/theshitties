import { test } from "node:test";
import assert from "node:assert/strict";
import { visualCase } from "../src/lib/visual-cases";

test("editorial comparisons apply only to their verified nomination and award year", () => {
  const nomination = {
    company: "Netflix",
    changedAt: "2026-03-26",
    seasonId: 2026,
    verified: true,
    headline: "The price plot thickens. Again.",
  };
  assert.equal(visualCase(nomination)?.after, "$19.99");
  assert.equal(visualCase({ ...nomination, seasonId: 2027 }), undefined);
  assert.equal(
    visualCase({ ...nomination, changedAt: "2026-09-01" }),
    undefined,
  );
  assert.equal(
    visualCase({ ...nomination, headline: "A different complaint" }),
    undefined,
  );
  assert.equal(visualCase({ ...nomination, verified: false }), undefined);
  assert.equal(
    visualCase({ ...nomination, company: "Other company" }),
    undefined,
  );
});
