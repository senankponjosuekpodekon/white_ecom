import { model } from "@medusajs/framework/utils"

const Client = model.define("client", {
  id: model.id().primaryKey(),
  slug: model.text().unique(),
  name: model.text(),
  contact_email: model.text().nullable(),
  status: model
    .enum(["pending", "provisioning", "active", "suspended", "rejected", "failed"])
    .default("pending"),
  domains: model.json().nullable(),
  config: model.json().nullable(),
  content: model.json().nullable(),
  publishable_key: model.text().nullable(),
  publishable_key_id: model.text().nullable(),
  sales_channel_id: model.text().nullable(),
  storefront_url: model.text().nullable(),
  error: model.text().nullable(),
})

export default Client
