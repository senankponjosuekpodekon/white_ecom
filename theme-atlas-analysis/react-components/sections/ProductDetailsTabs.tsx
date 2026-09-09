export type ProductDetailsTabsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Default open first tab on mobile */
  default_open?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type ProductDetailsTabsBlocks = {
  description?: {
    /** Tab header */
    header?: string
  }
  reviews?: {
    /** Tab header */
    header?: string
    /** Container type */
    container?: string
    /** Custom liquid — Paste the liquid code of the app review here */
    custom_liquid: unknown
  }
  tab?: {
    /** Tab heading */
    header?: string
    /** Tab content */
    content?: string
    /** Tab content from page */
    content_page: string
  }
  liquid?: {
    /** Tab heading */
    header?: string
    /** Custom liquid */
    custom_liquid: unknown
  }
}

export type ProductDetailsTabsProps = BaseSectionProps & {
  settings: ProductDetailsTabsSettings
  blocks: ProductDetailsTabsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ProductDetailsTabs({ id, settings, blocks, design }: ProductDetailsTabsProps) {
  return (
    <section id={id} className={`minimog-section minimog-product-details-tabs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: product-details-tabs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}