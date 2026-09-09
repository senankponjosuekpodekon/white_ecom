export type PageSearchSettings = {
  /** Container type */
  container?: string
  /** Results per page */
  results_per_page?: number
  /** Enable sorting */
  show_sorting?: boolean
  /** Enable filtering */
  show_filter?: boolean
  /** Show results count on filter item */
  show_product_count?: boolean
  /** Change product card variant on filtering — Change product card options, price and image based on the variant after filtering. */
  change_product_variant_on_fitlering?: boolean
  /** Filters title — Leave blank to hide */
  sidebar_title?: string
  /** Collapsed filter groups — Filters groups that collapsed by default. Separate by comma. */
  collapsed_groups?: string
  /** Color swatches group — Enter color option name, separate by comma. */
  color_swatches?: string
  /** Limit filter widget's height */
  limit_height_widget?: boolean
  /** Max height */
  limit_height?: number
}

export type PageSearchProps = BaseSectionProps & {
  settings: PageSearchSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function PageSearch({ id, settings, blocks, design }: PageSearchProps) {
  return (
    <section id={id} className={`minimog-section minimog-page-search`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: page-search (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}