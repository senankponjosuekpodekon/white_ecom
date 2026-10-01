"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { completeManualPayment, setShippingMethod } from "@/lib/payment";
import { updateCartDetails } from "@/lib/cart";
import { locales, defaultLocale, type Locale } from "@/i18n";

const CART_COOKIE = "cartId";

function safeLocale(raw: FormDataEntryValue | null): Locale {
  return locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
}

function field(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "").trim();
}

export async function saveAddressAction(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const next = field(formData, "next") === "payment" ? "payment" : "shipping";

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) {
    redirect(`/${locale}/cart`);
  }

  const email = field(formData, "email");
  const address = {
    first_name: field(formData, "first_name"),
    last_name: field(formData, "last_name"),
    address_1: field(formData, "address_1"),
    city: field(formData, "city"),
    postal_code: field(formData, "postal_code"),
    country_code: field(formData, "country_code").toLowerCase(),
    phone: field(formData, "phone"),
  };

  const invalid =
    !email ||
    !email.includes("@") ||
    !address.first_name ||
    !address.last_name ||
    (!address.address_1 && next !== "payment") ||
    (next !== "payment" && (!address.city || !address.postal_code || !address.country_code));

  if (invalid) {
    redirect(`/${locale}/checkout?step=address&error=invalid`);
  }

  const ok = await updateCartDetails(cartId, {
    email,
    shipping_address: address,
    billing_address: address,
  });

  if (!ok) {
    redirect(`/${locale}/checkout?step=address&error=save`);
  }

  redirect(`/${locale}/checkout?step=${next}`);
}

export async function setShippingAction(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));
  const optionId = field(formData, "optionId");

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId || !optionId) {
    redirect(`/${locale}/checkout?step=shipping&error=1`);
  }

  const ok = await setShippingMethod(cartId, optionId);
  if (!ok) {
    redirect(`/${locale}/checkout?step=shipping&error=1`);
  }

  redirect(`/${locale}/checkout?step=payment`);
}

export async function completeManualPaymentAction(formData: FormData) {
  const locale = safeLocale(formData.get("locale"));

  if (process.env.MANUAL_PAYMENT_ENABLED !== "true") {
    redirect(`/${locale}/checkout?step=payment&error=manual`);
  }

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;
  if (!cartId) {
    redirect(`/${locale}/cart`);
  }

  const orderId = await completeManualPayment(cartId, "none");

  if (!orderId) {
    redirect(`/${locale}/checkout?step=payment&error=manual`);
  }

  redirect(`/${locale}/checkout/result?order_id=${orderId}`);
}
