export type CollectionPageHeaderSettings = {
  /** Color scheme */
  color_scheme: string
  /** Container type */
  container?: string
  /** Layout */
  layout?: string
  /** Image */
  bg_image: string
  /** Image position */
  image_position?: string
  /** Enable parallax effect — Works only if the Image position is set to "Use image as background" */
  enable_parallax?: boolean
  /** Parallax direction */
  parallax_direction?: string
  /** Content alignment */
  text_alignment?: string
  /** Text color */
  text_color?: string
  /** Uppercase title */
  upper_title?: boolean
  /** Show description */
  show_desc?: boolean
  /** Description for all products */
  collection_all_desc: string
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Enable background zoom effect */
  enable_bg_zoom_effect?: boolean
}

export type CollectionPageHeaderBlocks = {
  banner?: {
    /** Collection — Choose a collection to show this banner. */
    collection: string
    /** Image */
    image: string
  }
}

export type CollectionPageHeaderProps = BaseSectionProps & {
  settings: CollectionPageHeaderSettings
  blocks: CollectionPageHeaderBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function CollectionPageHeader({ id, settings, blocks, design }: CollectionPageHeaderProps) {
  return (
    <section id={id} className={`minimog-section minimog-collection-page-header`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: collection-page-header (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}