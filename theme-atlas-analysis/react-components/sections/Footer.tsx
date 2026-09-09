export type FooterSettings = {
  /** Color scheme */
  color_scheme?: string
  /** Layout */
  design?: string
  /** Container type */
  container?: string
  /** Block bordered */
  bordered?: boolean
  /** Copyright text */
  copyright?: string
  /** Show country/region selector */
  show_country_selector?: boolean
  /** Show currency selector — [Watch tutorial](https://foxecom.link/TsDtIw) */
  show_currency_selector?: boolean
  /** Show language selector — [Watch tutorial](https://foxecom.link/eBEvt2) */
  show_language_selector?: boolean
  /** Show social icons */
  show_social_links?: boolean
  /** Enable Follow on Shop */
  enable_follow_on_shop?: boolean
  /** Show payment icons */
  show_payment_icons?: boolean
  /** Payment icons by image — Leave blank to use icons by Payment methods */
  image_custom_payment: string
  /** Image width (px) */
  payment_icons_width?: number
  /** Color scheme */
  footer_bottom_color_scheme?: string
  /** Menu */
  footer_bottom_menu: string
  /** Show menu item divider */
  show_menu_item_divider?: boolean
}

export type FooterBlocks = {
  menu?: {
    /** Footer menu */
    menu?: string
    /** Heading — Leave blank to use menu title */
    title?: string
    /** Container width */
    width?: string
    /** Order first */
    order_first?: boolean
    /** Open by default */
    open_default?: boolean
  }
  our_store?: {
    /** Title */
    title?: string
    /** Description */
    description?: string
    /** Show email */
    show_email?: boolean
    /** Show phone number */
    show_phone?: boolean
    /** Show social icons */
    show_socials_link?: boolean
    /** Container width */
    width?: string
    /** Order first */
    order_first?: boolean
    /** Open by default */
    open_default?: boolean
  }
  newsletter?: {
    /** Title */
    title?: string
    /** Description */
    description?: string
    /** Email placeholder */
    email_placeholder?: string
    /** Show icon input */
    show_icon_input?: boolean
    /** Button label — Leave it blank to use icon */
    button_label: string
    /** Button position — Only work with bordered form style */
    button_position?: string
    /** Button style */
    button_style?: string
    /** Form style */
    form_style?: string
    /** Show social link */
    show_social?: boolean
    /** Show "Terms & conditions" checkbox */
    show_agree_checkbox?: boolean
    /** Container width */
    width?: string
    /** Order first */
    order_first?: boolean
    /** Open by default */
    open_default?: boolean
  }
  custom_text?: {
    /** Title */
    title?: string
    /** Image */
    image: string
    /** Image max-width (px) */
    image_max?: string
    /** Content */
    description?: string
    /** Container width */
    width?: string
    /** Order first */
    order_first?: boolean
    /** Open by default */
    open_default?: boolean
  }
  custom_html?: {
    /** Title */
    title?: string
    /** HTML — Liquid code supported */
    html: unknown
    /** Container width */
    width?: string
    /** Order first */
    order_first?: boolean
    /** Open by default */
    open_default?: boolean
  }
  spacing?: {
    /** Container width */
    width?: string
  }
}

export type FooterProps = BaseSectionProps & {
  settings: FooterSettings
  blocks: FooterBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Footer({ id, settings, blocks, design }: FooterProps) {
  return (
    <section id={id} className={`minimog-section minimog-footer`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: footer (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}