import { medusaClient } from "./medusa-client";

export async function initiatePaymentSession(
  cartId: string
): Promise<string | null> {
  try {
    const { cart } = await medusaClient.client.fetch<{ cart: unknown }>(
      `/store/carts/${cartId}/payment-sessions`,
      {
        method: "POST",
        body: { provider_id: "pp_stripe_stripe" },
      }
    );

    const typedCart = cart as {
      payment_collection?: {
        payment_sessions?: Array<{
          data?: { client_secret?: string };
        }>;
      };
    };

    return (
      typedCart.payment_collection?.payment_sessions?.[0]?.data
        ?.client_secret ?? null
    );
  } catch {
    return null;
  }
}
