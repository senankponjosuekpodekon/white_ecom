export type BrandsListSettings = {
  /** Heading */
  heading?: string
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
  /** Images per row */
  item_per_row?: number
  /** Column gap */
  column_gap?: number
  /** Row gap */
  row_gap?: number
  /** Column gap mobile */
  column_gap_mobile?: number
  /** Row gap mobile */
  row_gap_mobile?: number
  /** Enable slider — Images must be greater than images per row */
  enable_slider?: boolean
  /** Show navigation */
  show_nav?: boolean
  /** Show pagination */
  show_pagination?: boolean
  /** Auto-rotate slides */
  autorotate?: boolean
  /** Change slides every */
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

export type BrandsListBlocks = {
  image?: {
    /** Image */
    image: string
    /** Image from URL — Enter an image URL with extension .svg, .png or .jpg */
    image_by_url: string
    /** Image Link */
    image_link: string
    /** Image width (px) — Leave blank to use original width. */
    max_width?: string
  }
}

export type BrandsListProps = BaseSectionProps & {
  settings: BrandsListSettings
  blocks: BrandsListBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function BrandsList({ id, settings, blocks, design }: BrandsListProps) {
  return (
    <section id={id} className={`minimog-section minimog-brands-list`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: brands-list (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}