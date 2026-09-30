import fs from "fs"
import path from "path"
import { MedusaError } from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { writeJsonAtomic } from "../utils/atomic-write"

const clientsDir = path.resolve(process.cwd(), "clients")

function safeClientPath(...parts: string[]): string {
  const clientName = process.env.CLIENT_NAME
  if (!clientName) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "CLIENT_NAME not configured")
  }
  const clientRoot = path.resolve(clientsDir, clientName)
  const target = path.resolve(clientRoot, ...parts)
  if (target !== clientRoot && !target.startsWith(clientRoot + path.sep)) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid client path")
  }
  return target
}

const writeConfigStep = createStep(
  "write-config",
  async (input: { config: Record<string, unknown> }) => {
    const filePath = safeClientPath("config.json")
    writeJsonAtomic(filePath, input.config)
    return new StepResponse({ filePath })
  }
)

export const updateClientConfigWorkflow = createWorkflow(
  "update-client-config",
  (input: { config: Record<string, unknown> }) => {
    writeConfigStep(input)
  }
)
