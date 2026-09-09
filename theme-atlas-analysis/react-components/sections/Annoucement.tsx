export type AnnoucementSettings = {
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Show announcement */
  show_announcement?: boolean
  /** Home page only */
  homepage_only?: boolean
  /** Show close button */
  show_close?: boolean
  /** Show divider */
  show_divider?: boolean
  /** Show navigation */
  show_nav?: boolean
  /** Auto-rotate slides */
  autorotate?: boolean
  /** Change slides every */
  autorotate_speed?: number
}

export type AnnoucementBlocks = {
  item?: {
    /** Message */
    message?: string
    /** Link */
    message_link: string
  }
}

export type AnnoucementProps = BaseSectionProps & {
  settings: AnnoucementSettings
  blocks: AnnoucementBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Annoucement({ id, settings, blocks, design }: AnnoucementProps) {
  return (
    <section id={id} className={`minimog-section minimog-annoucement`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: annoucement (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}