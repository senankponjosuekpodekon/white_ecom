import { useState } from "react"
import { Button } from "@medusajs/ui"

type AiAction =
  | "generate"
  | "description"
  | "seo"
  | "translate"
  | "category-suggest"
  | "email-order"
  | "review-summary"
  | "legal-page"
  | "alt-tags"

interface AiGenerateButtonProps {
  type: AiAction
  prompt: string
  context?: string
  system?: string
  sourceLocale?: string
  targetLocale?: string
  label?: string
  disabled?: boolean
  onResult: (text: string) => void
  onError?: (message: string) => void
}

export function AiGenerateButton({
  type,
  prompt,
  context,
  system,
  sourceLocale,
  targetLocale,
  label,
  disabled,
  onResult,
  onError,
}: AiGenerateButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch("/admin/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          prompt: prompt.trim(),
          context,
          system,
          sourceLocale,
          targetLocale,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error ?? "AI generation failed")
      }
      onResult(data.text ?? "")
    } catch (err) {
      onError?.((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="secondary"
      size="small"
      isLoading={loading}
      disabled={disabled || loading}
      onClick={handleClick}
    >
      {label ?? "Générer"}
    </Button>
  )
}
