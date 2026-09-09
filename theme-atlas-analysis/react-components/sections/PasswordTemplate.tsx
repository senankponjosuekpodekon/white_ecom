export type PasswordTemplateSettings = {
  /** Background image */
  image: string
  /** Background color */
  bg_color?: string
  /** Show logo */
  show_logo?: boolean
  /** Logo image */
  image_l: string
  /** Logo Main width (in pixels) */
  logo_max_width?: string
  /** Title */
  t1?: string
  /** Description */
  t2?: string
  /** Show newsletter */
  show_n?: boolean
  /** Title */
  n_t1?: string
  /** Form Text */
  n_t2?: string
  /** Show password */
  show_p?: boolean
  /** Title */
  p_t1?: string
  /** Form Text */
  p_t2?: string
  /** Copyright */
  f_t1?: string
}

export type PasswordTemplateProps = BaseSectionProps & {
  settings: PasswordTemplateSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function PasswordTemplate({ id, settings, blocks, design }: PasswordTemplateProps) {
  return (
    <section id={id} className={`minimog-section minimog-password-template`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: password-template (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}