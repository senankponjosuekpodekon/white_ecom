import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  entity_id?: string
  actor_type?: string
  token?: string
}>) {
  if (data.actor_type !== "customer" || !data.entity_id || !data.token) {
    return
  }

  const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")
  const locale = process.env.DEFAULT_LANGUAGE ?? "fr"
  const resetUrl = `${siteUrl}/${locale}/reset-password?token=${encodeURIComponent(
    data.token
  )}&email=${encodeURIComponent(data.entity_id)}`

  const notificationModule = container.resolve(Modules.NOTIFICATION) as {
    createNotifications: (input: {
      to: string
      channel: string
      template: string
      data: Record<string, unknown>
    }) => Promise<unknown>
  }

  await notificationModule.createNotifications({
    to: data.entity_id,
    channel: "email",
    template: "password-reset",
    data: { email: data.entity_id, reset_url: resetUrl },
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
