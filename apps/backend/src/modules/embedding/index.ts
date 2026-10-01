import { Module } from "@medusajs/framework/utils"
import EmbeddingModuleService from "./service"

export const EMBEDDING_MODULE = "embedding"

export default Module(EMBEDDING_MODULE, {
  service: EmbeddingModuleService,
})
