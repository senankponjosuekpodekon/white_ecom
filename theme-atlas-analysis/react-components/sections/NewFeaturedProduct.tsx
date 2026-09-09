export type NewFeaturedProductSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Product */
  featured_product: string
  /** Enable variant group images */
  enable_variant_group_images?: boolean
  /** Item gap */
  column_gap?: number
  /** Item gap mobile */
  column_gap_mobile?: number
  /** Media placement */
  image_placement?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type NewFeaturedProductBlocks = {
  @app?: {
  }
  title?: {
  }
  price?: {
    /** Show saving amount */
    show_saving?: boolean
    /** Type */
    sale_badge_type?: string
  }
  variant_picker?: {
  }
  buy_buttons?: {
    /** Show quantity selector */
    show_quantity_selector?: boolean
    /** Show Add-to-cart button */
    show_atc_button?: boolean
    /** Show dynamic checkout buttons — Using the payment methods available on your store, customers see their preferred option, like PayPal or Apple Pay. [Learn more](https://help.shopify.com/manual/using-themes/change-the-layout/dynamic-checkout) */
    show_dynamic_checkout?: boolean
  }
  meta?: {
    /** Show collections list */
    show_collections?: boolean
    /** Show SKU */
    show_sku?: boolean
    /** Show product vendor */
    show_vendor?: boolean
  }
  badge?: {
  }
  description?: {
  }
  short_description?: {
  }
  text?: {
    /** Text */
    text?: string
    /** Text style */
    text_style?: string
  }
  custom_text?: {
    /** Custom text */
    content: string
  }
  custom_liquid?: {
    /** Custom liquid */
    custom_liquid: unknown
  }
  shipping?: {
    /** Show delivery estimation — How delivery times are generated? */
    show_delivery_times?: boolean
    /** Delivery text */
    deliver_text?: string
    /** Deliver in: — days (+/- 2 days) */
    deliver_days?: string
    /** Date format — Example: %m/%d [Learn more about date format here.](http://strftime.net/) */
    date_format?: string
    /** Show Shipping text */
    show_shipping_text?: boolean
    /** Shipping text */
    shipping_text?: string
  }
  trust_badge?: {
    /** Heading */
    trust_badges_text?: string
    /** Trust badges image */
    trust_badges_image: string
    /** Image width */
    trust_badges_image_width?: string
    /** Heading position */
    position?: string
  }
  collapsible_tab?: {
    /** Heading */
    heading?: string
    /** Content */
    content: string
    /** Content by Liquid — Example: {{ product.description }} */
    liquid: unknown
    /** Default open */
    default_open?: boolean
  }
  inventory_status?: {
    /** Show inventory indicator bar */
    show_indicator_bar?: boolean
    /** Text for normal inventory */
    normal_text: string
    /** Text for low inventory */
    low_text?: string
    /** Text for out of stock */
    outofstock_text: string
    /** Text for backordered */
    backordered_text?: string
  }
}

export type NewFeaturedProductProps = BaseSectionProps & {
  settings: NewFeaturedProductSettings
  blocks: NewFeaturedProductBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function NewFeaturedProduct({ id, settings, blocks, design }: NewFeaturedProductProps) {
  return (
    <section id={id} className={`minimog-section minimog-new-featured-product`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: new-featured-product (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}