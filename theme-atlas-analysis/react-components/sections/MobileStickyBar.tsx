export type MobileStickyBarSettings = {
  /** Show sticky bar — Show a sticky bar on mobile to let customers shopping easier. Switch to mobile view to see it. */
  show_mobile_sticky?: boolean
  /** Show home icon */
  show_home_icon?: boolean
  /** Show products listing */
  show_collection_icon?: boolean
  /** Show cart icon */
  show_cart_icon?: boolean
  /** Show search icon */
  show_search_icon?: boolean
  /** Show account icon — Customers account must be enabled. See [Enabling customer accounts](https://help.shopify.com/en/manual/checkout-settings/customer-accounts) */
  show_account_icon?: boolean
  /** Show wishlist icon — Wishlist page must be specified */
  show_wishlist_icon?: boolean
}

export type MobileStickyBarProps = BaseSectionProps & {
  settings: MobileStickyBarSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function MobileStickyBar({ id, settings, blocks, design }: MobileStickyBarProps) {
  return (
    <section id={id} className={`minimog-section minimog-mobile-sticky-bar`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: mobile-sticky-bar (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}