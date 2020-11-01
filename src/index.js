import logging from './logger.js';
import request from './request.js';
import parser from './xml-parser.js';

(async () => {
  let logger = logging.child({ service: 'main' });

  logger.info('Starting.');

  let feedContentText;
  let items;
  try {
    feedContentText = await request();
    items = await parser(feedContentText);
  } catch {
    process.exit(1);
  }

  logger.info('Exiting.');
})();
