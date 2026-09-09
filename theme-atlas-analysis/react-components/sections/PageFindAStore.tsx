export type PageFindAStoreSettings = {
  /** Container type */
  container?: string
  /** Column gap */
  gap?: number
  /** Column gap */
  gap_mobile?: number
}

export type PageFindAStoreBlocks = {
  image?: {
    /** Image */
    image: string
    /** Width */
    width?: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  content?: {
    /** Store title */
    heading?: string
    /** Content */
    content: string
    /** width */
    width?: string
  }
}

export type PageFindAStoreProps = BaseSectionProps & {
  settings: PageFindAStoreSettings
  blocks: PageFindAStoreBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function PageFindAStore({ id, settings, blocks, design }: PageFindAStoreProps) {
  return (
    <section id={id} className={`minimog-section minimog-page-find-a-store`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: page-find-a-store (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}