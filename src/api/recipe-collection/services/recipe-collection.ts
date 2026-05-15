/**
 * recipe-collection service
 */

import { factories } from "@strapi/strapi"

export default factories.createCoreService(
  "api::recipe-collection.recipe-collection" as any
)
