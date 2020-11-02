import levelup from 'levelup';
import leveldown from 'leveldown';
import encode from 'encoding-down';
import assert, { AssertionError } from 'assert';

import logging from './logger.js';

const dbPath = process.env.RSS_CRAWLER_DB_PATH || './myDb';
const db = levelup(encode(leveldown(dbPath), { valueEncoding: 'json' }));

const store = async (items) => {
  let logger = logging.child({ service: 'store' });

  let watchList;
  try {
    watchList = await db.get('watched_items');
  } catch (error) {
    if (error.notFound) {
      logger.error('Unable to load watch list.');
    }
    logger.debug(error);
    throw Error;
  }

  const promises = await items.map(async (item) => {
    try {
      assert.notStrictEqual(watchList.indexOf(item.show), -1);
      await db.get(item.guid);
    } catch (error) {
      if (error instanceof AssertionError) {
        logger.info('Item not in watched list. Skipping it.');
        return false;
      } else if (error.notFound) {
        logger.info(`Item ${item.guid} not in store. Adding it.`);
        try {
          await db.put(item.guid, item);
        } catch (error) {
          logger.error(error);
          throw error;
        }
        logger.info(`Item ${item.guid} successfully added to store.`);
        return true;
      } else {
        logger.error(error);
      }
    }
    logger.info(`Item ${item.guid} already in store. Skipping it.`);
    return false;
  });
  const processedItems = await Promise.all(promises);
  const newItems = items.filter((_, index) => {
    return processedItems[index];
  });

  logger.info(
    `Found ${newItems.length} new item${newItems.length === 1 ? '' : 's'}.`
  );
  return newItems
};

export default store;
