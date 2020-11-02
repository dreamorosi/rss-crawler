import logging from './logger.js';
import request from './request.js';
import parser from './xml-parser.js';
import store from './store.js';

(async () => {
  let logger = logging.child({ service: 'main' });

  logger.info('Starting.');

  let feedContentText;
  let items;
  try {
    feedContentText = await request();
    items = await parser(feedContentText);
    let newItems = await store(items);
  } catch {
    process.exit(1);
  }

  logger.info('Exiting.');
})();
