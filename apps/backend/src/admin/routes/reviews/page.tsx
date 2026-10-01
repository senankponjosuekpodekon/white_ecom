import { useEffect, useState } from "react"
import { defineRouteConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"

type Review = {
  id: string
  product_id: string
  author_name: string
  rating: number
  title?: string | null
  content: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

const STATUS_FILTERS = ["pending", "approved", "rejected", "all"] as const

const statusColor = (status: string) =>
  status === "approved" ? "green" : status === "rejected" ? "red" : "orange"

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([])
  const [status, setStatus] = useState<string>("pending")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = (filter = status) => {
    setLoading(true)
    const qs = filter === "all" ? "" : `?status=${filter}`
    fetch(`/admin/reviews${qs}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setReviews(data.reviews ?? [])
      })
      .catch(() => setError("Impossible de charger les avis"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const setReviewStatus = async (id: string, next: string) => {
    setError(null)
    const res = await fetch(`/admin/reviews/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    })
    if (!res.ok) {
      setError("Mise à jour impossible")
      return
    }
    load()
  }

  const removeReview = async (id: string) => {
    setError(null)
    const res = await fetch(`/admin/reviews/${id}`, { method: "DELETE" })
    if (!res.ok) {
      setError("Suppression impossible")
      return
    }
    load()
  }

  const switchFilter = (next: string) => {
    setStatus(next)
    load(next)
  }

  return (
    <Container className="p-6" style={{ maxWidth: "900px" }}>
      <Heading level="h1">Avis clients</Heading>
      <Text className="text-ui-fg-subtle mt-2">
        Modérez les avis produits soumis sur le storefront. Les avis
        "pending" ne sont pas visibles publiquement.
      </Text>

      <div className="mt-4 flex gap-2">
        {STATUS_FILTERS.map((f) => (
          <Button
            key={f}
            variant={status === f ? "primary" : "secondary"}
            onClick={() => switchFilter(f)}
          >
            {f === "pending"
              ? "En attente"
              : f === "approved"
                ? "Approuvés"
                : f === "rejected"
                  ? "Rejetés"
                  : "Tous"}
          </Button>
        ))}
      </div>

      {error && <Text className="text-ui-fg-error mt-4">{error}</Text>}
      {loading && (
        <Text className="text-ui-fg-subtle mt-4">Chargement…</Text>
      )}

      {!loading && reviews.length === 0 && (
        <Text className="text-ui-fg-subtle mt-6">Aucun avis.</Text>
      )}

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border border-ui-border-base rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {review.author_name}
                </span>
                <span className="text-ui-fg-subtle">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </span>
                <Badge color={statusColor(review.status)}>
                  {review.status}
                </Badge>
              </div>
              <span className="text-xs text-ui-fg-subtle">
                {new Date(review.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            {review.title && (
              <Text className="mt-2 font-medium">{review.title}</Text>
            )}
            <Text className="mt-1 text-ui-fg-subtle">{review.content}</Text>
            <Text className="mt-1 text-xs text-ui-fg-subtle">
              Produit : {review.product_id}
            </Text>
            <div className="mt-3 flex gap-2">
              {review.status !== "approved" && (
                <Button
                  variant="secondary"
                  onClick={() => setReviewStatus(review.id, "approved")}
                >
                  Approuver
                </Button>
              )}
              {review.status !== "rejected" && (
                <Button
                  variant="secondary"
                  onClick={() => setReviewStatus(review.id, "rejected")}
                >
                  Rejeter
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => removeReview(review.id)}
              >
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Avis clients",
  rank: 6,
})

export default Reviews
