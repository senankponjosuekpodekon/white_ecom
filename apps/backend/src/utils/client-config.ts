import fs from "fs"
import path from "path"
import { MedusaError } from "@medusajs/framework/utils"
import { defaultContent, mergeContent, type ClientContent } from "./default-content"

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
