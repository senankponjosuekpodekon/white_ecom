export type HotspotsImageSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Image */
  image: string
  /** Mobile Image */
  mobile_image: string
  /** Image width */
  image_max_width?: number
  /** Heading size */
  heading_size?: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
  /** Enable background zoom effect. */
  enable_bg_zoom_effect?: boolean
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
}

export type HotspotsImageBlocks = {
  hotspot?: {
    /** Vertical position */
    top?: number
    /** Horizontal position */
    left?: number
    /** Vertical position (Mobile image) */
    m_top?: number
    /** Horizontal position (Mobile image) */
    m_left?: number
    /** Image */
    image: string
    /** Heading */
    heading?: string
    /** Text */
    text?: string
  }
}

export type HotspotsImageProps = BaseSectionProps & {
  settings: HotspotsImageSettings
  blocks: HotspotsImageBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function HotspotsImage({ id, settings, blocks, design }: HotspotsImageProps) {
  return (
    <section id={id} className={`minimog-section minimog-hotspots-image`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: hotspots-image (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}