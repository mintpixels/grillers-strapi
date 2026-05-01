// import type { Core } from '@strapi/strapi';

import {
  syncKosherPromiseCopy,
  KOSHER_PROMISE_BODY_VERSION,
} from "./bootstrap/sync-kosher-promise-copy"

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

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
  },
}
