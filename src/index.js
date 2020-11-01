import logging from './logger.js';

(async () => {
  let logger = logging.child({ service: 'main' });

  logger.info('Starting.');
})();
