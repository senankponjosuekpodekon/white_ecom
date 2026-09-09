import type { ReactNode } from "react"
import type { MinimogSection, MinimogBlock } from "@/lib/content"

export type { MinimogSection, MinimogBlock }

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
