"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { completeManualPayment } from "@/lib/payment";
import { locales, defaultLocale, type Locale } from "@/i18n";

const CART_COOKIE = "cartId";

export async function completeManualPaymentAction(formData: FormData) {
  const rawLocale = formData.get("locale") as string;
  const optionId = formData.get("optionId") as string;
  const locale = locales.includes(rawLocale as Locale) ? (rawLocale as Locale) : defaultLocale;

  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    redirect(`/${locale}/cart`);
  }

  const orderId = await completeManualPayment(cartId, optionId);

  if (!orderId) {
    redirect(`/${locale}/cart`);
  }

  redirect(`/${locale}/checkout/result?order_id=${orderId}`);
}
