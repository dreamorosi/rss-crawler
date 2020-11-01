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
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), prodFormat),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logging.add(
    new winston.transports.Console({
      format: devFormat,
    })
  );
}

export default logging;
