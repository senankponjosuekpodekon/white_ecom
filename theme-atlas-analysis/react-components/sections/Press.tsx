export type PressSettings = {
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
  /** Show divider */
  show_divider?: boolean
  /** Auto-rotate content */
  autoplay?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type PressBlocks = {
  news?: {
    /** Content */
    title?: string
    /** Image */
    image: string
    /** Image width (px) — Leave blank to use original width. */
    image_width?: string
  }
}

export type PressProps = BaseSectionProps & {
  settings: PressSettings
  blocks: PressBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Press({ id, settings, blocks, design }: PressProps) {
  return (
    <section id={id} className={`minimog-section minimog-press`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: press (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}