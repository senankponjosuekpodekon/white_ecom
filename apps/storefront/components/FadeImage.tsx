"use client"

import { useState } from "react"
import Image, { ImageProps } from "next/image"

type FadeImageProps = Omit<ImageProps, "onLoadingComplete" | "alt"> & {
  alt: string
  onLoadingComplete?: () => void
}

export function FadeImage({
  alt,
  className = "",
  onLoadingComplete,
  ...props
}: FadeImageProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 z-10 animate-pulse bg-[var(--color-surface)]" />
      )}
      <Image
        {...props}
        alt={alt}
        className={`
          ${loaded ? "opacity-100" : "opacity-0"}
          transition-opacity duration-500
          ${className}
        `}
        onLoadingComplete={() => {
          setLoaded(true)
          onLoadingComplete?.()
        }}
      />
    </div>
  )
}
