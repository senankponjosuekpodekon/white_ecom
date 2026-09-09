import Image from "next/image"
import Link from "next/link"
import { getProducts } from "@/lib/get-products"
import { ProductCard } from "./ProductCard"
import { Hero } from "./Hero"
import { Features } from "./Features"
import { ValueProposition } from "./ValueProposition"
import { SocialProof } from "./SocialProof"
import { CTA } from "./CTA"
import { HeroSlideshow } from "./HeroSlideshow"
import type { LocalizedContent, HomePageSection } from "@/lib/content"
import type { DesignFullConfig } from "@/lib/design"
import type { Product } from "@/lib/types"
import type { Locale } from "@/i18n"

const defaultSections: HomePageSection[] = [
  { type: "hero", enabled: true },
  { type: "marquee", enabled: true },
  { type: "collections", enabled: true },
  { type: "featured_products", enabled: true },
  { type: "features", enabled: true },
  { type: "value_proposition", enabled: true },
  { type: "social_proof", enabled: true },
  { type: "cta", enabled: true },
]

type Slide = {
  title: string
  subtitle?: string
  cta?: string
  ctaHref?: string
  image?: string
}

export async function HomeSections({
  locale,
  content,
  design,
  t,
}: {
  locale: Locale
  content: LocalizedContent
  design: DesignFullConfig
  t: (key: string) => string
}) {
  const sections = (
    content.homePage?.sections ?? defaultSections
  ).filter((s) => s.enabled !== false)

  let featuredProducts: Product[] = []
  const featured = sections.find((s) => s.type === "featured_products")
  if (featured) {
    const opts = featured.options ?? {}
    const limit = Number(opts.limit ?? 8)
    featuredProducts = await getProducts(limit)
  }

  return (
    <>
      {sections.map((section) => {
        const opts = section.options ?? {}
        switch (section.type) {
          case "hero": {
            const slides = (opts.slides as Slide[] | undefined) ?? []
            if (slides.length === 0) return null
            if (slides.length === 1) {
              const s = slides[0]
              return (
                <Hero
                  key="hero"
                  locale={locale}
                  design={design}
                  content={{ title: s.title, subtitle: s.subtitle ?? "", cta: s.cta ?? "", image: s.image ?? "" }}
                />
              )
            }
            return <HeroSlideshow key="hero" slides={slides} locale={locale} />
          }
          case "marquee": {
            const items = (opts.items as Array<{ text?: string }> | undefined) ?? []
            if (items.length === 0) return null
            const doubled = [...items, ...items]
            return (
              <div
                key="marquee"
                className="overflow-hidden border-y border-[var(--color-border)] py-4 bg-[var(--color-surface)]"
              >
                <div className="marquee-track">
                  {doubled.map((item, i) => (
                    <span
                      key={i}
                      className="text-lg font-medium text-[var(--color-foreground)] whitespace-nowrap"
                    >
                      {item.text}
                    </span>
                  ))}
                </div>
              </div>
            )
          }
          case "collections": {
            const heading = (opts.heading as string) ?? ""
            const items =
              (opts.items as Array<{ title?: string; image?: string; href?: string }> | undefined) ??
              []
            if (items.length === 0) return null
            return (
              <section key="collections" className="section-gradient py-12">
                <div className="max-w-7xl mx-auto px-8">
                  {heading && (
                    <h2 className="text-2xl font-heading font-bold mb-6 text-center text-[var(--color-foreground)]">
                      {heading}
                    </h2>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                      <Link
                        key={i}
                        href={`/${locale}${item.href ?? "/products"}`}
                        className="group text-center"
                      >
                        <div className="relative aspect-square rounded-full overflow-hidden bg-[var(--color-surface)] flex items-center justify-center">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.title ?? ""}
                              fill
                              unoptimized
                              loading="lazy"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-4xl text-[var(--color-muted)]">
                              {item.title?.charAt(0) ?? "•"}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 font-medium text-[var(--color-foreground)]">
                          {item.title}
                        </h3>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )
          }
          case "featured_products": {
            const heading = (opts.heading as string) ?? ""
            if (featuredProducts.length === 0) return null
            return (
              <section key="featured" className="py-12">
                <div className="max-w-7xl mx-auto px-8">
                  {heading && (
                    <h2 className="text-2xl font-heading font-bold mb-8 text-center text-[var(--color-foreground)]">
                      {heading}
                    </h2>
                  )}
                  <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                      <li key={product.id}>
                        <ProductCard product={product} locale={locale} feed={design.feed} />
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-8">
                    <Link href={`/${locale}/products`} className="btn-primary">
                      {t("viewAll")}
                    </Link>
                  </div>
                </div>
              </section>
            )
          }
          case "features":
            return (
              <Features
                key="features"
                title={t("featuresTitle")}
                features={content.features}
              />
            )
          case "value_proposition":
            return <ValueProposition key="vp" content={content.valueProposition} />
          case "social_proof":
            return <SocialProof key="sp" content={content.socialProof} />
          case "cta":
            return <CTA key="cta" locale={locale} content={content.cta} />
          default:
            return null
        }
      })}
    </>
  )
}
