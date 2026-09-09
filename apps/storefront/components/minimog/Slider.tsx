"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { MinimogSectionProps, MinimogBlock } from "./types"

type SlideSettings = {
  background?: string
  mb_background?: string
  content_in_container?: boolean
  content_position?: string
  text_alignment?: string
  text_size?: string
  text_color?: string
  subheading?: string
  title?: string
  description?: string
  image_link?: string
  button_text?: string
  button_link?: string
  button_style?: string
  button_size?: string
  second_button_text?: string
  second_button_link?: string
  second_button_style?: string
  second_button_size?: string
}

type SliderSettings = {
  container?: string
  slideshow_height?: string
  show_overlay?: boolean
  dots_position?: string
  dots_color?: string
  show_dots?: boolean
  show_arrows?: boolean
  autorotate?: boolean
  autorotate_speed?: number
  use_content_above?: boolean
  custom_class?: string
  animations?: string
}

type Slide = MinimogBlock & { type: string; settings: SlideSettings }

const FALLBACK_IMAGE = "https://placehold.co/1920x900/111827/FFFFFF?text=Hero+Slide"

function safeImage(url?: string) {
  if (!url || url.startsWith("shopify://")) {
    return FALLBACK_IMAGE
  }
  return url
}

function positionToClass(position?: string) {
  if (!position) return "items-center justify-center"
  const [h, v] = position.split(" ")
  const mapH: Record<string, string> = { left: "items-start", center: "items-center", right: "items-end" }
  const mapV: Record<string, string> = { top: "justify-start", middle: "justify-center", bottom: "justify-end" }
  return `${mapV[v] || "justify-center"} ${mapH[h] || "items-center"}`
}

function alignToClass(align?: string) {
  if (align === "left") return "text-left"
  if (align === "right") return "text-right"
  return "text-center"
}

function sizeToClass(size?: string) {
  if (size === "small") return "text-2xl"
  if (size === "large") return "text-6xl"
  return "text-4xl"
}

export function MinimogSlider({
  id,
  settings,
  blocks,
  blockOrder,
  design,
}: MinimogSectionProps) {
  const rawSettings = settings as SliderSettings
  const rawBlocks = blocks as Record<string, Slide> | undefined
  const ordered: Slide[] = (blockOrder ?? Object.keys(rawBlocks ?? {}))
    .map((key) => rawBlocks?.[key])
    .filter((b): b is Slide => !!b && b.type === "slider_item")

  const [active, setActive] = useState(0)
  const {
    slideshow_height = "large",
    show_overlay = true,
    show_dots = true,
    show_arrows = false,
    autorotate = false,
    autorotate_speed = 5,
  } = rawSettings ?? {}

  const heightClass =
    slideshow_height === "fullscreen"
      ? "h-screen"
      : slideshow_height === "large"
      ? "h-[600px]"
      : "h-[400px]"

  useEffect(() => {
    if (!autorotate || ordered.length <= 1) return
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % ordered.length)
    }, (autorotate_speed ?? 5) * 1000)
    return () => clearInterval(interval)
  }, [autorotate, autorotate_speed, ordered.length])

  const current = ordered[active]
  if (!current) return null

  const s = current.settings ?? {}
  const image = safeImage(s.background)
  const mobileImage = safeImage(s.mb_background ?? s.background)
  const textColor = s.text_color === "white" ? "text-white" : "text-gray-900"

  return (
    <section
      id={id}
      className={`relative w-full overflow-hidden ${heightClass} minimog-slider design-${design ?? "default"}`}
    >
      <Image
        src={image}
        alt={s.title ?? "Slide"}
        fill
        className="object-cover hidden md:block"
        sizes="100vw"
        unoptimized
        priority
      />
      <Image
        src={mobileImage}
        alt={s.title ?? "Slide"}
        fill
        className="object-cover md:hidden"
        sizes="100vw"
        unoptimized
        priority
      />
      {show_overlay && (
        <div className="absolute inset-0 bg-black/30" />
      )}
      <div className={`absolute inset-0 container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${positionToClass(s.content_position)}`}>
        <div className={`max-w-3xl ${alignToClass(s.text_alignment)} ${textColor}`}>
          {s.subheading && (
            <div
              className="text-sm md:text-base font-medium uppercase tracking-wide mb-3"
              dangerouslySetInnerHTML={{ __html: s.subheading }}
            />
          )}
          {s.title && (
            <h2
              className={`font-bold mb-4 ${sizeToClass(s.text_size)}`}
              dangerouslySetInnerHTML={{ __html: s.title }}
            />
          )}
          {s.description && (
            <div
              className="text-base md:text-lg mb-6 opacity-90"
              dangerouslySetInnerHTML={{ __html: s.description }}
            />
          )}
          <div className={`flex flex-wrap gap-4 ${s.text_alignment === "right" ? "justify-end" : s.text_alignment === "left" ? "justify-start" : "justify-center"}`}>
            {s.button_text && s.button_link && (
              <Link
                href={s.button_link}
                className="inline-block px-6 py-3 bg-white text-gray-900 font-medium rounded hover:bg-gray-100 transition"
              >
                {s.button_text}
              </Link>
            )}
            {s.second_button_text && s.second_button_link && (
              <Link
                href={s.second_button_link}
                className="inline-block px-6 py-3 border border-white text-white font-medium rounded hover:bg-white/10 transition"
              >
                {s.second_button_text}
              </Link>
            )}
          </div>
        </div>
      </div>
      {show_arrows && ordered.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => setActive((prev) => (prev - 1 + ordered.length) % ordered.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setActive((prev) => (prev + 1) % ordered.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 rounded-full text-white hover:bg-white/30"
          >
            ›
          </button>
        </>
      )}
      {show_dots && ordered.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {ordered.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={`w-3 h-3 rounded-full ${
                idx === active ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
