import type { Nominee } from "./constants";

export const companyBrands: Record<string, { file: string; tone: string }> = {
  "southwest airlines": { file: "southwest", tone: "blue" },
  "american airlines": { file: "american", tone: "blue" },
  "delta air lines": { file: "delta", tone: "blue" },
  spotify: { file: "spotify", tone: "green" },
  netflix: { file: "netflix", tone: "red" },
  youtube: { file: "youtube", tone: "red" },
  meta: { file: "meta", tone: "blue" },
};

export type VisualCase = {
  company: string;
  changedAt: string;
  headline: string;
  title: string;
  kind: "music" | "video" | "baggage" | "seating" | "photos";
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  context: string;
  impact: string;
  impactLabel: string;
  note: string;
};

// Editorial summaries of the cited 2026 cases in add-2026-nominees.ts.
// Match the specific nomination, never just the company: later seasons and
// community submissions must not inherit an unrelated claim or price.
const cases: VisualCase[] = [
  {
    company: "Southwest Airlines",
    changedAt: "2026-01-27",
    headline: "Open seating got assigned a funeral.",
    title: "RIP, open seating.",
    kind: "seating",
    before: "Your choice",
    after: "Assigned",
    context: "How you get your seat",
    impact: "RIP",
    impactLabel: "open seating",
    note: "Basic fares generally get a seat assignment at check-in.",
  },
  {
    company: "American Airlines",
    changedAt: "2026-04-09",
    headline: "The fare is basic. The fees are advanced.",
    title: "Your bag has a cover charge.",
    kind: "baggage",
    before: "$45",
    after: "$50",
    beforeLabel: "Prepaid",
    afterLabel: "At airport",
    context: "First checked bag · affected itineraries",
    impact: "$100",
    impactLabel: "round trip, one bag",
    note: "At the airport rate. New fees apply to affected tickets bought April 9 onward.",
  },
  {
    company: "Delta Air Lines",
    changedAt: "2026-04-08",
    headline: "Your suitcase just hit an upgrade fee.",
    title: "Same bag. Bigger fee.",
    kind: "baggage",
    before: "$35",
    after: "$45",
    context: "First checked bag · affected itineraries",
    impact: "+$20",
    impactLabel: "per round trip",
    note: "First-bag fees rose $10 each way on affected itineraries.",
  },
  {
    company: "Spotify",
    changedAt: "2026-02-01",
    headline: "Premium now comes with a premium-er price.",
    title: "Same playlist. New price.",
    kind: "music",
    before: "$11.99",
    after: "$12.99",
    context: "U.S. Individual Premium · per month",
    impact: "+$12",
    impactLabel: "per year",
    note: "A full year at the new monthly rate. Duo and Family rose $2/month.",
  },
  {
    company: "Netflix",
    changedAt: "2026-03-26",
    headline: "The price plot thickens. Again.",
    title: "The sequel costs more.",
    kind: "video",
    before: "$17.99",
    after: "$19.99",
    context: "U.S. Standard, ad-free · per month",
    impact: "+$24",
    impactLabel: "per year",
    note: "A full year at the new monthly rate. Every U.S. plan went up.",
  },
  {
    company: "YouTube",
    changedAt: "2026-04-10",
    headline: "Pay more to keep the ads away.",
    title: "Ad-free got less affordable.",
    kind: "video",
    before: "$22.99",
    after: "$26.99",
    context: "U.S. Premium Family · per month",
    impact: "+$48",
    impactLabel: "per year",
    note: "A full year at the new monthly rate. Individual Premium rose $2/month.",
  },
  {
    company: "Meta",
    changedAt: "2026-07-07",
    headline: "Instagram photos became AI props—until people noticed.",
    title: "Your photos. Someone’s AI props.",
    kind: "photos",
    before: "Public posts",
    after: "AI references",
    context: "Public adult Instagram accounts",
    impact: "~3 days",
    impactLabel: "before it was pulled",
    note: "Meta removed the image-reference feature after backlash.",
  },
];

export function visualCase(
  nominee: Pick<
    Nominee,
    "seasonId" | "verified" | "company" | "changedAt" | "headline"
  >,
): VisualCase | undefined {
  if (nominee.seasonId !== 2026 || !nominee.verified) return undefined;
  return cases.find(
    (item) =>
      item.company.toLowerCase() === nominee.company.toLowerCase() &&
      item.changedAt === nominee.changedAt &&
      item.headline === nominee.headline,
  );
}
