import { z } from "@medusajs/framework/zod"
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { requireSuperAdmin, isValidClientName } from "../../utils"

const provisionSchema = z.object({
  name: z.string().min(1).refine(isValidClientName),
  domain: z
    .string()
    .regex(/^[a-z0-9.-]+\.[a-z]{2,}$/i, "Invalid domain")
    .optional(),
  admin_email: z.string().email().optional(),
})

// Self-service provisioning: dispatch the `provision-client.yml` GitHub
// Actions workflow, which SSHes into the VPS and runs the provisioning
// pipeline. Requires a GITHUB_PROVISION_TOKEN secret (fine-grained PAT with
// actions:write on this repo) and GITHUB_REPO (owner/repo) env vars.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!requireSuperAdmin(req, res)) return

  const parse = provisionSchema.safeParse(req.body)
  if (!parse.success) {
    res.status(400).json({ error: "Invalid body" })
    return
  }

  const token = process.env.GITHUB_PROVISION_TOKEN
  const repo = process.env.GITHUB_REPO
  if (!token || !repo) {
    res.status(503).json({
      error:
        "Provisioning not configured: set GITHUB_PROVISION_TOKEN and GITHUB_REPO",
    })
    return
  }

  const { name, domain, admin_email } = parse.data

  try {
    const gh = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/provision-client.yml/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
          "User-Agent": "white-ecom-admin",
        },
        body: JSON.stringify({
          ref: "dev",
          inputs: {
            client: name,
            domain: domain ?? "",
            admin_email: admin_email ?? "",
          },
        }),
      }
    )

    if (!gh.ok) {
      const detail = await gh.text()
      res.status(502).json({ error: `GitHub dispatch failed: ${gh.status}`, detail })
      return
    }

    res.json({ dispatched: true, workflow: "provision-client.yml", client: name })
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
}
