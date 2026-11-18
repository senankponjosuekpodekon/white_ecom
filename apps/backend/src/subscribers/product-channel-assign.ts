import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { CLIENT_MODULE } from "../modules/client"
import type ClientModuleService from "../modules/client/service"
import type { ClientRecord } from "../utils/client-resolver"

// Auto-assign new products to a tenant's sales channel.
//
// Medusa only exposes a product through the publishable keys linked to its
// sales channels. When exactly one active client channel exists, a new
// product created without an explicit channel would land in the default
// channel and stay invisible on the tenant storefront. This subscriber links
// such products to that channel.
//
// With several active tenants the channel cannot be guessed, so the product
// is left untouched and must be assigned explicitly in the admin.
export default async function productChannelAssignHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; sales_channels?: { id: string }[] }>) {
  if (data.sales_channels?.length) {
    return
  }

  const service = container.resolve<ClientModuleService>(CLIENT_MODULE)
  const clients = (await service.listClients(
    { status: "active" },
    {}
  )) as unknown as ClientRecord[]
  const channels = clients
    .map((c) => c.sales_channel_id)
    .filter((id): id is string => Boolean(id))

  if (channels.length !== 1) {
    return
  }

  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK) as {
    create: (data: unknown) => Promise<unknown>
  }
  await remoteLink.create({
    [Modules.PRODUCT]: { product_id: data.id },
    [Modules.SALES_CHANNEL]: { sales_channel_id: channels[0] },
  })
}

export const config: SubscriberConfig = {
  event: "product.created",
}
