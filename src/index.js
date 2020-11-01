import logging from './logger.js';
import request from './request.js';

(async () => {
  let logger = logging.child({ service: 'main' });

  logger.info('Starting.');

  let feedContentText;
  try {
    feedContentText = await request();
  } catch {
    process.exit(1);
  }

  logger.info('Exiting.');
})();
