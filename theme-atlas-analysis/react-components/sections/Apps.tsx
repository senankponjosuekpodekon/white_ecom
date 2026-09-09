export type AppsSettings = {
  /** Heading */
  heading: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Text alignment */
  header_alignment?: string
  /** Container type */
  container?: string
  /** Background color */
  background_color: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
}

export type AppsBlocks = {
  @app?: {
  }
}

export type AppsProps = BaseSectionProps & {
  settings: AppsSettings
  blocks: AppsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Apps({ id, settings, blocks, design }: AppsProps) {
  return (
    <section id={id} className={`minimog-section minimog-apps`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: apps (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}