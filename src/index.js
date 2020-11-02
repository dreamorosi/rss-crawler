import logging from './logger.js';
import request from './request.js';
import parser from './xml-parser.js';
import store from './store.js';
import queue from './queue.js';

(async () => {
  let logger = logging.child({ service: 'main' });

  logger.info('Starting.');

  try {
    let feedContentText = await request();
    let items = await parser(feedContentText);
    let newItems = await store(items);
    if (newItems.length > 0){
      await queue(newItems)
    }
  } catch {
    process.exit(1);
  }

  logger.info('Exiting.');
})();
