export type FeaturedProductSliderSettings = {
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
  /** Image placement */
  image_placement?: string
  /** Auto-rotate slides */
  slide_autoplay?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Change slides every — Work when auto-rotate */
  autorotate_speed?: number
  /** Show featured image */
  show_featured_image?: boolean
  /** Design layout */
  pcard_layout?: string
  /** Content alignment */
  pcard_alignment?: string
  /** Image aspect ratio */
  pcard_image_ratio?: string
  /** Show product vendors */
  show_vendor?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type FeaturedProductSliderBlocks = {
  product?: {
    /** Heading */
    heading: string
    /** Description */
    description: string
    /** Product */
    product: string
    /** Featured image */
    image: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
}

export type FeaturedProductSliderProps = BaseSectionProps & {
  settings: FeaturedProductSliderSettings
  blocks: FeaturedProductSliderBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function FeaturedProductSlider({ id, settings, blocks, design }: FeaturedProductSliderProps) {
  return (
    <section id={id} className={`minimog-section minimog-featured-product-slider`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: featured-product-slider (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}