export type SliderSettings = {
  /** Container type */
  container?: string
  /** Slide height — Only applies to screens > 767px */
  slideshow_height?: string
  /** Show overlay */
  show_overlay?: boolean
  /** Pagination position */
  dots_position?: string
  /** Controls color */
  dots_color?: string
  /** Show pagination */
  show_dots?: boolean
  /** Show navigation */
  show_arrows?: boolean
  /** Auto-rotate slides */
  autorotate?: boolean
  /** Change slides every — Work when auto-rotate */
  autorotate_speed?: number
  /** Use content above the image */
  use_content_above?: boolean
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type SliderBlocks = {
  slider_item?: {
    /** Image on desktop — 1920 x 900px recommended */
    background: string
    /** Image on mobile — 600 x 480px recommended */
    mb_background: string
    /** Content in container box */
    content_in_container?: boolean
    /** Content position */
    content_position?: string
    /** Content alignment */
    text_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color */
    text_color?: string
    /** Subheading — Allow custom HTML */
    subheading: string
    /** Heading — Allow custom HTML */
    title?: string
    /** Description */
    description?: string
    /** Image link — Link to image */
    image_link: string
    /** Button label */
    button_text?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Button label */
    second_button_text: string
    /** Button link */
    second_button_link: string
    /** Button style */
    second_button_style?: string
    /** Button size */
    second_button_size?: string
    /** Show footer */
    show_footer?: boolean
    /** Footer alignment */
    footer_alignment?: string
    /** Footer text */
    footer_text?: string
    /** Footer button */
    footer_button?: string
    /** Footer link */
    footer_link: string
    /** Enable preload image — If this section is visible when the page loads, enabling this setting can reduce LCP and may improve site speed scores. */
    enable_preload_image?: boolean
  }
  video_slide?: {
    /** Video — Allow multiple format, each video in a new line. MP4, MOV and WEBM supported. */
    video?: string
    /** Image on mobile — 600 x 480px recommended */
    mb_background: string
    /** Content in container box */
    content_in_container?: boolean
    /** Content position */
    content_position?: string
    /** Content alignment */
    text_alignment?: string
    /** Text size */
    text_size?: string
    /** Text color */
    text_color?: string
    /** Subheading — Allow custom HTML */
    subheading: string
    /** Heading — Allow custom HTML */
    title?: string
    /** Description */
    description?: string
    /** Image link — Link to image */
    image_link: string
    /** Button label */
    button_text?: string
    /** Button link */
    button_link: string
    /** Button style */
    button_style?: string
    /** Button size */
    button_size?: string
    /** Show footer */
    show_footer?: boolean
    /** Footer alignment */
    footer_alignment?: string
    /** Footer text */
    footer_text?: string
    /** Footer button */
    footer_button?: string
    /** Footer link */
    footer_link: string
  }
}

export type SliderProps = BaseSectionProps & {
  settings: SliderSettings
  blocks: SliderBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Slider({ id, settings, blocks, design }: SliderProps) {
  return (
    <section id={id} className={`minimog-section minimog-slider`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: slider (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}