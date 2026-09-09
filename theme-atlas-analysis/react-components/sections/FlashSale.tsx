export type FlashSaleSettings = {
}

export type FlashSaleProps = BaseSectionProps & {
  settings: FlashSaleSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function FlashSale({ id, settings, blocks, design }: FlashSaleProps) {
  return (
    <section id={id} className={`minimog-section minimog-flash-sale`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: flash-sale (design: {design ?? "default"})</p>
      </div>
    </section>
  )
}