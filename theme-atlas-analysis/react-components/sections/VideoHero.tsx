export type VideoHeroSettings = {
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Section height */
  hero_size?: string
  /** Video ratio — Work when section height is 'Adapt to video ratio' */
  video_ratio?: string
  /** Show overlay */
  show_overlay?: boolean
  /** Video type */
  video_type?: string
  /** Shopify hosted */
  shopify_video: unknown
  /** External video url */
  video_url?: string
  /** Content in container box */
  content_in_container?: boolean
  /** Content position */
  content_position?: string
  /** Content alignment */
  text_alignment?: string
  /** Text size */
  text_size?: string
  /** Text color — Work when contents above image */
  text_color?: string
  /** Heading */
  title?: string
  /** Subheading */
  subtitle: string
  /** Text */
  text?: string
  /** Button label */
  button_label?: string
  /** Button link */
  button_link: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
  /** Button label */
  button_label_2: string
  /** Button link */
  button_link_2: string
  /** Button style */
  button_style_2?: string
  /** Button size */
  button_size_2?: string
  /** Use content above image */
  use_content_above?: boolean
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type VideoHeroProps = BaseSectionProps & {
  settings: VideoHeroSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function VideoHero({ id, settings, blocks, design }: VideoHeroProps) {
  return (
    <section id={id} className={`minimog-section minimog-video-hero`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: video-hero (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}