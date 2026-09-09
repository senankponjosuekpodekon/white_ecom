export type MultipleImageWithTextSettings = {
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Text alignment */
  header_alignment?: string
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Column gap */
  column_gap?: number
  /** Column gap on mobile */
  column_gap_mobile?: number
  /** Show pagination */
  show_pagination?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Auto slide */
  autorotate?: boolean
  /** Auto slide every */
  autorotate_speed?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type MultipleImageWithTextBlocks = {
  image_with_text?: {
    /** Color scheme */
    color_scheme: string
    /** Image */
    image: string
    /** Heading */
    title?: string
    /** Subheading */
    sub_title: string
    /** Text */
    text?: string
    /** Text size */
    text_size?: string
    /** Text alignment */
    text_alignment?: string
    /** Button label */
    button_label?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
  }
}

export type MultipleImageWithTextProps = BaseSectionProps & {
  settings: MultipleImageWithTextSettings
  blocks: MultipleImageWithTextBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function MultipleImageWithText({ id, settings, blocks, design }: MultipleImageWithTextProps) {
  return (
    <section id={id} className={`minimog-section minimog-multiple-image-with-text`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: multiple-image-with-text (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}