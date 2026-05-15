// import type { Core } from '@strapi/strapi';

import {
  syncKosherPromiseCopy,
  KOSHER_PROMISE_BODY_VERSION,
} from "./bootstrap/sync-kosher-promise-copy"
import {
  syncRecipeTaxonomy,
  RECIPE_TAXONOMY_WRITEBACK_VERSION,
} from "./bootstrap/sync-recipe-taxonomy"
import {
  syncCuratedCollections,
  CURATED_COLLECTIONS_VERSION,
} from "./bootstrap/sync-curated-collections"
import { registerAlgoliaStubCleanup } from "./bootstrap/algolia-stub-cleanup"

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(_args: { strapi: any }) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: any }) {
    // Idempotent content migrations. Each migration uses a store key so it
    // only runs once per content version — bump the version constant in the
    // migration file to force a re-run on the next deploy.
    try {
      await syncKosherPromiseCopy({
        strapi,
        targetVersion: KOSHER_PROMISE_BODY_VERSION,
      })
    } catch (err) {
      strapi.log.error(
        `[bootstrap] sync-kosher-promise-copy failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }

    try {
      await syncRecipeTaxonomy({
        strapi,
        targetVersion: RECIPE_TAXONOMY_WRITEBACK_VERSION,
      })
    } catch (err) {
      strapi.log.error(
        `[bootstrap] sync-recipe-taxonomy failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }

    try {
      await syncCuratedCollections({
        strapi,
        targetVersion: CURATED_COLLECTIONS_VERSION,
      })
    } catch (err) {
      strapi.log.error(
        `[bootstrap] sync-curated-collections failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }

    // Runtime patch for the strapi-algolia null-transformer stub bug (#115).
    // Lives in bootstrap (not register) so the plugin's own lifecycle
    // subscription runs first; our cleanup follows behind to delete any
    // objectID-only stubs the plugin leaves.
    try {
      registerAlgoliaStubCleanup({ strapi })
    } catch (err) {
      strapi.log.error(
        `[bootstrap] register-algolia-stub-cleanup failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }
  },
}
