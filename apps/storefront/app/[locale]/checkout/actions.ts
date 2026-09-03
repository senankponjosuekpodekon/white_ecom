"use server";

import { redirect } from "next/navigation";
import { completeManualPayment } from "@/lib/payment";
import { locales, defaultLocale, type Locale } from "@/i18n";

export async function completeManualPaymentAction(formData: FormData) {
  const cartId = formData.get("cartId") as string;
  const rawLocale = formData.get("locale") as string;
  const optionId = formData.get("optionId") as string;
  const locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : defaultLocale;

  if (!cartId) {
    throw new Error("Missing cartId");
  }

  const orderId = await completeManualPayment(cartId, optionId);

  if (!orderId) {
    redirect(`/${locale}/cart`);
  }

  redirect(`/${locale}/checkout/result?order_id=${orderId}`);
}
