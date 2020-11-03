# :construction: rss-crawler
NodeJS daemon that periodically parses a RSS feed and based on a list of watched items, saves the info of relevant entries in a persistent storage and pushes them to a queue for downstream processing.

## Install
Download the latest release, run `npm install` followed by `npm run setup` and follow the setup wizard.

## Manage

## Specs

### RSS Schema
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:tv="http://my-rss-feed.com">
    <channel>
        <title>Feed Title</title>
        <link>http://my-rss-feed.com</link>
        <ttl>30</ttl>
        <description>Feed Description</description>
        <item>
            <title>Show Name S01E01</title>
            <link>some_url:?ABCDEFGHILMNOPQRSTUVWZYZ</link>
            <guid isPermaLink="false">96c0f2a6dc843b7ef08eb3c17266cf348ab3e16c</guid>
            <pubDate>Fri, 30 Oct 2020 09:50:17 +0000</pubDate>
            <description>New episode: Show Name S01E01</description>
            <tv:show_id>1234</tv:show_id>
            <tv:external_id>98765</tv:external_id>
            <tv:show_name>Show Name</tv:show_name>
            <tv:episode_id>7654</tv:episode_id>
            <tv:raw_title>Show Name S01E01</tv:raw_title>
            <tv:info_hash>ABCDEFGHILMNOPQRSTUVWZYZ</tv:info_hash>
            <enclosure url="some_url:?ABCDEFGHILMNOPQRSTUVWZYZ" length="0" type="application/mime" />
        </item>
    </channel>
</rss>
```
### LevelDB
Service checks for an entry in DB to keep track of watched shows:
```json
{
    "watched_items": ["1234"]
}
```
If none is found, all shows are tracked.

### Output Message Schema
```json
{
    "name": "Show Name",
    "link":"some_url:?ABCDEFGHILMNOPQRSTUVWZYZ",
    "show":"1234",
    "guid":"96c0f2a6dc843b7ef08eb3c17266cf348ab3e16c"
}
```

## Develop
VSCode configuration at `.vscode/launch.json`.
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "runtimeVersion": "14.15.0",
            "program": "${workspaceFolder}/src/index.js",
            "outputCapture": "std",
            "internalConsoleOptions": "openOnSessionStart",
            "env": {
                "RSS_CRAWLER_LOG_LEVEL": "DEBUG",
                "RSS_CRAWLER_ENVIRONMENT": "DEV",
                "RSS_CRAWLER_FEED_URL": "http://my-rss-feed.com/user/111111.rss",
                "RSS_CRAWLER_FEED_OUTPUT_QUEUE": "/showsqueue"
            }
        }
    ]
}
```
### Dev Container
`.devcontainer/Dockerfile`
```dockerfile
ARG VARIANT="14-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN mkdir ~/.npm-global && \
    npm config set prefix '~/.npm-global' && \
    echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile

ARG EXTRA_NODE_VERSION=14.15.0
RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"
```
`.devcontainer/devcontainer.json`
```json
{
	"name": "Node.js",
	"build": {
		"dockerfile": "Dockerfile"
	},
	"settings": {
		"terminal.integrated.shell.linux": "/bin/bash"
	},
	"extensions": [
		"dbaeumer.vscode-eslint",
		"esbenp.prettier-vscode",
		"visualstudioexptteam.vscodeintellicode"
	],
	"postCreateCommand": "npm install"
}
```


## License

[MIT License - Copyright (c) 2020 Andrea Amorosi](LICENSE)