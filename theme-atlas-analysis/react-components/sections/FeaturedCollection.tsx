export type FeaturedCollectionSettings = {
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Text alignment */
  header_alignment?: string
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Collection */
  collection: string
  /** Enable flash sale */
  enable_flashsale?: boolean
  /** Show countdown timer */
  show_countdown?: boolean
  /** Products to show */
  product_to_show?: number
  /** Products per row */
  items_per_row?: number
  /** Column gap */
  item_gap?: number
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
  /** Show button on header */
  show_button_on_header?: boolean
  /** Button type — Load more options only work when slider is disabled */
  button_type?: string
  /** Button label — Leave it blank to hide */
  button_text?: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
  /** Load products on scroll */
  infinite_load?: boolean
  /** Max pages to load */
  max_page_load?: number
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

export type FeaturedCollectionProps = BaseSectionProps & {
  settings: FeaturedCollectionSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function FeaturedCollection({ id, settings, blocks, design }: FeaturedCollectionProps) {
  return (
    <section id={id} className={`minimog-section minimog-featured-collection`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: featured-collection (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}