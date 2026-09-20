import { validatePackingPublication, PackingPolicyError } from "./seasonal-packing-policy";

export const COLD_CHAIN_UID = "api::cold-chain-setting.cold-chain-setting";
const populate = {
  PackagingBoxes: true,
  SeasonalPackingPolicies: { populate: { ExposureRules: true } },
};

/** Strapi 5.23.1 document middleware. Validation surrounds publication in one
 * transaction, including the actual inserted version (not a stale draft).
 * Direct create/update(status: published) calls bypass the publish middleware
 * in that version, so this content type must save a draft then publish it. */
export function packingPublicationMiddleware(
  strapi: any,
  validationError: (message: string) => Error,
) {
  const validate = (entry: unknown) => {
    try { validatePackingPublication(entry); }
    catch (error) {
      if (error instanceof PackingPolicyError) throw validationError(error.message);
      throw error;
    }
  };
  return async (context: any, next: () => Promise<any>) => {
    if (context.uid !== COLD_CHAIN_UID) return next();
    if (["create", "update"].includes(context.action) && context.params?.status === "published") {
      throw validationError("Save cold-chain settings as a draft, then publish after review.");
    }
    if (context.action !== "publish") return next();
    const documentId = context.params?.documentId;
    if (!documentId) throw validationError("Select the reviewed cold-chain draft before publishing.");
    return strapi.db.transaction(async () => {
      const draft = await strapi.documents(COLD_CHAIN_UID).findOne({ documentId, status: "draft", populate });
      validate(draft);
      const result = await next();
      if (!Array.isArray(result?.entries) || !result.entries.length)
        throw validationError("Cold-chain publication produced no version; keep the previous policy.");
      for (const entry of result.entries) {
        const published = await strapi.db.query(COLD_CHAIN_UID).findOne({
          where: { id: entry.id, documentId, publishedAt: { $ne: null } },
          populate,
        });
        validate(published);
      }
      return result;
    });
  };
}
