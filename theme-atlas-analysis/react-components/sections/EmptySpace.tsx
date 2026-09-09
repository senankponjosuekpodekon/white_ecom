export type EmptySpaceSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Show divider line */
  show_divider_line?: boolean
  /** Divider style */
  divider_style: string
  /** Divider height */
  divider_height?: number
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
}

export type EmptySpaceProps = BaseSectionProps & {
  settings: EmptySpaceSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function EmptySpace({ id, settings, blocks, design }: EmptySpaceProps) {
  return (
    <section id={id} className={`minimog-section minimog-empty-space`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: empty-space (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}