export const categories = [
  {
    id: "ads",
    name: "Ad Infestation",
    description: "For turning every surface into ad space.",
    symbol: "✳",
  },
  {
    id: "subscriptions",
    name: "Subscription Shakedown",
    description: "For charging more to give you less.",
    symbol: "$",
  },
  {
    id: "features",
    name: "Feature Funeral",
    description: "In loving memory of things that worked.",
    symbol: "†",
  },
  {
    id: "lock-in",
    name: "Lock-In of the Year",
    description: "You can check out. You just can’t leave.",
    symbol: "⌘",
  },
  {
    id: "bait-switch",
    name: "Bait & Switch",
    description: "For becoming the thing you promised not to be.",
    symbol: "↔",
  },
] as const;
export const category = (id: string) => categories.find((c) => c.id === id)!;
export type Nominee = {
  id: string;
  seasonId: number;
  company: string;
  headline: string;
  description: string;
  category: string;
  sources: string[];
  status: string;
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
