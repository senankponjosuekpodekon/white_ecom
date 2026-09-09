export type TestimonialsSettings = {
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
  /** Layout */
  design?: string
  /** Show stars */
  show_stars?: boolean
  /** Auto-rotate content */
  autorotate?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Stars color */
  star_color?: string
  /** Item color scheme */
  item_color_scheme: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type TestimonialsBlocks = {
  testimonial?: {
    /** Title */
    title?: string
    /** Content */
    description?: string
    /** Author */
    footer?: string
    /** Image — Optional */
    image: string
    /** Image text — Optional */
    image_text: string
    /** Image link */
    image_link: string
    /** Product — This option is use only for layout 3 & layout 6. */
    product: string
  }
}

export type TestimonialsProps = BaseSectionProps & {
  settings: TestimonialsSettings
  blocks: TestimonialsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Testimonials({ id, settings, blocks, design }: TestimonialsProps) {
  return (
    <section id={id} className={`minimog-section minimog-testimonials`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: testimonials (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}