import { factories } from "@strapi/strapi"

// `as any` casts here are required until Strapi regenerates content-type
// types after this schema lands — the `ContentType` union doesn't yet
// include `api::back-in-stock-request.back-in-stock-request`. Strapi
// itself accepts the string at runtime; this just keeps `tsc` happy
// in the meantime. Re-running `npm run build` regenerates types and
// makes the cast unnecessary.
export default factories.createCoreController(
  "api::back-in-stock-request.back-in-stock-request" as any
)
