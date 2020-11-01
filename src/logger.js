import winston from 'winston';

const customFormat = winston.format.printf(
  ({ level, message, timestamp, service }) => {
    return `${timestamp} ${level.toUpperCase()} - ${service} - ${message}`;
  }
);

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  defaultMeta: { service: 'main' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export default logger;
