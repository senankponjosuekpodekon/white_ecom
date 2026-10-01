// Minimal Vercel REST API client for storefront provisioning.
// Enabled when VERCEL_TOKEN and VERCEL_GIT_REPO are set.

import { MedusaError } from "@medusajs/framework/utils"

const API = "https://api.vercel.com"

export function vercelConfigured(): boolean {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_GIT_REPO)
}

function teamQuery(): string {
  const teamId = process.env.VERCEL_TEAM_ID
  return teamId ? `?teamId=${encodeURIComponent(teamId)}` : ""
}

async function vercelFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const token = process.env.VERCEL_TOKEN
  if (!token) {
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      "VERCEL_TOKEN not configured"
    )
  }
  const res = await fetch(`${API}${path}${teamQuery()}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  })
  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>
  if (!res.ok) {
    const err = (body as { error?: { message?: string; code?: string } }).error
    throw new MedusaError(
      MedusaError.Types.UNEXPECTED_STATE,
      `Vercel ${init.method ?? "GET"} ${path} failed: ${res.status} ${err?.code ?? ""} ${err?.message ?? ""}`.trim()
    )
  }
  return body as T
}

type VercelProject = {
  id: string
  name: string
  link?: { repoId?: number; type?: string }
}

export async function createVercelProject(name: string): Promise<VercelProject> {
  const repo = process.env.VERCEL_GIT_REPO
  return vercelFetch<VercelProject>("/v10/projects", {
    method: "POST",
    body: JSON.stringify({
      name,
      framework: "nextjs",
      gitRepository: { repo, type: "github" },
      publicSource: false,
    }),
  })
}

export async function getVercelProject(name: string): Promise<VercelProject> {
  return vercelFetch<VercelProject>(`/v9/projects/${encodeURIComponent(name)}`)
}

export async function upsertVercelEnv(
  projectId: string,
  key: string,
  value: string
): Promise<void> {
  await vercelFetch(`/v10/projects/${projectId}/env`, {
    method: "POST",
    body: JSON.stringify({
      key,
      value,
      type: "plain",
      target: ["production", "preview", "development"],
    }),
  })
}

export async function triggerVercelDeploy(
  project: VercelProject
): Promise<{ url?: string }> {
  const repo = process.env.VERCEL_GIT_REPO
  const repoId = project.link?.repoId
  if (!repoId) {
    return {}
  }
  const result = await vercelFetch<{ url?: string }>("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: project.name,
      project: project.name,
      target: "production",
      gitSource: {
        type: "github",
        repoId,
        ref: process.env.VERCEL_GIT_REF ?? "main",
      },
    }),
  })
  return result
}

export async function deleteVercelProject(name: string): Promise<void> {
  await vercelFetch(`/v9/projects/${encodeURIComponent(name)}`, {
    method: "DELETE",
  })
}
