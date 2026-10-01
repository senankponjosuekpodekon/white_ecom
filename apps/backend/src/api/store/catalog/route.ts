import {
  MedusaRequest,
  MedusaResponse,
  MedusaStoreRequest,
} from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  QueryContext,
  getVariantAvailability,
  isPresent,
} from "@medusajs/framework/utils"

const MAX_FETCH = 2000
const DEFAULT_LIMIT = 24
const MAX_LIMIT = 100

const FIELDS = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "status",
  "created_at",
  "categories.id",
  "variants.id",
  "variants.title",
  "variants.sku",
  "variants.manage_inventory",
  "variants.calculated_price.*",
]

const parseNumber = (value: unknown): number | undefined => {
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

const minVariantPrice = (product: any): number | undefined => {
  const amounts = (product.variants ?? [])
    .map((v: any) => Number(v?.calculated_price?.calculated_amount))
    .filter((a: number) => Number.isFinite(a))
  return amounts.length ? Math.min(...amounts) : undefined
}

const productInStock = (product: any): boolean =>
  (product.variants ?? []).some(
    (v: any) => !v?.manage_inventory || (v?.inventory_quantity ?? 0) > 0
  )

// Custom catalog endpoint: the default /store/products API cannot filter or
// order by calculated price or stock, so filtered/sorted catalogue pages fall
// back to client-side filtering over a bounded window. This route performs
// price/stock filtering and price ordering server-side and returns an accurate
// `count` for pagination.
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const params = req.query as Record<string, unknown>

  const limit = Math.min(
    Math.max(1, parseNumber(params.limit) ?? DEFAULT_LIMIT),
    MAX_LIMIT
  )
  const offset = Math.max(0, parseNumber(params.offset) ?? 0)
  const minPrice = parseNumber(params.min_price)
  const maxPrice = parseNumber(params.max_price)
  const inStockOnly =
    params.in_stock === "true" || params.in_stock === "1"
  const order = typeof params.order === "string" ? params.order : undefined
  const q = isPresent(params.q) ? String(params.q) : undefined

  const filters: Record<string, unknown> = { status: "published" }
  if (q) filters.q = q
  if (isPresent(params.category_id)) {
    const ids = Array.isArray(params.category_id)
      ? params.category_id
      : [params.category_id]
    filters.categories = { id: ids }
  }
  if (isPresent(params.collection_id)) {
    filters.collection_id = params.collection_id
  }
  if (isPresent(params.sales_channel_id)) {
    filters.sales_channel_id = params.sales_channel_id
  }

  // Pricing context: region from explicit param, else the store's default
  // region (mirrors /store/products normalize-data-for-context).
  let regionId = isPresent(params.region_id) ? String(params.region_id) : ""
  if (!regionId) {
    const { data: stores } = await query.graph({
      entity: "store",
      fields: ["id", "default_region_id"],
      pagination: { skip: 0, take: 1 },
    })
    regionId = stores[0]?.default_region_id ?? ""
  }
  if (!regionId) {
    const { data: regions } = await query.graph({
      entity: "region",
      fields: ["id"],
      pagination: { skip: 0, take: 1 },
    })
    regionId = regions[0]?.id
  }

  const { data: region } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
    filters: { id: regionId },
    pagination: { skip: 0, take: 1 },
  })
  if (!region?.length) {
    res.status(400).json({ message: "No region available for pricing" })
    return
  }

  const context: Record<string, unknown> = {}
  context["variants"] = {
    calculated_price: QueryContext({
      region_id: region[0].id,
      currency_code: region[0].currency_code,
    }),
  }

  const { data: products } = await query.index(
    {
      entity: "product",
      fields: FIELDS,
      filters,
      pagination: { skip: 0, take: MAX_FETCH },
      context,
    },
    { cache: { enable: true }, locale: req.locale }
  )

  // Stock availability for the publishable key's sales channel.
  const salesChannelIds =
    (req as MedusaStoreRequest).publishable_key_context?.sales_channel_ids ?? []
  const allVariants = products.flatMap((p: any) => p.variants ?? [])
  const managedVariants = allVariants.filter(
    (v: any) => v?.id && v.manage_inventory
  )
  if (managedVariants.length && salesChannelIds.length) {
    const availability = await getVariantAvailability(query, {
      variant_ids: managedVariants.map((v: any) => v.id),
      sales_channel_id: salesChannelIds[0],
    })
    for (const variant of managedVariants) {
      variant.inventory_quantity = availability[variant.id]?.availability ?? 0
    }
  }

  let list = products

  if (minPrice !== undefined || maxPrice !== undefined) {
    list = list.filter((p: any) => {
      const price = minVariantPrice(p)
      if (price === undefined) return false
      if (minPrice !== undefined && price < minPrice) return false
      if (maxPrice !== undefined && price > maxPrice) return false
      return true
    })
  }
  if (inStockOnly) {
    list = list.filter(productInStock)
  }

  if (order === "price_asc" || order === "variants.calculated_price.calculated_amount") {
    list = [...list].sort(
      (a, b) => (minVariantPrice(a) ?? Infinity) - (minVariantPrice(b) ?? Infinity)
    )
  } else if (
    order === "price_desc" ||
    order === "-variants.calculated_price.calculated_amount"
  ) {
    list = [...list].sort(
      (a, b) => (minVariantPrice(b) ?? -Infinity) - (minVariantPrice(a) ?? -Infinity)
    )
  } else if (order === "-created_at") {
    list = [...list].sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  } else if (order === "title") {
    list = [...list].sort((a, b) => String(a.title).localeCompare(String(b.title)))
  } else if (order === "-title") {
    list = [...list].sort((a, b) => String(b.title).localeCompare(String(a.title)))
  }

  const count = list.length
  const page = list.slice(offset, offset + limit)

  res.status(200).json({ products: page, count, limit, offset })
}
