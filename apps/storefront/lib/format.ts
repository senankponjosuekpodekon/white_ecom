export function formatPrice(amount: number, currency: string, locale = "fr-FR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}
