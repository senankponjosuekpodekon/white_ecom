export type ProductRecommendationsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Remove URL params — Remove param tracking in product URL */
  remove_params?: boolean
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Text alignment */
  text_align?: string
  /** Products to show */
  limit?: number
  /** Products per row */
  columns?: number
  /** Column gap */
  column_gap?: number
  /** Enable slider */
  enable_slider?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Use horizontal scrollbar */
  use_scroll_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type ProductRecommendationsProps = BaseSectionProps & {
  settings: ProductRecommendationsSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function ProductRecommendations({ id, settings, blocks, design }: ProductRecommendationsProps) {
  return (
    <section id={id} className={`minimog-section minimog-product-recommendations`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: product-recommendations (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}