import PosixMQ from 'posix-mq'

const queue = async (items) => {
  let logger = logging.child({ service: 'queue' });
  const mq = new PosixMQ()

  logger.info('Opening output queue.');
  try {
    mq.open({
      name: process.env.RSS_CRAWLER_FEED_OUTPUT_QUEUE,
      create: true,
      mode: '0777',
      maxmsgs: 10
    })  
  } catch (error) {
    logger.error('Unable to open output queue.');
    logger.debug(error);
    throw Error;
  }

  logger.info('Pushing messages to the queue.')
  try {
    items.forEach(item => {
      mq.push(item.string)
      logger.info(`Item with id ${item.guid} sent successfully.`)
    })
  } catch (error) {
    logger.error('Unable to push messages to output queue.');
    logger.debug(error);
    throw Error;
  }

  logger.info('Closing output queue.');
  try {
    mq.close()
  } catch (error) {
    logger.error('Unable to close output queue.');
    logger.debug(error);
    throw Error;
  }

  return
}

export default queue;