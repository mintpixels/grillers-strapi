import { factories } from "@strapi/strapi"

// See controller for the `as any` cast rationale.
export default factories.createCoreRouter(
  "api::back-in-stock-request.back-in-stock-request" as any
)
