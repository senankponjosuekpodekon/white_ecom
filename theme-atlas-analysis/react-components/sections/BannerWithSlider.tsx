export type BannerWithSliderSettings = {
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Text alignment */
  header_alignment?: string
  /** Layout */
  layout?: string
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Auto-rotate slides */
  slide_autoplay?: boolean
  /** Pagination position */
  pagination_position: string
  /** Change slides every — Work when auto-rotate */
  autorotate_speed?: number
  /** Number of columns on mobile */
  columns_mobile?: string
  /** Use horizontal scrollbar — Uncheck to display as grid */
  use_scroll_mobile?: boolean
  /** Image */
  banner_image_1: string
  /** Mobile Image */
  banner_image_mobile_1: string
  /** Button label */
  button_text_1?: string
  /** Button link */
  button_link_1: string
  /** Button style */
  button_style_1?: string
  /** Button size */
  button_size_1?: string
  /** Image */
  banner_image_2: string
  /** Mobile Image */
  banner_image_mobile_2: string
  /** Button label */
  button_text_2?: string
  /** Button link */
  button_link_2: string
  /** Button style */
  button_style_2?: string
  /** Button size */
  button_size_2?: string
  /** Image */
  banner_image_3: string
  /** Mobile Image */
  banner_image_mobile_3: string
  /** Button label */
  button_text_3?: string
  /** Button link */
  button_link_3: string
  /** Button style */
  button_style_3?: string
  /** Button size */
  button_size_3?: string
  /** Image */
  banner_image_4: string
  /** Mobile Image */
  banner_image_mobile_4: string
  /** Button label */
  button_text_4?: string
  /** Button link */
  button_link_4: string
  /** Button style */
  button_style_4?: string
  /** Button size */
  button_size_4?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type BannerWithSliderBlocks = {
  item_slide?: {
    /** Image */
    item_image: string
    /** Color scheme */
    color_scheme: string
    /** Text color */
    content_text_color?: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    text_alignment?: string
    /** Subheading */
    subheading?: string
    /** Heading */
    heading?: string
    /** Description */
    description: string
    /** Text size */
    text_size?: string
    /** Button label */
    button_text?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
  }
}

export type BannerWithSliderProps = BaseSectionProps & {
  settings: BannerWithSliderSettings
  blocks: BannerWithSliderBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function BannerWithSlider({ id, settings, blocks, design }: BannerWithSliderProps) {
  return (
    <section id={id} className={`minimog-section minimog-banner-with-slider`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: banner-with-slider (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}