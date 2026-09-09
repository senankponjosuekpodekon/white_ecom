export type ProductTabsSettings = {
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
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Tab header type */
  tab_header?: string
  /** Products to show */
  limit?: number
  /** Show "View all" button */
  show_button?: boolean
  /** Button type */
  button_type?: string
  /** Button label */
  button_label?: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
  /** Design layout */
  pcard_layout?: string
  /** Image aspect ratio */
  pcard_image_ratio?: string
  /** Show product vendors */
  show_vendor?: boolean
  /** Products per row */
  items_per_row?: number
  /** Column gap */
  item_gap?: number
  /** Enable slider */
  enable_slider?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Disable slider */
  mobile_disable_slider?: boolean
  /** Use horizontal scrollbar — Uncheck to display as grid, slider must be disabled */
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

export type ProductTabsBlocks = {
  tab?: {
    /** Tab name — Leave it blank to use collection name */
    title: string
    /** Collection */
    collection: string
  }
}

export type ProductTabsProps = BaseSectionProps & {
  settings: ProductTabsSettings
  blocks: ProductTabsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ProductTabs({ id, settings, blocks, design }: ProductTabsProps) {
  return (
    <section id={id} className={`minimog-section minimog-product-tabs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: product-tabs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}