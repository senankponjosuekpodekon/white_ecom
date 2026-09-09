export type ProductBundlesSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Layout */
  layout?: string
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
  /** Image */
  image: string
  /** Image position */
  image_position?: string
  /** Image aspect ratio */
  image_ratio?: string
  /** Show reviews badge */
  show_reviews?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
}

export type ProductBundlesBlocks = {
  product?: {
    /** Select product */
    product: string
    /** Vertical */
    top?: number
    /** Horizontal */
    left?: number
  }
}

export type ProductBundlesProps = BaseSectionProps & {
  settings: ProductBundlesSettings
  blocks: ProductBundlesBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ProductBundles({ id, settings, blocks, design }: ProductBundlesProps) {
  return (
    <section id={id} className={`minimog-section minimog-product-bundles`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: product-bundles (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}