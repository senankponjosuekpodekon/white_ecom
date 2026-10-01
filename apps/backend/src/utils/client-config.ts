import fs from "fs"
import path from "path"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import { defaultContent, mergeContent, type ClientContent } from "./default-content"
import { deepMerge } from "./merge"

export const WL_CONFIG_KEY = "whitelabel_config"
export const WL_CONTENT_KEY = "whitelabel_content"

type StoreRow = { id: string; metadata?: Record<string, unknown> | null }

async function loadStoreRow(
  scope: MedusaContainer
): Promise<StoreRow | undefined> {
  const query = scope.resolve(ContainerRegistrationKeys.QUERY) as {
    graph: <T>(config: {
      entity: string
      fields: string[]
    }) => Promise<{ data: T[] }>
  }
  const { data } = await query.graph<StoreRow>({
    entity: "store",
    fields: ["id", "metadata"],
  })
  return data[0]
}

export async function loadDbConfig(
  scope: MedusaContainer
): Promise<Record<string, unknown>> {
  try {
    const store = await loadStoreRow(scope)
    const config = store?.metadata?.[WL_CONFIG_KEY]
    return config && typeof config === "object" && !Array.isArray(config)
      ? (config as Record<string, unknown>)
      : {}
  } catch {
    return {}
  }
}

export async function loadDbContent(scope: MedusaContainer): Promise<ClientContent> {
  try {
    const store = await loadStoreRow(scope)
    const content = store?.metadata?.[WL_CONTENT_KEY]
    return content && typeof content === "object" && !Array.isArray(content)
      ? (content as ClientContent)
      : {}
  } catch {
    return {}
  }
}

export async function resolveClientConfig(
  scope: MedusaContainer
): Promise<Record<string, unknown>> {
  return deepMerge(loadClientConfig(), await loadDbConfig(scope))
}

export async function resolveClientContent(
  scope: MedusaContainer
): Promise<ClientContent> {
  const fileOverride = loadJsonFile<ClientContent>(clientConfigPath("content.json"))
  const dbOverride = await loadDbContent(scope)
  return mergeContent(mergeContent(defaultContent, fileOverride), dbOverride)
}

async function saveStoreMetadata(
  scope: MedusaContainer,
  key: string,
  value: Record<string, unknown>
): Promise<void> {
  const store = await loadStoreRow(scope)
  if (!store) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store not found")
  }
  const storeService = scope.resolve(Modules.STORE) as {
    updateStores: (
      id: string,
      data: { metadata: Record<string, unknown> }
    ) => Promise<unknown>
  }
  await storeService.updateStores(store.id, {
    metadata: { ...(store.metadata ?? {}), [key]: value },
  })
}

export function saveClientConfigDb(
  scope: MedusaContainer,
  config: Record<string, unknown>
): Promise<void> {
  return saveStoreMetadata(scope, WL_CONFIG_KEY, config)
}

export function saveClientContentDb(
  scope: MedusaContainer,
  content: ClientContent
): Promise<void> {
  return saveStoreMetadata(scope, WL_CONTENT_KEY, content)
}

export function clientConfigPath(...parts: string[]): string | undefined {
  const clientName = process.env.CLIENT_NAME
  if (!clientName) {
    return undefined
  }
  return path.resolve(process.cwd(), "clients", clientName, ...parts)
}

export function loadJsonFile<T>(filePath: string | undefined): T | undefined {
  if (!filePath) {
    return undefined
  }
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

export function loadClientConfig(): Record<string, unknown> {
  const filePath = clientConfigPath("config.json")
  return loadJsonFile<Record<string, unknown>>(filePath) ?? {}
}

export function loadClientContent(): ClientContent {
  const filePath = clientConfigPath("content.json")
  const override = loadJsonFile<ClientContent>(filePath)
  return mergeContent(defaultContent, override)
}

export function loadRawClientContent(): ClientContent {
  const filePath = clientConfigPath("content.json")
  return loadJsonFile<ClientContent>(filePath) ?? {}
}

export function saveClientContent(content: ClientContent): void {
  const filePath = clientConfigPath("content.json")
  if (!filePath) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "CLIENT_NAME is not set")
  }
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf-8")
}
