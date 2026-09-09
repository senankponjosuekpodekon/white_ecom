export type Section404TemplateSettings = {
  /** Background Color */
  bg_color?: string
  /** Text 1 Color */
  t1_color?: string
  /** Text 2 Color */
  t2_color?: string
}

export type Section404TemplateProps = BaseSectionProps & {
  settings: Section404TemplateSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function Section404Template({ id, settings, blocks, design }: Section404TemplateProps) {
  return (
    <section id={id} className={`minimog-section minimog-404-template`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: 404-template (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}