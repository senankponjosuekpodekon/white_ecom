export type PageFaqsSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Select menu */
  menu: string
  /** Custom classes */
  custom_class: string
}

export type PageFaqsBlocks = {
  content?: {
    /** Content — Allow html code */
    content: string
  }
  accordion?: {
    /** Heading */
    title?: string
    /** Content */
    content?: string
    /** Open Tab By Default */
    open?: boolean
  }
}

export type PageFaqsProps = BaseSectionProps & {
  settings: PageFaqsSettings
  blocks: PageFaqsBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function PageFaqs({ id, settings, blocks, design }: PageFaqsProps) {
  return (
    <section id={id} className={`minimog-section minimog-page-faqs`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: page-faqs (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}