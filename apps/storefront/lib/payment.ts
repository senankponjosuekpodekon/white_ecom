import { medusaClient } from "./medusa-client";

export type ShippingOption = {
  id: string;
  name: string;
  amount: number;
  currency_code: string;
};

async function getPaymentCollectionId(cartId: string): Promise<string | null> {
  try {
    const { cart } = await medusaClient.client.fetch<{ cart: unknown }>(
      `/store/carts/${cartId}?fields=payment_collection.*`
    );
    const typedCart = cart as { payment_collection?: { id?: string } };
    return typedCart.payment_collection?.id ?? null;
  } catch {
    return null;
  }
}

async function refreshPaymentCollectionId(cartId: string): Promise<string | null> {
  try {
    const { payment_collection } = await medusaClient.client.fetch<{
      payment_collection: { id: string };
    }>("/store/payment-collections", {
      method: "POST",
      body: { cart_id: cartId },
    });
    return payment_collection.id;
  } catch {
    return null;
  }
}

async function setShippingMethod(
  cartId: string,
  optionId: string
): Promise<boolean> {
  try {
    await medusaClient.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: { option_id: optionId },
    });
    return true;
  } catch {
    return false;
  }
}

export async function getShippingOptions(
  cartId: string
): Promise<ShippingOption[]> {
  try {
    const { shipping_options } = await medusaClient.client.fetch<{
      shipping_options: Array<{
        id: string;
        name: string;
        calculated_price: {
          calculated_amount: number;
          currency_code: string;
        };
      }>;
    }>(`/store/shipping-options?cart_id=${cartId}`);

    return shipping_options.map((o) => ({
      id: o.id,
      name: o.name,
      amount: o.calculated_price.calculated_amount,
      currency_code: o.calculated_price.currency_code,
    }));
  } catch {
    return [];
  }
}

export async function initiatePaymentSession(
  cartId: string,
  providerId: string = "pp_stripe_stripe"
): Promise<string | null> {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY;
  if (!stripeKey || stripeKey.includes("placeholder")) {
    return null;
  }

  const paymentCollectionId =
    (await getPaymentCollectionId(cartId)) ??
    (await refreshPaymentCollectionId(cartId));

  if (!paymentCollectionId) {
    return null;
  }

  try {
    const { payment_session } = await medusaClient.client.fetch<{
      payment_session: unknown;
    }>(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        method: "POST",
        body: { provider_id: providerId },
      }
    );

    const typed = payment_session as { data?: { client_secret?: string } };
    return typed.data?.client_secret ?? null;
  } catch {
    return null;
  }
}

export async function completeManualPayment(
  cartId: string,
  shippingOptionId: string
): Promise<string | null> {
  if (shippingOptionId === "none") {
    // skip shipping for digital / services products
  } else if (!shippingOptionId) {
    const options = await getShippingOptions(cartId);
    shippingOptionId = options[0]?.id ?? "";
  }

  if (shippingOptionId && shippingOptionId !== "none") {
    await setShippingMethod(cartId, shippingOptionId);
  }

  const paymentCollectionId = await refreshPaymentCollectionId(cartId);
  if (!paymentCollectionId) {
    return null;
  }

  try {
    await medusaClient.client.fetch<{ payment_session: unknown }>(
      `/store/payment-collections/${paymentCollectionId}/payment-sessions`,
      {
        method: "POST",
        body: { provider_id: "pp_system_default" },
      }
    );

    const { order } = await medusaClient.client.fetch<{
      order?: { id: string };
    }>(`/store/carts/${cartId}/complete`, { method: "POST" });

    return order?.id ?? null;
  } catch {
    return null;
  }
}
