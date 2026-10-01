"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { medusaClient } from "@/lib/medusa-client"

export function OnboardingForm() {
  const t = useTranslations("onboarding")
  const [form, setForm] = useState({ name: "", slug: "", email: "", domain: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "slug" ? value.toLowerCase() : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await medusaClient.client.fetch("/store/onboarding", {
        method: "POST",
        body: {
          name: form.name,
          slug: form.slug,
          email: form.email,
          domain: form.domain || undefined,
        },
      })
      setSent(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : ""
      setError(message.includes("already taken") ? t("errorTaken") : t("error"))
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-md mx-auto p-8 section-gradient min-h-screen">
        <h1 className="text-2xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
          {t("successTitle")}
        </h1>
        <p className="text-[var(--color-muted)]">{t("successText")}</p>
      </div>
    )
  }

  const inputClass =
    "w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
  const labelClass =
    "block text-sm font-medium mb-1 text-[var(--color-foreground)]"

  return (
    <div className="max-w-md mx-auto p-8 section-gradient min-h-screen">
      <h1 className="text-2xl font-heading font-bold mb-2 text-[var(--color-foreground)]">
        {t("title")}
      </h1>
      <p className="text-sm text-[var(--color-muted)] mb-6">{t("subtitle")}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ob-name" className={labelClass}>
            {t("name")}
          </label>
          <input
            id="ob-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder={t("namePlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-slug" className={labelClass}>
            {t("slug")}
          </label>
          <input
            id="ob-slug"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            pattern="[a-z0-9-]+"
            minLength={3}
            maxLength={48}
            placeholder={t("slugPlaceholder")}
            className={inputClass}
          />
          <p className="text-xs text-[var(--color-muted)] mt-1">{t("slugHelp")}</p>
        </div>
        <div>
          <label htmlFor="ob-email" className={labelClass}>
            {t("email")}
          </label>
          <input
            id="ob-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder={t("emailPlaceholder")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="ob-domain" className={labelClass}>
            {t("domain")}
          </label>
          <input
            id="ob-domain"
            name="domain"
            value={form.domain}
            onChange={handleChange}
            placeholder={t("domainPlaceholder")}
            className={inputClass}
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full btn-primary">
          {loading ? t("sending") : t("submit")}
        </button>
      </form>
    </div>
  )
}
