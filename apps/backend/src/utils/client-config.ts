import fs from "fs"
import path from "path"
import { defaultContent, mergeContent, type ClientContent } from "./default-content"

function clientConfigPath(...parts: string[]): string | undefined {
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
