export type ScrollingPromotionSettings = {
  /** Container type */
  container?: string
  /** Direction */
  direction?: string
  /** Speed */
  speed?: number
  /** Item gap */
  item_gap?: number
  /** Item gap mobile */
  item_gap_mobile?: number
  /** Color scheme */
  color_scheme: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
}

export type ScrollingPromotionBlocks = {
  image?: {
    /** Image */
    image: string
    /** Image height */
    image_height?: number
    /** Image link */
    image_link: string
  }
  testimonial?: {
    /** Text */
    text?: string
    /** Author */
    author?: string
    /** Select product */
    product: string
    /** Image */
    image: string
    /** Icon */
    icon: string
  }
  announcement?: {
    /** Custom SVG icon */
    custom_svg: string
    /** Icon size */
    icon_size?: string
    /** Text */
    text?: string
    /** Text size */
    text_size?: number
    /** Link */
    text_link: string
  }
}

export type ScrollingPromotionProps = BaseSectionProps & {
  settings: ScrollingPromotionSettings
  blocks: ScrollingPromotionBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ScrollingPromotion({ id, settings, blocks, design }: ScrollingPromotionProps) {
  return (
    <section id={id} className={`minimog-section minimog-scrolling-promotion`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: scrolling-promotion (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}