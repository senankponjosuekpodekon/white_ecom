export type CollapsibleTabsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Image */
  image: string
  /** Image position */
  image_position: string
  /** Column gap */
  column_gap?: number
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Text alignment */
  header_alignment?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
  /** Visible in the view animation */
  animations?: string
  /** Custom classes */
  custom_class: string
}

export type CollapsibleTabsBlocks = {
  item?: {
    /** Collapsible tab */
    header?: string
    /** Text size */
    text_size: string
    /** Accordion content */
    content?: string
    /** Tab content from page */
    content_page: string
    /** Default open */
    open?: boolean
  }
  liquid?: {
    /** Tab heading */
    header?: string
    /** Custom liquid */
    custom_liquid: unknown
  }
}

export type CollapsibleTabsProps = BaseSectionProps & {
  settings: CollapsibleTabsSettings
  blocks: CollapsibleTabsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollapsibleTabs({ id, settings, blocks, design }: CollapsibleTabsProps) {
  return (
    <section id={id} className={`minimog-section minimog-collapsible-tabs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collapsible-tabs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}