/**
 * experiment controller
 */

import { factories } from '@strapi/strapi';

const uid = 'api::experiment.experiment' as any;

export default factories.createCoreController(uid);
