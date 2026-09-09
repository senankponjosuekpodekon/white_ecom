export type NewsletterSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Form layout */
  form_layout?: string
  /** Form style */
  form_design?: string
  /** Heading */
  heading?: string
  /** Description */
  description: string
  /** Text size */
  text_size?: string
  /** Email placeholder text */
  email_placeholder?: string
  /** Button label — Leave blank to use icon */
  submit_button?: string
  /** Text color */
  text_color?: string
  /** Show icon */
  show_icon?: boolean
  /** Icon image */
  icon_img: string
  /** Icon image width (px) */
  icon_img_width?: string
  /** Show "Terms & conditions" checkbox */
  show_agreement?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type NewsletterBlocks = {
  image?: {
    /** Image */
    image: string
    /** Width */
    image_width?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
}

export type NewsletterProps = BaseSectionProps & {
  settings: NewsletterSettings
  blocks: NewsletterBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Newsletter({ id, settings, blocks, design }: NewsletterProps) {
  return (
    <section id={id} className={`minimog-section minimog-newsletter`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: newsletter (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}