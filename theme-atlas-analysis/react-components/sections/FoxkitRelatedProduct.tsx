export type FoxkitRelatedProductSettings = {
}

export type FoxkitRelatedProductProps = BaseSectionProps & {
  settings: FoxkitRelatedProductSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function FoxkitRelatedProduct({ id, settings, blocks, design }: FoxkitRelatedProductProps) {
  return (
    <section id={id} className={`minimog-section minimog-foxkit-related-product`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: foxkit-related-product (design: {design ?? "default"})</p>
      </div>
    </section>
  )
}