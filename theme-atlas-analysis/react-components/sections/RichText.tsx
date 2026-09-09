export type RichTextSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Text alignment */
  content_alignment?: string
  /** Image 1 */
  image_1: string
  /** Image 2 */
  image_2: string
  /** Image 3 */
  image_3: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type RichTextBlocks = {
  subheading?: {
    /** Subheading */
    subheading?: string
  }
  heading?: {
    /** Heading */
    heading?: string
    /** Heading size */
    heading_size?: string
  }
  text?: {
    /** Text */
    text?: string
  }
  button?: {
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

export type RichTextProps = BaseSectionProps & {
  settings: RichTextSettings
  blocks: RichTextBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function RichText({ id, settings, blocks, design }: RichTextProps) {
  return (
    <section id={id} className={`minimog-section minimog-rich-text`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: rich-text (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}