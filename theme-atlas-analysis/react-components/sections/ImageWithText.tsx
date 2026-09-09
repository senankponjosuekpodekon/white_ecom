export type ImageWithTextSettings = {
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Column gap */
  item_gap?: number
  /** Column gap on mobile */
  item_gap_mobile?: number
  /** Image alignment */
  layout?: string
  /** Image container width */
  image_column_size?: string
  /** Show image overlap */
  image_overlap?: boolean
  /** Show image reverse — Work when disable image overlap */
  show_image_reverse?: boolean
  /** Enable hover effect */
  hover_effect?: boolean
  /** Image animation — The parallax option work only when enable show image overlap */
  image_animation?: string
  /** Image */
  image: string
  /** Image link */
  link: string
  /** Second image */
  image_2: string
  /** Image link */
  link_2: string
  /** Offset top — Work when enable image overlap */
  second_image_offset_top?: number
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
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type ImageWithTextProps = BaseSectionProps & {
  settings: ImageWithTextSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function ImageWithText({ id, settings, blocks, design }: ImageWithTextProps) {
  return (
    <section id={id} className={`minimog-section minimog-image-with-text`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: image-with-text (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}