export type PromotionCountdownTimerSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Use background in container */
  background_in_container?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type PromotionCountdownTimerBlocks = {
  text?: {
    /** Text alignment */
    text_alignment?: string
    /** Subheading */
    subheading: string
    /** Heading */
    heading?: string
    /** Heading size */
    heading_size?: string
    /** Text */
    text?: string
  }
  countdown?: {
    /** Text alignment */
    text_alignment?: string
    /** End time — Date format: YYYY-MM-DD HH:MM:ss */
    time?: string
  }
  button?: {
    /** Text alignment */
    text_alignment?: string
    /** Button label */
    button_label?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
  }
}

export type PromotionCountdownTimerProps = BaseSectionProps & {
  settings: PromotionCountdownTimerSettings
  blocks: PromotionCountdownTimerBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function PromotionCountdownTimer({ id, settings, blocks, design }: PromotionCountdownTimerProps) {
  return (
    <section id={id} className={`minimog-section minimog-promotion-countdown-timer`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: promotion-countdown-timer (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}