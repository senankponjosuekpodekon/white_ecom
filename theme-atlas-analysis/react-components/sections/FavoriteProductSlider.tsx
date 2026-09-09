export type FavoriteProductSliderSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Product */
  featured_product: string
  /** Custom title — Leave blank to display product title */
  heading?: string
  /** Subtitle */
  subheading: string
  /** Description */
  description?: string
  /** Text alignment */
  header_alignment?: string
  /** Text color */
  text_color?: string
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

export type FavoriteProductSliderProps = BaseSectionProps & {
  settings: FavoriteProductSliderSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function FavoriteProductSlider({ id, settings, blocks, design }: FavoriteProductSliderProps) {
  return (
    <section id={id} className={`minimog-section minimog-favorite-product-slider`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: favorite-product-slider (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}