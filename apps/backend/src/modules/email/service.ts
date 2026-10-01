import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"
import type {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import type { Logger } from "@medusajs/framework/types"

type Options = {
  apiKey?: string
  from?: string
  storeName?: string
}

type OrderItem = { title?: string; quantity?: number; unit_price?: number }

function money(amount: number | undefined, currency: string): string {
  return `${(amount ?? 0).toFixed(2)} ${currency.toUpperCase()}`
}

function orderPlacedHtml(
  data: Record<string, unknown> | undefined,
  storeName: string
): string {
  const order = (data?.order ?? {}) as {
    display_id?: number | string
    email?: string
    total?: number
    currency_code?: string
    items?: OrderItem[]
  }
  const currency = order.currency_code ?? "eur"
  const rows = (order.items ?? [])
    .map(
      (i) =>
        `<tr><td style="padding:6px 0">${i.title ?? ""} × ${i.quantity ?? 1}</td>` +
        `<td style="padding:6px 0;text-align:right">${money(i.unit_price, currency)}</td></tr>`
    )
    .join("")

  return `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
      <h2 style="margin-bottom:4px">${storeName}</h2>
      <h3>Merci pour votre commande !</h3>
      <p>Commande <strong>#${order.display_id ?? ""}</strong> confirmée.</p>
      <table style="width:100%;border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb">${rows}</table>
      <p style="text-align:right;font-weight:bold">Total : ${money(order.total, currency)}</p>
      <p style="color:#6b7280;font-size:13px">Vous recevrez un nouvel email lorsque votre commande sera expédiée.</p>
    </div>`
}

function buildEmail(
  template: string,
  data: Record<string, unknown> | undefined,
  storeName: string
): { subject: string; html: string } {
  const order = (data?.order ?? {}) as { display_id?: number | string }
  switch (template) {
    case "order-placed":
      return {
        subject: `${storeName} — Confirmation de commande #${order.display_id ?? ""}`.trim(),
        html: orderPlacedHtml(data, storeName),
      }
    case "password-reset": {
      const resetUrl = (data?.reset_url as string | undefined) ?? ""
      return {
        subject: `${storeName} — Réinitialisation du mot de passe`.trim(),
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <h2 style="margin-bottom:4px">${storeName}</h2>
          <p>Une demande de réinitialisation de mot de passe a été effectuée pour votre compte.</p>
          <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#111827;color:#ffffff;text-decoration:none;border-radius:6px">Réinitialiser mon mot de passe</a></p>
          <p style="color:#6b7280;font-size:13px">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
        </div>`,
      }
    }
    case "order-shipped": {
      const trackingNumber = data?.tracking as string | undefined
      const trackingUrl = data?.tracking_url as string | undefined
      const trackingHtml = trackingNumber
        ? `<p>Numéro de suivi : <strong>${trackingNumber}</strong>${
            trackingUrl
              ? ` — <a href="${trackingUrl}">Suivre le colis</a>`
              : ""
          }</p>`
        : ""
      return {
        subject: `${storeName} — Commande #${order.display_id ?? ""} expédiée`.trim(),
        html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
          <h2 style="margin-bottom:4px">${storeName}</h2>
          <p>Bonne nouvelle ! Votre commande <strong>#${order.display_id ?? ""}</strong> a été expédiée.</p>
          ${trackingHtml}
        </div>`,
      }
    }
    default:
      return {
        subject: `${storeName} — Notification`.trim(),
        html: `<div style="font-family:Arial,sans-serif"><pre>${JSON.stringify(data ?? {}, null, 2)}</pre></div>`,
      }
  }
}

class EmailNotificationService extends AbstractNotificationProviderService {
  static identifier = "email-notification"
  protected logger_: Logger
  protected options_: Options

  constructor({ logger }: { logger: Logger }, options: Options) {
    super()
    this.logger_ = logger
    this.options_ = options
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const storeName = this.options_.storeName ?? process.env.STORE_NAME ?? "White Shop"
    const { subject, html } = buildEmail(
      notification.template,
      notification.data as Record<string, unknown> | undefined,
      storeName
    )

    if (!this.options_.apiKey) {
      this.logger_.info(
        `[email] RESEND_API_KEY absent — email non envoyé. to=${notification.to} subject="${subject}"`
      )
      return {}
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options_.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.options_.from ?? `${storeName} <orders@resend.dev>`,
        to: notification.to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Resend API error ${res.status}: ${body}`
      )
    }

    const json = (await res.json()) as { id?: string }
    return { id: json.id }
  }
}

export default EmailNotificationService
