import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderModule = container.resolve(Modules.ORDER) as {
    retrieveOrder: (
      id: string,
      config?: { relations?: string[] }
    ) => Promise<{
      id: string
      display_id?: number
      email?: string
      total?: number
      currency_code?: string
      items?: Array<{
        title?: string
        quantity?: number
        unit_price?: number
      }>
    }>
  }

  const order = await orderModule.retrieveOrder(data.id, {
    relations: ["items"],
  })

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
    template: "order-placed",
    data: {
      order: {
        id: order.id,
        display_id: order.display_id,
        total: order.total,
        currency_code: order.currency_code,
        items: (order.items ?? []).map((i) => ({
          title: i.title,
          quantity: i.quantity,
          unit_price: i.unit_price,
        })),
      },
    },
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
