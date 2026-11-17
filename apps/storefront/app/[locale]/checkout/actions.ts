"use server";

import { redirect } from "next/navigation";
import { completeManualPayment } from "@/lib/payment";
import { updateCartDetails } from "@/lib/cart";
import { locales, defaultLocale, type Locale } from "@/i18n";

function safeLocale(raw: string): Locale {
  return locales.includes(raw as Locale) ? (raw as Locale) : defaultLocale;
}

export async function updateCartDetailsAction(formData: FormData) {
  const cartId = formData.get("cartId") as string;
  const locale = safeLocale(formData.get("locale") as string);

  if (!cartId) {
    throw new Error("Missing cartId");
  }

  const ok = await updateCartDetails(cartId, {
    email: (formData.get("email") as string) ?? "",
    first_name: (formData.get("first_name") as string) ?? "",
    last_name: (formData.get("last_name") as string) ?? "",
    address_1: (formData.get("address_1") as string) ?? "",
    address_2: (formData.get("address_2") as string) ?? "",
    postal_code: (formData.get("postal_code") as string) ?? "",
    city: (formData.get("city") as string) ?? "",
    country_code: (formData.get("country_code") as string) ?? "",
    phone: (formData.get("phone") as string) ?? "",
  });

  if (!ok) {
    redirect(`/${locale}/checkout?details=error`);
  }

  redirect(`/${locale}/checkout`);
}

export async function completeManualPaymentAction(formData: FormData) {
  const cartId = formData.get("cartId") as string;
  const rawLocale = formData.get("locale") as string;
  const optionId = formData.get("optionId") as string;
  const locale = safeLocale(rawLocale);

  if (!cartId) {
    throw new Error("Missing cartId");
  }

  const orderId = await completeManualPayment(cartId, optionId);

  if (!orderId) {
    redirect(`/${locale}/cart`);
  }

  redirect(`/${locale}/checkout/result?order_id=${orderId}`);
}
