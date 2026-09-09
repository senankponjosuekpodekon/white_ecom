export type CustomContentSettings = {
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
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Content color scheme */
  content_color_scheme: string
  /** Background image */
  background_image: string
  /** Background image mobile */
  background_image_mobile: string
  /** Enable parallax effect */
  enable_parallax?: boolean
  /** Parallax direction */
  parallax_direction?: string
  /** Column gap */
  gap?: number
  /** Column gap mobile */
  gap_mobile?: number
  /** Enable horizontal scroll */
  use_scroll_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
  /** Custom classes */
  custom_class: string
}

export type CustomContentBlocks = {
  text?: {
    /** Heading */
    title?: string
    /** Subheading */
    subheading: string
    /** Text */
    text?: string
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Horizontal alignment */
    align_text?: string
    /** Text size */
    text_size?: string
    /** Text color */
    text_color?: string
    /** Button label */
    button_label: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  image?: {
    /** Image */
    image: string
    /** Image link */
    link: string
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  video?: {
    /** Video type */
    video_type?: string
    /** Shopify hosted */
    shopify_video: unknown
    /** Video link — Accepts YouTube or Vimeo links */
    video_link?: string
    /** Video ratio */
    ratio?: string
    /** Cover image */
    image: string
    /** Heading */
    video_title: string
    /** Text size */
    text_size?: string
    /** Text color */
    text_color?: string
    /** Play button style */
    play_style?: string
    /** Play button size */
    play_size?: string
    /** Autoplay — Only work if the muted box is checked */
    autoplay?: boolean
    /** Loop */
    loop?: boolean
    /** Muted */
    muted?: boolean
    /** Show controls — Only work when use Shopify hosted video type */
    show_controls?: boolean
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  product?: {
    /** Product */
    product: string
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  product_form?: {
    /** Product */
    product: string
    /** Show quantity selector */
    show_quantity_selector?: boolean
    /** Show vendor */
    show_vendor?: boolean
    /** Show price */
    show_price?: boolean
    /** Show cart button */
    show_add_to_cart?: boolean
    /** Show review */
    show_product_review?: boolean
    /** Show dynamic checkout button — Each customer will see their preferred payment method from those available on your store, such as PayPal or Apple Pay. [Learn more](https://help.shopify.com/manual/using-themes/change-the-layout/dynamic-checkout) */
    enable_payment_button?: boolean
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  article?: {
    /** Article */
    article: string
    /** Container width */
    width?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  image_card?: {
    /** Container width */
    width?: string
    /** Color scheme */
    color_scheme: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    content_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color — Work only when contents above image. */
    text_color?: string
    /** Image */
    image: string
    /** Mobile image */
    mobile_image: string
    /** Image link */
    link: string
    /** Heading */
    title?: string
    /** Sub heading */
    subtitle: string
    /** Description */
    description: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Fixed on bottom */
    button_fixed?: boolean
    /** Use content above image */
    use_content_above?: boolean
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  video_card?: {
    /** Container width */
    width?: string
    /** Color scheme */
    color_scheme: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    content_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color — Work only when contents above image. */
    text_color?: string
    /** Select video */
    shopify_video: unknown
    /** Video ratio */
    video_ratio?: string
    /** Card link */
    link: string
    /** Heading */
    title?: string
    /** Sub heading */
    subtitle: string
    /** Description */
    description: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Fixed on bottom */
    button_fixed?: boolean
    /** Use content above image */
    use_content_above?: boolean
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  lookbook?: {
    /** Color scheme — Color scheme for product cards hovered */
    color_scheme: string
    /** Container width */
    width?: string
    /** Image */
    image: string
    /** Offset top */
    top_1?: number
    /** Offset left */
    left_1?: number
    /** Select product */
    product_1: string
    /** Offset top */
    top_2?: number
    /** Offset left */
    left_2?: number
    /** Select product */
    product_2: string
    /** Offset top */
    top_3?: number
    /** Offset left */
    left_3?: number
    /** Select product */
    product_3: string
    /** Offset top */
    top_4?: number
    /** Offset left */
    left_4?: number
    /** Select product */
    product_4: string
    /** Offset top */
    top_5?: number
    /** Offset left */
    left_5?: number
    /** Select product */
    product_5: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  product_bundles?: {
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Heading */
    title?: string
    /** Subheading */
    subheading: string
    /** Text size */
    text_size?: string
    /** Show reviews badge */
    show_reviews?: boolean
    /** Image aspect ratio */
    image_ratio?: string
    /** Product 1 */
    product_1: string
    /** Product 2 */
    product_2: string
    /** Product 3 */
    product_3: string
    /** Product 4 */
    product_4: string
    /** Product 5 */
    product_5: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  countdown?: {
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Horizontal alignment */
    align?: string
    /** Text alignment */
    text_alignment?: string
    /** End time — Date format: YYYY-MM-DD HH:MM:ss */
    time?: string
    /** Heading */
    heading: string
    /** Heading size */
    heading_size?: string
    /** Subheading */
    subheading: string
    /** Text */
    text: string
    /** Button label */
    button_label: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  social?: {
    /** Heading */
    heading?: string
    /** Description */
    description: string
    /** Container width */
    width?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  newsletter?: {
    /** Heading */
    heading?: string
    /** Heading text size */
    text_size?: string
    /** Description */
    description?: string
    /** Form style */
    form_design?: string
    /** Email placeholder text */
    placeholder?: string
    /** Button label */
    submit_button?: string
    /** Vertical alignment */
    alignment?: string
    /** Horizontal alignment */
    align_text?: string
    /** Container width */
    width?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  html?: {
    /** HTML */
    code: string
    /** Container width */
    width?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  liquid?: {
    /** Custom liquid */
    custom_liquid: unknown
    /** Container width */
    width?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  image_with_text?: {
    /** Container width */
    width?: string
    /** Image */
    image: string
    /** Image link */
    link: string
    /** Image alignment */
    layout?: string
    /** Image container width */
    image_column_size?: string
    /** Hover effect */
    hover_effect?: boolean
    /** Heading */
    title?: string
    /** Subheading */
    sub_title: string
    /** Text */
    text?: string
    /** Text size */
    text_size?: string
    /** Text alignment */
    content_alignment?: string
    /** Button label */
    button_label?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  text_card_with_image?: {
    /** Container width */
    width?: string
    /** Card link */
    link: string
    /** Text alignment */
    text_alignment?: string
    /** Image */
    image: string
    /** Heading */
    title?: string
    /** Text */
    text: string
    /** Text size */
    text_size?: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  handpicked_products?: {
    /** Container width */
    width?: string
    /** Vertical alignment */
    alignment?: string
    /** Sub heading */
    subtitle: string
    /** Heading */
    title?: string
    /** Text */
    text: string
    /** Button label */
    button_label: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Text size */
    text_size?: string
    /** Text alignment */
    content_alignment?: string
    /** Products */
    product_list: string[]
    /** Products to show */
    product_to_show?: number
    /** Products per row */
    items_per_row?: number
    /** Column gap */
    item_gap?: number
    /** Design layout */
    pcard_layout?: string
    /** Image aspect ratio */
    pcard_image_ratio?: string
    /** Show product vendors */
    show_vendor?: boolean
    /** Hide product title */
    hide_title?: boolean
    /** Enable slider — Only applies to screens > 767px */
    enable_slider?: boolean
    /** Show pagination */
    show_pagination?: boolean
    /** Show navigation */
    show_navigation?: boolean
    /** Use horizontal scrollbar — Uncheck to display as grid */
    use_scroll_mobile?: boolean
    /** Column gap */
    item_gap_mobile?: number
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
  image_comparison?: {
    /** Container width */
    width?: string
    /** Select product */
    product: string
    /** Sub heading */
    subtitle: string
    /** Heading */
    title?: string
    /** Text */
    text: string
    /** Text size */
    text_size?: string
    /** Text alignment */
    content_alignment?: string
    /** Text color */
    text_color?: string
    /** Layout */
    layout?: string
    /** Image height */
    image_height?: string
    /** Image */
    before_image: string
    /** Image mobile */
    before_image_mobile: string
    /** Heading */
    before_heading?: string
    /** Image */
    after_image: string
    /** Image mobile */
    after_image_mobile: string
    /** Heading */
    after_heading?: string
    /** Custom classes */
    block_custom_class: string
    /** Visible in the view animation */
    animations?: string
  }
}

export type CustomContentProps = BaseSectionProps & {
  settings: CustomContentSettings
  blocks: CustomContentBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CustomContent({ id, settings, blocks, design }: CustomContentProps) {
  return (
    <section id={id} className={`minimog-section minimog-custom-content`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: custom-content (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}