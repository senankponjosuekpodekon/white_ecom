"use client"

import { useState } from "react"

export function ProductTabs({
  tabs,
}: {
  tabs: Array<{ label: string; content: string }>
}) {
  const [active, setActive] = useState(0)
  const visible = tabs.filter((t) => t.content.trim().length > 0)
  if (visible.length === 0) return null
  const current = Math.min(active, visible.length - 1)

  return (
    <div className="card-design overflow-hidden">
      <div className="flex border-b border-[var(--color-border)]">
        {visible.map((tab, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActive(index)}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              index === current
                ? "border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-4 text-[var(--color-muted)] leading-relaxed whitespace-pre-line">
        {visible[current].content}
      </div>
    </div>
  )
}
