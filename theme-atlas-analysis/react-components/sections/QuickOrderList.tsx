export type QuickOrderListSettings = {
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
  /** Show image */
  show_image?: boolean
  /** Show sku */
  show_sku?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type QuickOrderListProps = BaseSectionProps & {
  settings: QuickOrderListSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function QuickOrderList({ id, settings, blocks, design }: QuickOrderListProps) {
  return (
    <section id={id} className={`minimog-section minimog-quick-order-list`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: quick-order-list (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}