export type PromotionBannerSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Image on desktop */
  background: string
  /** Image on mobile */
  mb_background: string
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Text */
  text?: string
  /** Text alignment */
  content_alignment?: string
  /** Link */
  banner_url: string
  /** Button label */
  button_label?: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
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

export type PromotionBannerBlocks = {
  promotion?: {
    /** Subheading */
    subheading?: string
    /** Heading */
    heading?: string
    /** Text alignment */
    text_alignment?: string
  }
}

export type PromotionBannerProps = BaseSectionProps & {
  settings: PromotionBannerSettings
  blocks: PromotionBannerBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function PromotionBanner({ id, settings, blocks, design }: PromotionBannerProps) {
  return (
    <section id={id} className={`minimog-section minimog-promotion-banner`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: promotion-banner (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}