/**
 * analytic service
 */

import { factories } from '@strapi/strapi';

// @ts-expect-error - Strapi types will be generated on first run
export default factories.createCoreService('api::analytic.analytic');

