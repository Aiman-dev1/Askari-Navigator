import Stripe from "stripe";
import Tenant from "../models/Tenant.js";
import { getPlans } from "../config/plans.js";

function getStripe() {
  return process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
}

function publicPlan({ priceId, ...plan }) {
  return { ...plan, available: !!priceId };
}

// GET /api/v1/billing/plans — public plan catalogue
export function listPlans(req, res) {
  res.json({
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    plans: getPlans().map(publicPlan),
  });
}

// GET /api/v1/billing/subscription  (tenant admin) — own subscription state
export async function getSubscription(req, res, next) {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });
    res.json({
      plan: tenant.plan,
      subscriptionStatus: tenant.subscriptionStatus,
      currentPeriodEnd: tenant.currentPeriodEnd,
      stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/billing/checkout { planId, billingData? }  (tenant admin)
// Creates a Stripe Checkout session or processes payment with billing data.
export async function createCheckout(req, res, next) {
  try {
    const stripe = getStripe();
    const { planId, billingData } = req.body;
    
    const plan = getPlans().find((p) => p.id === planId);
    if (!plan) return res.status(400).json({ error: "Unknown plan" });

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    if (!stripe) {
      // Mock successful checkout with billing data validation
      if (billingData) {
        // Validate required billing fields
        if (!billingData.cardholderName || !billingData.email || !billingData.cardNumber ||
            !billingData.expiryDate || !billingData.cvc || !billingData.address ||
            !billingData.city || !billingData.postalCode || !billingData.country) {
          return res.status(400).json({ error: "All billing fields are required" });
        }
      }

      // Update tenant subscription
      tenant.plan = plan.id;
      tenant.subscriptionStatus = "Active";
      tenant.currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      await tenant.save();

      return res.json({ success: true, message: "Subscription activated" });
    }

    if (!plan.priceId) {
      return res.status(503).json({ error: `No Stripe Price ID configured for the ${plan.name} plan` });
    }

    if (!tenant.stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: tenant.buildingName,
        email: billingData?.email || tenant.email || undefined,
        address: billingData ? {
          line1: billingData.address,
          city: billingData.city,
          postal_code: billingData.postalCode,
          country: billingData.country === "Pakistan" ? "PK" : billingData.country,
        } : undefined,
        metadata: { tenantId: tenant._id.toString() },
      });
      tenant.stripeCustomerId = customer.id;
      await tenant.save();
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: tenant.stripeCustomerId,
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${clientUrl}/building-admin?billing=success`,
      cancel_url: `${clientUrl}/building-admin?billing=cancelled`,
      metadata: { tenantId: tenant._id.toString(), planId: plan.id },
      subscription_data: {
        metadata: { tenantId: tenant._id.toString(), planId: plan.id },
      },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/billing/portal  (tenant admin) — Stripe customer portal
export async function createPortal(req, res, next) {
  try {
    const stripe = getStripe();
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    if (!stripe) {
      // Mock successful portal redirection
      return res.json({ url: `${clientUrl}/building-admin` });
    }

    const tenant = await Tenant.findById(req.user.tenantId);
    if (!tenant?.stripeCustomerId) {
      return res.status(400).json({ error: "No billing account yet — subscribe to a plan first" });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomerId,
      return_url: `${clientUrl}/building-admin`,
    });
    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
}

const STATUS_MAP = {
  active: "Active",
  trialing: "Trial",
  past_due: "Suspended",
  unpaid: "Suspended",
  canceled: "Cancelled",
  incomplete_expired: "Cancelled",
};

// POST /api/v1/billing/webhook — Stripe events (mounted with express.raw)
export async function webhook(req, res) {
  const stripe = getStripe();
  if (!stripe) return res.status(503).end();

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ error: `Webhook signature verification failed: ${err.message}` });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        await Tenant.findByIdAndUpdate(session.metadata.tenantId, {
          $set: {
            plan: session.metadata.planId,
            subscriptionStatus: "Active",
            stripeSubscriptionId: session.subscription,
          },
        });
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object;
        await Tenant.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          {
            $set: {
              subscriptionStatus: STATUS_MAP[sub.status] || "Suspended",
              currentPeriodEnd: new Date(sub.current_period_end * 1000),
            },
          }
        );
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object;
        await Tenant.findOneAndUpdate(
          { stripeSubscriptionId: sub.id },
          { $set: { subscriptionStatus: "Cancelled", plan: null, stripeSubscriptionId: null } }
        );
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error("Webhook handling failed:", err);
    res.status(500).json({ error: "Webhook handling failed" });
  }
}
