export type MainProductSettings = {
  /** Container type */
  container?: string
  /** Layout */
  layout?: string
  /** Show Add to wishlist */
  show_atwl?: boolean
  /** Enable history state — This will add a '?variant={variant_id}' to the browser's URL */
  enable_history_state?: boolean
  /** Enable variant group images */
  enable_variant_group_images?: boolean
  /** Disable selected variant by default */
  disable_selected_variant_default?: boolean
  /** Show featured media by default — If unchecked, the selected variant's image will be show on page load. */
  show_featured_media?: boolean
  /** Enable image zoom */
  show_zoom_button?: boolean
  /** Enable video autoplay */
  enable_video_autoplay?: boolean
  /** Show thumbnails on mobile */
  show_nav_media_mobile?: boolean
  /** Show pagination on mobile */
  show_pagination_mobile?: boolean
  /** Show on desktop */
  use_sticky_atc?: boolean
  /** Show on mobile */
  use_sticky_atc_on_mobile?: boolean
  /** Show dynamic checkout buttons */
  enable_dynamic_checkout?: boolean
  /** Show wishlist button */
  sticky_atc_wishtlist?: boolean
  /** Show compare button */
  sticky_atc_compare?: boolean
}

export type MainProductBlocks = {
  @app?: {
  }
  title?: {
  }
  rating?: {
  }
  price?: {
    /** Show saving amount */
    show_saving?: boolean
    /** Type */
    sale_badge_type?: string
  }
  variant_picker?: {
    /** Size option title — Enter the option titles which you want to show Size guide button, separate with a comma */
    size_title?: string
  }
  buy_buttons?: {
    /** Show quantity selector */
    show_quantity_selector?: boolean
    /** Show Add-to-cart button */
    show_atc_button?: boolean
    /** Show dynamic checkout buttons — Using the payment methods available on your store, customers see their preferred option, like PayPal or Apple Pay. [Learn more](https://help.shopify.com/manual/using-themes/change-the-layout/dynamic-checkout) */
    show_dynamic_checkout?: boolean
    /** Show recipient form for gift card products — When enabled, gift card products can optionally be sent to a recipient with a personal message. */
    show_gift_card_recipient?: boolean
  }
  meta?: {
    /** Show collections list */
    show_collections?: boolean
    /** Show product vendor */
    show_vendor?: boolean
    /** Show product type */
    show_type?: boolean
    /** Show availability */
    show_availability?: boolean
    /** Show SKU */
    show_sku?: boolean
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
  image?: {
    /** Image */
    image: string
    /** Image link */
    image_link: string
    /** Image width */
    image_width?: number
    /** Image alignment */
    image_alignment?: string
  }
  custom_liquid?: {
    /** Custom liquid */
    custom_liquid: unknown
  }
  visitors?: {
    /** Color scheme */
    color_scheme: string
    /** Visitor count text */
    live_views_text?: string
    /** Visitor count range */
    live_views_range?: string
    /** Change count number every — Seconds */
    live_view_duration?: string
    /** Visitor count icon blinks */
    live_view_icon_blinks?: boolean
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
    /** Content by Liquid — Example: {{product.description}} */
    liquid: unknown
    /** Default open */
    default_open?: boolean
  }
  addons?: {
    /** Show Add to compare */
    show_atcp?: boolean
    /** Show Ask a Question */
    show_ask_a_question?: boolean
    /** Show social share */
    show_social?: boolean
  }
  foxkit_stock_countdown?: {
  }
  foxkit_countdown_timer?: {
  }
  custom_field?: {
    /** Field name — Required, don't leave it blank */
    title?: string
    /** Field type */
    field_type?: string
    /** Options — Each option in a new line */
    field_options: string
    /** Placeholder */
    field_placeholder: string
    /** Required — If you use “Required” with a checkbox, then the checkbox will need to be checked for the customer to add the item to the cart. */
    field_required?: boolean
    /** Show at checkout — Uncheck this if you don't want the captured information to be shown in the order summary on the checkout pages. */
    show_at_checkout?: boolean
  }
  image_field?: {
    /** Field name — Required, don't leave it blank */
    title?: string
    /** Required — If you use “Required” with a checkbox, then the checkbox will need to be checked for the customer to add the item to the cart. */
    field_required?: boolean
    /** Show at checkout — Uncheck this if you don't want the captured information to be shown in the order summary on the checkout pages. */
    show_at_checkout?: boolean
  }
  breadcrumb?: {
  }
  complementary?: {
    /** Heading */
    block_heading?: string
    /** Show as collapsible tab */
    make_collapsible_row?: boolean
    /** Maximum products to show */
    product_list_limit?: number
    /** Number of products per page */
    products_per_page?: number
    /** Aspect ratio */
    pcard_image_ratio?: string
    /** Enable variant options */
    enable_variant_options?: boolean
    /** Enable quick view button */
    enable_quick_view?: boolean
    /** Enable add to cart button */
    enable_quick_add?: boolean
    /** Enable compare button */
    enable_compare?: boolean
    /** Enable wishlist button */
    enable_wishlist?: boolean
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

export type MainProductProps = BaseSectionProps & {
  settings: MainProductSettings
  blocks: MainProductBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function MainProduct({ id, settings, blocks, design }: MainProductProps) {
  return (
    <section id={id} className={`minimog-section minimog-main-product`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: main-product (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}