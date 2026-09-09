export type CollectionListSettings = {
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Button label — Leave blank to hide the button */
  button_label: string
  /** Button link */
  button_link: string
  /** Button style */
  button_style?: string
  /** Text alignment */
  header_alignment?: string
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Layout */
  layout?: string
  /** Expanded — Work if Enable slider is checked */
  expanded?: boolean
  /** Card style */
  card_style?: string
  /** Text alignment */
  text_alignment?: string
  /** Hover effect */
  hover_effect?: string
  /** Show product count */
  show_product_count?: boolean
  /** Product count inline */
  count_inline_title?: boolean
  /** Image rounded — Don't work well with "Content inside" layout */
  image_rounded?: boolean
  /** Collections per row */
  items_per_row?: number
  /** Column gap */
  item_gap?: number
  /** Enable slider */
  enable_slider?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Auto slide */
  autorotate?: boolean
  /** Auto slide every */
  autorotate_speed?: number
  /** Disable slider */
  mobile_disable_slider?: boolean
  /** Use horizontal scrollbar — Uncheck to display as grid */
  use_scroll_mobile?: boolean
  /** Column gap */
  mobile_gap?: number
  /** Hide slider controls */
  hidden_slide_control_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CollectionListBlocks = {
  collection_block?: {
    /** Collection */
    collection: string
    /** Title — Leave blank to use collection's title */
    title?: string
    /** Featured image */
    item_image: string
  }
  banner?: {
    /** Collection */
    collection: string
    /** Title */
    title?: string
    /** Description */
    description?: string
    /** Background */
    item_bg?: string
    /** Text color */
    item_text_color?: string
  }
}

export type CollectionListProps = BaseSectionProps & {
  settings: CollectionListSettings
  blocks: CollectionListBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionList({ id, settings, blocks, design }: CollectionListProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-list`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-list (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}