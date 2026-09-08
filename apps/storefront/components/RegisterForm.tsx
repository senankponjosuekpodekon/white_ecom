"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { medusaClient } from "@/lib/medusa-client"
import type { Locale } from "@/i18n"

export function RegisterForm({ locale }: { locale: Locale }) {
  const t = useTranslations("account")
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await medusaClient.auth.register("customer", "emailpass", {
        email: form.email,
        password: form.password,
      })

      const token =
        typeof result === "string" ? result : (result as { token?: string }).token

      await medusaClient.store.customer.create(
        {
          email: form.email,
          first_name: form.firstName,
          last_name: form.lastName,
        },
        {},
        token ? { Authorization: `Bearer ${token}` } : {}
      )

      await medusaClient.auth.login("customer", "emailpass", {
        email: form.email,
        password: form.password,
      })

      router.push(`/${locale}/account`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("unknownError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 section-gradient min-h-screen">
      <h1 className="text-2xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
        {t("registerTitle")}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
            {t("firstName")}
          </label>
          <input
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
            {t("lastName")}
          </label>
          <input
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
            {t("email")}
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-[var(--color-foreground)]">
            {t("password")}
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full p-2 rounded border border-[var(--color-border)] bg-[var(--color-surface)]"
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary"
        >
          {loading ? "..." : t("register")}
        </button>
      </form>
      <p className="mt-4 text-sm text-[var(--color-muted)]">
        {t("alreadyAccount")}{" "}
        <Link href={`/${locale}/login`} className="text-[var(--color-primary)] underline">
          {t("login")}
        </Link>
      </p>
    </div>
  )
}
