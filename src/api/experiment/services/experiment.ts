/**
 * experiment service
 */

import { factories } from '@strapi/strapi';

const uid = 'api::experiment.experiment' as any;

export default factories.createCoreService(uid);
