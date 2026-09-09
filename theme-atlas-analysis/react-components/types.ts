export type BaseSectionProps = {
  id: string
  settings: Record<string, unknown>
  blocks?: Record<string, Record<string, unknown>>
  design?: string
}
