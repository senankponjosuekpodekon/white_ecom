export type ScalingLogoSettings = {
  /** Color scheme */
  color_scheme: string
  /** Background image */
  background: string
  /** Background image mobile */
  background_mobile: string
  /** Logo */
  logo: string
  /** Heading */
  heading?: string
  /** Button label — Leave it blank to hide */
  button_label?: string
  /** Button style */
  button_style?: string
  /** Button link */
  button_link: string
}

export type ScalingLogoProps = BaseSectionProps & {
  settings: ScalingLogoSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function ScalingLogo({ id, settings, blocks, design }: ScalingLogoProps) {
  return (
    <section id={id} className={`minimog-section minimog-scaling-logo`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: scaling-logo (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}