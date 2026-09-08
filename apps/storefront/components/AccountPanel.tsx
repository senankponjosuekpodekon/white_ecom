"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { medusaClient } from "@/lib/medusa-client"
import type { Locale } from "@/i18n"

export function AccountPanel({ locale }: { locale: Locale }) {
  const t = useTranslations("account")
  const router = useRouter()
  const [customer, setCustomer] = useState<{ email: string; first_name: string | null; last_name: string | null } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medusaClient.store.customer
      .retrieve()
      .then(({ customer }: { customer: { email: string; first_name: string | null; last_name: string | null } }) =>
        setCustomer(customer)
      )
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await medusaClient.auth.logout()
    router.push(`/${locale}/login`)
  }

  if (loading) {
    return <p className="p-8 text-[var(--color-muted)]">{t("loading")}</p>
  }

  if (!customer) {
    return (
      <div className="max-w-md mx-auto p-8 section-gradient min-h-screen">
        <h1 className="text-2xl font-heading font-bold mb-4 text-[var(--color-foreground)]">
          {t("accountTitle")}
        </h1>
        <p className="text-[var(--color-muted)] mb-4">{t("notLogged")}</p>
        <div className="flex gap-4">
          <Link href={`/${locale}/login`} className="btn-primary">
            {t("login")}
          </Link>
          <Link href={`/${locale}/register`} className="btn-primary">
            {t("register")}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 section-gradient min-h-screen">
      <h1 className="text-2xl font-heading font-bold mb-6 text-[var(--color-foreground)]">
        {t("accountTitle")}
      </h1>
      <div className="card-design p-6 mb-6">
        <p className="text-[var(--color-foreground)] font-medium">
          {customer.first_name} {customer.last_name}
        </p>
        <p className="text-[var(--color-muted)]">{customer.email}</p>
      </div>
      <button onClick={handleLogout} className="btn-primary">
        {t("logout")}
      </button>
    </div>
  )
}
