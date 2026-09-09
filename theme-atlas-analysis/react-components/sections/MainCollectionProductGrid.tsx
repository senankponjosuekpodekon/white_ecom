export type MainCollectionProductGridSettings = {
  /** Container type */
  container?: string
  /** Default layout */
  grid_layout?: string
  /** Products per row in Grid layout — For devices with screen width greater than 1024px */
  grid_columns?: string
  /** Show columns switcher */
  show_columns_switcher?: boolean
  /** Products per page */
  pagination_limit?: number
  /** Pagination type */
  paginate_type?: string
  /** Enable sorting */
  show_sorting?: boolean
  /** Enable filtering */
  show_filter?: boolean
  /** Filters type — Note: the Storefront filters will be hidden if your collection contains more than 1000 products. [Learn more about filters](/admin/menus) */
  filters_type?: string
  /** Filters position */
  sidebar?: string
  /** Filters title — Leave blank to hide */
  sidebar_title?: string
  /** Limit filter widget's height */
  limit_height_widget?: boolean
  /** Max height */
  limit_height?: number
  /** Change product card variant on filtering — Change product card options, price and image based on the variant after filtering. */
  change_product_variant_on_fitlering?: boolean
  /** Show results count on filter item */
  show_product_count?: boolean
  /** Collapsed filter groups — Filters groups that collapsed by default. Separate by comma. */
  collapsed_groups?: string
  /** Color swatches group — Enter color option name, separate by comma. */
  color_swatches?: string
  /** Color design */
  color_swatches_design?: string
}

export type MainCollectionProductGridBlocks = {
  filter?: {
    /** Design */
    design_filtergroup?: string
    /** Title */
    title?: string
    /** Tags List — Example: Vintage,tops,shirts... */
    filtergroup?: string
    /** Show color with label — Work with filter colors */
    show_label?: boolean
    /** Enable collapsible */
    use_accordion?: boolean
    /** Expand by default */
    open_filtergroup?: boolean
  }
  collections?: {
    /** Title */
    title?: string
    /** Menu — Only show items linked to a collection */
    menu: string
    /** Show featured image */
    show_image?: boolean
    /** Enable collapsible */
    use_accordion?: boolean
    /** Expand by default */
    open_filtergroup?: boolean
  }
  banner_promotion?: {
    /** Color scheme */
    color_scheme: string
    /** Text size */
    text_size?: string
    /** Text color */
    text_color?: string
    /** Image */
    image: string
    /** Mobile image */
    mobile_image: string
    /** Image link */
    link: string
    /** Content position */
    content_position?: string
    /** Content alignment */
    content_alignment?: string
    /** Heading */
    title?: string
    /** Sub heading */
    subtitle: string
    /** Button label */
    button_label?: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Fixed on bottom */
    button_fixed?: boolean
  }
}

export type MainCollectionProductGridProps = BaseSectionProps & {
  settings: MainCollectionProductGridSettings
  blocks: MainCollectionProductGridBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function MainCollectionProductGrid({ id, settings, blocks, design }: MainCollectionProductGridProps) {
  return (
    <section id={id} className={`minimog-section minimog-main-collection-product-grid`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: main-collection-product-grid (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}