import xml2js from 'xml2js';
import assert, { AssertionError } from 'assert';

import logging from './logger.js';

class Item {
  constructor(name, link, show, guid) {
    this.name = name;
    this.link = link;
    this.show = show;
    this.guid = guid;
  }
  get string() {
    return JSON.stringify(this);
  }
}

const parser = async (xmlString) => {
  let logger = logging.child({ service: 'xml-parser' });

  let xml;
  try {
    xml = await xml2js.parseStringPromise(xmlString, {
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });
  } catch (error) {
    logger.debug(error.message.replace(/\n/g, ' '));
    logger.error('Unable to parse RSS Feed string.');
    throw Error;
  }

  try {
    const rawItems = xml?.rss?.channel?.item;
    assert.notDeepStrictEqual(rawItems, undefined);
    return rawItems.map(
      (item) => new Item(item.show_name, item.link, item.show_id, item.guid._)
    );
  } catch (error) {
    if (error instanceof AssertionError) {
      logger.error('Unable to retrieve entries in RSS Feed object.');
    } else {
      logger.error(error);
    }
    throw Error;
  }
};

export default parser;
