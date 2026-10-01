import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function shipmentCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; no_notification?: boolean }>) {
  if (data.no_notification) {
    return
  }

  const query = container.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: (input: {
      entity: string
      fields: string[]
      filters?: Record<string, unknown>
    }) => Promise<{
      data: Array<{
        id: string
        labels?: Array<{ tracking_number?: string; tracking_url?: string }>
        order?: {
          id?: string
          display_id?: number
          email?: string
        } | null
      }>
    }>
  }

  const { data: fulfillments } = await query.graph({
    entity: "fulfillment",
    fields: [
      "id",
      "labels.tracking_number",
      "labels.tracking_url",
      "order.id",
      "order.display_id",
      "order.email",
    ],
    filters: { id: data.id },
  })

  const fulfillment = fulfillments[0]
  const order = fulfillment?.order

  if (!order?.email) {
    return
  }

  const notificationModule = container.resolve(Modules.NOTIFICATION) as {
    createNotifications: (input: {
      to: string
      channel: string
      template: string
      data: Record<string, unknown>
    }) => Promise<unknown>
  }

  await notificationModule.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-shipped",
    data: {
      order: {
        id: order.id,
        display_id: order.display_id,
      },
      tracking: (fulfillment?.labels ?? [])
        .map((l) => l.tracking_number)
        .filter(Boolean)[0],
      tracking_url: (fulfillment?.labels ?? [])
        .map((l) => l.tracking_url)
        .filter(Boolean)[0],
    },
  })
}

export const config: SubscriberConfig = {
  event: "shipment.created",
}
