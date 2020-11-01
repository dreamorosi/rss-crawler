import fetch from 'node-fetch';

import logging from './logger.js';

class ServiceUrlNotProvided extends Error {
  constructor(code, statusText, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceUrlNotProvided);
    }

    this.name = 'ServiceUrlNotProvided';
  }
}

class HttpError extends Error {
  constructor(code, statusText, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HttpError);
    }

    this.name = 'HttpError';
    this.code = code;
    this.message = statusText;
  }
}

class EmptyResult extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EmptyResult);
    }

    this.name = 'EmptyResult';
  }
}

const raiseForStatus = (response) => {
  if (!response.ok) {
    throw new HttpError(response.status, response.statusText);
  }
};

const raiseForEmptyContent = (responseText) => {
  if (responseText.trim() == '') {
    throw new EmptyResult();
  }
};

const getServiceUrl = () => {
  if (
    process.env.RSS_CRAWLER_FEED_URL !== undefined &&
    process.env.RSS_CRAWLER_FEED_URL.trim() !== ''
  ) {
    return process.env.RSS_CRAWLER_FEED_URL;
  } else {
    throw new ServiceUrlNotProvided();
  }
};

const request = async () => {
  let logger = logging.child({ service: 'request' });
  try {
    const url = getServiceUrl();
    logger.info('Issuing request to upstream service.');
    const response = await fetch(url);
    raiseForStatus(response);
    const text = await response.text();
    raiseForEmptyContent(text);
    logger.info('Request to upstream service successful.');

    return text;
  } catch (error) {
    if (error instanceof ServiceUrlNotProvided) {
      logger.error(
        `Service URL not provided, set RSS_CRAWLER_FEED_URL environment variable.`
      );
    } else if (error instanceof HttpError) {
      logger.error(
        `Upstream service returned ${error.code} - ${error.message}.`
      );
    } else if (error instanceof EmptyResult) {
      logger.error(`Upstream service returned an empty response body.`);
    } else {
      logger.debug(error);
      logger.error(`Unspecified error while making the request.`);
    }
    throw Error;
  }
};

export default request;
