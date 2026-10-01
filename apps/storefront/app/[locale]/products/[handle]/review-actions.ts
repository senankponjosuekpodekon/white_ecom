"use server";

import { medusaClient } from "@/lib/medusa-client";

export async function submitReview(
  productId: string,
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  const rating = Number(formData.get("rating"));
  const authorName = String(formData.get("author_name") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (
    !productId ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5 ||
    !authorName ||
    !content
  ) {
    return { ok: false, error: "invalid" };
  }

  try {
    await medusaClient.client.fetch("/store/reviews", {
      method: "POST",
      body: {
        product_id: productId,
        rating,
        author_name: authorName,
        title: title || undefined,
        content,
      },
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "submit" };
  }
}
