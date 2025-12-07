/**
 * announcement-bar router
 */

import { factories } from '@strapi/strapi';

// @ts-expect-error - Strapi types will be generated on first run
export default factories.createCoreRouter('api::announcement-bar.announcement-bar');

