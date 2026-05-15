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
    // Fast/idempotent steps that must complete before the server accepts
    // traffic. Anything slow MUST be deferred (see `setImmediate` below),
    // because Strapi Cloud kills the instance if the HTTP server hasn't
    // bound to :1337 within the platform's health-check window.
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

    // Runtime patch for the strapi-algolia null-transformer stub bug (#115).
    // Synchronous subscription register — finishes immediately.
    try {
      registerAlgoliaStubCleanup({ strapi })
    } catch (err) {
      strapi.log.error(
        `[bootstrap] register-algolia-stub-cleanup failed: ${err instanceof Error ? err.message : String(err)}`
      )
    }

    // Heavy data migrations — fire-and-forget AFTER bootstrap returns so
    // the server binds to :1337 before Strapi Cloud's health check times
    // out. Both syncs are gated on a store-key version flag, so a partial
    // run on one deploy just resumes on the next. We deliberately do not
    // await; errors are logged inside the sync functions.
    setImmediate(() => {
      void (async () => {
        try {
          await syncRecipeTaxonomy({
            strapi,
            targetVersion: RECIPE_TAXONOMY_WRITEBACK_VERSION,
          })
        } catch (err) {
          strapi.log.error(
            `[deferred] sync-recipe-taxonomy failed: ${err instanceof Error ? err.message : String(err)}`
          )
        }

        try {
          await syncCuratedCollections({
            strapi,
            targetVersion: CURATED_COLLECTIONS_VERSION,
          })
        } catch (err) {
          strapi.log.error(
            `[deferred] sync-curated-collections failed: ${err instanceof Error ? err.message : String(err)}`
          )
        }
      })()
    })
  },
}
