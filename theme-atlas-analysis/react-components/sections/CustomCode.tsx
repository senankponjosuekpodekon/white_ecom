export type CustomCodeSettings = {
  /** Enter your code here — Note: Drag this section, and drop it at the top of the page's list of sections. */
  custom_css: string
}

export type CustomCodeProps = BaseSectionProps & {
  settings: CustomCodeSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function CustomCode({ id, settings, blocks, design }: CustomCodeProps) {
  return (
    <section id={id} className={`minimog-section minimog-custom-code`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: custom-code (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}