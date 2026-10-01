"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { submitReview } from "@/app/[locale]/products/[handle]/review-actions";

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm text-[var(--color-foreground)]";

export function ReviewForm({ productId }: { productId: string }) {
  const t = useTranslations("reviews");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(false);

  if (done) {
    return (
      <p className="text-sm text-[var(--color-muted)]">
        {t("submitted")}
      </p>
    );
  }

  return (
    <form
      className="space-y-3 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(false);
        const res = await submitReview(
          productId,
          new FormData(e.currentTarget)
        );
        setPending(false);
        if (res.ok) setDone(true);
        else setError(true);
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <input
          name="author_name"
          required
          maxLength={120}
          placeholder={t("namePlaceholder")}
          className={inputCls}
        />
        <select name="rating" required defaultValue="5" className={inputCls}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
              {"☆".repeat(5 - n)}
            </option>
          ))}
        </select>
      </div>
      <input
        name="title"
        maxLength={200}
        placeholder={t("titlePlaceholder")}
        className={inputCls}
      />
      <textarea
        name="content"
        required
        rows={4}
        maxLength={5000}
        placeholder={t("contentPlaceholder")}
        className={inputCls}
      />
      {error && <p className="text-sm text-red-600">{t("error")}</p>}
      <button type="submit" disabled={pending} className="btn-primary text-sm">
        {pending ? t("sending") : t("submit")}
      </button>
    </form>
  );
}
