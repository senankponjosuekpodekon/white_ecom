export type CascadingProductSettings = {
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Collection */
  collection: string
  /** Products to show */
  product_to_show?: number
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Text aligmnent */
  heading_alignment: string
  /** Overlay heading */
  overlay_heading?: boolean
  /** Vertical space between items */
  spacing?: string
  /** Variation between media sizes */
  variance?: string
  /** Sequence */
  sequence?: number
  /** Desktop column gap */
  column_gap?: number
  /** Enable parallax animations — When enabled small cascade media will scroll faster than large cascade media. */
  cascade_enable_parallax?: boolean
  /** Parallax intensity — Adjust the level of parallax animations. */
  cascade_parallax_intensity?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
}

export type CascadingProductProps = BaseSectionProps & {
  settings: CascadingProductSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function CascadingProduct({ id, settings, blocks, design }: CascadingProductProps) {
  return (
    <section id={id} className={`minimog-section minimog-cascading-product`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: cascading-product (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}