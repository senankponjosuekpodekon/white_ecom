export type CollectionListTemplateSettings = {
  /** Container type */
  container?: string
  /** Select collections to show */
  display_type?: string
  /** Page title */
  title?: string
  /** Description */
  description: string
  /** Text alignment */
  header_alignment?: string
  /** Collections per row */
  items_per_row?: number
  /** Column gap */
  item_gap?: number
  /** Columns */
  mobile_columns?: string
  /** Column gap mobile */
  mobile_gap?: number
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
}

export type CollectionListTemplateBlocks = {
  collection_item?: {
    /** Select collection */
    collection: string
    /** Select image */
    image: string
  }
}

export type CollectionListTemplateProps = BaseSectionProps & {
  settings: CollectionListTemplateSettings
  blocks: CollectionListTemplateBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionListTemplate({ id, settings, blocks, design }: CollectionListTemplateProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-list-template`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-list-template (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}