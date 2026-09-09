export type ArticleSettings = {
  /** Container type */
  container?: string
  /** Show sidebar */
  sidebar_show?: boolean
  /** Position */
  sidebar_position?: string
  /** Design */
  design?: string
  /** Show breadcrumb */
  blog_show_breadcrumb?: boolean
  /** Show author */
  blog_show_author?: boolean
  /** Show date */
  blog_show_date?: boolean
  /** Show tags */
  blog_show_tags?: boolean
  /** Show social */
  blog_show_social?: boolean
  /** Show comments */
  blog_show_comment?: boolean
  /** Show related articles */
  show_related_articles?: boolean
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
}

export type ArticleBlocks = {
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

export type ArticleProps = BaseSectionProps & {
  settings: ArticleSettings
  blocks: ArticleBlocks
  design?: string
}

import { BaseSectionProps } from "../types"

export function Article({ id, settings, blocks, design }: ArticleProps) {
  return (
    <section id={id} className={`minimog-section minimog-article`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: article (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
        {{blocks && <pre className="text-xs">{{JSON.stringify(blocks, null, 2)}}</pre>}}
      </div>
    </section>
  )
}