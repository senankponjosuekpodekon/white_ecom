import Image from "next/image"
import Link from "next/link"
import { removeFromCartAction, updateLineItemAction } from "@/lib/actions/cart"
import { formatPrice } from "@/lib/format"
import type { Cart } from "@/lib/types"
import type { Locale } from "@/i18n"

export function MinimogCart({ cart, locale }: { cart: Cart | null; locale: Locale }) {
  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Warenkorb</h1>
          <p className="text-gray-500 mb-6">Ihr Warenkorb ist leer.</p>
          <Link
            href={`/${locale}/minimog/products`}
            className="inline-block px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
          >
            Weiter einkaufen
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Warenkorb</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-lg"
              >
                <div className="relative h-24 w-24 shrink-0 bg-gray-100 rounded overflow-hidden">
                  {item.product?.thumbnail ? (
                    <Image
                      src={item.product.thumbnail}
                      alt={item.product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                      {item.product?.title.charAt(0).toUpperCase() ?? "?"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">
                    {item.product?.title ?? item.title}
                  </h2>
                  <p className="text-sm text-gray-500">{item.variant.title}</p>
                  <p className="mt-1 font-bold text-gray-900">
                    {formatPrice(item.unit_price, cart.currency_code)}
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <form action={updateLineItemAction} className="flex items-center gap-2">
                      <input type="hidden" name="lineItemId" value={item.id} />
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        max={99}
                        defaultValue={item.quantity}
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                      >
                        Aktualisieren
                      </button>
                    </form>
                    <form action={removeFromCartAction}>
                      <input type="hidden" name="lineItemId" value={item.id} />
                      <button
                        type="submit"
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Entfernen
                      </button>
                    </form>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 border border-gray-200 rounded-lg bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Zusammenfassung</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Zwischensumme</span>
                <span className="font-bold text-gray-900">{formatPrice(cart.total, cart.currency_code)}</span>
              </div>
              <Link
                href={`/${locale}/checkout`}
                className="block w-full text-center mt-6 px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition"
              >
                Zur Kasse
              </Link>
              <Link
                href={`/${locale}/minimog/products`}
                className="block w-full text-center mt-3 px-6 py-3 border border-gray-300 rounded hover:bg-white transition"
              >
                Weiter einkaufen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
