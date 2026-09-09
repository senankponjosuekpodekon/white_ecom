export type IconBoxSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
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
  /** Columns per row */
  item_per_row?: number
  /** Column gap */
  item_gap?: number
  /** Column gap on mobile */
  item_gap_mobile?: number
  /** Card layout */
  card_style?: string
  /** Image width — Leave blank to use original width. */
  image_max_width?: string
  /** Content alignment */
  content_alignment?: string
  /** Hover effect */
  hover_effect?: string
  /** Enable slider */
  enable_slider?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Show navigation */
  show_navigation?: boolean
  /** Enable horizontal scroll */
  use_scroll_mobile?: boolean
  /** Use grid 2 columns */
  use_grid_column_mb?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type IconBoxBlocks = {
  iconbox?: {
    /** Color scheme */
    card_color_scheme: string
    /** Image */
    image: string
    /** Image from URL — Enter an image URL with extension .svg, .png or .jpg */
    image_by_url: string
    /** Heading */
    title?: string
    /** Description */
    description?: string
    /** Image link */
    link: string
    /** Button label */
    button_label: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
  }
}

export type IconBoxProps = BaseSectionProps & {
  settings: IconBoxSettings
  blocks: IconBoxBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function IconBox({ id, settings, blocks, design }: IconBoxProps) {
  return (
    <section id={id} className={`minimog-section minimog-icon-box`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: icon-box (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}