export type ImageWithText1Settings = {
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
  /** Layout */
  layout: string
  /** Item gap */
  gap?: number
  /** Enable horizontal scroll */
  use_scroll_mobile?: boolean
  /** Item gap */
  mobile_gap?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type ImageWithText1Blocks = {
  item?: {
    /** Color scheme */
    color_scheme: string
    /** Image */
    image: string
    /** Mobile image */
    mobile_image: string
    /** Image link */
    link: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    content_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color — Work only on desktop */
    text_color?: string
    /** Heading */
    title?: string
    /** Sub heading */
    subtitle: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Fixed on bottom */
    button_fixed?: boolean
  }
}

export type ImageWithText1Props = BaseSectionProps & {
  settings: ImageWithText1Settings
  blocks: ImageWithText1Blocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ImageWithText1({ id, settings, blocks, design }: ImageWithText1Props) {
  return (
    <section id={id} className={`minimog-section minimog-image-with-text-1`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: image-with-text-1 (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}