"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { medusaClientAuth } from "@/lib/medusa-client";

function ResetPasswordForm() {
  const t = useTranslations("account");
  const params = useParams();
  const locale = String(params.locale ?? "fr");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError(t("resetTooShort"));
      return;
    }
    if (password !== confirm) {
      setError(t("resetMismatch"));
      return;
    }
    setLoading(true);
    try {
      await medusaClientAuth.auth.updateProvider(
        "customer",
        "emailpass",
        { email, password },
        token
      );
      setDone(true);
    } catch {
      setError(t("resetError"));
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <p className="text-[var(--color-foreground)]">{t("resetInvalid")}</p>
    );
  }

  if (done) {
    return (
      <div>
        <p className="text-[var(--color-foreground)] mb-4">{t("resetDone")}</p>
        <Link href={`/${locale}/login`} className="btn-primary inline-block">
          {t("login")}
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
          {t("resetNewPassword")}
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
          {t("resetConfirm")}
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button type="submit" disabled={loading} className="w-full btn-primary">
        {loading ? "..." : t("resetSubmit")}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const t = useTranslations("account");
  return (
    <main className="max-w-md mx-auto p-8 section-gradient min-h-screen">
      <h1 className="text-2xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
        {t("resetTitle")}
      </h1>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
