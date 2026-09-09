export type ContactFormSettings = {
  /** Container type */
  container?: string
  /** Title */
  title?: string
  /** Description */
  description?: string
  /** Show field name */
  show_name?: boolean
  /** Show field phone number */
  show_phone?: boolean
  /** Show email sign up */
  show_signup_email?: boolean
  /** Visible in the view animation */
  animations?: string
}

export type ContactFormBlocks = {
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

export type ContactFormProps = BaseSectionProps & {
  settings: ContactFormSettings
  blocks: ContactFormBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function ContactForm({ id, settings, blocks, design }: ContactFormProps) {
  return (
    <section id={id} className={`minimog-section minimog-contact-form`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: contact-form (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}