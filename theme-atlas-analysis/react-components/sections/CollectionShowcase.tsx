export type CollectionShowcaseSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Color scheme tabs */
  color_scheme_tab: string
  /** Desktop image position — Position is automatically optimized for mobile. */
  image_position?: string
  /** Product to show — The layout will automatically switch to a slider if the number of products is greater than 3 */
  product_to_show?: number
  /** Image aspect ratio */
  pcard_image_ratio?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CollectionShowcaseBlocks = {
  collection?: {
    /** Alias to collection — Leave it blank to use collection name */
    title?: string
    /** Collection */
    collection: string
    /** Image */
    image: string
    /** Subheading */
    subheading: string
    /** Heading */
    heading: string
    /** Heading size */
    heading_size?: string
    /** Button label — Leave it blank to hide */
    button_text?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
  }
}

export type CollectionShowcaseProps = BaseSectionProps & {
  settings: CollectionShowcaseSettings
  blocks: CollectionShowcaseBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionShowcase({ id, settings, blocks, design }: CollectionShowcaseProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-showcase`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-showcase (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}