export type CountdownTimerSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Alignment */
  align?: string
  /** Background image */
  background_image: string
  /** Use background in container */
  background_in_container?: boolean
  /** Enable parallax effect — Works only if the Image position is set to "Use image as background" */
  enable_parallax?: boolean
  /** Parallax direction */
  parallax_direction?: string
  /** Image on mobile */
  mb_image: string
  /** Use image as background */
  use_image_as_background?: boolean
  /** Heading */
  heading?: string
  /** Description */
  description: string
  /** End time — Date format: YYYY-MM-DD HH:MM:ss */
  time?: string
  /** Heading size */
  heading_size?: string
  /** Button label — Leave blank to hide button */
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
  /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
  enable_preload_image?: boolean
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type CountdownTimerProps = BaseSectionProps & {
  settings: CountdownTimerSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function CountdownTimer({ id, settings, blocks, design }: CountdownTimerProps) {
  return (
    <section id={id} className={`minimog-section minimog-countdown-timer`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: countdown-timer (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}