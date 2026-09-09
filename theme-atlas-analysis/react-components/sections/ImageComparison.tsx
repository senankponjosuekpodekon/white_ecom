export type ImageComparisonSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
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
  /** Layout */
  layout?: string
  /** Image height */
  image_height?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
}

export type ImageComparisonBlocks = {
  image?: {
    /** Image */
    image: string
    /** Image mobile */
    image_mobile: string
    /** Heading */
    heading: string
  }
}

export type ImageComparisonProps = BaseSectionProps & {
  settings: ImageComparisonSettings
  blocks: ImageComparisonBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ImageComparison({ id, settings, blocks, design }: ImageComparisonProps) {
  return (
    <section id={id} className={`minimog-section minimog-image-comparison`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: image-comparison (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}