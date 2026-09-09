export type BreadcrumbSettings = {
  /** Container type */
  container?: string
  /** Text alignment */
  text_alignment?: string
  /** Hide current page */
  hide_current?: boolean
  /** Hide on mobile */
  hide_on_mb?: boolean
  /** Visible in the view animation */
  animations?: string
}

export type BreadcrumbProps = BaseSectionProps & {
  settings: BreadcrumbSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function Breadcrumb({ id, settings, blocks, design }: BreadcrumbProps) {
  return (
    <section id={id} className={`minimog-section minimog-breadcrumb`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: breadcrumb (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}