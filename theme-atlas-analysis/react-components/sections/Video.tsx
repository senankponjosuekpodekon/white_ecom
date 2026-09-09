export type VideoSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Video type */
  video_type?: string
  /** Shopify hosted */
  shopify_video: unknown
  /** Video link — Accepts YouTube or Vimeo links */
  video_link?: string
  /** Video ratio */
  ratio?: string
  /** Cover image */
  image: string
  /** Heading */
  video_title: string
  /** Text size */
  text_size?: string
  /** Text color */
  text_color?: string
  /** Play button style */
  play_style?: string
  /** Play button size */
  play_size?: string
  /** Video width — Leave blank for follow container width */
  width?: string
  /** Autoplay — Only work if the muted box is checked */
  autoplay?: boolean
  /** Loop */
  loop?: boolean
  /** Muted */
  muted?: boolean
  /** Show controls — Only work when use Shopify hosted video type */
  show_controls?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type VideoProps = BaseSectionProps & {
  settings: VideoSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function Video({ id, settings, blocks, design }: VideoProps) {
  return (
    <section id={id} className={`minimog-section minimog-video`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: video (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}