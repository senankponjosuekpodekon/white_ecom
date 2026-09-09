export type ProductReviewsSettings = {
  /** Container type */
  container?: string
  /** Heading */
  heading?: string
  /** Custom liquid — Paste the liquid code of the app review here */
  custom_liquid: unknown
}

export type ProductReviewsProps = BaseSectionProps & {
  settings: ProductReviewsSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function ProductReviews({ id, settings, blocks, design }: ProductReviewsProps) {
  return (
    <section id={id} className={`minimog-section minimog-product-reviews`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: product-reviews (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}