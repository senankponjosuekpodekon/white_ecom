export type MapsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Height */
  map_height?: string
  /** Coordinate X — Integer */
  textx?: string
  /** Coordinate Y — Integer */
  texty?: string
  /** Zoom */
  zoom?: string
  /** Map Text */
  text2?: string
  /** Content position */
  content_position?: string
  /** Content alignment */
  text_alignment?: string
  /** Use content in container box */
  use_content_in_container?: boolean
  /** Visible in the view animation */
  animations?: string
  /** Custom classes */
  custom_class: string
}

export type MapsBlocks = {
  heading?: {
    /** Heading */
    heading?: string
  }
  subheading?: {
    /** Subheading */
    subheading?: string
  }
  text?: {
    /** Text */
    text?: string
  }
  button?: {
    /** Button label */
    button_label?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
  }
}

export type MapsProps = BaseSectionProps & {
  settings: MapsSettings
  blocks: MapsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Maps({ id, settings, blocks, design }: MapsProps) {
  return (
    <section id={id} className={`minimog-section minimog-maps`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: maps (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}