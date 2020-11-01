import winston from 'winston';

const prodFormat = winston.format.printf(
  ({ level, message, timestamp, service }) => {
    return `${timestamp} ${level.toUpperCase()} - ${service} - ${message}`;
  }
);

const devFormat = winston.format.printf(({ level, message, service }) => {
  if (message instanceof Object) {
    return `${level.toUpperCase()} - ${service} - ${JSON.stringify(
      message,
      null,
      2
    )}`;
  } else {
    return `${level.toUpperCase()} - ${service} - ${message}`;
  }
});

const logging = winston.createLogger({
  level: process.env.RSS_CRAWLER_LOG_LEVEL
    ? process.env.RSS_CRAWLER_LOG_LEVEL.toLowerCase()
    : 'info',
  format: winston.format.combine(winston.format.timestamp(), prodFormat),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (
  process.env.RSS_CRAWLER_ENVIRONMENT &&
  process.env.RSS_CRAWLER_ENVIRONMENT.toUpperCase() === 'DEV'
) {
  logging.add(
    new winston.transports.Console({
      format: devFormat,
    })
  );
}

export default logging;
