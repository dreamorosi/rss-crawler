import path from 'path';
import inquirer from 'inquirer';
import YAML from 'yaml';
import levelup from 'levelup';
import leveldown from 'leveldown';
import encode from 'encoding-down';
import PosixMQ from 'posix-mq';
import fs from 'fs';

const loadConfigs = async (flags) => {
  // TODO: proper logging
  let configs = {};
  try {
    let confData = await fs.readFile(confPath, 'utf-8');
    configs = YAML.parse(confData);
    assert('userName' in configs && 'federationUrl' in configs);
  } catch {
    console.error(
      `Configuration file is missing or corrupted.
  Run "aws-cli-saml configure" to recreate it.`
    );
    process.exit(1);
  }

  /*
  "RSS_CRAWLER_LOG_LEVEL": "DEBUG",
  "RSS_CRAWLER_ENVIRONMENT": "DEV",
  "RSS_CRAWLER_FEED_URL": "http://showrss.info/user/103309.rss?magnets=true&namespaces=true&name=null&quality=null&re=null",
  "RSS_CRAWLER_FEED_OUTPUT_QUEUE": "/showsqueue"
  "RSS_CRAWLER_DB_PATH": 
  */

  return {
    userName: process.env.USER_NAME || configs.userName,
    federationUrl: process.env.FEDERATION_URL || configs.federationUrl,
    userInput: configs.userInput || '#userNameInput',
    passInput: configs.passInput || '#passwordInput',
    submitBtn: configs.submitBtn || '#submitButton',
    skipBtn: configs.skipBtn || '#vipSkipBtn',
    errorEl: configs.errorEl || '#error #errorText',
    durationSeconds: parseInt(
      flags.durationSeconds || process.env.DURATION_SECONDS || 3600
    ),
  };
};

const configure = async (confPath) => {
  let prompt = inquirer.createPromptModule();

  let configs;
  try {
    let confData = await fs.readFile(confPath, 'utf-8');
    configs = YAML.parse(confData);
  } catch {
    configs = {
      feedUrl: '',
      logLevel: 'INFO',
      environment: 'PROD',
      outputQueue: '/showsqueue',
      dbPath: './myDb',
    };
  }

  let questions = [
    {
      type: 'input',
      name: 'feedUrl',
      message: 'RSS Feed URL:',
      default: configs.feedUrl,
    },
    {
      type: 'input',
      name: 'logLevel',
      message: 'Username:',
      default: configs.logLevel,
    },
    {
      type: 'input',
      name: 'environment',
      message: 'Environment:',
      default: configs.environment,
    },
    {
      type: 'input',
      name: 'outputQueue',
      message: 'Output Queue:',
      default: configs.outputQueue,
    },
    {
      type: 'input',
      name: 'dbPath',
      message: 'DB Path:',
      default: configs.dbPath,
    },
  ];

  let answers = prompt(questions);

  fs.writeFileSync(confPath, YAML.stringify(answers), 'utf8');
  console.log(`Configuration file stored at ${confPath}.`);
  return answers;
};

(async () => {
  // TODO: Ask for confirmation before destructive action.
  let confPath = path.join(
    path.join(process.env.PWD, '..'),
    'rss_crawler.conf'
  );
  let answers = await configure(confPath);

  const mq = new PosixMQ();
  mq.open({
    name: answers.outputQueue,
  });
  mq.unlink();

  mq.open({
    name: answers.outputQueue,
    create: true,
    mode: '0777',
    maxmsgs: 50,
  });

  try {
    fs.unlinkSync(answers.dbPath);
  } catch (err) {
    console.error(err);
  }
  const db = levelup(
    encode(leveldown(answers.dbPath), { valueEncoding: 'json' })
  );

  // TODO: Ask to setup (optional watch list)
  process.exit(0);
})();
