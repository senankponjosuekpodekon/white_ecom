export type RecentViewedProductsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
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
  /** Design layout */
  pcard_layout?: string
  /** Image aspect ratio */
  pcard_image_ratio?: string
  /** Show product vendors */
  show_vendor?: boolean
  /** Hide product title */
  hide_title?: boolean
  /** Enable slider */
  enable_slider?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Disable slider */
  mobile_disable_slider?: boolean
  /** Use horizontal scrollbar — Uncheck to display as grid */
  use_scroll_mobile?: boolean
  /** Column gap */
  item_gap_mobile?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type RecentViewedProductsProps = BaseSectionProps & {
  settings: RecentViewedProductsSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function RecentViewedProducts({ id, settings, blocks, design }: RecentViewedProductsProps) {
  return (
    <section id={id} className={`minimog-section minimog-recent-viewed-products`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: recent-viewed-products (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}