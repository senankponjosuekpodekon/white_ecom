export type PageContactSettings = {
  /** Container type */
  container?: string
}

export type PageContactBlocks = {
  textblock?: {
    /** Title */
    title?: string
    /** Content */
    content?: string
  }
  socialmedia?: {
    /** Title */
    title?: string
  }
}

export type PageContactProps = BaseSectionProps & {
  settings: PageContactSettings
  blocks: PageContactBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function PageContact({ id, settings, blocks, design }: PageContactProps) {
  return (
    <section id={id} className={`minimog-section minimog-page-contact`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: page-contact (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}