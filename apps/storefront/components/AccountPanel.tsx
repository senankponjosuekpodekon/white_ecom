"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { medusaClientAuth } from "@/lib/medusa-client"
import { formatPrice } from "@/lib/format"
import type { Locale } from "@/i18n"

type Customer = {
  email: string
  first_name: string | null
  last_name: string | null
}

type OrderRow = {
  id: string
  display_id?: number
  status: string
  total: number
  currency_code: string
  created_at: string
}

export function AccountPanel({ locale }: { locale: Locale }) {
  const t = useTranslations("account")
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    medusaClientAuth.store.customer
      .retrieve()
      .then(({ customer }: { customer: Customer }) => {
        setCustomer(customer)
        return medusaClientAuth.client
          .fetch<{ orders: OrderRow[] }>(
            "/store/orders?order=-created_at&limit=20&fields=id,display_id,status,total,currency_code,created_at"
          )
          .then((data) => setOrders(data.orders ?? []))
          .catch(() => setOrders([]))
      })
      .catch(() => setCustomer(null))
      .finally(() => setLoading(false))
  }, [])

  const handleLogout = async () => {
    await medusaClientAuth.auth.logout()
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

      <h2 className="text-xl font-heading font-semibold mb-4 text-[var(--color-foreground)]">
        {t("ordersTitle")}
      </h2>
      {orders.length === 0 ? (
        <p className="text-[var(--color-muted)] mb-6">{t("noOrders")}</p>
      ) : (
        <div className="card-design overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">{t("orderDate")}</th>
                <th className="px-4 py-3">{t("orderStatus")}</th>
                <th className="px-4 py-3">{t("orderTotal")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-[var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-3 text-[var(--color-foreground)]">
                    <Link
                      href={`/${locale}/account/orders/${order.id}`}
                      className="underline hover:text-[var(--color-primary)]"
                    >
                      {order.display_id ?? order.id.slice(-8)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString(locale)
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">
                    {order.status}
                  </td>
                  <td className="px-4 py-3 text-[var(--color-foreground)]">
                    {formatPrice(order.total, order.currency_code)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button onClick={handleLogout} className="btn-primary">
        {t("logout")}
      </button>
    </div>
  )
}
