export type PlanId = "14day" | "monthly" | "6months" | "yearly";

export type Plan = {
  id: PlanId;
  name: string;
  duration: string;
  oldPrice: string;
  price: string;
  note: string;
  badge?: "popular" | "best";
  envKey: string;
};

export const plans: Plan[] = [
  {
    id: "14day",
    name: "Starter Pass",
    duration: "14 days",
    oldPrice: "12€",
    price: "7.99€",
    note: "Try TLN Pass before choosing a longer membership.",
    envKey: "STRIPE_PRICE_ID_14_DAY",
  },
  {
    id: "monthly",
    name: "Monthly",
    duration: "1 month",
    oldPrice: "25€",
    price: "19.99€",
    note: "Flexible access with monthly billing.",
    badge: "popular",
    envKey: "STRIPE_PRICE_ID_MONTHLY",
  },
  {
    id: "6months",
    name: "City Half-Year",
    duration: "6 months",
    oldPrice: "119.94€",
    price: "99€",
    note: "Better value for regular Tallinn outings.",
    envKey: "STRIPE_PRICE_ID_6_MONTHS",
  },
  {
    id: "yearly",
    name: "Golden Year",
    duration: "12 months",
    oldPrice: "239.88€",
    price: "179€",
    note: "Maximum value for members who use TLN Pass often.",
    badge: "best",
    envKey: "STRIPE_PRICE_ID_YEARLY",
  },
];

export function getPlanById(planId?: string | null) {
  return plans.find((plan) => plan.id === planId) || plans[1];
}

export function getStripePriceId(planId?: string | null) {
  const plan = getPlanById(planId);

  const specificPriceId = process.env[plan.envKey];

  if (specificPriceId) {
    return specificPriceId;
  }

  if (plan.id === "monthly" && process.env.STRIPE_PRICE_ID) {
    return process.env.STRIPE_PRICE_ID;
  }

  if (process.env.STRIPE_PRICE_ID_MONTHLY) {
    return process.env.STRIPE_PRICE_ID_MONTHLY;
  }

  if (process.env.STRIPE_PRICE_ID) {
    return process.env.STRIPE_PRICE_ID;
  }

  throw new Error(`Missing Stripe price id for plan: ${plan.id}`);
}
