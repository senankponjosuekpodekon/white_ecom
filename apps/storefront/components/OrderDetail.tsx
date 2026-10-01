"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { medusaClientAuth } from "@/lib/medusa-client"
import { formatPrice } from "@/lib/format"
import type { Locale } from "@/i18n"

type OrderDetailData = {
  id: string
  display_id?: number
  status: string
  fulfillment_status?: string
  payment_status?: string
  total: number
  subtotal?: number
  shipping_total?: number
  tax_total?: number
  currency_code: string
  created_at: string
  email?: string
  shipping_address?: {
    first_name?: string
    last_name?: string
    address_1?: string
    postal_code?: string
    city?: string
    country_code?: string
  }
  items?: Array<{
    id: string
    title?: string
    quantity?: number
    unit_price?: number
    thumbnail?: string
  }>
}

const ORDER_FIELDS =
  "id,display_id,status,fulfillment_status,payment_status,total,subtotal,shipping_total,tax_total,currency_code,created_at,email,*items,*shipping_address"

export function OrderDetail({
  locale,
  orderId,
}: {
  locale: Locale
  orderId: string
}) {
  const t = useTranslations("account")
  const [order, setOrder] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    medusaClientAuth.client
      .fetch<{ order: OrderDetailData }>(
        `/store/orders/${orderId}?fields=${encodeURIComponent(ORDER_FIELDS)}`
      )
      .then((data) => setOrder(data.order))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return <p className="p-8 text-[var(--color-muted)]">{t("loading")}</p>
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto p-8 section-gradient min-h-screen">
        <p className="text-[var(--color-muted)] mb-4">{t("orderNotFound")}</p>
        <Link href={`/${locale}/account`} className="btn-primary">
          {t("backToAccount")}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-8 section-gradient min-h-screen">
      <Link
        href={`/${locale}/account`}
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-foreground)]"
      >
        ← {t("backToAccount")}
      </Link>
      <h1 className="text-2xl font-heading font-bold mt-2 mb-6 text-[var(--color-foreground)]">
        {t("orderTitle")} #{order.display_id ?? order.id.slice(-8)}
      </h1>

      <div className="card-design p-6 mb-6 text-sm">
        <div className="flex justify-between mb-1">
          <span className="text-[var(--color-muted)]">{t("orderDate")}</span>
          <span className="text-[var(--color-foreground)]">
            {order.created_at
              ? new Date(order.created_at).toLocaleDateString(locale)
              : "-"}
          </span>
        </div>
        <div className="flex justify-between mb-1">
          <span className="text-[var(--color-muted)]">{t("orderStatus")}</span>
          <span className="text-[var(--color-foreground)]">{order.status}</span>
        </div>
        {order.fulfillment_status && (
          <div className="flex justify-between mb-1">
            <span className="text-[var(--color-muted)]">
              {t("fulfillmentStatus")}
            </span>
            <span className="text-[var(--color-foreground)]">
              {order.fulfillment_status}
            </span>
          </div>
        )}
        {order.payment_status && (
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">
              {t("paymentStatus")}
            </span>
            <span className="text-[var(--color-foreground)]">
              {order.payment_status}
            </span>
          </div>
        )}
      </div>

      {order.shipping_address && (
        <div className="card-design p-6 mb-6 text-sm">
          <h2 className="font-heading font-semibold mb-2 text-[var(--color-foreground)]">
            {t("shippingAddress")}
          </h2>
          <p className="text-[var(--color-muted)]">
            {order.shipping_address.first_name} {order.shipping_address.last_name}
            <br />
            {order.shipping_address.address_1}
            <br />
            {order.shipping_address.postal_code} {order.shipping_address.city}
            <br />
            {order.shipping_address.country_code?.toUpperCase()}
          </p>
        </div>
      )}

      <div className="card-design p-6 mb-6">
        <h2 className="font-heading font-semibold mb-3 text-[var(--color-foreground)]">
          {t("orderItems")}
        </h2>
        <ul className="divide-y divide-[var(--color-border)] text-sm">
          {(order.items ?? []).map((item) => (
            <li key={item.id} className="flex justify-between py-3">
              <span className="text-[var(--color-foreground)]">
                {item.title} × {item.quantity ?? 1}
              </span>
              <span className="text-[var(--color-muted)]">
                {formatPrice(
                  (item.unit_price ?? 0) * (item.quantity ?? 1),
                  order.currency_code
                )}
              </span>
            </li>
          ))}
        </ul>
        <div className="border-t border-[var(--color-border)] mt-3 pt-3 text-sm space-y-1">
          {order.shipping_total != null && (
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>{t("shippingCost")}</span>
              <span>{formatPrice(order.shipping_total, order.currency_code)}</span>
            </div>
          )}
          {order.tax_total != null && (
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>{t("tax")}</span>
              <span>{formatPrice(order.tax_total, order.currency_code)}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-[var(--color-foreground)] pt-2">
            <span>{t("orderTotal")}</span>
            <span>{formatPrice(order.total, order.currency_code)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
