"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { medusaClientAuth } from "@/lib/medusa-client";

export default function ForgotPasswordPage() {
  const t = useTranslations("account");
  const params = useParams();
  const locale = String(params.locale ?? "fr");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await medusaClientAuth.auth.resetPassword("customer", "emailpass", {
        identifier: email,
      });
      setSent(true);
    } catch {
      setError(t("unknownError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto p-8 section-gradient min-h-screen">
      <h1 className="text-2xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
        {t("forgotTitle")}
      </h1>
      {sent ? (
        <p className="text-[var(--color-foreground)]">{t("forgotSent")}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-[var(--color-muted)]">{t("forgotText")}</p>
          <div>
            <label
              htmlFor="forgot-email"
              className="block text-sm font-medium mb-1 text-[var(--color-foreground)]"
            >
              {t("email")}
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="w-full btn-primary">
            {loading ? "..." : t("forgotSend")}
          </button>
        </form>
      )}
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        <Link href={`/${locale}/login`} className="text-[var(--color-primary)] underline">
          {t("backToLogin")}
        </Link>
      </p>
    </main>
  );
}
