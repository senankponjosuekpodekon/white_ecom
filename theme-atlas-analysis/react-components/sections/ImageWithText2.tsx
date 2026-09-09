export type ImageWithText2Settings = {
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Section height */
  hero_size?: string
  /** Show overlay */
  show_overlay?: boolean
  /** Image */
  image: string
  /** Image link */
  image_link: string
  /** Parallax effect */
  parallax?: boolean
  /** Parallax direction */
  parallax_direction?: string
  /** Content in container box */
  content_in_container?: boolean
  /** Content position */
  content_position?: string
  /** Content alignment */
  text_alignment?: string
  /** Text size */
  text_size?: string
  /** Text color — Work when contents above image */
  text_color?: string
  /** Heading */
  title?: string
  /** Subheading */
  subtitle: string
  /** Text */
  text?: string
  /** Button label */
  button_label?: string
  /** Button link */
  button_link: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
  /** Content alignment */
  text_alignment_mobile?: string
  /** Image */
  mb_image: string
  /** Use content above image */
  use_content_above?: boolean
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
  /** Enable background zoom effect */
  enable_bg_zoom_effect?: boolean
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
}

export type ImageWithText2Props = BaseSectionProps & {
  settings: ImageWithText2Settings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function ImageWithText2({ id, settings, blocks, design }: ImageWithText2Props) {
  return (
    <section id={id} className={`minimog-section minimog-image-with-text-2`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: image-with-text-2 (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}