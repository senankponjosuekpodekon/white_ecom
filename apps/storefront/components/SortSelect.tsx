"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function SortSelect({
  options,
  value,
}: {
  options: Array<{ value: string; label: string }>
  value: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(searchParams.toString())
    if (event.target.value === "default") {
      next.delete("sort")
    } else {
      next.set("sort", event.target.value)
    }
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-sm"
      aria-label="Sort"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}
