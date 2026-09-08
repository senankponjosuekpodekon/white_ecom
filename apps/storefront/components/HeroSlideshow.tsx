"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Slide = {
  title: string
  subtitle?: string
  cta?: string
  ctaHref?: string
  image?: string
}

export function HeroSlideshow({ slides, locale }: { slides: Slide[]; locale: string }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const slide = slides[index] ?? slides[0]
  if (!slide) return null

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: slide.image ? `url(${slide.image})` : undefined,
          background: slide.image
            ? undefined
            : "linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center text-white">
        <h2 className="text-3xl sm:text-5xl font-heading font-bold mb-4">{slide.title}</h2>
        {slide.subtitle && (
          <p className="text-lg mb-6 opacity-90">{slide.subtitle}</p>
        )}
        {slide.cta && (
          <Link
            href={`/${locale}${slide.ctaHref ?? "/products"}`}
            className="inline-block px-8 py-3 rounded-lg bg-white text-black font-medium hover:opacity-90 transition-opacity"
          >
            {slide.cta}
          </Link>
        )}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {slides.map((s, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${i === index ? "w-6 bg-white" : "w-2 bg-white/50"}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
