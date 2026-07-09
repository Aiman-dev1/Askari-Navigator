// SaaS subscription plans. Prices are display-only; Stripe charges
// whatever the configured Price ID says — create the Stripe Prices in PKR
// so checkout matches what the UI shows.
export function getPlans() {
  return [
    {
      id: "basic",
      name: "Basic",
      currency: "PKR",
      price: 500,
      features: ["Office directory", "Indoor navigation", "Global tower chat"],
      priceId: process.env.STRIPE_PRICE_BASIC || null,
    },
    {
      id: "professional",
      name: "Professional",
      currency: "PKR",
      price: 1779,
      features: ["Everything in Basic", "Floor chat rooms", "Shuffle Chat", "FAQ assistant"],
      priceId: process.env.STRIPE_PRICE_PROFESSIONAL || null,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      currency: "PKR",
      price: 2990,
      features: ["Everything in Professional", "SVG floor plans", "Chat moderation", "Priority support"],
      priceId: process.env.STRIPE_PRICE_ENTERPRISE || null,
    },
  ];
}
