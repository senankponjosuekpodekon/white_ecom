export type FeaturedCollectionBannerSettings = {
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
  /** Products to show */
  product_to_show?: number
  /** Column gap */
  item_gap?: number
  /** Row gap */
  row_gap?: number
  /** Design layout */
  pcard_layout?: string
  /** Image aspect ratio */
  pcard_image_ratio?: string
  /** Show product vendors */
  show_vendor?: boolean
  /** Hide product title */
  hide_title?: boolean
  /** Use horizontal scrollbar — Uncheck to display as grid */
  use_scroll_mobile?: boolean
  /** Column gap */
  item_gap_mobile?: number
  /** Row gap */
  row_gap_mobile?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type FeaturedCollectionBannerBlocks = {
  image_card?: {
    /** Color scheme */
    color_scheme: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    content_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color — Work only when contents above image. */
    text_color?: string
    /** Image */
    image: string
    /** Mobile image */
    mobile_image: string
    /** Image link */
    link: string
    /** Sub heading */
    subtitle: string
    /** Heading */
    title?: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Custom classes */
    block_custom_class: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
}

export type FeaturedCollectionBannerProps = BaseSectionProps & {
  settings: FeaturedCollectionBannerSettings
  blocks: FeaturedCollectionBannerBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function FeaturedCollectionBanner({ id, settings, blocks, design }: FeaturedCollectionBannerProps) {
  return (
    <section id={id} className={`minimog-section minimog-featured-collection-banner`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: featured-collection-banner (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}