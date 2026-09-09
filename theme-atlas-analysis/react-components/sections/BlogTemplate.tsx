export type BlogTemplateSettings = {
  /** Container type */
  container?: string
  /** Show sidebar */
  show_sidebar?: boolean
  /** Placement */
  layout?: string
  /** Layout */
  view?: string
  /** Posts to show */
  blog_list?: number
  /** Posts per row */
  show_item_per_row?: number
}

export type BlogTemplateBlocks = {
  categories?: {
    /** Title */
    title?: string
    /** Select categories menu */
    list_blog: string
  }
  tags?: {
    /** Title */
    title?: string
  }
  recent_post?: {
    /** Title */
    title?: string
    /** Blog Name */
    sidebar_recent_blog_name: string
    /** Post Count — Integer */
    sidebar_recent_blog_count?: string
    /** Show tags */
    blog_show_tags?: boolean
    /** Show author */
    blog_show_author?: boolean
    /** Show date */
    blog_show_date?: boolean
    /** Show excerpt */
    show_excerpt?: boolean
    /** Truncate Excerpt */
    truncate_excerpt?: boolean
    /** Show Words — Integer */
    truncate?: string
    /** Last Symbols */
    truncate_last_symbols?: string
  }
}

export type BlogTemplateProps = BaseSectionProps & {
  settings: BlogTemplateSettings
  blocks: BlogTemplateBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function BlogTemplate({ id, settings, blocks, design }: BlogTemplateProps) {
  return (
    <section id={id} className={`minimog-section minimog-blog-template`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: blog-template (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}