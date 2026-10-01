"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { medusaClientAuth } from "@/lib/medusa-client"

export type CustomerAddress = {
  id: string
  first_name?: string | null
  last_name?: string | null
  address_1?: string | null
  postal_code?: string | null
  city?: string | null
  country_code?: string | null
  phone?: string | null
  is_default_shipping?: boolean
  is_default_billing?: boolean
}

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  address_1: "",
  postal_code: "",
  city: "",
  country_code: "",
  phone: "",
  is_default_shipping: false,
}

export function AddressBook({
  initialAddresses,
}: {
  initialAddresses: CustomerAddress[]
}) {
  const t = useTranslations("account")
  const [addresses, setAddresses] = useState<CustomerAddress[]>(initialAddresses)
  const [editing, setEditing] = useState<CustomerAddress | "new" | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const openNew = () => {
    setForm({ ...EMPTY_FORM, is_default_shipping: addresses.length === 0 })
    setEditing("new")
    setError(null)
  }

  const openEdit = (address: CustomerAddress) => {
    setForm({
      first_name: address.first_name ?? "",
      last_name: address.last_name ?? "",
      address_1: address.address_1 ?? "",
      postal_code: address.postal_code ?? "",
      city: address.city ?? "",
      country_code: address.country_code ?? "",
      phone: address.phone ?? "",
      is_default_shipping: address.is_default_shipping ?? false,
    })
    setEditing(address)
    setError(null)
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      const body = {
        ...form,
        country_code: form.country_code.toLowerCase() || undefined,
      }
      if (editing === "new") {
        await medusaClientAuth.store.customer.createAddress(body)
      } else if (editing) {
        await medusaClientAuth.store.customer.updateAddress(editing.id, body)
      }
      const { addresses: refreshed } =
        await medusaClientAuth.store.customer.listAddress()
      setAddresses(refreshed ?? [])
      setEditing(null)
    } catch {
      setError(t("unknownError"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError(null)
    try {
      await medusaClientAuth.store.customer.deleteAddress(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch {
      setError(t("unknownError"))
    }
  }

  const field = (
    label: string,
    key: keyof typeof EMPTY_FORM,
    required = false
  ) => (
    <label className="block text-sm">
      <span className="text-[var(--color-muted)]">{label}</span>
      <input
        required={required}
        value={String(form[key] ?? "")}
        onChange={(e) =>
          setForm((f) => ({ ...f, [key]: e.target.value }))
        }
        className="mt-1 w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-foreground)]"
      />
    </label>
  )

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold text-[var(--color-foreground)]">
          {t("addressesTitle")}
        </h2>
        {!editing && (
          <button onClick={openNew} className="btn-primary text-sm">
            {t("addAddress")}
          </button>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 mb-3" role="alert">
          {error}
        </p>
      )}

      {editing ? (
        <form
          className="card-design p-6 space-y-3"
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            {field(t("firstName"), "first_name", true)}
            {field(t("lastName"), "last_name", true)}
          </div>
          {field(t("addressLine"), "address_1", true)}
          <div className="grid grid-cols-2 gap-3">
            {field(t("postalCode"), "postal_code", true)}
            {field(t("city"), "city", true)}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {field(t("country"), "country_code", true)}
            {field(t("phone"), "phone")}
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <input
              type="checkbox"
              checked={form.is_default_shipping}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  is_default_shipping: e.target.checked,
                }))
              }
            />
            {t("defaultShipping")}
          </label>
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {saving ? t("loading") : t("saveAddress")}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="text-sm text-[var(--color-muted)] hover:underline"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <p className="text-[var(--color-muted)] mb-2">{t("noAddresses")}</p>
      ) : (
        <ul className="card-design divide-y divide-[var(--color-border)] text-sm">
          {addresses.map((address) => (
            <li key={address.id} className="px-4 py-3 flex justify-between gap-4">
              <div className="text-[var(--color-foreground)]">
                <p>
                  {address.first_name} {address.last_name}
                  {address.is_default_shipping && (
                    <span className="ml-2 text-xs text-[var(--color-primary)]">
                      {t("defaultBadge")}
                    </span>
                  )}
                </p>
                <p className="text-[var(--color-muted)]">
                  {address.address_1}, {address.postal_code} {address.city},{" "}
                  {address.country_code?.toUpperCase()}
                </p>
              </div>
              <div className="flex gap-3 items-start shrink-0">
                <button
                  onClick={() => openEdit(address)}
                  className="text-[var(--color-muted)] hover:underline"
                >
                  {t("editAddress")}
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className="text-red-500 hover:underline"
                >
                  {t("deleteAddress")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
