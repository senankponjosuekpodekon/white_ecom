export type LookbookSettings = {
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
  /** Image aspect ratio */
  image_aspect_ratio?: string
  /** Use horizontal scrollbar — Uncheck to display as grid, work for 'Item' and 'Shop this look' block */
  use_scroll_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
  /** Enable background zoom effect. Works on Lookbook hero block only. */
  enable_bg_zoom_effect?: boolean
}

export type LookbookBlocks = {
  item?: {
    /** Color scheme — Adjust color scheme for hovered product cards. */
    color_scheme: string
    /** Image */
    image: string
    /** Title */
    button_text?: string
    /** Title link */
    button_link: string
    /** Button style */
    button_style: string
    /** Offset top */
    top_1?: number
    /** Offset left */
    left_1?: number
    /** Select product */
    product_1: string
    /** Offset top */
    top_2?: number
    /** Offset left */
    left_2?: number
    /** Select product */
    product_2: string
    /** Offset top */
    top_3?: number
    /** Offset left */
    left_3?: number
    /** Select product */
    product_3: string
    /** Offset top */
    top_4?: number
    /** Offset left */
    left_4?: number
    /** Select product */
    product_4: string
    /** Offset top */
    top_5?: number
    /** Offset left */
    left_5?: number
    /** Select product */
    product_5: string
  }
  lookbook-slider?: {
    /** Color scheme */
    color_scheme: string
    /** Subheading */
    sub_title: string
    /** Heading */
    title?: string
    /** Heading size */
    heading_size?: string
    /** Text */
    text: string
    /** Text alignment */
    content_alignment?: string
    /** Text color */
    text_color?: string
    /** Image */
    image: string
    /** Image position */
    image_position?: string
    /** Button style */
    button_style?: string
    /** Color scheme — Adjust color scheme for hovered product cards. */
    color_scheme_hovered: string
    /** Offset top */
    top_1?: number
    /** Offset left */
    left_1?: number
    /** Select product */
    product_1: string
    /** Offset top */
    top_2?: number
    /** Offset left */
    left_2?: number
    /** Select product */
    product_2: string
    /** Offset top */
    top_3?: number
    /** Offset left */
    left_3?: number
    /** Select product */
    product_3: string
    /** Offset top */
    top_4?: number
    /** Offset left */
    left_4?: number
    /** Select product */
    product_4: string
    /** Offset top */
    top_5?: number
    /** Offset left */
    left_5?: number
    /** Select product */
    product_5: string
    /** Columns */
    product_per_view?: string
    /** Show pagination */
    show_pagination?: boolean
    /** Pagination style */
    pagination_style?: string
    /** Show navigation */
    show_navigation?: boolean
    /** Design layout */
    pcard_layout?: string
    /** Image aspect ratio */
    pcard_image_ratio?: string
    /** Show product vendors */
    show_vendor?: boolean
    /** Hide product title */
    hide_title?: boolean
  }
  shop-this-look?: {
    /** Color scheme — Adjust color scheme for popup card. */
    color_scheme: string
    /** Image */
    image: string
    /** Title */
    title_text?: string
    /** Title size */
    title_size?: string
    /** Title alignment */
    text_alignment?: string
    /** Title link */
    title_link: string
    /** Button label */
    button_label?: string
    /** Products */
    product_list: string[]
  }
  lookbook-hero?: {
    /** Image */
    image: string
    /** Mobile image */
    mobile_image: string
    /** Button style */
    button_style: string
    /** Color scheme — Adjust color scheme for hovered product cards. */
    color_scheme_hovered: string
    /** Offset X */
    slider_offset_x?: number
    /** Offset top */
    top_1?: number
    /** Offset left */
    left_1?: number
    /** Offset top (Mobile image) */
    m_top_1?: number
    /** Offset left (Mobile image) */
    m_left_1?: number
    /** Select product */
    product_1: string
    /** Offset top */
    top_2?: number
    /** Offset left */
    left_2?: number
    /** Offset top (Mobile image) */
    m_top_2?: number
    /** Offset left (Mobile image) */
    m_left_2?: number
    /** Select product */
    product_2: string
    /** Offset top */
    top_3?: number
    /** Offset left */
    left_3?: number
    /** Offset top (Mobile image) */
    m_top_3?: number
    /** Offset left (Mobile image) */
    m_left_3?: number
    /** Select product */
    product_3: string
    /** Offset top */
    top_4?: number
    /** Offset left */
    left_4?: number
    /** Offset top (Mobile image) */
    m_top_4?: number
    /** Offset left (Mobile image) */
    m_left_4?: number
    /** Select product */
    product_4: string
    /** Offset top */
    top_5?: number
    /** Offset left */
    left_5?: number
    /** Offset top (Mobile image) */
    m_top_5?: number
    /** Offset left (Mobile image) */
    m_left_5?: number
    /** Select product */
    product_5: string
    /** Show pagination */
    show_pagination?: boolean
    /** Show navigation */
    show_navigation?: boolean
    /** Design layout */
    pcard_layout?: string
    /** Image aspect ratio */
    pcard_image_ratio?: string
    /** Show product vendors */
    show_vendor?: boolean
    /** Hide product title */
    hide_title?: boolean
  }
}

export type LookbookProps = BaseSectionProps & {
  settings: LookbookSettings
  blocks: LookbookBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Lookbook({ id, settings, blocks, design }: LookbookProps) {
  return (
    <section id={id} className={`minimog-section minimog-lookbook`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: lookbook (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}