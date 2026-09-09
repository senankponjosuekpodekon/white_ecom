export type CollectionTabsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Heading alignment */
  header_alignment?: string
  /** Heading */
  heading?: string
  /** Section header */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Desktop image position — Position is automatically optimized for mobile. */
  image_position?: string
  /** Image ratio */
  image_ratio?: string
  /** Prefix header */
  prefix_header?: string
  /** Trigger open tab */
  trigger_behavior?: string
  /** Auto-rotate content */
  autoplay?: boolean
  /** Change content every */
  autoplay_duration?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CollectionTabsBlocks = {
  collection?: {
    /** Collection */
    collection: string
    /** Image — Leave blank to use collection's image */
    image: string
    /** Heading — Leave blank to use collection's title */
    heading: string
    /** Heading size */
    heading_size?: string
    /** Text — Leave blank to use collection's description */
    text: string
    /** Icon */
    icon: string
  }
}

export type CollectionTabsProps = BaseSectionProps & {
  settings: CollectionTabsSettings
  blocks: CollectionTabsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionTabs({ id, settings, blocks, design }: CollectionTabsProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-tabs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-tabs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}