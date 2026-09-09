export type BlogPostsSettings = {
  /** Heading */
  heading?: string
  /** Heading size */
  heading_size?: string
  /** Subheading */
  subheading: string
  /** Description */
  description: string
  /** Text alignment */
  header_alignment?: string
  /** Container type */
  container?: string
  /** Color scheme */
  color_scheme: string
  /** Blog */
  blog: string
  /** Posts to show */
  limit?: number
  /** Posts per row */
  column?: number
  /** Column gap */
  column_gap?: number
  /** Column gap on mobile */
  mobile_gap?: number
  /** Image aspect ratio */
  article_image_aspect_ratio?: string
  /** Content alignment */
  article_align_content?: string
  /** Show tags */
  article_show_tags?: boolean
  /** Show publised date */
  article_show_date?: boolean
  /** Show excerpt */
  article_show_excerpt?: boolean
  /** Show read more link */
  article_show_button?: boolean
  /** Show button on header */
  show_button_on_header?: boolean
  /** Button link */
  button_link: string
  /** Button label — Leave it blank to hide */
  button_text?: string
  /** Button style */
  button_style?: string
  /** Button size */
  button_size?: string
  /** Enable horizontal scroll */
  use_scroll_mobile?: boolean
  /** Padding Top */
  padding_top?: number
  /** Padding Bottom */
  padding_bottom?: number
  /** Custom classes */
  custom_class: string
  /** Visible in the view animation */
  animations?: string
}

export type BlogPostsProps = BaseSectionProps & {
  settings: BlogPostsSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function BlogPosts({ id, settings, blocks, design }: BlogPostsProps) {
  return (
    <section id={id} className={`minimog-section minimog-blog-posts`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: blog-posts (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}