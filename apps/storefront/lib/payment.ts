import { medusaClient } from "./medusa-client";

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

async function selectFirstShippingOption(cartId: string): Promise<boolean> {
  try {
    const { shipping_options } = await medusaClient.client.fetch<{
      shipping_options: Array<{ id: string }>;
    }>(`/store/shipping-options?cart_id=${cartId}`);

    const first = shipping_options[0];
    if (!first) {
      return false;
    }

    await medusaClient.client.fetch(`/store/carts/${cartId}/shipping-methods`, {
      method: "POST",
      body: { option_id: first.id },
    });

    return true;
  } catch {
    return false;
  }
}

export async function initiatePaymentSession(
  cartId: string,
  providerId: string = "pp_stripe_stripe"
): Promise<string | null> {
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
  cartId: string
): Promise<string | null> {
  await selectFirstShippingOption(cartId);

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
