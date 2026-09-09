export type CollageTabsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Desktop navigation alignment */
  desktop_navigation_alignment?: string
  /** Desktop image position */
  desktop_image_position?: string
  /** Desktop image width */
  desktop_image_width?: number
  /** Image ratio */
  image_aspect_ratio?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CollageTabsBlocks = {
  tab?: {
    /** Color scheme */
    tab_color_scheme: string
    /** Navigation title */
    navigation_title: string
    /** Image */
    image: string
    /** Heading */
    heading: string
    /** Heading size */
    heading_size?: string
    /** Subheading */
    subheading: string
    /** Description */
    description: string
    /** Text alignment */
    text_alignment?: string
    /** Button label — Leave blank to hide the button */
    button_label: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
}

export type CollageTabsProps = BaseSectionProps & {
  settings: CollageTabsSettings
  blocks: CollageTabsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollageTabs({ id, settings, blocks, design }: CollageTabsProps) {
  return (
    <section id={id} className={`minimog-section minimog-collage-tabs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collage-tabs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}