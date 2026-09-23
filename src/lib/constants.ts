export const categories = [
  {
    id: "ads",
    name: "Ad Infestation",
    description: "For turning every surface into ad space.",
    symbol: "⌁",
  },
  {
    id: "subscriptions",
    name: "Subscription Shakedown",
    description: "For charging more to give you less.",
    symbol: "▣",
  },
  {
    id: "features",
    name: "Feature Funeral",
    description: "In loving memory of things that worked.",
    symbol: "⚰",
  },
  {
    id: "lock-in",
    name: "Lock-In of the Year",
    description: "You can check out. You just can’t leave.",
    symbol: "▰",
  },
  {
    id: "bait-switch",
    name: "Bait & Switch",
    description: "For becoming the thing you promised not to be.",
    symbol: "〰",
  },
  {
    id: "value-collapse",
    name: "Value Collapse",
    description: "Same product. Less product. More money.",
    symbol: "◒",
  },
  {
    id: "junk-fees",
    name: "Junk Fee Jamboree",
    description: "The advertised price was fan fiction.",
    symbol: "+$",
  },
  {
    id: "public-disservice",
    name: "Public Disservice",
    description: "Your taxes, now with a 404.",
    symbol: "404",
  },
] as const;
export const category = (id: string) => categories.find((c) => c.id === id)!;

export const sectors = [
  { id: "technology", name: "Technology" },
  { id: "food-drink", name: "Food & drink" },
  { id: "travel", name: "Travel" },
  { id: "entertainment", name: "Entertainment" },
  { id: "retail", name: "Retail" },
  { id: "finance", name: "Finance" },
  { id: "public-services", name: "Public services" },
  { id: "other", name: "Other" },
] as const;
export const sector = (id: string | null) =>
  sectors.find((item) => item.id === id) ?? sectors[sectors.length - 1];

export const sourceTypes = [
  { id: "primary", name: "Official announcement" },
  { id: "regulator", name: "Regulator or public record" },
  { id: "reporting", name: "Independent reporting" },
  { id: "community", name: "Community evidence" },
] as const;
export const sourceType = (id: string) =>
  sourceTypes.find((item) => item.id === id) ?? sourceTypes[2];

export const outcomes = [
  { id: "ongoing", name: "Still shitty" },
  { id: "partial", name: "Partially fixed" },
  { id: "reversed", name: "Reversed" },
  { id: "settled", name: "Settled" },
] as const;
export const outcome = (id: string) =>
  outcomes.find((item) => item.id === id) ?? outcomes[0];

export type NomineeSource = {
  url: string;
  title: string;
  publisher: string;
  publishedAt: string;
  type: (typeof sourceTypes)[number]["id"];
};
export type NomineeImage = {
  kind: "upload" | "external";
  url: string;
  alt: string;
};
export type Nominee = {
  id: string;
  seasonId: number;
  company: string;
  headline: string;
  description: string;
  before: string | null;
  after: string | null;
  impact: string | null;
  changedAt: string | null;
  category: string;
  sector: string | null;
  sources: NomineeSource[];
  images: NomineeImage[];
  status: string;
  outcome: (typeof outcomes)[number]["id"];
  verified: boolean;
  duplicateOf: string | null;
  createdAt: string;
  count: number;
  voted: boolean;
};
export type Season = {
  id: number;
  closesAt: string;
  finalizedAt: string | null;
};
