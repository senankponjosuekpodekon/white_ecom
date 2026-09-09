export type CustomLiquidSettings = {
  /** Custom liquid */
  custom_liquid: unknown
  /** Custom classes */
  custom_class: string
}

export type CustomLiquidProps = BaseSectionProps & {
  settings: CustomLiquidSettings
  blocks?: Record<string, never>
  design?: string
}

import { BaseSectionProps } from "../types"

export function CustomLiquid({ id, settings, blocks, design }: CustomLiquidProps) {
  return (
    <section id={id} className={`minimog-section minimog-custom-liquid`}>
      <div className="container">
        <p className="text-sm text-gray-500">Section: custom-liquid (design: {design ?? "default"})</p>
        <pre className="text-xs">{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </section>
  )
}