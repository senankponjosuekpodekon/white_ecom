export type GallerySettings = {
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Button label — Leave blank to hide the button */
  button_label: string
  /** Button link */
  button_link: string
  /** Button style */
  button_style?: string
  /** Text alignment */
  header_alignment?: string
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Header color scheme — Only work with layout Metro */
  color_scheme_content: string
  /** Icon */
  icon?: string
  /** Layout */
  layout?: string
  /** Images per row */
  grid_columns?: number
  /** Column gap */
  column_gap?: number
  /** Row gap */
  row_gap?: number
  /** Number of columns on mobile */
  columns_mobile?: string
  /** Gap */
  mobile_gap?: number
  /** Use horizontal scrollbar — Uncheck to display as grid */
  use_scroll_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type GalleryBlocks = {
  image?: {
    /** Image */
    image: string
    /** Link */
    link: string
  }
}

export type GalleryProps = BaseSectionProps & {
  settings: GallerySettings
  blocks: GalleryBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Gallery({ id, settings, blocks, design }: GalleryProps) {
  return (
    <section id={id} className={`minimog-section minimog-gallery`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: gallery (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}