export type HeaderSettings = {
  /** Color scheme */
  color_scheme: string
  /** Color scheme menu bar — For header design where Menu and Logo are in 2 lines */
  color_scheme_menu?: string
  /** Header design */
  header_design?: string
  /** Container type */
  container?: string
  /** Sticky header */
  sticky_header?: string
  /** Transparent on top */
  transparent_on_top?: boolean
  /** Text color — The text color when the header is transparent */
  transparent_text_color?: string
  /** Logo text */
  logo_text?: string
  /** Default Logo */
  logo: string
  /** Logo mobile */
  logo_mobile: string
  /** Logo for transparent header */
  logo_transparent: string
  /** Default Logo - SVG — Upload your SVG logo to [Files](/admin/settings/files) to get the URL. */
  logo_svg: string
  /** Logo mobile - SVG */
  logo_mobile_svg: string
  /** Logo for transparent header - SVG */
  logo_transparent_svg: string
  /** Logo width (desktop) */
  logo_max_width?: number
  /** Logo width (sticky) */
  sticky_logo_max_width?: number
  /** Logo width (mobile) */
  mobile_logo_max_width?: number
  /** Main menu */
  main_menu?: string
  /** Secondary menu — For header with 2 menus */
  secondary_menu: string
  /** Mobile menu — Leave blank to use Main menu */
  mobile_menu: string
  /** Uppercase first level */
  uppercase_parent_level?: boolean
  /** Show menu column divider */
  show_menu_column_divider?: boolean
  /** Search */
  search?: string
  /** Show account icon */
  show_account_icon?: boolean
  /** Show cart icon */
  show_cart_icon?: boolean
  /** Show wishlist icon */
  show_wishlist_icon?: boolean
  /** Show comparison icon */
  show_compare_icon?: boolean
  /** Show currency selector — [Watch tutorial](https://foxecom.link/TsDtIw) */
  show_currency_switcher?: boolean
  /** Show country/region selector */
  show_country_selector?: boolean
  /** Show language selector — [Watch tutorial](https://foxecom.link/eBEvt2) */
  show_language_switcher?: boolean
  /** Show currency selector — [Watch tutorial](https://foxecom.link/TsDtIw) */
  mb_show_currency_switcher?: boolean
  /** Show country/region selector */
  mb_show_country_selector?: boolean
  /** Show language selector — [Watch tutorial](https://foxecom.link/eBEvt2) */
  mb_show_language_switcher?: boolean
}

export type HeaderBlocks = {
  topbar?: {
    /** Color scheme */
    color_scheme: string
    /** Show divider */
    show_divider?: boolean
    /** Enable transparent */
    transparent_on_top?: boolean
    /** Show phone number */
    show_phone_numb?: boolean
    /** Show email */
    show_email?: boolean
    /** Show social media links */
    show_social_links?: boolean
    /** Show find store page */
    show_stores_page?: boolean
    /** Show currency selector — [Watch tutorial](https://foxecom.link/TsDtIw) */
    show_currency_switcher?: boolean
    /** Show country/region selector */
    show_country_selector?: boolean
    /** Show language selector — [Watch tutorial](https://foxecom.link/eBEvt2) */
    show_language_switcher?: boolean
    /** Message — Leave blank to hide message */
    alert_message: string
  }
  banner?: {
    /** For item */
    heading: string
    /** Container — Set width for the content wrapper */
    container?: string
    /** Banner style */
    banner_style?: string
    /** Banner image */
    banner_image: string
    /** Banner link */
    banner_link: string
    /** Title */
    banner_title?: string
    /** Subtitle */
    banner_desc: string
    /** Button label */
    banner_button_text?: string
  }
  product-list?: {
    /** For item */
    heading: string
    /** Container — Set width for the content wrapper */
    container?: string
    /** Stretch product width */
    stretch_width?: boolean
    /** Select collection */
    collection: string
    /** Number of products to show */
    limit?: number
    /** Number of columns */
    columns?: number
  }
  collection-list?: {
    /** For item */
    heading: string
    /** Container — Set width for the content wrapper */
    container?: string
    /** Collection */
    collection_1: string
    /** Featured image */
    image_1: string
    /** Collection */
    collection_2: string
    /** Featured image */
    image_2: string
    /** Collection */
    collection_3: string
    /** Featured image */
    image_3: string
    /** Collection */
    collection_4: string
    /** Featured image */
    image_4: string
    /** Collection */
    collection_5: string
    /** Featured image */
    image_5: string
    /** Collection */
    collection_6: string
    /** Featured image */
    image_6: string
  }
  bloglist?: {
    /** For item */
    heading: string
    /** Container — Set width for the content wrapper */
    container?: string
    /** Select blog */
    blog: string
  }
  custom_html?: {
    /** For item */
    heading: string
    /** Container — Set width for the content wrapper */
    container?: string
    /** Custom HTML */
    html: string
  }
}

export type HeaderProps = BaseSectionProps & {
  settings: HeaderSettings
  blocks: HeaderBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Header({ id, settings, blocks, design }: HeaderProps) {
  return (
    <section id={id} className={`minimog-section minimog-header`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: header (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}