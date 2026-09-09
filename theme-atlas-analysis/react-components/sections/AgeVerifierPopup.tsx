export type AgeVerifierPopupSettings = {
  /** Design mode */
  design_mode?: boolean
  /** Enable */
  enable?: boolean
  /** Image — 2000 x 800px recommended */
  bg_image: string
  /** Blur the image */
  bg_blur?: boolean
  /** Heading */
  decline_heading?: string
  /** Text */
  decline_content?: string
  /** Return button text */
  return_button?: string
}

export type AgeVerifierPopupBlocks = {
  heading?: {
    /** Heading */
    heading?: string
  }
  subheading?: {
    /** Subheading */
    subheading?: string
  }
  text?: {
    /** Content */
    text?: string
  }
  image?: {
    /** Image */
    image: string
    /** Use custom image width */
    use_custom_image_width?: boolean
    /** Custom image width (PX) */
    custom_image_width?: number
  }
  buttons?: {
    /** Decline button text */
    decline_button?: string
    /** Approve button text */
    approve_button?: string
  }
}

export type AgeVerifierPopupProps = BaseSectionProps & {
  settings: AgeVerifierPopupSettings
  blocks: AgeVerifierPopupBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function AgeVerifierPopup({ id, settings, blocks, design }: AgeVerifierPopupProps) {
  return (
    <section id={id} className={`minimog-section minimog-age-verifier-popup`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: age-verifier-popup (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}