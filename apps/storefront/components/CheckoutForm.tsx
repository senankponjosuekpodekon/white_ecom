"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { Locale } from "@/i18n";

function Form({ locale }: { locale: Locale }) {
  const t = useTranslations("checkout");
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/${locale}/checkout/result`,
      },
    });

    if (submitError) {
      setError(submitError.message ?? t("paymentFailed"));
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && <p className="text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full btn-primary disabled:opacity-50"
      >
        {loading ? t("processing") : t("pay")}
      </button>
    </form>
  );
}

export function CheckoutForm({
  clientSecret,
  locale,
}: {
  clientSecret: string;
  locale: Locale;
}) {
  const t = useTranslations("checkout");
  const key = process.env.NEXT_PUBLIC_STRIPE_KEY;
  const stripePromise = key ? loadStripe(key) : null;

  if (!stripePromise) {
    return <p className="text-red-600">{t("missingStripeKey")}</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <Form locale={locale} />
    </Elements>
  );
}
