export type CollectionImageShowcaseSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CollectionImageShowcaseBlocks = {
  collection?: {
    /** Collection */
    collection: string
    /** Alias to collection — Leave it blank to use collection name */
    title?: string
    /** Image 1 */
    image_1: string
    /** Image 2 */
    image_2: string
    /** Image 3 */
    image_3: string
  }
}

export type CollectionImageShowcaseProps = BaseSectionProps & {
  settings: CollectionImageShowcaseSettings
  blocks: CollectionImageShowcaseBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionImageShowcase({ id, settings, blocks, design }: CollectionImageShowcaseProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-image-showcase`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-image-showcase (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}