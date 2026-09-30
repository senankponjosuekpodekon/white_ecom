import fs from "fs"
import path from "path"
import os from "os"

export function writeJsonAtomic(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath)
  const tmp = path.join(dir, `.tmp-${Date.now()}-${Math.random().toString(36).slice(2)}.json`)
  try {
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
    fs.renameSync(tmp, filePath)
  } catch (err) {
    try {
      fs.unlinkSync(tmp)
    } catch {
      // ignore cleanup errors
    }
    throw err
  }
}
