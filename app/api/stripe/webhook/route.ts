import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "../../../../lib/stripe";
import { supabaseAdmin } from "../../../../lib/supabaseAdmin";

export const runtime = "nodejs";

function createPassCode() {
  return `TLN-${crypto
    .randomUUID()
    .replaceAll("-", "")
    .slice(0, 16)
    .toUpperCase()}`;
}

function getSubscriptionId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  return null;
}

function getCustomerId(value: unknown) {
  if (typeof value === "string") {
    return value;
  }

  if (
    value &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "string"
  ) {
    return value.id;
  }

  return null;
}

function mapSubscriptionStatus(status: string) {
  if (status === "active" || status === "trialing") {
    return "active";
  }

  if (status === "past_due") {
    return "past_due";
  }

  if (status === "canceled") {
    return "canceled";
  }

  if (status === "unpaid") {
    return "unpaid";
  }

  if (status === "incomplete" || status === "incomplete_expired") {
    return "inactive";
  }

  return status || "inactive";
}

function getValidUntil(subscription: Stripe.Subscription) {
  const subscriptionWithPeriod = subscription as unknown as {
    current_period_end?: number;
  };

  if (subscriptionWithPeriod.current_period_end) {
    return new Date(
      subscriptionWithPeriod.current_period_end * 1000
    ).toISOString();
  }

  const fallback = new Date();
  fallback.setDate(fallback.getDate() + 30);

  return fallback.toISOString();
}

async function upsertPassFromCheckoutSession(session: Stripe.Checkout.Session) {
  const subscriptionId = getSubscriptionId(session.subscription);
  const customerId = getCustomerId(session.customer);

  if (!subscriptionId) {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const fullName =
    session.metadata?.full_name ||
    session.customer_details?.name ||
    "TLN Member";

  const email =
    session.metadata?.email ||
    session.customer_details?.email ||
    session.customer_email ||
    "";

  const status = mapSubscriptionStatus(subscription.status);
  const validUntil = getValidUntil(subscription);

  const { data: existingPass, error: existingError } = await supabaseAdmin
    .from("member_passes")
    .select("*")
    .eq("stripe_subscription_id", subscriptionId)
    .maybeSingle();

  if (existingError) {
    throw new Error(existingError.message);
  }

  if (existingPass) {
    const { error } = await supabaseAdmin
      .from("member_passes")
      .update({
        full_name: fullName,
        email,
        status,
        valid_until: validUntil,
        stripe_customer_id: customerId,
        stripe_checkout_session_id: session.id,
        last_payment_status: session.payment_status,
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const { error } = await supabaseAdmin.from("member_passes").insert({
    full_name: fullName,
    email,
    pass_code: createPassCode(),
    plan: "TLN Pass Monthly",
    status,
    valid_until: validUntil,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_checkout_session_id: session.id,
    last_payment_status: session.payment_status,
  });

  if (error) {
    throw new Error(error.message);
  }
}

async function updatePassFromSubscription(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const customerId = getCustomerId(subscription.customer);
  const status = mapSubscriptionStatus(subscription.status);
  const validUntil = getValidUntil(subscription);

  const updateData: Record<string, string | null> = {
    status,
    valid_until: validUntil,
    stripe_customer_id: customerId,
    updated_at: new Date().toISOString(),
  };

  if (status === "canceled") {
    updateData.canceled_at = new Date().toISOString();
  }

  const { error } = await supabaseAdmin
    .from("member_passes")
    .update(updateData)
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }
}

async function updatePassFromInvoice(
  invoice: Stripe.Invoice,
  result: "paid" | "failed"
) {
  const invoiceWithSubscription = invoice as unknown as {
    subscription?: string | { id?: string };
  };

  const subscriptionId = getSubscriptionId(invoiceWithSubscription.subscription);

  if (!subscriptionId) {
    return;
  }

  if (result === "paid") {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const { error } = await supabaseAdmin
      .from("member_passes")
      .update({
        status: mapSubscriptionStatus(subscription.status),
        valid_until: getValidUntil(subscription),
        last_payment_status: "paid",
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscriptionId);

    if (error) {
      throw new Error(error.message);
    }

    return;
  }

  const { error } = await supabaseAdmin
    .from("member_passes")
    .update({
      status: "past_due",
      last_payment_status: "failed",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_subscription_id", subscriptionId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || webhookSecret === "not_configured_yet") {
    return NextResponse.json(
      {
        received: false,
        error: "STRIPE_WEBHOOK_SECRET is not configured yet",
      },
      { status: 400 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        received: false,
        error: "Missing Stripe signature",
      },
      { status: 400 }
    );
  }

  const rawBody = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook signature error";

    return NextResponse.json(
      {
        received: false,
        error: message,
      },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await upsertPassFromCheckoutSession(session);
    }

    if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object as Stripe.Subscription;
      await updatePassFromSubscription(subscription);
    }

    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;
      await updatePassFromInvoice(invoice, "paid");
    }

    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      await updatePassFromInvoice(invoice, "failed");
    }

    return NextResponse.json({
      received: true,
      type: event.type,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook handling error";

    return NextResponse.json(
      {
        received: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
