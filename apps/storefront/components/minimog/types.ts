import type { ReactNode } from "react"

export type MinimogSection = {
  id: string
  type: string
  enabled?: boolean
  design?: string
  settings?: Record<string, unknown>
  blocks?: Record<string, MinimogBlock>
  block_order?: string[]
}

export type MinimogBlock = {
  type: string
  disabled?: boolean
  settings?: Record<string, unknown>
}

export type MinimogSectionProps = {
  id: string
  settings: Record<string, unknown>
  blocks?: Record<string, MinimogBlock>
  blockOrder?: string[]
  design?: string
  locale?: string
}

export type MinimogRegistry = Record<
  string,
  (props: MinimogSectionProps) => ReactNode
>
