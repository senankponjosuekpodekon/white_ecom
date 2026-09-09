import Image from "next/image"
import Link from "next/link"
import type { Locale } from "@/i18n"
import { getCart } from "@/lib/cart"
import type { MinimogSectionProps } from "./types"

type HeaderSettings = {
  sticky_header?: boolean
  transparent_header?: boolean
  header_top?: string
}

export async function MinimogHeader({
  id,
  settings,
  locale: localeProp,
}: MinimogSectionProps) {
  const rawSettings = settings as HeaderSettings
  const { sticky_header = true } = rawSettings ?? {}
  const locale = (localeProp ?? "fr") as Locale
  const cart = await getCart()
  const cartCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0

  return (
    <header
      id={id}
      className={`w-full z-50 bg-white border-b border-gray-200 ${
        sticky_header ? "sticky top-0" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}/minimog`} className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Atlas Container"
              width={160}
              height={40}
              className="h-8 w-auto object-contain"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = "none"
              }}
            />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href={`/${locale}/minimog/products`} className="text-sm font-medium text-gray-700 hover:text-black">
              Container
            </Link>
            <Link href={`/${locale}/minimog/collections`} className="text-sm font-medium text-gray-700 hover:text-black">
              Collections
            </Link>
            <Link href={`/${locale}/contact`} className="text-sm font-medium text-gray-700 hover:text-black">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/minimog/cart`} className="relative text-sm font-medium text-gray-700 hover:text-black">
              Panier
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-gray-900 text-[10px] text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link href={`/${locale}/account`} className="text-sm font-medium text-gray-700 hover:text-black">
              Compte
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
