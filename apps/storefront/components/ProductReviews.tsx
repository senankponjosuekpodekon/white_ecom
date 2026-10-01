import { getTranslations } from "next-intl/server";
import { medusaClient } from "@/lib/medusa-client";
import { ReviewForm } from "@/components/ReviewForm";
import type { Locale } from "@/i18n";

type Review = {
  id: string;
  author_name: string;
  rating: number;
  title?: string | null;
  content: string;
  created_at: string;
};

async function getReviews(productId: string): Promise<{
  reviews: Review[];
  count: number;
  rating_average: number | null;
}> {
  try {
    return await medusaClient.client.fetch(
      `/store/reviews?product_id=${encodeURIComponent(productId)}`,
      { method: "GET" }
    );
  } catch {
    return { reviews: [], count: 0, rating_average: null };
  }
}

export async function ProductReviews({
  productId,
  locale,
}: {
  productId: string;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "reviews" });
  const { reviews, count, rating_average } = await getReviews(productId);

  return (
    <section className="mt-16 max-w-3xl" data-testid="reviews">
      <h2 className="text-2xl font-heading font-bold text-[var(--color-foreground)] mb-2">
        {t("title")}
      </h2>
      {count > 0 && rating_average !== null && (
        <p className="text-sm text-[var(--color-muted)] mb-6">
          <span className="text-[var(--color-primary)] text-base">
            {"★".repeat(Math.round(rating_average))}
            {"☆".repeat(5 - Math.round(rating_average))}
          </span>{" "}
          {rating_average.toFixed(1)} · {count} {t("count")}
        </p>
      )}
      {count === 0 && (
        <p className="text-sm text-[var(--color-muted)] mb-6">{t("empty")}</p>
      )}

      <ul className="space-y-6 mb-10">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="border-b border-[var(--color-border)] pb-6"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[var(--color-foreground)]">
                {review.author_name}
              </span>
              <span className="text-[var(--color-primary)]">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </span>
            </div>
            {review.title && (
              <p className="font-medium text-[var(--color-foreground)] mt-1">
                {review.title}
              </p>
            )}
            <p className="text-sm text-[var(--color-muted)] mt-1">
              {review.content}
            </p>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-4">
        {t("write")}
      </h3>
      <ReviewForm productId={productId} />
    </section>
  );
}
